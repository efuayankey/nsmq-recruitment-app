"use client";

import { useState, type FormEvent } from "react";
import { ALL_ROUND_TYPES, ROUND_LABELS } from "@/lib/constants";
import type { Difficulty, Question, QuestionType, RoundType, Subject } from "@/lib/types";

const QUESTION_TYPES: QuestionType[] = ["mcq", "short_answer", "numeric", "true_false"];
const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export interface QuestionFormValues {
  subject_id: number;
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
  riddle_clues: { order: number; clue_text: string; points_value: number }[] | null;
}

function fromQuestion(q: Question): QuestionFormValues {
  return {
    subject_id: q.subject_id,
    round_type: q.round_type,
    question_type: q.question_type,
    difficulty: q.difficulty,
    prompt: q.prompt,
    options: q.options,
    correct_answer: q.correct_answer,
    accepted_answers: q.accepted_answers,
    numeric_tolerance: q.numeric_tolerance,
    explanation: q.explanation,
    source: q.source,
    timer_seconds: q.timer_seconds,
    points: q.points,
    penalty: q.penalty,
    is_published: q.is_published,
    riddle_clues: q.riddle_clues.length ? q.riddle_clues : null,
  };
}

const EMPTY: QuestionFormValues = {
  subject_id: 0,
  round_type: "general",
  question_type: "short_answer",
  difficulty: "medium",
  prompt: "",
  options: null,
  correct_answer: "",
  accepted_answers: null,
  numeric_tolerance: null,
  explanation: null,
  source: null,
  timer_seconds: 45,
  points: 10,
  penalty: 0,
  is_published: false,
  riddle_clues: null,
};

export default function QuestionForm({
  subjects,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  subjects: Subject[];
  initial?: Question;
  onSubmit: (values: QuestionFormValues) => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const [values, setValues] = useState<QuestionFormValues>(
    initial ? fromQuestion(initial) : { ...EMPTY, subject_id: subjects[0]?.id ?? 0 }
  );
  const [optionsText, setOptionsText] = useState((initial?.options ?? []).join("\n"));
  const [acceptedText, setAcceptedText] = useState((initial?.accepted_answers ?? []).join(", "));
  const [clues, setClues] = useState(
    initial?.riddle_clues.length
      ? initial.riddle_clues
      : [{ order: 1, clue_text: "", points_value: 20 }]
  );

  function update<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function addClue() {
    setClues((prev) => [...prev, { order: prev.length + 1, clue_text: "", points_value: 5 }]);
  }

  function removeClue(index: number) {
    setClues((prev) => prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, order: i + 1 })));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const options =
      values.question_type === "mcq"
        ? optionsText.split("\n").map((s) => s.trim()).filter(Boolean)
        : null;
    const accepted_answers = acceptedText.trim()
      ? acceptedText.split(",").map((s) => s.trim()).filter(Boolean)
      : null;
    const riddle_clues = values.round_type === "riddle" ? clues.filter((c) => c.clue_text.trim()) : null;

    onSubmit({ ...values, options, accepted_answers, riddle_clues });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line bg-paper-raised p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink">Subject</label>
          <select
            value={values.subject_id}
            onChange={(e) => update("subject_id", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Round type</label>
          <select
            value={values.round_type}
            onChange={(e) => update("round_type", e.target.value as RoundType)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          >
            {ALL_ROUND_TYPES.map((rt) => (
              <option key={rt} value={rt}>
                {ROUND_LABELS[rt]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Question type</label>
          <select
            value={values.question_type}
            onChange={(e) => update("question_type", e.target.value as QuestionType)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt} value={qt}>
                {qt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Difficulty</label>
          <select
            value={values.difficulty}
            onChange={(e) => update("difficulty", e.target.value as Difficulty)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Prompt</label>
        <textarea
          required
          value={values.prompt}
          onChange={(e) => update("prompt", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>

      {values.question_type === "mcq" && (
        <div>
          <label className="text-sm font-medium text-ink">Options (one per line)</label>
          <textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink">Correct answer</label>
          <input
            required
            value={values.correct_answer}
            onChange={(e) => update("correct_answer", e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>

        {values.question_type === "numeric" ? (
          <div>
            <label className="text-sm font-medium text-ink">Numeric tolerance</label>
            <input
              type="number"
              step="any"
              value={values.numeric_tolerance ?? 0}
              onChange={(e) => update("numeric_tolerance", Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-ink">Accepted answers (comma separated)</label>
            <input
              value={acceptedText}
              onChange={(e) => setAcceptedText(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-ink">Timer (seconds)</label>
          <input
            type="number"
            min={5}
            value={values.timer_seconds}
            onChange={(e) => update("timer_seconds", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Points</label>
          <input
            type="number"
            min={1}
            value={values.points}
            onChange={(e) => update("points", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Penalty</label>
          <input
            type="number"
            min={0}
            value={values.penalty}
            onChange={(e) => update("penalty", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Explanation (optional)</label>
        <textarea
          value={values.explanation ?? ""}
          onChange={(e) => update("explanation", e.target.value || null)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
        />
      </div>

      {values.round_type === "riddle" && (
        <div>
          <label className="text-sm font-medium text-ink">Riddle clues (revealed in order, decreasing points)</label>
          <div className="mt-2 flex flex-col gap-2">
            {clues.map((clue, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={clue.clue_text}
                  onChange={(e) =>
                    setClues((prev) => prev.map((c, idx) => (idx === i ? { ...c, clue_text: e.target.value } : c)))
                  }
                  placeholder={`Clue ${i + 1}`}
                  className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  value={clue.points_value}
                  onChange={(e) =>
                    setClues((prev) =>
                      prev.map((c, idx) => (idx === i ? { ...c, points_value: Number(e.target.value) } : c))
                    )
                  }
                  className="w-24 rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeClue(i)}
                  className="rounded-lg border border-line px-3 text-sm text-rose-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addClue} className="self-start text-sm font-semibold text-navy-900 underline">
              + Add clue
            </button>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) => update("is_published", e.target.checked)}
        />
        Published (visible to students)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-navy-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create question"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-full border border-line px-6 py-2 text-sm font-semibold text-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}
