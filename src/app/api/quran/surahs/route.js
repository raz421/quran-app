import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE = "https://api.alquran.cloud/v1";

export async function GET() {
  try {
    const response = await axios.get(`${API_BASE}/surah`, { timeout: 10000 });
    return NextResponse.json({ surahs: response.data?.data ?? [] });
  } catch {
    return NextResponse.json({ message: "Unable to fetch surahs." }, { status: 500 });
  }
}
