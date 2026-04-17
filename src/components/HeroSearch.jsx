"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const LAST_READ_KEY = "quran:lastRead";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [previewCount, setPreviewCount] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const fetchPreview = async () => {
      try {
        const response = await fetch(
          `/api/quran/search?q=${encodeURIComponent(debouncedQuery)}&size=5`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          setPreviewCount(null);
          return;
        }
        const payload = await response.json();
        setPreviewCount(payload.total ?? null);
      } catch {
        setPreviewCount(null);
      }
    };

    fetchPreview();
    return () => controller.abort();
  }, [debouncedQuery]);

  const searchDisabled = useMemo(() => query.trim().length < 2, [query]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (searchDisabled) {
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const goToLastRead = () => {
    const raw = window.localStorage.getItem(LAST_READ_KEY);
    if (!raw) {
      router.push("/surah/1");
      return;
    }

    try {
      const value = JSON.parse(raw);
      const hash = value?.ayah ? `#ayah-${value.ayah}` : "";
      router.push(`/surah/${value?.surah ?? 1}${hash}`);
    } catch {
      router.push("/surah/1");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/25 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -left-16 top-20 h-52 w-52 rounded-full bg-primary/20 blur-[90px]" />
      <div className="pointer-events-none absolute -right-14 top-36 h-56 w-56 rounded-full bg-accent/10 blur-[100px]" />
      <div className="pattern-overlay pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[74vh] sm:px-6">
        <div className="stagger w-full">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-elevated/70 px-4 py-2 text-xs font-medium tracking-[0.12em] text-muted uppercase shadow-[0_16px_28px_-20px_rgba(2,6,23,1)]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Quran Search Experience
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Read with Clarity.
            <span className="block bg-gradient-to-r from-primary via-indigo-300 to-primary bg-clip-text text-transparent">
              Search with Intention.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base md:text-lg">
            A calm, distraction-free space designed for deep reading, precise
            discovery, and daily reflection.
          </p>

          <div className="glass surface-layer mx-auto mt-8 w-full max-w-3xl rounded-[28px] border border-white/10 p-3 shadow-[0_26px_52px_-34px_rgba(2,6,23,1),0_0_22px_rgba(99,102,241,0.14)] sm:mt-10 sm:p-4">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-background/40 px-3 sm:h-14 sm:px-4">
                <span className="text-muted">
                  <SearchIcon />
                </span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search ayah, surah, or keyword..."
                  className="h-full w-full bg-transparent text-base outline-none placeholder:text-slate-400 sm:text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={searchDisabled}
                className="h-12 w-full rounded-2xl bg-primary px-7 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(99,102,241,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-auto"
              >
                Search Quran
              </button>
            </form>

            <p className="mt-3 min-h-6 text-left text-xs text-muted sm:text-sm">
              {previewCount !== null && debouncedQuery.length > 1
                ? `${previewCount.toLocaleString()} matches found.`
                : "Type at least two characters to begin searching."}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push("/surah/1")}
              className="rounded-full border border-white/10 bg-elevated/80 px-3.5 py-2 text-xs font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary sm:px-4 sm:text-sm"
            >
              Al-Fatiha
            </button>
            <button
              type="button"
              onClick={() => router.push("/search?q=kursi")}
              className="rounded-full border border-white/10 bg-elevated/80 px-3.5 py-2 text-xs font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary sm:px-4 sm:text-sm"
            >
              Ayat al-Kursi
            </button>
            <button
              type="button"
              onClick={goToLastRead}
              className="rounded-full border border-white/10 bg-elevated/80 px-3.5 py-2 text-xs font-medium text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary sm:px-4 sm:text-sm"
            >
              Last Read
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
