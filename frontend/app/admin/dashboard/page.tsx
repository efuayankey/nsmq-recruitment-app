"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { LeaderboardEntry, Question } from "@/lib/types";

function AdminDashboardContent() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.get<Question[]>("/questions").then(setQuestions).catch(() => {});
    api.get<LeaderboardEntry[]>("/leaderboards").then(setLeaderboard).catch(() => {});
  }, []);

  const published = questions?.filter((q) => q.is_published).length ?? 0;
  const drafts = (questions?.length ?? 0) - published;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">NSMQ Coordinator Dashboard</h1>
      <p className="mt-2 text-ink-soft">Manage the question bank and keep an eye on student engagement.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Published questions</p>
          <p className="mt-2 font-display text-2xl font-bold text-navy-900">{published}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Draft questions</p>
          <p className="mt-2 font-display text-2xl font-bold text-navy-900">{drafts}</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Active students</p>
          <p className="mt-2 font-display text-2xl font-bold text-navy-900">{leaderboard?.length ?? "—"}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/questions"
          className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          Manage question bank
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-navy-700/50"
        >
          View leaderboard
        </Link>
      </div>

      {leaderboard && leaderboard.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Top students</h2>
          <div className="mt-4 flex flex-col gap-2">
            {leaderboard.slice(0, 5).map((entry, i) => (
              <div key={entry.user_id} className="flex items-center justify-between rounded-xl border border-line bg-paper-raised px-4 py-3 text-sm">
                <span className="font-medium text-ink">
                  {i + 1}. {entry.full_name}
                </span>
                <span className="font-semibold text-navy-900">{entry.best_score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <RequireAuth role="admin">
      <AdminDashboardContent />
    </RequireAuth>
  );
}
