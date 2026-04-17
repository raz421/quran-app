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
      <main className="pt-6">
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            {surah.revelationType}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-primary sm:text-3xl">
            {surah.nameEnglish}{" "}
            <span className="text-muted">({surah.nameTranslation})</span>
          </h1>
          <p className="arabic-amiri mt-2 text-right text-3xl text-primary sm:text-4xl">
            {surah.nameArabic}
          </p>
        </section>

        <ReadingExperience surah={surah} />
      </main>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
