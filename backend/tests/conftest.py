import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base
from app.models import Question, QuestionType, RoundType, Subject, UserRole  # noqa: F401


@pytest.fixture
def db() -> Session:
    # StaticPool keeps a single shared connection alive for the whole test —
    # without it, SQLAlchemy hands out a fresh connection per checkout, and
    # since ":memory:" databases are per-connection, tables "disappear" after
    # the first commit recycles the connection.
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def subject(db: Session) -> Subject:
    s = Subject(name="Mathematics")
    db.add(s)
    db.commit()
    db.refresh(s)
    return s
