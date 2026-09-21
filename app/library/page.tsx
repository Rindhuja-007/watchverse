import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Film } from "lucide-react";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Navbar } from "@/components/common/navbar";
import { LibraryView } from "@/components/library/library-view";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const rawEntries = await db.watchEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Date objects for client component
  const entries = rawEntries.map((e) => ({
    ...e,
    releaseDate: e.releaseDate ? e.releaseDate.toISOString() : null,
    dateAdded: e.dateAdded.toISOString(),
    dateStarted: e.dateStarted ? e.dateStarted.toISOString() : null,
    dateCompleted: e.dateCompleted ? e.dateCompleted.toISOString() : null,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f5f1e8]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-14">
        {/* Header section */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#d9f06a]">
              <Film size={14} />
              <span>Personal Collection</span>
            </div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              My Watch Universe
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {entries.length} {entries.length === 1 ? "story" : "stories"} curated and tracked across films, anime, and series.
            </p>
          </div>

          <Link
            href="/add"
            className="flex items-center gap-2 self-start rounded-full bg-[#d9f06a] px-5 py-3 text-xs font-semibold text-[#101214] shadow-lg shadow-[#d9f06a]/20 transition hover:bg-[#cbe25a] sm:self-auto"
          >
            <Plus size={16} />
            Add New Title
          </Link>
        </div>

        {/* Dynamic Interactive Library View */}
        <div className="mt-8">
          <LibraryView initialEntries={entries} />
        </div>
      </main>
    </div>
  );
}