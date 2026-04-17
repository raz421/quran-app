"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
          {results.map((item) => (
            <article
              key={`${item.surahNumber}-${item.ayahNumber}-${item.text.slice(0, 20)}`}
              className="glass rounded-2xl p-5"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">
                {item.surahName} • Ayah {item.ayahNumber}
              </p>
              <p className="text-sm leading-7 text-foreground sm:text-base sm:leading-8">
                <HighlightedText text={item.text} query={query} />
              </p>
              <Link
                href={`/surah/${item.surahNumber}#ayah-${item.ayahNumber}`}
                className="mt-4 inline-flex rounded-full border border-surface-border px-3 py-1 text-xs text-primary transition hover:border-primary"
              >
                Open in Surah
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
