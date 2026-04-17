import { quranApiClient } from "@/lib/quranApiClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await quranApiClient.get("/surah");
    return NextResponse.json({ surahs: response.data?.data ?? [] });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch surahs." },
      { status: 500 },
    );
  }
}
