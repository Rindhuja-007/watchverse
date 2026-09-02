import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

const schema = z.object({ externalMediaId: z.number().int().positive(), mediaType: z.enum(["MOVIE", "TV"]), title: z.string().min(1).max(200), posterPath: z.string().nullable().optional(), overview: z.string().max(10000).optional(), releaseDate: z.string().nullable().optional(), domain: z.enum(["MOVIE", "SERIES", "ANIME", "KDRAMA", "SITCOM"]), status: z.enum(["WATCHED", "WATCHING", "PLAN_TO_WATCH", "ON_HOLD", "DROPPED"]).default("PLAN_TO_WATCH"), rating: z.number().int().min(1).max(10).nullable().optional(), favorite: z.boolean().default(false) });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const entries = await db.watchEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the title details." }, { status: 400 });
  const input = parsed.data;
  try {
    const entry = await db.watchEntry.create({ data: { ...input, userId: session.user.id, releaseDate: input.releaseDate ? new Date(input.releaseDate) : null } });
    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "That title is already in your library." }, { status: 409 });
  }
}