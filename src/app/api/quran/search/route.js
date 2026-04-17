import { quranApiClient } from "@/lib/quranApiClient";
import { NextResponse } from "next/server";

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalizeName(value) {
  return normalizeText(value)
    .replace(/^surah\s+/, "")
    .replace(/^al\s+/, "")
    .split(" ")
    .filter(Boolean)
    .map((token) =>
      token.length > 3 && token.endsWith("h") ? token.slice(0, -1) : token,
    )
    .join(" ");
}

function buildComparisonVariants(value) {
  const normalized = normalizeText(value);
  const noSurah = normalized.replace(/^surah\s+/, "");
  const noArticle = noSurah.replace(/^al\s+/, "");
  const canonical = canonicalizeName(normalized);

  return [
    ...new Set([
      normalized,
      noSurah,
      noArticle,
      canonical,
      canonical.replace(/\s+/g, ""),
      noArticle.replace(/\s+/g, ""),
    ]),
  ].filter((item) => item.length >= 2);
}

function buildQueryCandidates(query) {
  return [...new Set([query.trim(), ...buildComparisonVariants(query)])].filter(
    (value) => value.length >= 2,
  );
}

function mapMatches(matches, size) {
  return matches.slice(0, size).map((item) => ({
    text: item.text,
    surahName: item.surah?.englishName ?? "Unknown Surah",
    surahNumber: item.surah?.number ?? 1,
    ayahNumber: item.numberInSurah,
    matchType: "ayah-text",
  }));
}

async function searchAyahsByCandidate(candidate) {
  try {
    const response = await quranApiClient.get(
      `/search/${encodeURIComponent(candidate)}/all/en`,
    );
    return response.data?.data ?? null;
  } catch {
    return null;
  }
}

function scoreSurahMatch(surah, queryVariants) {
  const names = [surah.englishName, surah.englishNameTranslation, surah.name]
    .flatMap((value) => buildComparisonVariants(value ?? ""))
    .filter(Boolean);

  let score = 0;
  names.forEach((name) => {
    queryVariants.forEach((queryVariant) => {
      if (!name || !queryVariant) {
        return;
      }
      if (name === queryVariant) {
        score = Math.max(score, 5);
        return;
      }
      if (name.startsWith(queryVariant)) {
        score = Math.max(score, 4);
        return;
      }
      if (name.includes(queryVariant)) {
        score = Math.max(score, 3);
      }
    });
  });

  return score;
}

function buildSurahMatchResult(surah) {
  return {
    total: 1,
    matches: [
      {
        text:
          surah.englishNameTranslation ??
          "Surah name match. Open to read from the beginning.",
        surahName: surah.englishName ?? "Unknown Surah",
        surahNumber: surah.number ?? 1,
        ayahNumber: null,
        matchType: "surah-name",
      },
    ],
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedSize = Number(searchParams.get("size") ?? "25");
  const size = Math.max(1, Math.min(requestedSize, 50));

  if (query.length < 2) {
    return NextResponse.json({ total: 0, matches: [] });
  }

  try {
    const normalizedQuery = normalizeText(query);
    const candidates = buildQueryCandidates(query);
    const queryVariants = buildComparisonVariants(query);
    const hasSurahPrefix = normalizedQuery.startsWith("surah ");

    const surahListResponse = await quranApiClient.get("/surah");
    const surahs = surahListResponse.data?.data ?? [];

    const sortedCandidates = surahs
      .map((surah) => ({
        surah,
        score: scoreSurahMatch(surah, queryVariants),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.surah.number - b.surah.number);

    const bestSurah = sortedCandidates[0]?.surah;
    const bestSurahScore = sortedCandidates[0]?.score ?? 0;
    const isSurahIntent =
      bestSurahScore >= 4 || (hasSurahPrefix && bestSurahScore >= 3);

    if (bestSurah && isSurahIntent) {
      return NextResponse.json(buildSurahMatchResult(bestSurah));
    }

    for (const candidate of candidates) {
      const payload = await searchAyahsByCandidate(candidate);
      if (!payload) {
        continue;
      }

      const rawMatches = payload?.matches ?? [];
      if (rawMatches.length > 0) {
        return NextResponse.json({
          total: payload?.count ?? rawMatches.length,
          matches: mapMatches(rawMatches, size),
        });
      }
    }

    if (!bestSurah) {
      return NextResponse.json({ total: 0, matches: [] });
    }

    return NextResponse.json(buildSurahMatchResult(bestSurah));
  } catch {
    return NextResponse.json({ total: 0, matches: [] }, { status: 500 });
  }
}
