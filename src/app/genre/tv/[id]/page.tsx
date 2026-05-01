import type { Metadata } from 'next';
import { getPopularTV } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';

export const revalidate = 3600;

interface PageProps {
  params: { id: string };
  searchParams: { name?: string };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  return { title: `${searchParams.name || 'Genre'} TV Shows - CineStream` };
}

// TMDb discover TV by genre
async function getTVByGenre(genreId: number, page = 1) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
  const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { results: [], total_results: 0 };
  return res.json();
}

export default async function TVGenrePage({ params, searchParams }: PageProps) {
  const genreId = Number(params.id);
  const name    = searchParams.name || 'TV Shows';

  const [page1, page2] = await Promise.all([
    getTVByGenre(genreId, 1),
    getTVByGenre(genreId, 2),
  ]);

  const items = [...(page1.results || []), ...(page2.results || [])];

  return (
    <div className="min-h-screen bg-cine-bg pt-20 sm:pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="mb-8">
          <h1 className="text-white text-3xl sm:text-4xl font-extrabold">
            <span className="border-l-4 border-cine-red pl-4">{name}</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">{(page1.total_results || 0).toLocaleString()} titles</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
          {items.map((item: { id: number }) => (
            <MovieCard key={item.id} item={item as never} mediaType="tv" />
          ))}
        </div>
      </div>
    </div>
  );
}
