import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query || query.length < 2) return NextResponse.json({ results: [] });
  try {
    const data = await tmdb.search(query);
    return NextResponse.json({ results: data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv").slice(0, 12) });
  } catch {
    return NextResponse.json({ error: "We couldn't load titles right now." }, { status: 502 });
  }
}