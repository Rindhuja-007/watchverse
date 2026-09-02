import "server-only";

const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p";

function apiKey() {
  if (!process.env.TMDB_API_KEY) throw new Error("TMDB_API_KEY is not configured");
  return process.env.TMDB_API_KEY;
}

async function request<T>(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.set("api_key", apiKey());
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetch(url, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("TMDB request failed");
  return response.json() as Promise<T>;
}

export type TmdbResult = { id: number; media_type: "movie" | "tv"; title?: string; name?: string; overview?: string; poster_path?: string | null; backdrop_path?: string | null; release_date?: string; first_air_date?: string; vote_average?: number };

export const tmdb = {
  search: (query: string, page = 1) => request<{ results: TmdbResult[] }>("/search/multi", { query, page, include_adult: "false" }),
  movie: (id: number) => request<TmdbResult>(`/movie/${id}`, { append_to_response: "credits,images" }),
  tv: (id: number) => request<TmdbResult>(`/tv/${id}`, { append_to_response: "credits,images" }),
  image: (path: string | null | undefined, size = "w500") => path ? `${imageBaseUrl}/${size}${path}` : null,
};