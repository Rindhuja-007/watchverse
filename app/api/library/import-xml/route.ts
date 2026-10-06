import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { enrichMediaMetadata } from "@/lib/enricher";
import { resolvePosterUrl } from "@/lib/images";

interface IncomingEntry {
  title: string;
  domain?: string;
  mediaType?: string;
  status?: string;
  rating?: number | null;
  seasonNumber?: number;
  currentEpisode?: number;
  totalEpisodes?: number;
  favorite?: boolean;
  notes?: string | null;
  overview?: string | null;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate?: string | null;
  externalMediaId?: number;
}

function normalizeStatus(raw?: string): string {
  if (!raw) return "WATCHED";
  const s = raw.trim().toUpperCase().replace(/[-\s]/g, "_");
  if (s.includes("WATCHING") || s === "1") return "WATCHING";
  if (s.includes("PLAN") || s === "6") return "PLAN_TO_WATCH";
  if (s.includes("HOLD") || s === "3") return "ON_HOLD";
  if (s.includes("DROP") || s === "4") return "DROPPED";
  return "WATCHED";
}

function normalizeDomain(raw?: string): string {
  if (!raw) return "ANIME";
  const d = raw.trim().toUpperCase();
  if (d.includes("MOVIE") || d === "FILM") return "MOVIE";
  if (d.includes("KDRAMA") || d.includes("K-DRAMA") || d.includes("DRAMA")) return "KDRAMA";
  if (d.includes("SITCOM") || d.includes("COMEDY")) return "SITCOM";
  if (d.includes("SERIES") || d.includes("TV")) return "SERIES";
  return "ANIME";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await req.json();
    const rawEntries: IncomingEntry[] = body.entries || [];

    if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
      return NextResponse.json(
        { error: "No valid entries found to import" },
        { status: 400 }
      );
    }

    let importedCount = 0;

    for (const item of rawEntries) {
      if (!item.title || typeof item.title !== "string" || !item.title.trim()) {
        continue;
      }

      const cleanTitle = item.title.trim();
      const status = normalizeStatus(item.status);
      const domain = normalizeDomain(item.domain);
      const mediaType = item.mediaType?.toUpperCase() === "MOVIE" ? "MOVIE" : "TV";
      const rating =
        item.rating != null && !isNaN(Number(item.rating))
          ? Math.max(1, Math.min(10, Math.round(Number(item.rating))))
          : null;

      const seasonNumber = Number(item.seasonNumber) || 1;
      const currentEpisode = Number(item.currentEpisode) || 0;
      const totalEpisodes = Number(item.totalEpisodes) || 12;

      // Deterministic fake ID if none provided
      const pseudoId =
        item.externalMediaId ||
        Math.abs(
          cleanTitle.split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
        ) % 10000000;

      // Check if we need to auto-enrich poster & metadata from AniList/TVMaze/TMDB
      let finalPoster = item.posterPath;
      let finalBackdrop = item.backdropPath || null;
      let finalOverview = item.overview || null;
      let finalReleaseDate = item.releaseDate ? new Date(item.releaseDate) : null;
      let finalTotalEps = totalEpisodes;
      let finalExternalId = item.externalMediaId || pseudoId;

      const needsEnrichment =
        !finalPoster ||
        finalPoster.includes("photo-1536440136628") ||
        finalPoster.includes("1m2n3o4");

      if (needsEnrichment) {
        try {
          const enriched = await enrichMediaMetadata(cleanTitle, domain);
          if (enriched) {
            finalPoster = enriched.posterPath || finalPoster;
            finalBackdrop = enriched.backdropPath || finalBackdrop;
            finalOverview = finalOverview || enriched.overview;
            if (!finalReleaseDate && enriched.releaseDate) {
              finalReleaseDate = new Date(enriched.releaseDate);
            }
            if (enriched.totalEpisodes && totalEpisodes <= 12) {
              finalTotalEps = enriched.totalEpisodes;
            }
            if (enriched.externalMediaId) {
              finalExternalId = enriched.externalMediaId;
            }
          }
        } catch (err) {
          console.warn(`Enrichment failed for ${cleanTitle}:`, err);
        }
      }

      // Ensure poster is cleanly formatted with fallbacks
      finalPoster = resolvePosterUrl(finalPoster, domain, cleanTitle);

      // Check if entry already exists for user by title
      const existing = await db.watchEntry.findFirst({
        where: {
          userId,
          title: {
            equals: cleanTitle,
          },
        },
      });

      if (existing) {
        // Update existing entry
        const shouldUpdatePoster =
          !existing.posterPath ||
          existing.posterPath.includes("photo-1536440136628") ||
          existing.posterPath.includes("1m2n3o4");

        await db.watchEntry.update({
          where: { id: existing.id },
          data: {
            status,
            rating: rating ?? existing.rating,
            seasonNumber,
            currentEpisode,
            totalEpisodes: finalTotalEps,
            domain,
            notes: item.notes || existing.notes,
            posterPath: shouldUpdatePoster ? finalPoster : existing.posterPath,
            backdropPath: finalBackdrop || existing.backdropPath,
            overview: existing.overview || finalOverview,
          },
        });
      } else {
        // Create new entry
        await db.watchEntry.create({
          data: {
            userId,
            externalMediaId: finalExternalId,
            mediaType,
            domain,
            title: cleanTitle,
            status,
            rating,
            seasonNumber,
            currentEpisode,
            totalEpisodes: finalTotalEps,
            favorite: Boolean(item.favorite),
            overview: finalOverview || `Imported entry for ${cleanTitle}.`,
            notes: item.notes || null,
            posterPath: finalPoster,
            backdropPath: finalBackdrop,
            releaseDate: finalReleaseDate,
          },
        });
      }

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} titles to your library.`,
    });
  } catch (error) {
    console.error("Import XML Error:", error);
    return NextResponse.json(
      { error: "Failed to process XML import." },
      { status: 500 }
    );
  }
}
