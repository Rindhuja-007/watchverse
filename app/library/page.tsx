import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const entries = await db.watchEntry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-[#101214] px-6 py-8 text-[#f5f1e8] sm:px-10 lg:px-14"><div className="mx-auto max-w-7xl"><Link href="/dashboard" className="text-sm text-[#d9f06a]">← Dashboard</Link><div className="mt-12 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-white/40">Your collection</p><h1 className="mt-2 text-4xl font-semibold">My Library</h1><p className="mt-2 text-white/50">{entries.length} {entries.length === 1 ? "title" : "titles"} in your universe.</p></div><Link href="/add" className="rounded-full bg-[#d9f06a] px-5 py-3 text-sm font-semibold text-[#101214]">+ Add title</Link></div>{entries.length === 0 ? <div className="mt-12 rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center"><h2 className="text-xl">Your watch universe is empty.</h2><Link href="/add" className="mt-5 inline-block text-sm text-[#d9f06a]">Find something to watch →</Link></div> : <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{entries.map((entry) => <article key={entry.id} className="min-h-56 rounded-2xl border border-white/10 bg-gradient-to-br from-[#3c4650] to-[#17191c] p-5"><span className="text-xs uppercase tracking-[0.2em] text-white/50">{entry.domain}</span><div className="mt-24"><h2 className="text-xl font-medium">{entry.title}</h2><p className="mt-1 text-xs uppercase text-[#d9f06a]">{entry.status.replaceAll("_", " ")}</p></div></article>)}</div>}</div></main>;
}