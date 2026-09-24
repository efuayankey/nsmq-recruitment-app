"""Answer normalization and grading. Pure functions — no DB access — so they're
cheap to unit test and reusable across round types."""

import re

from app.models import Question, QuestionType


def normalize_text(raw: str) -> str:
    return re.sub(r"\s+", " ", raw.strip().lower())


def _try_float(value: str) -> float | None:
    try:
        return float(value.strip())
    except ValueError:
        return None


def is_answer_correct(question: Question, submitted_answer: str) -> bool:
    if submitted_answer is None:
        return False

    if question.question_type == QuestionType.NUMERIC:
        submitted_num = _try_float(submitted_answer)
        correct_num = _try_float(question.correct_answer)
        if submitted_num is None or correct_num is None:
            return False
        tolerance = question.numeric_tolerance or 0.0
        return abs(submitted_num - correct_num) <= tolerance

    candidates = [question.correct_answer, *(question.accepted_answers or [])]
    normalized_submitted = normalize_text(submitted_answer)
    return any(normalize_text(candidate) == normalized_submitted for candidate in candidates)


def grade_standard_answer(question: Question, submitted_answer: str) -> tuple[bool, int]:
    """Grading for general/speed_race/problem_of_the_day/true_false rounds:
    full points if correct, penalty (as a negative award) if wrong."""
    correct = is_answer_correct(question, submitted_answer)
    points = question.points if correct else -question.penalty
    return correct, points


def grade_riddle_answer(question: Question, submitted_answer: str, clues_revealed: int) -> tuple[bool, int]:
    """Riddle scoring: correct answer is worth the points value of the clue level
    the student had revealed when they answered (progressive, decreasing value).
    Falls back to the question's base points if no clues were configured."""
    correct = is_answer_correct(question, submitted_answer)
    if not correct:
        return False, -question.penalty

    clues = question.riddle_clues
    if not clues:
        return True, question.points

    clue_index = max(0, min(clues_revealed, len(clues) - 1))
    return True, clues[clue_index].points_value
