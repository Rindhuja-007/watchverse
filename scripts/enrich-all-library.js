const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ANILIST_QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      title { romaji english }
      coverImage { extraLarge large }
      bannerImage
      description
      averageScore
      episodes
      seasonYear
    }
  }
`;

async function enrichTitle(cleanTitle, domain) {
  // 1. AniList for Anime
  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { search: cleanTitle },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const media = data?.data?.Media;
      if (media && (media.coverImage?.extraLarge || media.coverImage?.large)) {
        return {
          posterPath: media.coverImage?.extraLarge || media.coverImage?.large,
          backdropPath: media.bannerImage || null,
          overview: media.description ? media.description.replace(/<[^>]*>?/gm, "").slice(0, 500) : null,
          totalEpisodes: media.episodes || null,
        };
      }
    }
  } catch (err) {
    // continue
  }

  // 2. TVMaze for TV / Series / Sitcoms
  try {
    const res = await fetch("https://api.tvmaze.com/singlesearch/shows?q=" + encodeURIComponent(cleanTitle));
    if (res.ok) {
      const show = await res.json();
      if (show && show.image) {
        return {
          posterPath: show.image?.original || show.image?.medium,
          backdropPath: null,
          overview: show.summary ? show.summary.replace(/<[^>]*>?/gm, "").slice(0, 500) : null,
          totalEpisodes: null,
        };
      }
    }
  } catch (err) {
    // continue
  }

  return null;
}

async function run() {
  const entries = await prisma.watchEntry.findMany();
  console.log(`Checking ${entries.length} entries in database...`);

  let enrichedCount = 0;
  for (const entry of entries) {
    const isBadPoster =
      !entry.posterPath ||
      entry.posterPath.includes("photo-1536440136628") ||
      entry.posterPath.includes("photo-1489599849") ||
      entry.posterPath.includes("1m2n3o4");

    if (isBadPoster) {
      console.log(`Enriching: "${entry.title}" (${entry.domain})...`);
      const enriched = await enrichTitle(entry.title, entry.domain);
      if (enriched && enriched.posterPath) {
        await prisma.watchEntry.update({
          where: { id: entry.id },
          data: {
            posterPath: enriched.posterPath,
            backdropPath: enriched.backdropPath || entry.backdropPath,
            overview: enriched.overview || entry.overview,
            totalEpisodes: enriched.totalEpisodes || entry.totalEpisodes,
          },
        });
        console.log(`  ✓ Updated poster: ${enriched.posterPath}`);
        enrichedCount++;
      }
    }
  }

  console.log(`🎉 Finished! Enriched ${enrichedCount} titles with authentic poster art!`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
