from collections import defaultdict
from datetime import timedelta

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Question, QuizSession, SessionAnswer, SessionStatus, User
from app.schemas import DashboardResponse, SessionHistoryItem

router = APIRouter(prefix="/me", tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> DashboardResponse:
    completed = (
        db.query(QuizSession)
        .filter(QuizSession.user_id == user.id, QuizSession.status == SessionStatus.COMPLETED)
        .all()
    )

    if not completed:
        return DashboardResponse(
            total_sessions=0,
            average_score=0,
            best_score=0,
            accuracy=0,
            subject_strength={},
            round_strength={},
            current_streak=0,
        )

    scores = [s.total_score for s in completed]
    session_ids = [s.id for s in completed]

    answers = (
        db.query(SessionAnswer, Question)
        .join(Question, SessionAnswer.question_id == Question.id)
        .filter(SessionAnswer.session_id.in_(session_ids))
        .all()
    )

    subject_totals: dict[str, list[int]] = defaultdict(lambda: [0, 0])
    round_totals: dict[str, list[int]] = defaultdict(lambda: [0, 0])
    correct_count = 0

    for answer, question in answers:
        subject_key = question.subject.name
        round_key = question.round_type.value
        subject_totals[subject_key][1] += 1
        round_totals[round_key][1] += 1
        if answer.is_correct:
            subject_totals[subject_key][0] += 1
            round_totals[round_key][0] += 1
            correct_count += 1

    subject_strength = {k: round(v[0] / v[1], 3) for k, v in subject_totals.items() if v[1]}
    round_strength = {k: round(v[0] / v[1], 3) for k, v in round_totals.items() if v[1]}
    accuracy = round(correct_count / len(answers), 3) if answers else 0

    completion_days = sorted({s.completed_at.date() for s in completed if s.completed_at}, reverse=True)
    streak = 0
    expected_day = None
    for day in completion_days:
        if expected_day is None or expected_day - day == timedelta(days=1):
            streak += 1
            expected_day = day
        else:
            break

    return DashboardResponse(
        total_sessions=len(completed),
        average_score=round(sum(scores) / len(scores), 2),
        best_score=max(scores),
        accuracy=accuracy,
        subject_strength=subject_strength,
        round_strength=round_strength,
        current_streak=streak,
    )


@router.get("/history", response_model=list[SessionHistoryItem])
def get_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list:
    sessions = (
        db.query(QuizSession)
        .filter(QuizSession.user_id == user.id)
        .order_by(QuizSession.started_at.desc())
        .all()
    )
    return [
        SessionHistoryItem(
            session_id=s.id,
            status=s.status,
            total_score=s.total_score,
            started_at=s.started_at,
            completed_at=s.completed_at,
        )
        for s in sessions
    ]
