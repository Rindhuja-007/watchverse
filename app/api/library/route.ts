import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

const createEntrySchema = z.object({
  externalMediaId: z.number().int().optional(),
  mediaType: z.enum(["MOVIE", "TV"]).default("MOVIE"),
  title: z.string().min(1, "Title is required").max(300),
  posterPath: z.string().nullable().optional(),
  backdropPath: z.string().nullable().optional(),
  overview: z.string().max(10000).nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  domain: z.enum(["MOVIE", "SERIES", "ANIME", "KDRAMA", "SITCOM"]).default("MOVIE"),
  status: z.enum(["WATCHED", "WATCHING", "PLAN_TO_WATCH", "ON_HOLD", "DROPPED"]).default("PLAN_TO_WATCH"),
  rating: z
    .number()
    .min(1)
    .max(10)
    .transform((val) => Math.round(val))
    .nullable()
    .optional(),
  notes: z.string().max(5000).nullable().optional(),
  favorite: z.boolean().default(false),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const domain = searchParams.get("domain");
  const favorite = searchParams.get("favorite");
  const search = searchParams.get("search")?.trim();
  const sort = searchParams.get("sort") || "recent";

  const where: Record<string, any> = { userId: session.user.id };

  if (status && status !== "ALL") {
    where.status = status;
  }
  if (domain && domain !== "ALL") {
    where.domain = domain;
  }
  if (favorite === "true") {
    where.favorite = true;
  }
  if (search) {
    where.title = { contains: search };
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "rating_desc") {
    orderBy = [{ rating: "desc" }, { createdAt: "desc" }];
  } else if (sort === "title_asc") {
    orderBy = { title: "asc" };
  } else if (sort === "year_desc") {
    orderBy = { releaseDate: "desc" };
  }

  try {
    const entries = await db.watchEntry.findMany({
      where,
      orderBy,
    });
    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Failed to fetch library entries:", error);
    return NextResponse.json({ error: "Failed to load library." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = createEntrySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid title data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    // For custom/manual titles where no TMDB id was provided, synthesize a unique ID
    const externalMediaId = input.externalMediaId || Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000);

    const existing = await db.watchEntry.findUnique({
      where: {
        userId_externalMediaId_mediaType: {
          userId: session.user.id,
          externalMediaId,
          mediaType: input.mediaType,
        },
      },
    });

    if (existing) {
      // If already exists, update its status, rating, and notes instead of hard failing
      const updated = await db.watchEntry.update({
        where: { id: existing.id },
        data: {
          status: input.status,
          domain: input.domain,
          rating: input.rating !== undefined ? input.rating : existing.rating,
          notes: input.notes !== undefined ? input.notes : existing.notes,
          favorite: input.favorite !== undefined ? input.favorite : existing.favorite,
        },
      });
      return NextResponse.json({ entry: updated, updated: true }, { status: 200 });
    }

    // Safely parse releaseDate to avoid passing Invalid Date to Prisma
    let releaseDate: Date | null = null;
    if (input.releaseDate && typeof input.releaseDate === "string" && input.releaseDate.trim()) {
      const parsedDate = new Date(input.releaseDate.trim());
      if (!isNaN(parsedDate.getTime())) {
        releaseDate = parsedDate;
      }
    }

    const entry = await db.watchEntry.create({
      data: {
        userId: session.user.id,
        externalMediaId,
        mediaType: input.mediaType,
        title: input.title,
        posterPath: input.posterPath || null,
        backdropPath: input.backdropPath || null,
        overview: input.overview || null,
        releaseDate,
        domain: input.domain,
        status: input.status,
        rating: input.rating ?? null,
        notes: input.notes ?? null,
        favorite: input.favorite,
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to add entry to library:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "This title is already in your library." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Could not add title to library." },
      { status: 500 }
    );
  }
}