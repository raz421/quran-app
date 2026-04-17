"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { useMemo } from "react";

const LAST_READ_KEY = "quran:lastRead";

export default function ReadingExperience({ surah }) {
  const { settings, setArabicSize, setTranslationSize } = useAppSettings();

  const arabicClass = useMemo(
    () =>
      settings.arabicFont === "scheherazade"
        ? "arabic-scheherazade"
        : "arabic-amiri",
    [settings.arabicFont],
  );

  const playAudio = (url) => {
    if (!url) {
      return;
    }
    const audio = new Audio(url);
    audio.play().catch(() => null);
  };

  const saveLastRead = (ayahNumber) => {
    window.localStorage.setItem(
      LAST_READ_KEY,
      JSON.stringify({
        surah: surah.id,
        ayah: ayahNumber,
      }),
    );
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="glass mb-8 flex flex-wrap items-center gap-4 rounded-2xl p-4">
        <p className="text-sm font-medium text-muted">Font Controls</p>
        <button
          type="button"
          onClick={() => setArabicSize(Math.max(28, settings.arabicSize - 2))}
          className="rounded-xl border border-surface-border px-3 py-2 text-sm text-muted transition hover:border-primary hover:text-primary"
        >
          Arabic -
        </button>
        <button
          type="button"
          onClick={() => setArabicSize(Math.min(56, settings.arabicSize + 2))}
          className="rounded-xl border border-surface-border px-3 py-2 text-sm text-muted transition hover:border-primary hover:text-primary"
        >
          Arabic +
        </button>
        <button
          type="button"
          onClick={() =>
            setTranslationSize(Math.max(14, settings.translationSize - 1))
          }
          className="rounded-xl border border-surface-border px-3 py-2 text-sm text-muted transition hover:border-primary hover:text-primary"
        >
          Translation -
        </button>
        <button
          type="button"
          onClick={() =>
            setTranslationSize(Math.min(24, settings.translationSize + 1))
          }
          className="rounded-xl border border-surface-border px-3 py-2 text-sm text-muted transition hover:border-primary hover:text-primary"
        >
          Translation +
        </button>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah) => (
          <article
            key={ayah.numberInSurah}
            id={`ayah-${ayah.numberInSurah}`}
            className="glass group rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            onMouseEnter={() => saveLastRead(ayah.numberInSurah)}
          >
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Ayah {ayah.numberInSurah}
              </span>
              <button
                type="button"
                onClick={() => playAudio(ayah.audioUrl)}
                className="w-full rounded-full border border-surface-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent sm:w-auto"
              >
                Play Audio
              </button>
            </div>

            <p
              className={`${arabicClass} mb-4 text-right leading-loose tracking-wide text-primary`}
              style={{ fontSize: `${settings.arabicSize}px` }}
            >
              {ayah.arabicText}
            </p>

            <p
              className="text-muted"
              style={{
                fontSize: `${settings.translationSize}px`,
                lineHeight: 1.9,
              }}
            >
              {ayah.translationText}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
