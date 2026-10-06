// Utility to fetch authentic metadata and poster art for imported or unlisted titles
// Supports AniList GraphQL (free, no auth for Anime), TVMaze (free, no auth for Series), and TMDB

export interface EnrichedMedia {
  posterPath: string | null;
  backdropPath: string | null;
  overview: string | null;
  releaseDate: string | null;
  rating: number | null;
  totalEpisodes: number | null;
  domain: string;
  externalMediaId?: number;
}

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
      genres
    }
  }
`;

export async function enrichMediaMetadata(
  rawTitle: string,
  domainHint: string = "ANIME"
): Promise<EnrichedMedia | null> {
  const cleanTitle = rawTitle.trim();
  if (!cleanTitle) return null;

  const isAnime =
    domainHint === "ANIME" ||
    cleanTitle.toLowerCase().includes("season") ||
    /^[A-Za-z\s]+(no|na|wa|ga|wo|de|ni)\s+[A-Za-z\s]+$/i.test(cleanTitle);

  // 1. Try AniList GraphQL for Anime titles
  if (isAnime) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: ANILIST_QUERY,
          variables: { search: cleanTitle },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const media = data?.data?.Media;
        if (media) {
          const poster =
            media.coverImage?.extraLarge ||
            media.coverImage?.large ||
            null;
          const rating = media.averageScore
            ? Math.round(media.averageScore / 10)
            : null;
          const cleanDesc = media.description
            ? media.description.replace(/<[^>]*>?/gm, "").slice(0, 500)
            : null;

          return {
            posterPath: poster,
            backdropPath: media.bannerImage || null,
            overview: cleanDesc,
            releaseDate: media.seasonYear ? `${media.seasonYear}-01-01` : null,
            rating,
            totalEpisodes: media.episodes || null,
            domain: "ANIME",
            externalMediaId: media.id,
          };
        }
      }
    } catch {
      // Gracefully continue to other sources
    }
  }

  // 2. Try TVMaze for Series / Sitcoms / Shows
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(cleanTitle)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (res.ok) {
      const show = await res.json();
      if (show && show.image) {
        const poster = show.image?.original || show.image?.medium || null;
        const cleanSummary = show.summary
          ? show.summary.replace(/<[^>]*>?/gm, "").slice(0, 500)
          : null;
        const rating = show.rating?.average
          ? Math.round(Number(show.rating.average))
          : null;

        return {
          posterPath: poster,
          backdropPath: null,
          overview: cleanSummary,
          releaseDate: show.premiered || null,
          rating,
          totalEpisodes: null,
          domain: domainHint === "SITCOM" ? "SITCOM" : "SERIES",
          externalMediaId: show.id,
        };
      }
    }
  } catch {
    // Continue
  }

  return null;
}
