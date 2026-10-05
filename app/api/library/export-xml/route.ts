import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

interface ExportWatchEntry {
  id: string;
  title: string;
  domain: string;
  mediaType: string;
  status: string;
  rating?: number | null;
  seasonNumber?: number | null;
  currentEpisode?: number | null;
  totalEpisodes?: number | null;
  favorite?: boolean;
  overview?: string | null;
  notes?: string | null;
  posterPath?: string | null;
  backdropPath?: string | null;
  releaseDate?: Date | string | null;
  dateAdded?: Date | string;
}

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "";
  if (typeof d === "string") return d.split("T")[0];
  try {
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawEntries = await db.watchEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const entries = rawEntries as unknown as ExportWatchEntry[];

  const xmlEntries = entries
    .map((e) => {
      const season = e.seasonNumber ?? 1;
      const current = e.currentEpisode ?? 0;
      const total = e.totalEpisodes ?? 12;
      const score = e.rating != null ? String(e.rating) : "";
      const isFav = e.favorite ? "true" : "false";

      return `    <entry>
      <id>${escapeXml(e.id)}</id>
      <title>${escapeXml(e.title)}</title>
      <domain>${escapeXml(e.domain)}</domain>
      <mediaType>${escapeXml(e.mediaType)}</mediaType>
      <status>${escapeXml(e.status)}</status>
      <rating>${score}</rating>
      <seasonNumber>${season}</seasonNumber>
      <currentEpisode>${current}</currentEpisode>
      <totalEpisodes>${total}</totalEpisodes>
      <favorite>${isFav}</favorite>
      <overview>${escapeXml(e.overview)}</overview>
      <notes>${escapeXml(e.notes)}</notes>
      <posterPath>${escapeXml(e.posterPath)}</posterPath>
      <backdropPath>${escapeXml(e.backdropPath)}</backdropPath>
      <releaseDate>${formatDate(e.releaseDate)}</releaseDate>
      <dateAdded>${formatDate(e.dateAdded)}</dateAdded>
    </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<watchverse version="1.0">
  <user>
    <name>${escapeXml(session.user.name)}</name>
    <email>${escapeXml(session.user.email)}</email>
    <exportedAt>${new Date().toISOString()}</exportedAt>
    <totalEntries>${entries.length}</totalEntries>
  </user>
  <entries>
${xmlEntries}
  </entries>
</watchverse>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reel-library.xml"',
      "Cache-Control": "no-store",
    },
  });
}
