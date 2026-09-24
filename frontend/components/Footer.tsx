export default function Footer() {
  return (
    <footer className="border-t border-line bg-navy-950 py-10 text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold text-white">NSMQ MasterQuiz</p>
          <p className="mt-1 text-xs">
            Built for Archbishop Porter Girls&apos; Senior High School. Not affiliated with NSMQ, Primetime Limited, or GES.
          </p>
        </div>
        <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} NSMQ MasterQuiz</p>
      </div>
    </footer>
  );
}
