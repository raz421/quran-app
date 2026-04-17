export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-[#0b0f14]/90 text-slate-200">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(99,102,241,0.15)]" />
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="text-base font-medium text-foreground">Quran Calm Reader</p>
        <p className="mt-2 text-sm text-muted">
          Read with focus, reflect with clarity. {year}
        </p>
      </div>
    </footer>
  );
}
