"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const NAV_TARGET_KEY = "quran:navigationTarget";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ text, query }) {
  if (!query) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, "ig");
  const parts = text.split(regex);

  return (
    <span className="ayah-highlight">
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark key={`${part}-${index}`}>{part}</mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </span>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="glass animate-pulse rounded-2xl p-5">
          <div className="mb-2 h-4 w-40 rounded bg-slate-300/40 dark:bg-slate-700/40" />
          <div className="h-4 w-full rounded bg-slate-300/40 dark:bg-slate-700/40" />
          <div className="mt-2 h-4 w-4/5 rounded bg-slate-300/40 dark:bg-slate-700/40" />
        </div>
      ))}
    </div>
  );
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    const controller = new AbortController();
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/quran/search?q=${encodeURIComponent(query)}&size=25`,
          {
            signal: controller.signal,
          },
        );
        const payload = await response.json();
        setResults(payload.matches ?? []);
        setTotal(payload.total ?? 0);
      } catch {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [query]);

  const hasQuery = useMemo(() => query.length >= 2, [query]);

  const persistNavigationTarget = (surahNumber, ayahNumber) => {
    try {
      window.sessionStorage.setItem(
        NAV_TARGET_KEY,
        JSON.stringify({
          surah: surahNumber,
          ayah: ayahNumber,
        }),
      );
    } catch {
      // Ignore storage errors and keep normal hash navigation.
    }
  };

  const clearNavigationTarget = () => {
    try {
      window.sessionStorage.removeItem(NAV_TARGET_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
          Search Results
        </h1>
        <p className="mt-2 text-sm text-muted">
          {hasQuery
            ? `${total.toLocaleString()} matches for "${query}"`
            : "Enter a keyword from home."}
        </p>
      </div>

      {!hasQuery && (
        <div className="glass rounded-2xl p-8 text-center text-muted">
          Search with at least two characters from the hero section.
        </div>
      )}

      {loading && <SearchSkeleton />}

      {!loading && hasQuery && results.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center text-muted">
          No matching ayahs were found. Try another keyword.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((item, index) => (
            <article
              key={`${item.surahNumber}-${item.ayahNumber ?? "surah"}-${item.text.slice(0, 20)}`}
              style={{ animationDelay: `${index * 45}ms` }}
              className="glass rise-in group relative overflow-hidden rounded-3xl border border-white/10 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:shadow-[0_20px_42px_-30px_rgba(2,6,23,1),0_0_26px_rgba(99,102,241,0.2)] sm:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.16),transparent_44%)] opacity-80" />
              <div className="pointer-events-none absolute -bottom-16 -left-14 h-32 w-32 rounded-full border border-white/10 opacity-30" />
              <div className="pointer-events-none absolute -top-10 right-6 arabic-amiri select-none text-[88px] leading-none text-white/[0.04] transition duration-300 group-hover:text-white/[0.07]">
                ۞
              </div>

              <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                    {item.surahName}
                  </span>
                  {item.matchType !== "surah-name" && item.ayahNumber ? (
                    <span className="rounded-full border border-white/10 bg-background/35 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                      Ayah {item.ayahNumber}
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-background/35 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                      Surah Match
                    </span>
                  )}
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-muted">
                  Match
                </span>
              </div>

              <p className="relative z-10 text-sm leading-7 text-foreground sm:text-base sm:leading-8">
                <HighlightedText text={item.text} query={query} />
              </p>

              <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted">
                    Continue Reading
                  </p>
                  <Link
                    href={
                      item.matchType === "surah-name"
                        ? `/surah/${item.surahNumber}`
                        : `/surah/${item.surahNumber}#ayah-${item.ayahNumber}`
                    }
                    scroll={false}
                    onClick={() => {
                      if (item.matchType === "surah-name") {
                        clearNavigationTarget();
                        return;
                      }
                      persistNavigationTarget(
                        item.surahNumber,
                        item.ayahNumber,
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/12 px-3.5 py-1.5 text-xs font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/18"
                  >
                    Open in Surah
                    <span aria-hidden="true">{"->"}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
