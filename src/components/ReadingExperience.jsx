"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { useEffect, useMemo, useRef, useState } from "react";

const LAST_READ_KEY = "quran:lastRead";

export default function ReadingExperience({ surah }) {
  const { settings, setArabicSize, setTranslationSize } = useAppSettings();
  const [visibleAyahs, setVisibleAyahs] = useState(() => new Set());
  const [activeAyah, setActiveAyah] = useState(1);
  const activeAudioRef = useRef(null);

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

    const previousAudio = activeAudioRef.current;
    const previousTime = previousAudio?.currentTime ?? 0;
    const previousWasPlaying = Boolean(previousAudio && !previousAudio.paused);

    if (previousAudio) {
      previousAudio.pause();
    }

    const nextAudio = new Audio(url);
    activeAudioRef.current = nextAudio;

    nextAudio.addEventListener("ended", () => {
      if (activeAudioRef.current === nextAudio) {
        activeAudioRef.current = null;
      }
    });

    nextAudio
      .play()
      .then(() => {
        if (previousAudio) {
          previousAudio.currentTime = 0;
        }
      })
      .catch(() => {
        if (activeAudioRef.current === nextAudio) {
          activeAudioRef.current = previousAudio ?? null;
        }
        if (previousAudio && previousWasPlaying) {
          previousAudio.currentTime = previousTime;
          previousAudio.play().catch(() => null);
        }
      });
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

  const decreaseArabic = () =>
    setArabicSize(Math.max(28, settings.arabicSize - 2));
  const increaseArabic = () =>
    setArabicSize(Math.min(56, settings.arabicSize + 2));
  const decreaseTranslation = () =>
    setTranslationSize(Math.max(14, settings.translationSize - 1));
  const increaseTranslation = () =>
    setTranslationSize(Math.min(24, settings.translationSize + 1));

  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
        activeAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll("[data-ayah-card]");
    if (!cards.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleAyahs((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const ayah = Number(entry.target.getAttribute("data-ayah"));
            if (!Number.isNaN(ayah) && entry.isIntersecting) {
              next.add(ayah);
            }
          });
          return next;
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [surah.ayahs]);

  useEffect(() => {
    let frame = 0;

    const updateActiveAyah = () => {
      frame = 0;
      const cards = document.querySelectorAll("[data-ayah-card]");
      if (!cards.length) {
        return;
      }

      const marker = window.innerHeight * 0.35;
      let nextActive = activeAyah;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom >= marker) {
          const ayah = Number(card.getAttribute("data-ayah"));
          if (!Number.isNaN(ayah)) {
            nextActive = ayah;
          }
        }
      });

      if (nextActive === activeAyah) {
        for (let index = cards.length - 1; index >= 0; index -= 1) {
          const rect = cards[index].getBoundingClientRect();
          if (rect.top <= marker) {
            const ayah = Number(cards[index].getAttribute("data-ayah"));
            if (!Number.isNaN(ayah)) {
              nextActive = ayah;
            }
            break;
          }
        }
      }

      if (nextActive !== activeAyah) {
        setActiveAyah(nextActive);
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateActiveAyah);
      }
    };

    updateActiveAyah();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [activeAyah, surah.ayahs]);

  const readingProgress = Math.min(
    100,
    Math.max(0, (activeAyah / surah.ayahs.length) * 100),
  );

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="glass mb-8 rounded-3xl border border-white/10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-muted">Font Controls</p>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Arabic {settings.arabicSize}px
            </span>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Translation {settings.translationSize}px
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={decreaseArabic}
            className="rounded-xl border border-surface-border bg-background/30 px-3 py-2 text-sm text-muted transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Arabic -
          </button>
          <button
            type="button"
            onClick={increaseArabic}
            className="rounded-xl border border-surface-border bg-background/30 px-3 py-2 text-sm text-muted transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Arabic +
          </button>
          <button
            type="button"
            onClick={decreaseTranslation}
            className="rounded-xl border border-surface-border bg-background/30 px-3 py-2 text-sm text-muted transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Translation -
          </button>
          <button
            type="button"
            onClick={increaseTranslation}
            className="rounded-xl border border-surface-border bg-background/30 px-3 py-2 text-sm text-muted transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            Translation +
          </button>
        </div>
      </div>

      <div className="sticky top-[88px] z-20 mb-6 rounded-2xl border border-white/10 bg-elevated/80 px-4 py-2.5 backdrop-blur-xl">
        <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-muted">
          <span>Reading Progress</span>
          <span>
            Ayah {activeAyah} / {surah.ayahs.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-background/70">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-300 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah, index) => (
          <article
            key={ayah.numberInSurah}
            id={`ayah-${ayah.numberInSurah}`}
            data-ayah-card
            data-ayah={ayah.numberInSurah}
            style={{ animationDelay: `${index * 40}ms` }}
            className={`glass group relative overflow-hidden rounded-3xl border border-white/10 p-5 transition duration-350 sm:p-6 ${
              visibleAyahs.has(ayah.numberInSurah)
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            } hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_24px_rgba(99,102,241,0.16)]`}
            onMouseEnter={() => saveLastRead(ayah.numberInSurah)}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.16),transparent_42%)] opacity-75" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-36 w-36 rounded-full border border-white/10 opacity-30" />

            <div className="relative z-10 mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                Ayah {ayah.numberInSurah}
              </span>
              <button
                type="button"
                onClick={() => playAudio(ayah.audioUrl)}
                className="w-full rounded-full border border-surface-border bg-background/25 px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent sm:w-auto"
              >
                Play Audio
              </button>
            </div>

            <p
              className={`${arabicClass} relative z-10 mb-5 text-right leading-loose tracking-wide text-primary`}
              style={{ fontSize: `${settings.arabicSize}px` }}
            >
              {ayah.arabicText}
            </p>

            <p
              className="relative z-10 border-t border-white/10 pt-4 text-muted"
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
