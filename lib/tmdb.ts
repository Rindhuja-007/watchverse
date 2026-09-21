import "server-only";

const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p";

export type TmdbResult = {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  domain?: "MOVIE" | "SERIES" | "ANIME" | "KDRAMA" | "SITCOM";
  genres?: string[];
};

export const CURATED_CATALOG: TmdbResult[] = [
  {
    id: 693134,
    media_type: "movie",
    domain: "MOVIE",
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520fr.jpg",
    release_date: "2024-03-01",
    vote_average: 8.3,
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: 872585,
    media_type: "movie",
    domain: "MOVIE",
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cw0iwRACRTCuu9svvSxADBW.jpg",
    release_date: "2023-07-21",
    vote_average: 8.1,
    genres: ["Drama", "History"],
  },
  {
    id: 157336,
    media_type: "movie",
    domain: "MOVIE",
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-07",
    vote_average: 8.4,
    genres: ["Sci-Fi", "Adventure", "Drama"],
  },
  {
    id: 27205,
    media_type: "movie",
    domain: "MOVIE",
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: inception.",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genres: ["Action", "Sci-Fi"],
  },
  {
    id: 155,
    media_type: "movie",
    domain: "MOVIE",
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-18",
    vote_average: 8.5,
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: 569094,
    media_type: "movie",
    domain: "ANIME",
    title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse's very existence.",
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    release_date: "2023-06-02",
    vote_average: 8.4,
    genres: ["Animation", "Action", "Adventure"],
  },
  {
    id: 129,
    media_type: "movie",
    domain: "ANIME",
    title: "Spirited Away",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/mSDvdTqYqD170kudcT6E59l5j03.jpg",
    release_date: "2001-07-20",
    vote_average: 8.5,
    genres: ["Animation", "Family", "Fantasy"],
  },
  {
    id: 1429,
    media_type: "tv",
    domain: "ANIME",
    name: "Attack on Titan",
    overview: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    poster_path: "/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    backdrop_path: "/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
    first_air_date: "2013-04-07",
    vote_average: 8.7,
    genres: ["Anime", "Action", "Fantasy"],
  },
  {
    id: 85937,
    media_type: "tv",
    domain: "ANIME",
    name: "Demon Slayer: Kimetsu no Yaiba",
    overview: "It is the Taisho Period in Japan. Tanjiro, a kindhearted boy who sells charcoal for a living, finds his family slaughtered by a demon. To make matters worse, his younger sister Nezuko has transformed into a demon herself.",
    poster_path: "/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    backdrop_path: "/nTvM4mhqZlHIvUkI1gVnWumrSl7.jpg",
    first_air_date: "2019-04-06",
    vote_average: 8.7,
    genres: ["Anime", "Action", "Supernatural"],
  },
  {
    id: 94605,
    media_type: "tv",
    domain: "ANIME",
    name: "Arcane",
    overview: "Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    poster_path: "/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    backdrop_path: "/2rmK7mnchw9Xr3XdiTFSxTT0Yqi.jpg",
    first_air_date: "2021-11-06",
    vote_average: 8.8,
    genres: ["Anime", "Animation", "Sci-Fi"],
  },
  {
    id: 209867,
    media_type: "tv",
    domain: "ANIME",
    name: "Frieren: Beyond Journey's End",
    overview: "After the party of heroes defeated the Demon King, they restored peace to the land and returned to lives of solitude. Generations pass, and the elven mage Frieren comes face to face with humanity's mortality.",
    poster_path: "/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    backdrop_path: "/kY31Wn6V8U9p6PZqZ9d0B3KqK1o.jpg",
    first_air_date: "2023-09-29",
    vote_average: 8.9,
    genres: ["Anime", "Fantasy", "Adventure"],
  },
  {
    id: 95479,
    media_type: "tv",
    domain: "ANIME",
    name: "Jujutsu Kaisen",
    overview: "Yuji Itadori is a boy with tremendous physical strength, though he lives a completely ordinary high school life. One day, to save a classmate who has been attacked by curses, he eats the finger of Ryomen Sukuna.",
    poster_path: "/hDW85600qNENdBLw7r7d2fE4aXw.jpg",
    backdrop_path: "/gmECX1DvFnahQIhzptJ62OBDX6R.jpg",
    first_air_date: "2020-10-03",
    vote_average: 8.6,
    genres: ["Anime", "Action", "Supernatural"],
  },
  {
    id: 1396,
    media_type: "tv",
    domain: "SERIES",
    name: "Breaking Bad",
    overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    poster_path: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    backdrop_path: "/9faGSFi5jam6pDWGNd0p8J2qPtZ.jpg",
    first_air_date: "2008-01-20",
    vote_average: 8.9,
    genres: ["Drama", "Crime"],
  },
  {
    id: 60059,
    media_type: "tv",
    domain: "SERIES",
    name: "Better Call Saul",
    overview: "Six years before he begins to represent Albuquerque's most notorious criminal, small-time attorney Jimmy McGill transforms into the morally challenged lawyer Saul Goodman.",
    poster_path: "/fC2HDm5t0kHsf72TmF7KiRAzKRv.jpg",
    backdrop_path: "/hPea3Qy5Gd6z40LUqAWQx09v5e1.jpg",
    first_air_date: "2015-02-08",
    vote_average: 8.7,
    genres: ["Crime", "Drama"],
  },
  {
    id: 124364,
    media_type: "tv",
    domain: "SERIES",
    name: "The Bear",
    overview: "A young fine-dining chef comes home to Chicago to run his family Italian beef sandwich shop after a heartbreaking death in his family.",
    poster_path: "/z99U44WlYgY8o2wR5M9BfT4gJk1.jpg",
    backdrop_path: "/gL1k9pX4r1c3o9UqWv9vG8t6K7.jpg",
    first_air_date: "2022-06-23",
    vote_average: 8.3,
    genres: ["Drama", "Comedy"],
  },
  {
    id: 76331,
    media_type: "tv",
    domain: "SERIES",
    name: "Succession",
    overview: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down from the company.",
    poster_path: "/7HW473VZs9ypuY9Zu8pf74qN6U4.jpg",
    backdrop_path: "/cHyY5s6C2V5d6q9YwQ6e7r9T0Y.jpg",
    first_air_date: "2018-06-03",
    vote_average: 8.5,
    genres: ["Drama"],
  },
  {
    id: 100088,
    media_type: "tv",
    domain: "SERIES",
    name: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
    poster_path: "/uKvVjHNqB5VmOrdxqAt2V7J9Gax.jpg",
    backdrop_path: "/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
    first_air_date: "2023-01-15",
    vote_average: 8.6,
    genres: ["Drama", "Sci-Fi", "Adventure"],
  },
  {
    id: 94954,
    media_type: "tv",
    domain: "KDRAMA",
    name: "Crash Landing on You",
    overview: "A paragliding mishap drops a South Korean heiress in North Korea — and into the life of an army officer, who decides he will help her hide.",
    poster_path: "/ic9bHffyA8bF7Pq4z8K2a5fV6gY.jpg",
    backdrop_path: "/v8j1o7eW1p7r6bF9k5fL2e1.jpg",
    first_air_date: "2019-12-14",
    vote_average: 8.8,
    genres: ["KDrama", "Romance", "Comedy"],
  },
  {
    id: 93405,
    media_type: "tv",
    domain: "KDRAMA",
    name: "Squid Game",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    poster_path: "/dDlGFlwFFKx32j0Zl1c2r9k0X.jpg",
    backdrop_path: "/3r0512809u5g8fK1qL9f9.jpg",
    first_air_date: "2021-09-17",
    vote_average: 8.3,
    genres: ["KDrama", "Thriller", "Mystery"],
  },
  {
    id: 136283,
    media_type: "tv",
    domain: "KDRAMA",
    name: "The Glory",
    overview: "Years after surviving horrific abuse in high school, a woman puts an elaborate revenge scheme into motion to make the perpetrators pay for their crimes.",
    poster_path: "/6jOpyvgB19Y5c2W7l5c7l5w5.jpg",
    backdrop_path: "/y5w7l6m8k2f4r9t0v.jpg",
    first_air_date: "2022-12-30",
    vote_average: 8.6,
    genres: ["KDrama", "Drama", "Thriller"],
  },
  {
    id: 2316,
    media_type: "tv",
    domain: "SITCOM",
    name: "The Office",
    overview: "The everyday lives of office employees in the Scranton, Pennsylvania branch of the fictional Dunder Mifflin Paper Company.",
    poster_path: "/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg",
    backdrop_path: "/8WUVHemr1a5z1vY7Xk9d6.jpg",
    first_air_date: "2005-03-24",
    vote_average: 8.6,
    genres: ["Sitcom", "Comedy"],
  },
  {
    id: 1668,
    media_type: "tv",
    domain: "SITCOM",
    name: "Friends",
    overview: "Six young adults navigate personal and professional life in Manhattan, New York City.",
    poster_path: "/2koX1xLkpTQM4IZebYvKysFW1Nh.jpg",
    backdrop_path: "/7rN2a4sB0n2y4q7r.jpg",
    first_air_date: "1994-09-22",
    vote_average: 8.4,
    genres: ["Sitcom", "Comedy", "Romance"],
  },
  {
    id: 48891,
    media_type: "tv",
    domain: "SITCOM",
    name: "Brooklyn Nine-Nine",
    overview: "A comedy series following the exploits of Detective Jake Peralta and his diverse, lovable colleagues at the NYPD's 99th Precinct.",
    poster_path: "/hgRMSOt7a1b8qy76M23v8n8v.jpg",
    backdrop_path: "/9k0r8p7w4q8v2f3.jpg",
    first_air_date: "2013-09-17",
    vote_average: 8.2,
    genres: ["Sitcom", "Comedy", "Crime"],
  },
  {
    id: 97546,
    media_type: "tv",
    domain: "SITCOM",
    name: "Ted Lasso",
    overview: "An American college football coach is hired to manage an English soccer team, hoping that his folksy optimism will win over the cynical players and fans.",
    poster_path: "/5fhZdwP0DVJ0FySXUqL1q1V8b7a.jpg",
    backdrop_path: "/f8l8k0w8q3f5r7.jpg",
    first_air_date: "2020-08-14",
    vote_average: 8.5,
    genres: ["Sitcom", "Comedy", "Drama"],
  },
  {
    id: 666277,
    media_type: "movie",
    domain: "MOVIE",
    title: "Past Lives",
    overview: "Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora's family emigrates from South Korea. Decades later, they are reunited for one fateful week.",
    poster_path: "/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg",
    backdrop_path: "/hZkGoQYus5vegHoetDo83VGvBGA.jpg",
    release_date: "2023-06-02",
    vote_average: 7.9,
    genres: ["Romance", "Drama"],
  },
  {
    id: 545611,
    media_type: "movie",
    domain: "MOVIE",
    title: "Everything Everywhere All at Once",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in parallel universes.",
    poster_path: "/w3LxiVYPqRLexP02LOvEH7bhoRJ.jpg",
    backdrop_path: "/79lq1n9l5k2y4w8.jpg",
    release_date: "2022-03-24",
    vote_average: 8.0,
    genres: ["Action", "Sci-Fi", "Comedy"],
  },
  {
    id: 496243,
    media_type: "movie",
    domain: "MOVIE",
    title: "Parasite",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    release_date: "2019-05-30",
    vote_average: 8.5,
    genres: ["Comedy", "Thriller", "Drama"],
  },
  {
    id: 244786,
    media_type: "movie",
    domain: "MOVIE",
    title: "Whiplash",
    overview: "Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing his mind and body to extreme limits.",
    poster_path: "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdrop_path: "/6bbZ6XyvgfjhC0T0Vj0j8.jpg",
    release_date: "2014-10-10",
    vote_average: 8.4,
    genres: ["Drama", "Music"],
  },
  {
    id: 335984,
    media_type: "movie",
    domain: "MOVIE",
    title: "Blade Runner 2049",
    overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    poster_path: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop_path: "/sAtoMqDVhNDQBc3QJL3RF6hlxGq.jpg",
    release_date: "2017-10-06",
    vote_average: 7.9,
    genres: ["Sci-Fi", "Drama", "Mystery"],
  },
];

export function searchCuratedCatalog(query: string): TmdbResult[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return CURATED_CATALOG.slice(0, 16);

  return CURATED_CATALOG.filter((item) => {
    const titleMatch = (item.title || item.name || "").toLowerCase().includes(normalized);
    const overviewMatch = (item.overview || "").toLowerCase().includes(normalized);
    const domainMatch = (item.domain || "").toLowerCase().includes(normalized);
    const genreMatch = item.genres?.some((g) => g.toLowerCase().includes(normalized));
    return titleMatch || overviewMatch || domainMatch || genreMatch;
  });
}

async function request<T>(path: string, params: Record<string, string | number> = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not configured");

  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("api_key", key);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`TMDB request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export const tmdb = {
  search: async (query: string, page = 1): Promise<{ results: TmdbResult[] }> => {
    if (process.env.TMDB_API_KEY) {
      try {
        const live = await request<{ results: TmdbResult[] }>("/search/multi", {
          query,
          page,
          include_adult: "false",
        });
        if (live?.results && live.results.length > 0) {
          return live;
        }
      } catch (err) {
        console.warn("Live TMDB search failed, falling back to curated catalog:", err);
      }
    }
    return { results: searchCuratedCatalog(query) };
  },
  movie: (id: number) => request<TmdbResult>(`/movie/${id}`, { append_to_response: "credits,images" }),
  tv: (id: number) => request<TmdbResult>(`/tv/${id}`, { append_to_response: "credits,images" }),
  image: (path: string | null | undefined, size = "w500") => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${imageBaseUrl}/${size}${path}`;
  },
};