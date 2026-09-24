"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("Archbishop Porter Girls' SHS");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(email, password, fullName, schoolName);
      router.push(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink-soft">Start training for NSMQ team selection.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="fullName" className="text-sm font-medium text-ink">
            Full name
          </label>
          <input
            id="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-ink outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
          />
        </div>

        <div>
          <label htmlFor="schoolName" className="text-sm font-medium text-ink">
            School
          </label>
          <input
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-ink outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-ink outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-ink outline-none focus:border-navy-700 focus:ring-2 focus:ring-navy-700/20"
          />
          <p className="mt-1 text-xs text-ink-soft">At least 8 characters.</p>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-navy-900 hover:text-gold-600">
          Log in
        </Link>
      </p>
    </div>
  );
}
