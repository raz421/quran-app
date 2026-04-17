import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ReadingExperience from "@/components/ReadingExperience";
import SettingsPanel from "@/components/SettingsPanel";
import { getSurahReadingData } from "@/lib/quran";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Surah ${id} | Quran`,
  };
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = await getSurahReadingData(id);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6 sm:pt-8">
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-elevated via-surface to-surface p-5 shadow-[0_26px_50px_-34px_rgba(2,6,23,1)] sm:p-7">
            <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-accent/12 blur-2xl" />

            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {surah.revelationType}
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="text-2xl font-semibold text-primary sm:text-3xl">
                {surah.nameEnglish}{" "}
                <span className="text-muted">({surah.nameTranslation})</span>
              </h1>
              <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-background/35 px-3 py-1 text-xs text-muted">
                Surah {surah.id}
              </span>
            </div>

            <p className="arabic-amiri mt-3 text-right text-3xl text-primary sm:text-4xl">
              {surah.nameArabic}
            </p>
          </div>
        </section>

        <ReadingExperience surah={surah} />
      </main>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
