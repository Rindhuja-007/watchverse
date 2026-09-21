import { NextResponse } from "next/server";
import { tmdb, CURATED_CATALOG } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";

  try {
    if (!query) {
      return NextResponse.json({
        results: CURATED_CATALOG.slice(0, 16),
      });
    }

    const data = await tmdb.search(query);
    const results = (data.results || [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 20);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API error:", error);
    // Graceful fallback to curated catalog even if an exception occurs
    const fallback = CURATED_CATALOG.slice(0, 12);
    return NextResponse.json({ results: fallback });
  }
}