const API_BASE = "https://api.alquran.cloud/v1";

async function fetchApi(url) {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed Quran API request: ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.data) {
    throw new Error("Unexpected Quran API payload.");
  }

  return payload.data;
}

export async function getSurahs() {
  return fetchApi(`${API_BASE}/surah`);
}

export async function getSurahReadingData(id) {
  const [arabic, translation, audio] = await Promise.all([
    fetchApi(`${API_BASE}/surah/${id}/quran-uthmani`),
    fetchApi(`${API_BASE}/surah/${id}/en.asad`),
    fetchApi(`${API_BASE}/surah/${id}/ar.alafasy`),
  ]);

  const translationByAyah = Object.fromEntries(
    translation.ayahs.map((ayah) => [ayah.numberInSurah, ayah.text]),
  );
  const audioByAyah = Object.fromEntries(audio.ayahs.map((ayah) => [ayah.numberInSurah, ayah.audio]));

  return {
    id: arabic.number,
    nameArabic: arabic.name,
    nameEnglish: arabic.englishName,
    nameTranslation: arabic.englishNameTranslation,
    revelationType: arabic.revelationType,
    ayahs: arabic.ayahs.map((ayah) => ({
      numberInSurah: ayah.numberInSurah,
      arabicText: ayah.text,
      translationText: translationByAyah[ayah.numberInSurah] ?? "",
      audioUrl: audioByAyah[ayah.numberInSurah] ?? null,
      juz: ayah.juz,
    })),
  };
}
