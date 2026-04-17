export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10 bg-[#0b0f14] text-slate-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute -left-24 top-8 h-52 w-52 rounded-full bg-primary/12 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Quran Calm Reader
            </p>
            <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
              A premium reading environment for recitation, search, and
              reflection.
            </h3>
          </div>

          <div className="md:justify-self-end md:text-right">
            <p className="text-sm text-slate-400">
              Built with clarity, rhythm, and focus.
            </p>
            <p className="mt-2 text-sm text-slate-100">
              Read with intention every day.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>{year} Quran Calm Reader</p>
          <p>Crafted for thoughtful digital spirituality</p>
        </div>
      </div>
    </footer>
  );
}
