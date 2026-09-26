"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import QuestionForm, { type QuestionFormValues } from "@/components/admin/QuestionForm";
import { api } from "@/lib/api";
import { ROUND_LABELS } from "@/lib/constants";
import type { Question, Subject } from "@/lib/types";

function QuestionsContent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    const [q, s] = await Promise.all([api.get<Question[]>("/questions"), api.get<Subject[]>("/subjects")]);
    setQuestions(q);
    setSubjects(s);
  }

  useEffect(() => {
    // Fetch-on-mount: setState only happens after the awaited request
    // resolves, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  async function handleCreate(values: QuestionFormValues) {
    setSubmitting(true);
    try {
      await api.post("/questions", values);
      setShowForm(false);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: QuestionFormValues) {
    if (!editing) return;
    setSubmitting(true);
    try {
      await api.patch(`/questions/${editing.id}`, values);
      setEditing(null);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePublish(q: Question) {
    await api.patch(`/questions/${q.id}`, { is_published: !q.is_published });
    await refresh();
  }

  async function handleDelete(q: Question) {
    if (!confirm(`Delete "${q.prompt.slice(0, 60)}…"?`)) return;
    await api.delete(`/questions/${q.id}`);
    await refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Question bank</h1>
          <p className="mt-2 text-ink-soft">{questions.length} questions · {questions.filter((q) => q.is_published).length} published</p>
        </div>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
          >
            + New question
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-6">
          <QuestionForm subjects={subjects} onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitting={submitting} />
        </div>
      )}

      {editing && (
        <div className="mt-6">
          <QuestionForm
            subjects={subjects}
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3">
        {questions.map((q) => (
          <div key={q.id} className="rounded-xl border border-line bg-paper-raised p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <span>{ROUND_LABELS[q.round_type]}</span>
              <span>·</span>
              <span>{subjects.find((s) => s.id === q.subject_id)?.name ?? "—"}</span>
              <span>·</span>
              <span className={q.is_published ? "text-emerald-600" : "text-rose-600"}>
                {q.is_published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">{q.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button onClick={() => setEditing(q)} className="text-sm font-semibold text-navy-900 hover:text-gold-600">
                Edit
              </button>
              <button onClick={() => togglePublish(q)} className="text-sm font-semibold text-navy-900 hover:text-gold-600">
                {q.is_published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => handleDelete(q)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                Delete
              </button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="text-sm text-ink-soft">No questions yet. Create the first one.</p>}
      </div>
    </div>
  );
}

export default function AdminQuestionsPage() {
  return (
    <RequireAuth role="admin">
      <QuestionsContent />
    </RequireAuth>
  );
}
