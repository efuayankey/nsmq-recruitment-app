"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

function LeaderboardContent() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    api.get<LeaderboardEntry[]>("/leaderboards").then(setEntries);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Leaderboard</h1>
      <p className="mt-2 text-ink-soft">Best completed-session score per student.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper-raised">
        {entries === null ? (
          <p className="p-6 text-sm text-ink-soft">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">No completed sessions yet. Be the first!</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-950 text-white/80">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">School</th>
                <th className="px-4 py-3 text-right font-medium">Best score</th>
                <th className="px-4 py-3 text-right font-medium">Sessions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.user_id} className="border-t border-line">
                  <td className="px-4 py-3 font-display font-semibold text-gold-600">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-ink">{e.full_name}</td>
                  <td className="px-4 py-3 text-ink-soft">{e.school_name || "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-navy-900">{e.best_score}</td>
                  <td className="px-4 py-3 text-right text-ink-soft">{e.sessions_completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <RequireAuth>
      <LeaderboardContent />
    </RequireAuth>
  );
}
