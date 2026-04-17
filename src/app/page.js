import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSearch from "@/components/HeroSearch";
import SettingsPanel from "@/components/SettingsPanel";
import SurahGrid from "@/components/SurahGrid";
import { getSurahs } from "@/lib/quran";
import { Suspense } from "react";

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSearch />
        <Suspense
          fallback={
            <div className="mx-auto mt-16 max-w-6xl px-4 text-sm text-muted sm:px-6">
              Loading surahs...
            </div>
          }
        >
          <SurahGrid surahs={surahs} title="All 114 Surahs" />
        </Suspense>
      </main>
      <Footer />
      <SettingsPanel />
    </div>
  );
}
