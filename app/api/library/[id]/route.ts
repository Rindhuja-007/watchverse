import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

const updateSchema = z.object({
  status: z.enum(["WATCHED", "WATCHING", "PLAN_TO_WATCH", "ON_HOLD", "DROPPED"]).optional(),
  rating: z.number().int().min(1).max(10).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  favorite: z.boolean().optional(),
  domain: z.enum(["MOVIE", "SERIES", "ANIME", "KDRAMA", "SITCOM"]).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db.watchEntry.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Title not found in your library." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid update data", details: parsed.error.format() }, { status: 400 });
    }

    const data: Record<string, any> = { ...parsed.data };

    if (data.status === "WATCHED" && !existing.dateCompleted) {
      data.dateCompleted = new Date();
    }
    if (data.status === "WATCHING" && !existing.dateStarted) {
      data.dateStarted = new Date();
    }

    const updated = await db.watchEntry.update({
      where: { id },
      data,
    });

    return NextResponse.json({ entry: updated });
  } catch (error) {
    console.error("Error updating watch entry:", error);
    return NextResponse.json({ error: "Failed to update title." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await db.watchEntry.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Title not found in your library." }, { status: 404 });
    }

    await db.watchEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting watch entry:", error);
    return NextResponse.json({ error: "Failed to remove title." }, { status: 500 });
  }
}
