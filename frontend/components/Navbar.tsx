"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    router.push("/");
  }

  const dashboardHref = user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/60 bg-navy-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logos/school-logo.png"
            alt="Archbishop Porter Girls' SHS logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            NSMQ MasterQuiz
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/leaderboard" className="text-sm font-medium text-white/80 transition hover:text-gold-400">
            Leaderboard
          </Link>
          {!loading && user && (
            <Link href={dashboardHref} className="text-sm font-medium text-white/80 transition hover:text-gold-400">
              Dashboard
            </Link>
          )}
          {!loading && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">{user.full_name}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white transition hover:border-gold-400 hover:text-gold-400"
              >
                Log out
              </button>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-white/80 transition hover:text-gold-400">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-gold-500 px-4 py-1.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
              >
                Get started
              </Link>
            </div>
          ) : null}
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-navy-800/60 bg-navy-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/leaderboard" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/80">
              Leaderboard
            </Link>
            {user && (
              <Link href={dashboardHref} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/80">
                Dashboard
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm font-medium text-gold-400">
                Log out ({user.full_name})
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/80">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gold-400">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
