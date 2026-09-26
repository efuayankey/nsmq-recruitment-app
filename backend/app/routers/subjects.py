from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import Subject, User
from app.schemas import SubjectResponse

router = APIRouter(prefix="/subjects", tags=["subjects"])


@router.get("", response_model=list[SubjectResponse])
def list_subjects(db: Session = Depends(get_db), _user: User = Depends(get_current_user)) -> list[Subject]:
    return db.query(Subject).order_by(Subject.name).all()
