"""Config-driven quiz session state machine.

A session's rounds_snapshot is decided once, at start_session, from the
requested QuizConfig-like parameters (round_types/subjects/difficulty/
question_count). After that the engine just walks the snapshot — it never
re-queries "what counts as a Speed Race question" mid-session, so a session
already in progress isn't affected by questions being edited/published
elsewhere while the student is mid-quiz.
"""

import random
import time
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models import Question, QuizSession, RoundType, SessionAnswer, SessionStatus
from app.schemas import AnswerResult, QuestionPublic, SessionStateResponse, StartSessionRequest
from app.services.scoring import grade_riddle_answer, grade_standard_answer

REDIS_TIMER_PREFIX = "session"


def _redis_key(session_id: int) -> str:
    return f"{REDIS_TIMER_PREFIX}:{session_id}:question_started_at"


def start_session(db: DBSession, user_id: int, request: StartSessionRequest) -> QuizSession:
    if not request.round_types:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "At least one round_type is required")

    per_round_count = max(1, request.question_count // len(request.round_types))
    rounds_snapshot: list[dict] = []

    for round_type in request.round_types:
        stmt = select(Question).where(
            Question.round_type == round_type,
            Question.is_published.is_(True),
        )
        candidates = list(db.execute(stmt).scalars().all())
        if request.subjects:
            candidates = [q for q in candidates if q.subject.name in request.subjects]
        if request.difficulty:
            candidates = [q for q in candidates if q.difficulty == request.difficulty]

        if not candidates:
            continue

        sample_size = min(per_round_count, len(candidates))
        chosen = random.sample(candidates, sample_size)
        rounds_snapshot.append(
            {"round_type": round_type.value, "question_ids": [q.id for q in chosen]}
        )

    if not rounds_snapshot:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "No published questions match the requested round types/subjects/difficulty",
        )

    session = QuizSession(
        user_id=user_id,
        status=SessionStatus.IN_PROGRESS,
        rounds_snapshot=rounds_snapshot,
        current_round_index=0,
        current_question_index=0,
        riddle_clues_revealed=1,
        total_score=0,
        round_scores=[],
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def _current_round(session: QuizSession) -> dict | None:
    if session.current_round_index >= len(session.rounds_snapshot):
        return None
    return session.rounds_snapshot[session.current_round_index]


def _current_question(db: DBSession, session: QuizSession) -> Question | None:
    round_data = _current_round(session)
    if round_data is None:
        return None
    if session.current_question_index >= len(round_data["question_ids"]):
        return None
    question_id = round_data["question_ids"][session.current_question_index]
    return db.get(Question, question_id)


def _to_question_public(question: Question, session: QuizSession) -> QuestionPublic:
    revealed_clues: list[str] = []
    if question.round_type == RoundType.RIDDLE and question.riddle_clues:
        n = min(session.riddle_clues_revealed, len(question.riddle_clues))
        revealed_clues = [c.clue_text for c in question.riddle_clues[:n]]

    return QuestionPublic(
        question_id=question.id,
        round_type=question.round_type,
        question_type=question.question_type,
        subject=question.subject.name,
        difficulty=question.difficulty,
        prompt=question.prompt,
        options=question.options,
        timer_seconds=question.timer_seconds,
        points=question.points,
        revealed_clues=revealed_clues,
    )


def get_session_state(db: DBSession, session: QuizSession, redis_client=None) -> SessionStateResponse:
    round_data = _current_round(session)
    question = _current_question(db, session)

    if question is not None and redis_client is not None:
        redis_client.set(_redis_key(session.id), time.time(), ex=question.timer_seconds + 120)

    return SessionStateResponse(
        session_id=session.id,
        status=session.status,
        round_index=session.current_round_index,
        round_type=RoundType(round_data["round_type"]) if round_data else RoundType.GENERAL,
        question_index=session.current_question_index,
        question_count_in_round=len(round_data["question_ids"]) if round_data else 0,
        total_score=session.total_score,
        current_question=_to_question_public(question, session) if question else None,
    )


def reveal_next_clue(db: DBSession, session: QuizSession) -> SessionStateResponse:
    question = _current_question(db, session)
    if question is None or question.round_type != RoundType.RIDDLE:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current question is not a riddle")

    if session.riddle_clues_revealed < len(question.riddle_clues):
        session.riddle_clues_revealed += 1
        db.commit()
        db.refresh(session)

    return get_session_state(db, session)


def _elapsed_seconds(session: QuizSession, redis_client, client_reported: int | None) -> int | None:
    if redis_client is None:
        return client_reported
    started_at = redis_client.get(_redis_key(session.id))
    if started_at is None:
        return client_reported
    return int(time.time() - float(started_at))


def _advance(session: QuizSession) -> None:
    round_data = _current_round(session)
    session.current_question_index += 1
    if session.current_question_index >= len(round_data["question_ids"]):
        session.current_round_index += 1
        session.current_question_index = 0
        session.riddle_clues_revealed = 1

    if session.current_round_index >= len(session.rounds_snapshot):
        session.status = SessionStatus.COMPLETED
        session.completed_at = datetime.now(timezone.utc)


def _record_round_score(session: QuizSession, round_index: int, points: int) -> None:
    round_scores = list(session.round_scores or [])
    for entry in round_scores:
        if entry["round_index"] == round_index:
            entry["score"] += points
            break
    else:
        round_scores.append({"round_index": round_index, "score": points})
    session.round_scores = round_scores


def submit_answer(
    db: DBSession,
    session: QuizSession,
    submitted_answer: str,
    client_reported_time: int | None,
    redis_client=None,
) -> AnswerResult:
    if session.status != SessionStatus.IN_PROGRESS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Session is not in progress")

    question = _current_question(db, session)
    if question is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No current question for this session")

    round_index = session.current_round_index
    time_taken = _elapsed_seconds(session, redis_client, client_reported_time)

    timed_out = time_taken is not None and time_taken > question.timer_seconds + 5
    if timed_out:
        is_correct, points = False, 0
    elif question.round_type == RoundType.RIDDLE:
        is_correct, points = grade_riddle_answer(
            question, submitted_answer, session.riddle_clues_revealed - 1
        )
    else:
        is_correct, points = grade_standard_answer(question, submitted_answer)

    answer = SessionAnswer(
        session_id=session.id,
        question_id=question.id,
        round_index=round_index,
        submitted_answer=submitted_answer,
        is_correct=is_correct,
        points_awarded=points,
        time_taken_seconds=time_taken,
        clues_revealed=session.riddle_clues_revealed if question.round_type == RoundType.RIDDLE else None,
    )
    db.add(answer)

    session.total_score += points
    _record_round_score(session, round_index, points)
    _advance(session)

    db.commit()
    db.refresh(session)

    if redis_client is not None:
        redis_client.delete(_redis_key(session.id))

    return AnswerResult(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        points_awarded=points,
        explanation=question.explanation,
    )
