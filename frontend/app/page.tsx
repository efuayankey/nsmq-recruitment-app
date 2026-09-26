import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "5", label: "Contest round types" },
  { value: "24/7", label: "Practice access" },
  { value: "0s", label: "Wait for your score" },
];

const FEATURES = [
  {
    title: "Instant results",
    description: "Every answer is scored server-side the moment you submit it — no more waiting weeks for grading.",
  },
  {
    title: "All 5 NSMQ rounds",
    description:
      "General Questions, Speed Race, Problem of the Day, True/False, and progressive-clue Riddles — practice the real contest format.",
  },
  {
    title: "Performance analytics",
    description: "Track accuracy by subject and round type, watch your streak grow, and see exactly where to focus next.",
  },
  {
    title: "Champion training",
    description: "Follow the same round structure and pacing used by our NSMQ representatives, any time you want to train.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(234,182,39,0.16),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              Archbishop Porter Girls&apos; SHS
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Join the legacy of <span className="text-gold-400">NSMQ champions</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              Train, compete, and earn your place representing Archbishop Porter Girls in Ghana&apos;s most
              prestigious academic competition — the National Science &amp; Maths Quiz.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
              >
                Start your journey
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-400"
              >
                I already have an account
              </Link>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">{stat.value}</dd>
                  <p className="mt-1 text-xs text-white/60 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -top-4 -right-4 rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-navy-950 shadow-lg">
              2022 Western Zonal Champions
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
              <Image
                src="/images/contestants/team-2024.jpg"
                alt="Archbishop Porter Girls' SHS NSMQ contestants"
                width={640}
                height={480}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Why train here?</h2>
            <p className="mt-4 text-ink-soft">
              Built specifically to prepare you for the real contest format — not just another generic quiz app.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-line bg-paper-raised p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-raised py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-10 rounded-3xl border border-line bg-navy-950 p-8 sm:p-12 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/images/contestants/team-2023.avif"
                alt="Archbishop Porter Girls' SHS NSMQ team"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
                Our track record
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white">
                Trained by the same coaches, the same rounds, the same pressure.
              </h2>
              <p className="mt-4 text-white/75">
                Every practice session here mirrors the real contest pacing — timed rounds, cumulative scoring, and
                the exact question formats our NSMQ contestants faced on stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to begin your NSMQ journey?
          </h2>
          <p className="mt-4 text-white/75">
            Registration is open. Create an account and start your first practice round today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
            >
              Register now
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold-400 hover:text-gold-400"
            >
              See the leaderboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
