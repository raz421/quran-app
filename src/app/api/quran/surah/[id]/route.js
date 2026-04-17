import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.alquran.cloud/v1";

export async function GET(_request, context) {
  const { id } = await context.params;

  try {
    const [arabicResponse, translationResponse, audioResponse] = await Promise.all([
      axios.get(`${API_BASE}/surah/${id}/quran-uthmani`, { timeout: 10000 }),
      axios.get(`${API_BASE}/surah/${id}/en.asad`, { timeout: 10000 }),
      axios.get(`${API_BASE}/surah/${id}/ar.alafasy`, { timeout: 10000 }),
    ]);

    const arabic = arabicResponse.data?.data;
    const translation = translationResponse.data?.data;
    const audio = audioResponse.data?.data;

    const translationByAyah = Object.fromEntries(
      (translation?.ayahs ?? []).map((ayah) => [ayah.numberInSurah, ayah.text]),
    );
    const audioByAyah = Object.fromEntries((audio?.ayahs ?? []).map((ayah) => [ayah.numberInSurah, ayah.audio]));

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
    return NextResponse.json({ message: "Unable to fetch surah details." }, { status: 500 });
  }
}
