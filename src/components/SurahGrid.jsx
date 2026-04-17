"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SurahGrid({ surahs, title = "Surahs" }) {
  const itemsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(surahs.length / itemsPerPage));
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsedPage = Number(searchParams.get("page") ?? "1");
  const initialPage = Number.isFinite(parsedPage) ? parsedPage : 1;
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Math.trunc(initialPage)),
  );

  const setPage = (page) => {
    const nextPage = Math.min(totalPages, Math.max(1, Math.trunc(page)));
    const nextParams = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(nextPage));
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const paginatedSurahs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return surahs.slice(start, start + itemsPerPage);
  }, [surahs, currentPage]);

  const pageButtons = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <section className="mt-16 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-primary sm:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-muted">{surahs.length} chapters total</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              className="glass surface-layer flex h-full flex-col rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-xl bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  {surah.number}
                </span>
                <span className="text-xs text-muted">
                  {surah.numberOfAyahs} ayahs
                </span>
              </div>

              <h3 className="arabic-amiri mb-3 text-right text-3xl leading-tight text-primary">
                {surah.name}
              </h3>
              <p className="text-lg font-semibold text-foreground">
                {surah.englishName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {surah.englishNameTranslation}
              </p>
              <p className="mt-auto pt-4 text-xs uppercase tracking-[0.16em] text-muted">
                {surah.revelationType}
              </p>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, surahs.length)} of{" "}
              {surahs.length}
            </p>

            <div className="glass flex w-full max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 px-3 py-2">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs text-foreground transition duration-300 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                Previous
              </button>

              {pageButtons.map((page) => {
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPage(page)}
                    className={`min-w-9 rounded-xl px-3 py-2 text-xs transition duration-300 sm:min-w-10 sm:text-sm ${
                      isActive
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                        : "border border-white/10 text-foreground hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-white/10 px-3 py-2 text-xs text-foreground transition duration-300 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                Next
              </button>
            </div>

            <p className="text-xs uppercase tracking-[0.12em] text-muted">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
