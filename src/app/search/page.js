import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchResultsClient from "@/components/SearchResultsClient";
import SettingsPanel from "@/components/SettingsPanel";
import { Suspense } from "react";

export const metadata = {
  title: "Search | Quran",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Suspense
        fallback={
          <section className="mx-auto w-full max-w-4xl px-6 py-12">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="glass animate-pulse rounded-2xl p-5">
                  <div className="mb-2 h-4 w-40 rounded bg-slate-300/40 dark:bg-slate-700/40" />
                  <div className="h-4 w-full rounded bg-slate-300/40 dark:bg-slate-700/40" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-slate-300/40 dark:bg-slate-700/40" />
                </div>
              ))}
            </div>
          </section>
        }
      >
        <SearchResultsClient />
      </Suspense>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
