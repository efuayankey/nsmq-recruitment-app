from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models import Question, RiddleClue, User
from app.schemas import QuestionCreate, QuestionResponse, QuestionUpdate

router = APIRouter(prefix="/questions", tags=["questions"])


def _apply_riddle_clues(db: Session, question: Question, clues: list | None) -> None:
    if clues is None:
        return
    question.riddle_clues.clear()
    db.flush()
    for clue in clues:
        db.add(
            RiddleClue(
                question_id=question.id,
                order=clue.order,
                clue_text=clue.clue_text,
                points_value=clue.points_value,
            )
        )


@router.get("", response_model=list[QuestionResponse])
def list_questions(
    published_only: bool = False,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
) -> list[Question]:
    query = db.query(Question)
    if published_only:
        query = query.filter(Question.is_published.is_(True))
    return query.order_by(Question.created_at.desc()).all()


@router.post("", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    payload: QuestionCreate, db: Session = Depends(get_db), admin: User = Depends(require_admin)
) -> Question:
    data = payload.model_dump(exclude={"riddle_clues"})
    question = Question(**data, created_by=admin.id)
    db.add(question)
    db.flush()
    _apply_riddle_clues(db, question, payload.riddle_clues)
    db.commit()
    db.refresh(question)
    return question


@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int, db: Session = Depends(get_db), _admin: User = Depends(require_admin)
) -> Question:
    question = db.get(Question, question_id)
    if question is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    return question


@router.patch("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    payload: QuestionUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
) -> Question:
    question = db.get(Question, question_id)
    if question is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")

    data = payload.model_dump(exclude={"riddle_clues"}, exclude_unset=True)
    for field, value in data.items():
        setattr(question, field, value)

    _apply_riddle_clues(db, question, payload.riddle_clues)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int, db: Session = Depends(get_db), _admin: User = Depends(require_admin)
) -> None:
    question = db.get(Question, question_id)
    if question is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    db.delete(question)
    db.commit()
