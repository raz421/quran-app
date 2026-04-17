import axios from "axios";

const API_BASE = "https://api.alquran.cloud/v1";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchApi(
  url,
  { retries = 3, useNextCache = true, revalidate = 3600 } = {},
) {
  const fetchOptions = useNextCache
    ? { next: { revalidate } }
    : { cache: "no-store" };

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, fetchOptions);

    if (response.ok) {
      const payload = await response.json();
      if (!payload?.data) {
        throw new Error("Unexpected Quran API payload.");
      }

      return payload.data;
    }

    const canRetry = RETRYABLE_STATUS.has(response.status) && attempt < retries;
    if (!canRetry) {
      throw new Error(`Failed Quran API request: ${response.status}`);
    }

    await wait(250 * 2 ** attempt);
  }

  throw new Error("Failed Quran API request after retries.");
}

async function fetchLargeApi(url, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await axios.get(url, {
        timeout: 20000,
      });

      if (!response?.data?.data) {
        throw new Error("Unexpected Quran API payload.");
      }

      return response.data.data;
    } catch (error) {
      const status = error?.response?.status;
      const canRetry = RETRYABLE_STATUS.has(status) && attempt < retries;
      if (!canRetry) {
        if (status) {
          throw new Error(`Failed Quran API request: ${status}`);
        }
        throw error;
      }

      await wait(250 * 2 ** attempt);
    }
  }

  throw new Error("Failed Quran API request after retries.");
}

let quranEditionsPromise = null;

const toSurahMap = (edition) =>
  Object.fromEntries(
    (edition?.surahs ?? []).map((surah) => [surah.number, surah]),
  );

async function getQuranEditions() {
  if (!quranEditionsPromise) {
    quranEditionsPromise = Promise.all([
      fetchLargeApi(`${API_BASE}/quran/quran-uthmani`),
      fetchLargeApi(`${API_BASE}/quran/en.asad`),
      fetchLargeApi(`${API_BASE}/quran/ar.alafasy`),
    ])
      .then(([arabicQuran, translationQuran, audioQuran]) => ({
        arabicById: toSurahMap(arabicQuran),
        translationById: toSurahMap(translationQuran),
        audioById: toSurahMap(audioQuran),
      }))
      .catch((error) => {
        quranEditionsPromise = null;
        throw error;
      });
  }

  return quranEditionsPromise;
}

export async function getSurahs() {
  return fetchApi(`${API_BASE}/surah`);
}

export async function getSurahReadingData(id) {
  const { arabicById, translationById, audioById } = await getQuranEditions();

  const surahId = Number(id);
  const arabic = arabicById[surahId];
  const translation = translationById[surahId];
  const audio = audioById[surahId];

  if (!arabic || !translation || !audio) {
    throw new Error(`Unable to resolve surah data for id: ${id}`);
  }

  const translationByAyah = Object.fromEntries(
    translation.ayahs.map((ayah) => [ayah.numberInSurah, ayah.text]),
  );
  const audioByAyah = Object.fromEntries(
    audio.ayahs.map((ayah) => [ayah.numberInSurah, ayah.audio]),
  );

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
