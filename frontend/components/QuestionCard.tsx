"use client";

import { ROUND_LABELS } from "@/lib/constants";
import type { QuestionPublic } from "@/lib/types";

export default function QuestionCard({
  question,
  value,
  onChange,
  onRevealClue,
  revealingClue,
}: {
  question: QuestionPublic;
  value: string;
  onChange: (value: string) => void;
  onRevealClue?: () => void;
  revealingClue?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-navy-900/10 px-3 py-1 text-xs font-semibold text-navy-900">
          {question.subject}
        </span>
        <span className="rounded-full bg-navy-900/10 px-3 py-1 text-xs font-semibold text-navy-900">
          {ROUND_LABELS[question.round_type]}
        </span>
        <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-600 capitalize">
          {question.difficulty}
        </span>
        <span className="ml-auto text-xs font-medium text-ink-soft">Worth {question.points} pts</span>
      </div>

      <p className="mt-6 text-lg font-medium leading-relaxed text-ink sm:text-xl">{question.prompt}</p>

      {question.round_type === "riddle" && (
        <div className="mt-4 space-y-2">
          {question.revealed_clues.map((clue, i) => (
            <p key={i} className="rounded-lg bg-navy-900/5 px-4 py-2 text-sm text-ink-soft">
              Clue {i + 1}: {clue}
            </p>
          ))}
          {onRevealClue && (
            <button
              type="button"
              onClick={onRevealClue}
              disabled={revealingClue}
              className="text-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 disabled:opacity-50"
            >
              {revealingClue ? "Revealing…" : "Reveal another clue (fewer points)"}
            </button>
          )}
        </div>
      )}

      <div className="mt-6">
        {question.question_type === "mcq" && question.options ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(option)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  value === option
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-line text-ink hover:border-navy-700/50"
                }`}
              >
                <span className="mr-2 font-display font-bold text-gold-600">{String.fromCharCode(65 + i)}.</span>
                {option}
              </button>
            ))}
          </div>
        ) : question.question_type === "true_false" ? (
          <div className="flex gap-3">
            {["True", "False"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  value === option
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-line text-ink hover:border-navy-700/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={question.question_type === "numeric" ? "text" : "text"}
            inputMode={question.question_type === "numeric" ? "decimal" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer…"
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
          />
        )}
      </div>
    </div>
  );
}
