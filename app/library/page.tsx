import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const entries = await db.watchEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-[#101214] px-6 py-8 text-[#f5f1e8] sm:px-10 lg:px-14"><div className="mx-auto max-w-7xl"><Link href="/dashboard" className="text-sm text-[#d9f06a]">← Dashboard</Link><div className="mt-12 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-white/40">Your collection</p><h1 className="mt-2 text-4xl font-semibold">My Library</h1><p className="mt-2 text-white/50">{entries.length} {entries.length === 1 ? "title" : "titles"} in your universe.</p></div><Link href="/add" className="rounded-full bg-[#d9f06a] px-5 py-3 text-sm font-semibold text-[#101214]">+ Add title</Link></div>{entries.length === 0 ? <div className="mt-12 rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center"><h2 className="text-xl">Your watch universe is empty.</h2><Link href="/add" className="mt-5 inline-block text-sm text-[#d9f06a]">Find something to watch →</Link></div> : <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{entries.map((entry) => <article key={entry.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"><div className="relative aspect-[2/3] bg-gradient-to-br from-[#3c4650] to-[#17191c]">{entry.posterPath ? <Image src={`https://image.tmdb.org/t/p/w500${entry.posterPath}`} alt={`${entry.title} poster`} fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw" className="object-cover" /> : <div className="flex h-full items-center justify-center text-4xl text-white/20">✦</div>}</div><div className="p-5"><span className="text-xs uppercase tracking-[0.2em] text-white/50">{entry.domain}</span><h2 className="mt-3 text-xl font-medium">{entry.title}</h2><p className="mt-1 text-xs uppercase text-[#d9f06a]">{entry.status.replaceAll("_", " ")}</p></div></article>)}</div>}</div></main>;
}