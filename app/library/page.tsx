import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
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
    <div className="min-h-screen bg-[#090a0c] text-[#f5f1e8]">
      <Navbar />
      <main>
        <LibraryView initialEntries={entries} />
      </main>
    </div>
  );
}