const DEFAULT_QURAN_API_BASE_URL = "https://api.alquran.cloud/v1";
const DEFAULT_QURAN_API_TIMEOUT_MS = 10000;

function toPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const serverEnv = {
  quranApiBaseUrl:
    process.env.QURAN_API_BASE_URL?.trim() || DEFAULT_QURAN_API_BASE_URL,
  quranApiTimeoutMs: toPositiveNumber(
    process.env.QURAN_API_TIMEOUT_MS,
    DEFAULT_QURAN_API_TIMEOUT_MS,
  ),
  quranApiKey: process.env.QURAN_API_KEY?.trim() || "",
};
