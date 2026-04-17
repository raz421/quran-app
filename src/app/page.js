import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import SettingsPanel from "@/components/SettingsPanel";
import SurahGrid from "@/components/SurahGrid";
import { getSurahs } from "@/lib/quran";

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSearch />
        <SurahGrid surahs={surahs} title="All 114 Surahs" />
      </main>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
