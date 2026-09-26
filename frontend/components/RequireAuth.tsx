"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";

export default function RequireAuth({ role, children }: { role?: UserRole; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (role && user.role !== role) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    }
  }, [loading, user, role, router]);

  if (loading || !user || (role && user.role !== role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-ink-soft">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
