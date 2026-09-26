"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api, ApiError } from "@/lib/api";
import { ALL_ROUND_TYPES, ROUND_LABELS, SUBJECTS } from "@/lib/constants";
import type { DashboardStats, QuizMode, RoundType, SessionHistoryItem, SessionState } from "@/lib/types";

const MODES: { id: QuizMode; title: string; description: string }[] = [
  { id: "full_contest", title: "Full Contest Simulation", description: "All 5 rounds, back to back, cumulative score." },
  { id: "round_practice", title: "Round Practice", description: "Drill one round type repeatedly." },
  { id: "subject_practice", title: "Subject Practice", description: "Focus on one or more subjects." },
  { id: "quick_drill", title: "Quick Drill", description: "5 quick questions, mixed subjects." },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [mode, setMode] = useState<QuizMode>("full_contest");
  const [selectedRound, setSelectedRound] = useState<RoundType>("general");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/me/dashboard").then(setStats).catch(() => {});
    api.get<SessionHistoryItem[]>("/me/history").then(setHistory).catch(() => {});
  }, []);

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }

  async function startSession() {
    setError(null);
    setStarting(true);
    try {
      let round_types: RoundType[] = ALL_ROUND_TYPES;
      let question_count = 10;
      let subjects: string[] | undefined;

      if (mode === "round_practice") {
        round_types = [selectedRound];
        question_count = 5;
      } else if (mode === "subject_practice") {
        round_types = ["general"];
        question_count = 8;
        subjects = selectedSubjects.length ? selectedSubjects : undefined;
      } else if (mode === "quick_drill") {
        round_types = ["general"];
        question_count = 5;
      }

      const session = await api.post<SessionState>("/sessions", { mode, round_types, question_count, subjects });
      router.push(`/student/quiz/${session.session_id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start a session. Try again.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Your training hub</h1>
      <p className="mt-2 text-ink-soft">Pick a mode and start practicing — every answer is scored instantly.</p>

      {stats && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Sessions completed" value={String(stats.total_sessions)} />
          <StatCard label="Best score" value={String(stats.best_score)} />
          <StatCard label="Accuracy" value={`${Math.round(stats.accuracy * 100)}%`} />
          <StatCard label="Current streak" value={`${stats.current_streak} day${stats.current_streak === 1 ? "" : "s"}`} />
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Start a session</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === m.id
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-line bg-paper-raised text-ink hover:border-navy-700/50"
                }`}
              >
                <p className="font-display font-semibold">{m.title}</p>
                <p className={`mt-1 text-sm ${mode === m.id ? "text-white/70" : "text-ink-soft"}`}>{m.description}</p>
              </button>
            ))}
          </div>

          {mode === "round_practice" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink">Round type</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_ROUND_TYPES.map((rt) => (
                  <button
                    key={rt}
                    onClick={() => setSelectedRound(rt)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      selectedRound === rt
                        ? "border-gold-500 bg-gold-500/10 text-gold-600"
                        : "border-line text-ink-soft hover:border-navy-700/40"
                    }`}
                  >
                    {ROUND_LABELS[rt]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "subject_practice" && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink">Subjects (leave blank for all)</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSubject(s)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition ${
                      selectedSubjects.includes(s)
                        ? "border-gold-500 bg-gold-500/10 text-gold-600"
                        : "border-line text-ink-soft hover:border-navy-700/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

          <button
            onClick={startSession}
            disabled={starting}
            className="mt-6 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
          >
            {starting ? "Starting…" : "Start session"}
          </button>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Recent sessions</h2>
          <div className="mt-4 flex flex-col gap-2">
            {history.length === 0 && <p className="text-sm text-ink-soft">No sessions yet — start your first one.</p>}
            {history.slice(0, 8).map((h) => (
              <Link
                key={h.session_id}
                href={h.status === "completed" ? `/student/quiz/${h.session_id}/results` : `/student/quiz/${h.session_id}`}
                className="flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm transition hover:border-navy-700/40"
              >
                <span className="text-ink-soft">{new Date(h.started_at).toLocaleDateString()}</span>
                <span className="font-medium text-ink">
                  {h.status === "completed" ? `${h.total_score} pts` : "In progress"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <RequireAuth role="student">
      <DashboardContent />
    </RequireAuth>
  );
}
