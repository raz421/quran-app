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
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-surface-border bg-surface p-4 backdrop-blur-2xl transition-transform duration-300 sm:p-6 ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Reading Settings
          </h2>
          <button
            onClick={closeSettings}
            type="button"
            className="rounded-full border border-surface-border px-3 py-1 text-sm text-muted transition hover:border-primary hover:text-primary"
          >
            Close
          </button>
        </div>

        <div className="space-y-6">
          <section className="space-y-2">
            <p className="text-sm font-medium text-muted">Theme</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ].map((themeOption) => {
                const active = settings.theme === themeOption.value;
                return (
                  <button
                    key={themeOption.value}
                    type="button"
                    onClick={() => setTheme(themeOption.value)}
                    className={`rounded-xl px-4 py-2 text-sm transition duration-300 ${
                      active
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                        : "border border-surface-border text-muted hover:border-primary hover:text-primary"
                    }`}
                  >
                    {themeOption.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-2">
            <p className="text-sm font-medium text-muted">Arabic Font</p>
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
                    className={`rounded-xl px-4 py-2 text-sm transition duration-300 ${
                      active
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                        : "border border-surface-border text-muted hover:border-primary hover:text-primary"
                    }`}
                  >
                    {fontOption.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-sm font-medium text-muted">
              Arabic Font Size ({settings.arabicSize}px)
            </p>
            <input
              type="range"
              min="28"
              max="56"
              value={settings.arabicSize}
              onChange={(event) => setArabicSize(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </section>

          <section className="space-y-3">
            <p className="text-sm font-medium text-muted">
              Translation Font Size ({settings.translationSize}px)
            </p>
            <input
              type="range"
              min="14"
              max="24"
              value={settings.translationSize}
              onChange={(event) =>
                setTranslationSize(Number(event.target.value))
              }
              className="w-full accent-primary"
            />
          </section>
        </div>
      </aside>
    </>
  );
}
