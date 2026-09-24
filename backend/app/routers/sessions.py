from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.redis import get_redis_client
from app.core.security import get_current_user
from app.models import QuizSession, SessionAnswer, User
from app.schemas import (
    AnswerResult,
    SessionResultsResponse,
    SessionStateResponse,
    StartSessionRequest,
    SubmitAnswerRequest,
)
from app.services import session_engine

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _get_owned_session(db: Session, session_id: int, user: User) -> QuizSession:
    session = db.get(QuizSession, session_id)
    if session is None or session.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Session not found")
    return session


@router.post("", response_model=SessionStateResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: StartSessionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> SessionStateResponse:
    session = session_engine.start_session(db, user.id, payload)
    return session_engine.get_session_state(db, session, redis_client=get_redis_client())


@router.get("/{session_id}", response_model=SessionStateResponse)
def get_session(
    session_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
) -> SessionStateResponse:
    session = _get_owned_session(db, session_id, user)
    return session_engine.get_session_state(db, session, redis_client=get_redis_client())


@router.post("/{session_id}/answers", response_model=AnswerResult)
def submit_answer(
    session_id: int,
    payload: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> AnswerResult:
    session = _get_owned_session(db, session_id, user)
    return session_engine.submit_answer(
        db, session, payload.answer, payload.time_taken_seconds, redis_client=get_redis_client()
    )


@router.post("/{session_id}/reveal-clue", response_model=SessionStateResponse)
def reveal_clue(
    session_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
) -> SessionStateResponse:
    session = _get_owned_session(db, session_id, user)
    return session_engine.reveal_next_clue(db, session)


@router.post("/{session_id}/complete", response_model=SessionResultsResponse)
def complete_session(
    session_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
) -> SessionResultsResponse:
    session = _get_owned_session(db, session_id, user)
    answers = (
        db.query(SessionAnswer)
        .filter(SessionAnswer.session_id == session.id)
        .order_by(SessionAnswer.round_index, SessionAnswer.answered_at)
        .all()
    )
    return SessionResultsResponse(
        session_id=session.id,
        total_score=session.total_score,
        round_scores=session.round_scores,
        started_at=session.started_at,
        completed_at=session.completed_at,
        answers=[
            {
                "question_id": a.question_id,
                "submitted_answer": a.submitted_answer,
                "is_correct": a.is_correct,
                "points_awarded": a.points_awarded,
                "round_index": a.round_index,
            }
            for a in answers
        ],
    )
