export type UserRole = "student" | "admin";

export type RoundType = "general" | "speed_race" | "problem_of_the_day" | "true_false" | "riddle";
export type QuestionType = "mcq" | "short_answer" | "numeric" | "true_false";
export type Difficulty = "easy" | "medium" | "hard";
export type QuizMode = "full_contest" | "round_practice" | "subject_practice" | "quick_drill";
export type SessionStatus = "in_progress" | "completed" | "abandoned";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  school_id: number | null;
}

export interface Subject {
  id: number;
  name: string;
}

export interface RiddleClueInput {
  order: number;
  clue_text: string;
  points_value: number;
}

export interface Question {
  id: number;
  subject_id: number;
  topic_id: number | null;
  round_type: RoundType;
  question_type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  options: string[] | null;
  correct_answer: string;
  accepted_answers: string[] | null;
  numeric_tolerance: number | null;
  explanation: string | null;
  source: string | null;
  timer_seconds: number;
  points: number;
  penalty: number;
  is_published: boolean;
  created_at: string;
  riddle_clues: RiddleClueInput[];
}

export interface QuestionPublic {
  question_id: number;
  round_type: RoundType;
  question_type: QuestionType;
  subject: string;
  difficulty: Difficulty;
  prompt: string;
  options: string[] | null;
  timer_seconds: number;
  points: number;
  revealed_clues: string[];
}

export interface SessionState {
  session_id: number;
  status: SessionStatus;
  round_index: number;
  round_type: RoundType;
  question_index: number;
  question_count_in_round: number;
  total_score: number;
  current_question: QuestionPublic | null;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: string;
  points_awarded: number;
  explanation: string | null;
}

export interface SessionResultAnswer {
  question_id: number;
  prompt: string;
  subject: string;
  round_type: RoundType;
  submitted_answer: string | null;
  correct_answer: string;
  explanation: string | null;
  is_correct: boolean;
  points_awarded: number;
  round_index: number;
}

export interface SessionResults {
  session_id: number;
  total_score: number;
  round_scores: { round_index: number; score: number }[];
  started_at: string;
  completed_at: string | null;
  answers: SessionResultAnswer[];
}

export interface SessionHistoryItem {
  session_id: number;
  status: SessionStatus;
  total_score: number;
  started_at: string;
  completed_at: string | null;
}

export interface DashboardStats {
  total_sessions: number;
  average_score: number;
  best_score: number;
  accuracy: number;
  subject_strength: Record<string, number>;
  round_strength: Record<string, number>;
  current_streak: number;
}

export interface LeaderboardEntry {
  user_id: number;
  full_name: string;
  school_name: string | null;
  best_score: number;
  sessions_completed: number;
}
