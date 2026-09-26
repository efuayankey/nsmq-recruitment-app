"use client";

import { useEffect, useRef, useState } from "react";

/** Pass a per-question `key` when rendering this (e.g. key={question.id}) so
 * React remounts it on question change instead of needing an effect to
 * reset internal state. */
export default function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const low = remaining <= 5;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-display text-sm font-semibold ${
        low ? "border-rose-500 bg-rose-500/10 text-rose-600" : "border-navy-700/30 bg-navy-900/5 text-navy-900"
      }`}
    >
      <span aria-hidden>⏱</span>
      {String(Math.floor(remaining / 60)).padStart(1, "0")}:{String(remaining % 60).padStart(2, "0")}
    </div>
  );
}
