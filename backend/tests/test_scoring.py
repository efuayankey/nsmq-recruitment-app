from app.models import Difficulty, Question, QuestionType, RiddleClue, RoundType
from app.services.scoring import grade_riddle_answer, grade_standard_answer, is_answer_correct, normalize_text


def _question(**overrides) -> Question:
    defaults = dict(
        subject_id=1,
        round_type=RoundType.GENERAL,
        question_type=QuestionType.SHORT_ANSWER,
        difficulty=Difficulty.MEDIUM,
        prompt="test",
        correct_answer="Mitochondria",
        timer_seconds=45,
        points=10,
        penalty=0,
    )
    defaults.update(overrides)
    return Question(**defaults)


def test_normalize_text_collapses_whitespace_and_case():
    assert normalize_text("  Mitochondria  ") == "mitochondria"
    assert normalize_text("H2O") == "h2o"
    assert normalize_text("multi   space") == "multi space"


def test_short_answer_matches_case_and_whitespace_insensitively():
    q = _question(correct_answer="Mitochondria")
    assert is_answer_correct(q, "  mitochondria ") is True
    assert is_answer_correct(q, "nucleus") is False


def test_short_answer_matches_accepted_answers_list():
    q = _question(correct_answer="Mitochondria", accepted_answers=["Mitochondrion"])
    assert is_answer_correct(q, "mitochondrion") is True


def test_numeric_within_tolerance_is_correct():
    q = _question(
        question_type=QuestionType.NUMERIC, correct_answer="21.5", numeric_tolerance=0.5
    )
    assert is_answer_correct(q, "21.9") is True
    assert is_answer_correct(q, "22.1") is False


def test_numeric_garbage_input_is_not_correct():
    q = _question(question_type=QuestionType.NUMERIC, correct_answer="5", numeric_tolerance=0)
    assert is_answer_correct(q, "not a number") is False


def test_standard_grading_awards_points_on_correct():
    q = _question(correct_answer="5", points=10, penalty=3)
    correct, points = grade_standard_answer(q, "5")
    assert correct is True
    assert points == 10


def test_standard_grading_applies_penalty_on_incorrect():
    q = _question(correct_answer="5", points=10, penalty=3)
    correct, points = grade_standard_answer(q, "wrong")
    assert correct is False
    assert points == -3


def test_riddle_scores_by_clue_level_revealed():
    q = _question(round_type=RoundType.RIDDLE, correct_answer="DNA", points=5, penalty=5)
    q.riddle_clues = [
        RiddleClue(order=1, clue_text="clue 1", points_value=20),
        RiddleClue(order=2, clue_text="clue 2", points_value=12),
        RiddleClue(order=3, clue_text="clue 3", points_value=5),
    ]

    correct, points = grade_riddle_answer(q, "DNA", clues_revealed=0)
    assert correct is True and points == 20

    correct, points = grade_riddle_answer(q, "DNA", clues_revealed=2)
    assert correct is True and points == 5


def test_riddle_wrong_answer_applies_penalty():
    q = _question(round_type=RoundType.RIDDLE, correct_answer="DNA", points=5, penalty=5)
    q.riddle_clues = [RiddleClue(order=1, clue_text="clue 1", points_value=20)]

    correct, points = grade_riddle_answer(q, "RNA", clues_revealed=0)
    assert correct is False
    assert points == -5
