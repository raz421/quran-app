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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/18 via-transparent to-transparent" />
      <div className="pattern-overlay pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-[64vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:min-h-[70vh] sm:px-6">
        <div className="stagger w-full">
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Read, Search and Reflect on the Quran
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted sm:text-base md:text-lg">
            A focused reading space crafted for daily recitation and meaningful
            reflection.
          </p>

          <form
            onSubmit={onSubmit}
            className="glass surface-layer mt-8 flex w-full flex-col gap-2 rounded-3xl p-2 sm:mt-10 sm:h-14 sm:flex-row sm:items-center sm:gap-3 sm:rounded-full sm:px-3 sm:py-0"
          >
            <span className="hidden pl-3 text-muted sm:inline">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ayah, surah, or keyword..."
              className="h-12 w-full rounded-2xl bg-transparent px-3 text-base outline-none placeholder:text-slate-400 sm:h-full sm:px-0 sm:text-lg"
            />
            <button
              type="submit"
              disabled={searchDisabled}
              className="h-10 w-full rounded-full bg-primary px-6 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.15)] transition duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Search
            </button>
          </form>

          <p className="mt-3 min-h-6 text-sm text-muted">
            {previewCount !== null && debouncedQuery.length > 1
              ? `${previewCount.toLocaleString()} matches found.`
              : "Type at least two characters to begin searching."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => router.push("/surah/1")}
              className="rounded-full border border-white/10 bg-elevated px-3 py-2 text-xs text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary sm:px-4 sm:text-sm"
            >
              Al-Fatiha
            </button>
            <button
              type="button"
              onClick={() => router.push("/search?q=kursi")}
              className="rounded-full border border-white/10 bg-elevated px-3 py-2 text-xs text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary sm:px-4 sm:text-sm"
            >
              Ayat al-Kursi
            </button>
            <button
              type="button"
              onClick={goToLastRead}
              className="rounded-full border border-white/10 bg-elevated px-3 py-2 text-xs text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary sm:px-4 sm:text-sm"
            >
              Last Read
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
