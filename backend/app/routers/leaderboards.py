from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import QuizSession, School, SessionStatus, User
from app.schemas import LeaderboardEntry

router = APIRouter(prefix="/leaderboards", tags=["leaderboards"])


@router.get("", response_model=list[LeaderboardEntry])
def get_leaderboard(
    limit: int = 20,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> list[LeaderboardEntry]:
    rows = (
        db.query(
            User.id,
            User.full_name,
            School.name,
            func.max(QuizSession.total_score).label("best_score"),
            func.count(QuizSession.id).label("sessions_completed"),
        )
        .join(QuizSession, QuizSession.user_id == User.id)
        .outerjoin(School, School.id == User.school_id)
        .filter(QuizSession.status == SessionStatus.COMPLETED)
        .group_by(User.id, User.full_name, School.name)
        .order_by(func.max(QuizSession.total_score).desc())
        .limit(limit)
        .all()
    )

    return [
        LeaderboardEntry(
            user_id=row[0],
            full_name=row[1],
            school_name=row[2],
            best_score=row[3],
            sessions_completed=row[4],
        )
        for row in rows
    ]
