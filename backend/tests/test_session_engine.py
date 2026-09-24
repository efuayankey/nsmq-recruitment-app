import time

from sqlalchemy.orm import Session

from app.models import Difficulty, Question, QuestionType, RiddleClue, RoundType, Subject, User, UserRole
from app.schemas import StartSessionRequest
from app.services import session_engine


class FakeRedis:
    """Minimal stand-in for the redis.Redis calls the engine makes."""

    def __init__(self) -> None:
        self.store: dict[str, str] = {}

    def set(self, key: str, value, ex=None) -> None:
        self.store[key] = str(value)

    def get(self, key: str):
        return self.store.get(key)

    def delete(self, key: str) -> None:
        self.store.pop(key, None)


def _make_user(db: Session) -> User:
    user = User(email="student@test.com", hashed_password="x", full_name="Student", role=UserRole.STUDENT)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _make_question(db: Session, subject: Subject, **overrides) -> Question:
    defaults = dict(
        subject_id=subject.id,
        round_type=RoundType.GENERAL,
        question_type=QuestionType.SHORT_ANSWER,
        difficulty=Difficulty.MEDIUM,
        prompt="q",
        correct_answer="42",
        timer_seconds=30,
        points=10,
        penalty=0,
        is_published=True,
    )
    defaults.update(overrides)
    q = Question(**defaults)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


def test_start_session_builds_snapshot_from_published_questions(db: Session, subject: Subject):
    _make_question(db, subject, prompt="q1")
    _make_question(db, subject, prompt="q2")
    _make_question(db, subject, prompt="q3", is_published=False)  # excluded

    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.GENERAL], question_count=5)
    session = session_engine.start_session(db, user.id, request)

    assert len(session.rounds_snapshot) == 1
    assert session.rounds_snapshot[0]["round_type"] == "general"
    assert len(session.rounds_snapshot[0]["question_ids"]) == 2  # only published ones


def test_submit_answer_advances_within_round_then_completes(db: Session, subject: Subject):
    _make_question(db, subject, prompt="q1", correct_answer="42")
    _make_question(db, subject, prompt="q2", correct_answer="7")

    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.GENERAL], question_count=2)
    session = session_engine.start_session(db, user.id, request)

    assert session.current_question_index == 0
    session_engine.submit_answer(db, session, "42", client_reported_time=5)
    assert session.current_question_index == 1
    assert session.status.value == "in_progress"

    session_engine.submit_answer(db, session, "7", client_reported_time=5)
    assert session.status.value == "completed"
    assert session.completed_at is not None
    assert session.total_score == 20


def test_wrong_answer_scores_zero_when_no_penalty_configured(db: Session, subject: Subject):
    _make_question(db, subject, prompt="q1", correct_answer="42", penalty=0)

    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.GENERAL], question_count=1)
    session = session_engine.start_session(db, user.id, request)

    result = session_engine.submit_answer(db, session, "wrong", client_reported_time=5)
    assert result.is_correct is False
    assert result.points_awarded == 0
    assert session.status.value == "completed"


def test_round_transition_moves_to_next_round_type(db: Session, subject: Subject):
    _make_question(db, subject, prompt="general-q", round_type=RoundType.GENERAL, correct_answer="42")
    _make_question(db, subject, prompt="tf-q", round_type=RoundType.TRUE_FALSE, correct_answer="True")

    user = _make_user(db)
    request = StartSessionRequest(
        mode="full_contest",
        round_types=[RoundType.GENERAL, RoundType.TRUE_FALSE],
        question_count=2,
    )
    session = session_engine.start_session(db, user.id, request)
    assert session.current_round_index == 0

    session_engine.submit_answer(db, session, "42", client_reported_time=5)
    assert session.current_round_index == 1
    assert session.current_question_index == 0

    state = session_engine.get_session_state(db, session)
    assert state.round_type == RoundType.TRUE_FALSE


def test_riddle_clue_reveal_increments_and_caps_at_available_clues(db: Session, subject: Subject):
    q = _make_question(db, subject, prompt="riddle-q", round_type=RoundType.RIDDLE, correct_answer="DNA")
    db.add(RiddleClue(question_id=q.id, order=1, clue_text="clue 1", points_value=20))
    db.add(RiddleClue(question_id=q.id, order=2, clue_text="clue 2", points_value=5))
    db.commit()

    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.RIDDLE], question_count=1)
    session = session_engine.start_session(db, user.id, request)

    assert session.riddle_clues_revealed == 1
    session_engine.reveal_next_clue(db, session)
    assert session.riddle_clues_revealed == 2
    # already at max — revealing again should not go out of bounds
    session_engine.reveal_next_clue(db, session)
    assert session.riddle_clues_revealed == 2


def test_riddle_answer_scores_by_clue_level_via_full_flow(db: Session, subject: Subject):
    q = _make_question(db, subject, prompt="riddle-q", round_type=RoundType.RIDDLE, correct_answer="DNA", points=5)
    db.add(RiddleClue(question_id=q.id, order=1, clue_text="clue 1", points_value=20))
    db.add(RiddleClue(question_id=q.id, order=2, clue_text="clue 2", points_value=5))
    db.commit()

    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.RIDDLE], question_count=1)
    session = session_engine.start_session(db, user.id, request)

    result = session_engine.submit_answer(db, session, "DNA", client_reported_time=5)
    assert result.points_awarded == 20  # answered on first clue


def test_server_side_timer_overrides_client_reported_time(db: Session, subject: Subject):
    _make_question(db, subject, prompt="q1", correct_answer="42", timer_seconds=5)
    user = _make_user(db)
    request = StartSessionRequest(mode="round_practice", round_types=[RoundType.GENERAL], question_count=1)
    session = session_engine.start_session(db, user.id, request)

    redis_client = FakeRedis()
    # simulate the question having been shown 20s ago (well past the 5s timer)
    session_engine.get_session_state(db, session, redis_client=redis_client)
    key = session_engine._redis_key(session.id)
    redis_client.store[key] = str(time.time() - 20)

    result = session_engine.submit_answer(
        db, session, "42", client_reported_time=1, redis_client=redis_client
    )
    # client claimed 1 second, but redis says 20s elapsed against a 5s timer -> timeout
    assert result.is_correct is False
    assert result.points_awarded == 0
