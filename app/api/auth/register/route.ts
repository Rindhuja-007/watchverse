import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";

const schema = z.object({ name: z.string().trim().min(2).max(60), email: z.string().email().transform((value) => value.toLowerCase()), password: z.string().min(8).max(72) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Enter a name, valid email, and password of at least 8 characters." }, { status: 400 });
  const { name, email, password } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  const user = await db.user.create({ data: { name, email, passwordHash: await hash(password, 12) }, select: { id: true, name: true, email: true } });
  return NextResponse.json({ user }, { status: 201 });
}