"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import { api } from "@/lib/api";
import { ROUND_LABELS } from "@/lib/constants";
import type { AnswerResult, SessionState } from "@/lib/types";

function QuizContent() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params.sessionId;
  const router = useRouter();

  const [state, setState] = useState<SessionState | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [revealingClue, setRevealingClue] = useState(false);
  // 0 until the first loadState() call sets it — Date.now() is impure and
  // can't be used as a useRef initializer evaluated during render.
  const startedAtRef = useRef<number>(0);

  const loadState = useCallback(async () => {
    const s = await api.get<SessionState>(`/sessions/${sessionId}`);
    setState(s);
    setAnswer("");
    setFeedback(null);
    startedAtRef.current = Date.now();
    if (s.status === "completed") {
      router.replace(`/student/quiz/${sessionId}/results`);
    }
  }, [sessionId, router]);

  useEffect(() => {
    // Fetch-on-mount/session-change: setState only happens after the
    // awaited request resolves, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadState();
  }, [loadState]);

  async function handleSubmit() {
    if (!state?.current_question || submitting) return;
    setSubmitting(true);
    try {
      const time_taken_seconds = Math.round((Date.now() - startedAtRef.current) / 1000);
      const result = await api.post<AnswerResult>(`/sessions/${sessionId}/answers`, {
        answer,
        time_taken_seconds,
      });
      setFeedback(result);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevealClue() {
    setRevealingClue(true);
    try {
      const s = await api.post<SessionState>(`/sessions/${sessionId}/reveal-clue`);
      setState(s);
    } finally {
      setRevealingClue(false);
    }
  }

  if (!state) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-soft">Loading your session…</p>
      </div>
    );
  }

  if (!state.current_question) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-soft">Wrapping up…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
            Round {state.round_index + 1} · {ROUND_LABELS[state.round_type]}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Question {state.question_index + 1} of {state.question_count_in_round}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold text-navy-900">{state.total_score} pts</span>
          {!feedback && (
            <Timer
              key={state.current_question.question_id}
              seconds={state.current_question.timer_seconds}
              onExpire={handleSubmit}
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <QuestionCard
          question={state.current_question}
          value={answer}
          onChange={setAnswer}
          onRevealClue={state.current_question.round_type === "riddle" ? handleRevealClue : undefined}
          revealingClue={revealingClue}
        />
      </div>

      {feedback ? (
        <div
          className={`mt-6 rounded-2xl border p-5 ${
            feedback.is_correct ? "border-emerald-500 bg-emerald-500/10" : "border-rose-500 bg-rose-500/10"
          }`}
        >
          <p className={`font-display font-semibold ${feedback.is_correct ? "text-emerald-600" : "text-rose-600"}`}>
            {feedback.is_correct ? "Correct!" : "Not quite"}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Correct answer: <span className="font-medium text-ink">{feedback.correct_answer}</span>
            {" · "}
            {feedback.points_awarded >= 0 ? "+" : ""}
            {feedback.points_awarded} pts
          </p>
          {feedback.explanation && <p className="mt-2 text-sm text-ink-soft">{feedback.explanation}</p>}
          <button
            onClick={loadState}
            className="mt-4 rounded-full bg-navy-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            Continue
          </button>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!answer || submitting}
          className="mt-6 w-full rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit answer"}
        </button>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <RequireAuth role="student">
      <QuizContent />
    </RequireAuth>
  );
}
