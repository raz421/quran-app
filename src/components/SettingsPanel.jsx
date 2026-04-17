"use client";

import { useAppSettings } from "@/context/AppSettingsContext";

export default function SettingsPanel() {
  const {
    settings,
    setTheme,
    setArabicFont,
    setArabicSize,
    setTranslationSize,
    isSettingsOpen,
    closeSettings,
  } = useAppSettings();

  const previewArabicClass =
    settings.arabicFont === "scheherazade"
      ? "arabic-scheherazade"
      : "arabic-amiri";

  return (
    <>
      <div
        onClick={closeSettings}
        className={`fixed inset-0 z-40 bg-slate-950/40 transition duration-300 ${
          isSettingsOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-white/10 bg-surface/95 p-4 backdrop-blur-2xl transition-transform duration-300 sm:p-6 ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">
                Reader Preferences
              </p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                Reading Settings
              </h2>
            </div>
            <button
              onClick={closeSettings}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-elevated/70 text-muted transition hover:border-primary/55 hover:text-primary"
              aria-label="Close settings"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6 18 18M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-elevated/55 p-4 shadow-[0_16px_28px_-24px_rgba(2,6,23,1)]">
            <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">
              Theme Mode
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-background/25 p-1.5">
              {[
                { label: "Light", value: "light", icon: "\u2600" },
                { label: "Dark", value: "dark", icon: "\u263D" },
              ].map((themeOption) => {
                const active = settings.theme === themeOption.value;
                return (
                  <button
                    key={themeOption.value}
                    type="button"
                    onClick={() => setTheme(themeOption.value)}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition duration-300 ${
                      active
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.16)]"
                        : "text-muted hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span aria-hidden>{themeOption.icon}</span>
                    {themeOption.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-elevated/55 p-4 shadow-[0_16px_28px_-24px_rgba(2,6,23,1)]">
            <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">
              Arabic Typeface
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Amiri", value: "amiri" },
                { label: "Scheherazade", value: "scheherazade" },
              ].map((fontOption) => {
                const active = settings.arabicFont === fontOption.value;
                return (
                  <button
                    key={fontOption.value}
                    type="button"
                    onClick={() => setArabicFont(fontOption.value)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition duration-300 ${
                      active
                        ? "border-primary/35 bg-primary/14 text-primary"
                        : "border-white/10 text-muted hover:border-primary/45 hover:text-foreground"
                    }`}
                  >
                    {fontOption.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-xl border border-white/10 bg-background/30 p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.12em] text-muted">
                Live Preview
              </p>
              <p
                dir="rtl"
                className={`${previewArabicClass} text-right text-primary`}
                style={{
                  fontSize: `${Math.min(settings.arabicSize, 40)}px`,
                  lineHeight: 1.65,
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-elevated/55 p-4 shadow-[0_16px_28px_-24px_rgba(2,6,23,1)]">
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Arabic Size
              </p>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {settings.arabicSize}px
              </span>
            </div>
            <input
              type="range"
              min="28"
              max="56"
              value={settings.arabicSize}
              onChange={(event) => setArabicSize(Number(event.target.value))}
              className="mt-3 w-full accent-primary"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-elevated/55 p-4 shadow-[0_16px_28px_-24px_rgba(2,6,23,1)]">
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Translation Size
              </p>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {settings.translationSize}px
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              value={settings.translationSize}
              onChange={(event) =>
                setTranslationSize(Number(event.target.value))
              }
              className="mt-3 w-full accent-primary"
            />
          </section>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-xs text-muted">
            Preferences are saved automatically to your local device.
          </p>
        </div>
      </aside>
    </>
  );
}
