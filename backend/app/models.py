import enum
from datetime import datetime, timezone

from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"


class RoundType(str, enum.Enum):
    GENERAL = "general"
    SPEED_RACE = "speed_race"
    PROBLEM_OF_THE_DAY = "problem_of_the_day"
    TRUE_FALSE = "true_false"
    RIDDLE = "riddle"


class QuestionType(str, enum.Enum):
    MCQ = "mcq"
    SHORT_ANSWER = "short_answer"
    NUMERIC = "numeric"
    TRUE_FALSE = "true_false"


class Difficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuizMode(str, enum.Enum):
    FULL_CONTEST = "full_contest"
    ROUND_PRACTICE = "round_practice"
    SUBJECT_PRACTICE = "subject_practice"
    QUICK_DRILL = "quick_drill"


class SessionStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"


class School(Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    users: Mapped[list["User"]] = relationship(back_populates="school")


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    school: Mapped["School | None"] = relationship(back_populates="users")
    sessions: Mapped[list["QuizSession"]] = relationship(back_populates="user")
    achievements: Mapped[list["UserAchievement"]] = relationship(back_populates="user")


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    topics: Mapped[list["Topic"]] = relationship(back_populates="subject")
    questions: Mapped[list["Question"]] = relationship(back_populates="subject")


class Topic(Base):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)

    subject: Mapped["Subject"] = relationship(back_populates="topics")
    questions: Mapped[list["Question"]] = relationship(back_populates="topic")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    topic_id: Mapped[int | None] = mapped_column(ForeignKey("topics.id"), nullable=True)
    round_type: Mapped[RoundType] = mapped_column(Enum(RoundType), nullable=False)
    question_type: Mapped[QuestionType] = mapped_column(Enum(QuestionType), nullable=False)
    difficulty: Mapped[Difficulty] = mapped_column(Enum(Difficulty), default=Difficulty.MEDIUM)

    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    correct_answer: Mapped[str] = mapped_column(Text, nullable=False)
    accepted_answers: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    numeric_tolerance: Mapped[float | None] = mapped_column(Float, nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)

    timer_seconds: Mapped[int] = mapped_column(Integer, default=45)
    points: Mapped[int] = mapped_column(Integer, default=10)
    penalty: Mapped[int] = mapped_column(Integer, default=0)

    is_published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    subject: Mapped["Subject"] = relationship(back_populates="questions")
    topic: Mapped["Topic | None"] = relationship(back_populates="questions")
    riddle_clues: Mapped[list["RiddleClue"]] = relationship(
        back_populates="question", order_by="RiddleClue.order", cascade="all, delete-orphan"
    )


class RiddleClue(Base):
    __tablename__ = "riddle_clues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), nullable=False)
    order: Mapped[int] = mapped_column(Integer, nullable=False)
    clue_text: Mapped[str] = mapped_column(Text, nullable=False)
    points_value: Mapped[int] = mapped_column(Integer, nullable=False)

    question: Mapped["Question"] = relationship(back_populates="riddle_clues")


class QuizConfig(Base):
    __tablename__ = "quiz_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    mode: Mapped[QuizMode] = mapped_column(Enum(QuizMode), nullable=False)
    round_types: Mapped[list[str]] = mapped_column(JSON, nullable=False)
    subjects: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    difficulty: Mapped[Difficulty | None] = mapped_column(Enum(Difficulty), nullable=True)
    question_count: Mapped[int] = mapped_column(Integer, default=10)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class QuizSession(Base):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    quiz_config_id: Mapped[int | None] = mapped_column(ForeignKey("quiz_configs.id"), nullable=True)
    status: Mapped[SessionStatus] = mapped_column(Enum(SessionStatus), default=SessionStatus.IN_PROGRESS)

    rounds_snapshot: Mapped[list[dict]] = mapped_column(JSON, nullable=False)
    current_round_index: Mapped[int] = mapped_column(Integer, default=0)
    current_question_index: Mapped[int] = mapped_column(Integer, default=0)
    riddle_clues_revealed: Mapped[int] = mapped_column(Integer, default=0)

    total_score: Mapped[int] = mapped_column(Integer, default=0)
    round_scores: Mapped[list[dict]] = mapped_column(JSON, default=list)

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="sessions")
    answers: Mapped[list["SessionAnswer"]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )


class SessionAnswer(Base):
    __tablename__ = "session_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"), nullable=False)
    round_index: Mapped[int] = mapped_column(Integer, nullable=False)

    submitted_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_correct: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    points_awarded: Mapped[int] = mapped_column(Integer, default=0)
    time_taken_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    clues_revealed: Mapped[int | None] = mapped_column(Integer, nullable=True)
    answered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    session: Mapped["QuizSession"] = relationship(back_populates="answers")
    question: Mapped["Question"] = relationship()


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    achievement_id: Mapped[int] = mapped_column(ForeignKey("achievements.id"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    user: Mapped["User"] = relationship(back_populates="achievements")
    achievement: Mapped["Achievement"] = relationship()
