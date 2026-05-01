const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  media_type?: string;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  production_companies?: ProductionCompany[];
}

export interface TVShow {
  id: number;
  name: string;
  title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  media_type?: string;
  seasons?: Season[];
  episode_run_time?: number[];
  networks?: Network[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  results: Video[];
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime: number | null;
  season_number: number;
}

export interface SeasonDetails {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  episodes: Episode[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchMultiResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  overview?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface MovieDetails extends Movie {
  credits: Credits;
  videos: VideosResponse;
  similar: PaginatedResponse<Movie>;
  recommendations: PaginatedResponse<Movie>;
}

export interface TVShowDetails extends TVShow {
  credits: Credits;
  videos: VideosResponse;
  similar: PaginatedResponse<TVShow>;
  recommendations: PaginatedResponse<TVShow>;
}

// ─── Image URL Helpers ────────────────────────────────────────────────────────

export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder-poster.svg';
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.svg';
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
  if (!path) return '/placeholder-profile.svg';
  return `${IMAGE_BASE}/${size}${path}`;
}

// ─── Fetch Helper ─────────────────────────────────────────────────────────────

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}, revalidate = 3600): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`TMDb API error: ${res.status} ${res.statusText} for ${endpoint}`);
  }

  return res.json() as Promise<T>;
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`);
}

export async function getPopularMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/movie/popular', { page: String(page) });
}

export async function getTopRatedMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/movie/top_rated', { page: String(page) });
}

export async function getNowPlayingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/movie/now_playing', { page: String(page) });
}

export async function getUpcomingMovies(page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/movie/upcoming', { page: String(page) });
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getMoviesByGenre(genreId: number, page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
}

// ─── TV Shows ────────────────────────────────────────────────────────────────

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch(`/trending/tv/${timeWindow}`);
}

export async function getPopularTV(page = 1): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch('/tv/popular', { page: String(page) });
}

export async function getTopRatedTV(page = 1): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch('/tv/top_rated', { page: String(page) });
}

export async function getAiringTodayTV(page = 1): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch('/tv/airing_today', { page: String(page) });
}

export async function getTVDetails(id: number): Promise<TVShowDetails> {
  return tmdbFetch(`/tv/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<SeasonDetails> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchMulti(query: string, page = 1): Promise<PaginatedResponse<SearchMultiResult>> {
  return tmdbFetch('/search/multi', { query, page: String(page) });
}

export async function searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch('/search/movie', { query, page: String(page) });
}

export async function searchTV(query: string, page = 1): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch('/search/tv', { query, page: String(page) });
}

// ─── Genres ───────────────────────────────────────────────────────────────────

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch('/genre/movie/list');
}

export async function getTVGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch('/genre/tv/list');
}

// ─── Trending (All) ───────────────────────────────────────────────────────────

export async function getTrendingAll(timeWindow: 'day' | 'week' = 'week'): Promise<PaginatedResponse<SearchMultiResult>> {
  return tmdbFetch(`/trending/all/${timeWindow}`);
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatYear(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).getFullYear().toString();
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function getDisplayTitle(item: Movie | TVShow | SearchMultiResult): string {
  return (item as Movie).title || (item as TVShow).name || 'Unknown';
}

export function getDisplayDate(item: Movie | TVShow | SearchMultiResult): string {
  return (item as Movie).release_date || (item as TVShow).first_air_date || '';
}
