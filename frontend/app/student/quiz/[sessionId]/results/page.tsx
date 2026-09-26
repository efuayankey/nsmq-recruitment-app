"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import { ROUND_LABELS } from "@/lib/constants";
import type { SessionResults } from "@/lib/types";

function ResultsContent() {
  const params = useParams<{ sessionId: string }>();
  const [results, setResults] = useState<SessionResults | null>(null);

  useEffect(() => {
    api.post<SessionResults>(`/sessions/${params.sessionId}/complete`).then(setResults);
  }, [params.sessionId]);

  if (!results) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-soft">Loading results…</p>
      </div>
    );
  }

  const mistakes = results.answers.filter((a) => !a.is_correct);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-line bg-navy-950 p-8 text-center text-white sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">Session complete</p>
        <p className="mt-4 font-display text-5xl font-bold">{results.total_score} pts</p>
        <p className="mt-2 text-white/70">
          {results.answers.filter((a) => a.is_correct).length} of {results.answers.length} correct
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {results.round_scores.map((rs) => {
          const answer = results.answers.find((a) => a.round_index === rs.round_index);
          return (
            <div key={rs.round_index} className="rounded-xl border border-line bg-paper-raised p-4">
              <p className="text-sm font-medium text-ink-soft">
                {answer ? ROUND_LABELS[answer.round_type] : `Round ${rs.round_index + 1}`}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-navy-900">{rs.score} pts</p>
            </div>
          );
        })}
      </div>

      {mistakes.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Mistake review</h2>
          <div className="mt-4 flex flex-col gap-3">
            {mistakes.map((m) => (
              <div key={m.question_id} className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                  {m.subject} · {ROUND_LABELS[m.round_type]}
                </p>
                <p className="mt-2 text-sm font-medium text-ink">{m.prompt}</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Your answer: <span className="text-rose-600">{m.submitted_answer || "(no answer)"}</span>
                </p>
                <p className="text-sm text-ink-soft">
                  Correct answer: <span className="font-medium text-emerald-600">{m.correct_answer}</span>
                </p>
                {m.explanation && <p className="mt-1 text-sm text-ink-soft">{m.explanation}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/student/dashboard"
          className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          Back to dashboard
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-navy-700/50"
        >
          See leaderboard
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <RequireAuth role="student">
      <ResultsContent />
    </RequireAuth>
  );
}
