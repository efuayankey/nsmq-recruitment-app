from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models import Difficulty, QuestionType, QuizMode, RoundType, SessionStatus, UserRole


# ---- auth ----


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    school_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    school_id: int | None = None

    model_config = {"from_attributes": True}


# ---- questions ----


class RiddleClueSchema(BaseModel):
    order: int
    clue_text: str
    points_value: int

    model_config = {"from_attributes": True}


class QuestionCreate(BaseModel):
    subject_id: int
    topic_id: int | None = None
    round_type: RoundType
    question_type: QuestionType
    difficulty: Difficulty = Difficulty.MEDIUM
    prompt: str
    options: list[str] | None = None
    correct_answer: str
    accepted_answers: list[str] | None = None
    numeric_tolerance: float | None = None
    explanation: str | None = None
    source: str | None = None
    timer_seconds: int = 45
    points: int = 10
    penalty: int = 0
    is_published: bool = False
    riddle_clues: list[RiddleClueSchema] | None = None


class QuestionUpdate(BaseModel):
    subject_id: int | None = None
    topic_id: int | None = None
    round_type: RoundType | None = None
    question_type: QuestionType | None = None
    difficulty: Difficulty | None = None
    prompt: str | None = None
    options: list[str] | None = None
    correct_answer: str | None = None
    accepted_answers: list[str] | None = None
    numeric_tolerance: float | None = None
    explanation: str | None = None
    source: str | None = None
    timer_seconds: int | None = None
    points: int | None = None
    penalty: int | None = None
    is_published: bool | None = None
    riddle_clues: list[RiddleClueSchema] | None = None


class QuestionResponse(BaseModel):
    id: int
    subject_id: int
    topic_id: int | None
    round_type: RoundType
    question_type: QuestionType
    difficulty: Difficulty
    prompt: str
    options: list[str] | None
    correct_answer: str
    accepted_answers: list[str] | None
    numeric_tolerance: float | None
    explanation: str | None
    source: str | None
    timer_seconds: int
    points: int
    penalty: int
    is_published: bool
    created_at: datetime
    riddle_clues: list[RiddleClueSchema] = []

    model_config = {"from_attributes": True}


# ---- sessions / quiz engine ----


class StartSessionRequest(BaseModel):
    mode: QuizMode
    round_types: list[RoundType]
    subjects: list[str] | None = None
    difficulty: Difficulty | None = None
    question_count: int = 10


class QuestionPublic(BaseModel):
    """What the student sees while answering — no correct_answer leaked."""

    question_id: int
    round_type: RoundType
    question_type: QuestionType
    subject: str
    difficulty: Difficulty
    prompt: str
    options: list[str] | None = None
    timer_seconds: int
    points: int
    revealed_clues: list[str] = []


class SessionStateResponse(BaseModel):
    session_id: int
    status: SessionStatus
    round_index: int
    round_type: RoundType
    question_index: int
    question_count_in_round: int
    total_score: int
    current_question: QuestionPublic | None = None


class SubmitAnswerRequest(BaseModel):
    answer: str
    time_taken_seconds: int | None = None


class RevealClueRequest(BaseModel):
    pass


class AnswerResult(BaseModel):
    is_correct: bool
    correct_answer: str
    points_awarded: int
    explanation: str | None = None


class SessionResultsResponse(BaseModel):
    session_id: int
    total_score: int
    round_scores: list[dict]
    started_at: datetime
    completed_at: datetime | None
    answers: list[dict]


class SessionHistoryItem(BaseModel):
    session_id: int
    mode: str | None = None
    status: SessionStatus
    total_score: int
    started_at: datetime
    completed_at: datetime | None

    model_config = {"from_attributes": True}


# ---- dashboard / leaderboard ----


class DashboardResponse(BaseModel):
    total_sessions: int
    average_score: float
    best_score: int
    accuracy: float
    subject_strength: dict[str, float]
    round_strength: dict[str, float]
    current_streak: int


class LeaderboardEntry(BaseModel):
    user_id: int
    full_name: str
    school_name: str | None
    best_score: int
    sessions_completed: int
