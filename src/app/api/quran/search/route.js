import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.alquran.cloud/v1";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const size = Number(searchParams.get("size") ?? "25");

  if (query.length < 2) {
    return NextResponse.json({ total: 0, matches: [] });
  }

  try {
    const response = await axios.get(`${API_BASE}/search/${encodeURIComponent(query)}/all/en`, {
      timeout: 10000,
    });

    const payload = response.data?.data;
    const matches = (payload?.matches ?? []).slice(0, Math.max(1, Math.min(size, 50))).map((item) => ({
      text: item.text,
      surahName: item.surah?.englishName ?? "Unknown Surah",
      surahNumber: item.surah?.number ?? 1,
      ayahNumber: item.numberInSurah,
    }));

    return NextResponse.json({
      total: payload?.count ?? matches.length,
      matches,
    });
  } catch {
    return NextResponse.json({ total: 0, matches: [] }, { status: 500 });
  }
}
