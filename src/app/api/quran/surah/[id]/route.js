import { quranApiClient } from "@/lib/quranApiClient";
import { NextResponse } from "next/server";

export async function GET(_request, context) {
  const { id } = await context.params;

  try {
    const [arabicResponse, translationResponse, audioResponse] =
      await Promise.all([
        quranApiClient.get(`/surah/${id}/quran-uthmani`),
        quranApiClient.get(`/surah/${id}/en.asad`),
        quranApiClient.get(`/surah/${id}/ar.alafasy`),
      ]);

    const arabic = arabicResponse.data?.data;
    const translation = translationResponse.data?.data;
    const audio = audioResponse.data?.data;

    const translationByAyah = Object.fromEntries(
      (translation?.ayahs ?? []).map((ayah) => [ayah.numberInSurah, ayah.text]),
    );
    const audioByAyah = Object.fromEntries(
      (audio?.ayahs ?? []).map((ayah) => [ayah.numberInSurah, ayah.audio]),
    );

    const normalized = {
      id: arabic?.number,
      nameArabic: arabic?.name,
      nameEnglish: arabic?.englishName,
      nameTranslation: arabic?.englishNameTranslation,
      revelationType: arabic?.revelationType,
      ayahs: (arabic?.ayahs ?? []).map((ayah) => ({
        numberInSurah: ayah.numberInSurah,
        arabicText: ayah.text,
        translationText: translationByAyah[ayah.numberInSurah] ?? "",
        audioUrl: audioByAyah[ayah.numberInSurah] ?? null,
      })),
    };

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch surah details." },
      { status: 500 },
    );
  }
}
