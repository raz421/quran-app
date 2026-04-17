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

  const revelationTone = (type) =>
    type === "Meccan"
      ? "border-primary/30 bg-primary/10 text-primary"
      : "border-accent/35 bg-accent/10 text-accent";

  const supportsFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const handleCardMove = (event) => {
    if (!supportsFinePointer) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty("--lift", "-6px");
  };

  const handleCardLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
    card.style.setProperty("--lift", "0px");
  };

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
          {paginatedSurahs.map((surah, index) => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
              style={{
                animationDelay: `${index * 50}ms`,
                "--tilt-x": "0deg",
                "--tilt-y": "0deg",
                "--lift": "0px",
                "--glow-x": "50%",
                "--glow-y": "50%",
                transform:
                  "perspective(1200px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translateY(var(--lift))",
              }}
              className="group rise-in relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-elevated via-surface to-surface p-5 shadow-[0_20px_42px_-30px_rgba(2,6,23,1)] transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/55 hover:shadow-[0_0_26px_rgba(99,102,241,0.18)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_0%_100%,rgba(99,102,241,0.12),transparent_45%)] opacity-80" />
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(99,102,241,0.2), transparent 46%)",
                }}
              />
              <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-primary/20 blur-2xl transition duration-300 group-hover:bg-primary/30" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-accent/10 blur-2xl opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/55 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute -bottom-8 -right-1 arabic-amiri select-none text-[128px] leading-none text-white/[0.045] transition duration-300 group-hover:text-white/[0.07]">
                ۞
              </div>

              <div className="relative z-10 mb-4 flex items-start justify-between">
                <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/12 px-2 text-xs font-semibold text-primary shadow-[0_0_18px_rgba(99,102,241,0.14)]">
                  {String(surah.number).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-white/10 bg-background/35 px-2.5 py-1 text-[11px] font-medium text-muted">
                  {surah.numberOfAyahs} ayahs
                </span>
              </div>

              <h3 className="arabic-amiri relative z-10 mb-3 text-right text-3xl leading-tight text-primary transition duration-300 group-hover:text-indigo-300">
                {surah.name}
              </h3>

              <p className="relative z-10 text-lg font-semibold text-foreground">
                {surah.englishName}
              </p>
              <p className="relative z-10 mt-1 text-sm text-muted">
                {surah.englishNameTranslation}
              </p>

              <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] ${revelationTone(
                      surah.revelationType,
                    )}`}
                  >
                    {surah.revelationType}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.08em] text-muted transition duration-300 group-hover:text-primary">
                    Read Now
                    <span className="text-sm transition duration-300 group-hover:translate-x-0.5">
                      {"->"}
                    </span>
                  </span>
                </div>
              </div>
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

            <div className="glass flex w-full max-w-xl flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-elevated/70 px-3 py-2 shadow-[0_18px_32px_-24px_rgba(2,6,23,1)]">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-xs text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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
                        ? "bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.22)]"
                        : "border border-white/10 bg-background/25 text-foreground hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
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
                className="rounded-xl border border-white/10 bg-background/30 px-3 py-2 text-xs text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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
