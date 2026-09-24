"""Seed subjects, topics, and a starter question bank covering all 5 NSMQ
round types, plus a demo admin account. Run inside the backend container:

    docker compose exec backend python -m scripts.seed
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Difficulty, Question, QuestionType, RiddleClue, RoundType, Subject, Topic, User, UserRole

SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"]

QUESTIONS = [
    dict(
        subject="Chemistry",
        topic="Atomic structure",
        round_type=RoundType.GENERAL,
        question_type=QuestionType.MCQ,
        difficulty=Difficulty.EASY,
        prompt="What is the chemical formula for water?",
        options=["H2O", "CO2", "NaCl", "C6H12O6"],
        correct_answer="H2O",
        timer_seconds=45,
        points=10,
    ),
    dict(
        subject="Mathematics",
        topic="Linear equations",
        round_type=RoundType.GENERAL,
        question_type=QuestionType.NUMERIC,
        difficulty=Difficulty.EASY,
        prompt="If 2x + 5 = 15, what is the value of x?",
        correct_answer="5",
        numeric_tolerance=0,
        timer_seconds=45,
        points=10,
    ),
    dict(
        subject="Physics",
        topic="Electricity",
        round_type=RoundType.SPEED_RACE,
        question_type=QuestionType.MCQ,
        difficulty=Difficulty.MEDIUM,
        prompt="What is the SI unit of electric current?",
        options=["Volt", "Ampere", "Ohm", "Watt"],
        correct_answer="Ampere",
        timer_seconds=15,
        points=10,
    ),
    dict(
        subject="Biology",
        topic="Cell biology",
        round_type=RoundType.SPEED_RACE,
        question_type=QuestionType.SHORT_ANSWER,
        difficulty=Difficulty.EASY,
        prompt="Which organelle is known as the 'powerhouse of the cell'?",
        correct_answer="Mitochondria",
        accepted_answers=["Mitochondrion"],
        timer_seconds=15,
        points=10,
    ),
    dict(
        subject="Mathematics",
        topic="Calculus",
        round_type=RoundType.PROBLEM_OF_THE_DAY,
        question_type=QuestionType.SHORT_ANSWER,
        difficulty=Difficulty.HARD,
        prompt=(
            "A ball is thrown upward with initial velocity 20 m/s from a height of 1.5m. "
            "Using g = 10 m/s^2, find the maximum height reached above the ground (in metres)."
        ),
        correct_answer="21.5",
        numeric_tolerance=0.5,
        timer_seconds=180,
        points=25,
    ),
    dict(
        subject="Physics",
        topic="Mechanics",
        round_type=RoundType.TRUE_FALSE,
        question_type=QuestionType.TRUE_FALSE,
        difficulty=Difficulty.MEDIUM,
        prompt="True or False: Mass and weight are the same physical quantity.",
        correct_answer="False",
        timer_seconds=20,
        points=10,
        penalty=5,
    ),
    dict(
        subject="Chemistry",
        topic="Periodic table",
        round_type=RoundType.TRUE_FALSE,
        question_type=QuestionType.TRUE_FALSE,
        difficulty=Difficulty.EASY,
        prompt="True or False: Oxygen is a noble gas.",
        correct_answer="False",
        timer_seconds=20,
        points=10,
        penalty=5,
    ),
    dict(
        subject="Biology",
        topic="Genetics",
        round_type=RoundType.RIDDLE,
        question_type=QuestionType.SHORT_ANSWER,
        difficulty=Difficulty.MEDIUM,
        prompt="I am a molecule that carries the genetic code of life, shaped like a twisted ladder. What am I?",
        correct_answer="DNA",
        accepted_answers=["Deoxyribonucleic acid"],
        timer_seconds=60,
        points=5,
        penalty=5,
        riddle_clues=[
            {"order": 1, "clue_text": "I am found in the nucleus of almost every cell.", "points_value": 20},
            {"order": 2, "clue_text": "I am made of four repeating bases: A, T, C, G.", "points_value": 12},
            {"order": 3, "clue_text": "James Watson and Francis Crick described my double-helix structure.", "points_value": 5},
        ],
    ),
]

ADMIN_EMAIL = "admin@nsmqmasterquiz.com"
ADMIN_PASSWORD = "changeme123"


def run() -> None:
    db = SessionLocal()
    try:
        subject_map: dict[str, Subject] = {}
        for name in SUBJECTS:
            subject = db.query(Subject).filter(Subject.name == name).first()
            if subject is None:
                subject = Subject(name=name)
                db.add(subject)
                db.flush()
            subject_map[name] = subject

        admin = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if admin is None:
            admin = User(
                email=ADMIN_EMAIL,
                hashed_password=hash_password(ADMIN_PASSWORD),
                full_name="NSMQ Coordinator",
                role=UserRole.ADMIN,
            )
            db.add(admin)
            db.flush()

        for entry in QUESTIONS:
            existing = db.query(Question).filter(Question.prompt == entry["prompt"]).first()
            if existing:
                continue

            subject = subject_map[entry["subject"]]
            topic_name = entry.get("topic")
            topic = None
            if topic_name:
                topic = db.query(Topic).filter(Topic.subject_id == subject.id, Topic.name == topic_name).first()
                if topic is None:
                    topic = Topic(subject_id=subject.id, name=topic_name)
                    db.add(topic)
                    db.flush()

            riddle_clues = entry.pop("riddle_clues", None)
            question = Question(
                subject_id=subject.id,
                topic_id=topic.id if topic else None,
                round_type=entry["round_type"],
                question_type=entry["question_type"],
                difficulty=entry["difficulty"],
                prompt=entry["prompt"],
                options=entry.get("options"),
                correct_answer=entry["correct_answer"],
                accepted_answers=entry.get("accepted_answers"),
                numeric_tolerance=entry.get("numeric_tolerance"),
                timer_seconds=entry.get("timer_seconds", 45),
                points=entry.get("points", 10),
                penalty=entry.get("penalty", 0),
                is_published=True,
                created_by=admin.id,
            )
            db.add(question)
            db.flush()

            if riddle_clues:
                for clue in riddle_clues:
                    db.add(
                        RiddleClue(
                            question_id=question.id,
                            order=clue["order"],
                            clue_text=clue["clue_text"],
                            points_value=clue["points_value"],
                        )
                    )

        db.commit()
        print(f"Seed complete. Admin login: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
