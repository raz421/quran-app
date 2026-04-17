import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SettingsPanel from "@/components/SettingsPanel";
import SurahGrid from "@/components/SurahGrid";
import { getSurahs } from "@/lib/quran";

export const metadata = {
  title: "Surahs | Quran",
};

export default async function SurahsPage() {
  const surahs = await getSurahs();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-8">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-semibold text-primary">All Surahs</h1>
          <p className="mt-2 text-muted">Browse all chapters with a clean, focused reading flow.</p>
        </div>
        <SurahGrid surahs={surahs} title="Quran Chapters" />
      </main>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
