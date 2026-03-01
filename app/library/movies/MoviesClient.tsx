// front/app/library/movies/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMovies } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { Movie } from "@/types/movie";
import Link from "next/link";

export default function MoviesClient() {
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const watchedParam = searchParams.get("watched");
  const recommendedBy = searchParams.get("friends_recommended");
  const tag = searchParams.get("my_tag");

  const sortBy = searchParams.get("sort_by") ?? "created_at";
  const order = searchParams.get("order") ?? "desc";

  const loadMovies = async () => {
    const params: any = {
      sort_by: sortBy,
      order,
      limit: 100,
    };

    if (watchedParam === "true") params.watched = true;
    if (watchedParam === "false") params.watched = false;
    if (recommendedBy) params.friends_recommended = recommendedBy;
    if (tag) params.my_tag = tag;

    const data = await getMovies(params);
    setMovies(data);
  };

  useEffect(() => {
    loadMovies();
  }, [watchedParam, recommendedBy, tag, sortBy, order]);

  return (
    <main
      className="
      mx-auto
      w-full
      max-w-screen-lg
      px-4
      sm:px-6
      lg:px-8
      py-8
    "
    >
      {/* Header */}
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/library" className="hover:text-zinc-300 transition">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Movies</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-medium text-zinc-100">Movies</h1>
        <p className="mt-1 text-sm text-zinc-500">Your personal film library</p>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <select
          value={watchedParam ?? ""}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            e.target.value
              ? params.set("watched", e.target.value)
              : params.delete("watched");
            window.location.href = `/library/movies?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="">All</option>
          <option value="true">Watched</option>
          <option value="false">Unwatched</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("sort_by", e.target.value);
            if (!params.get("order")) params.set("order", "desc");
            window.location.href = `/library/movies?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="created_at">Recently added</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>

        <select
          value={order}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("order", e.target.value);
            window.location.href = `/library/movies?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Active filters */}
      <div className="mb-6 flex flex-wrap gap-2 text-xs text-zinc-400">
        {watchedParam && (
          <FilterChip
            label={watchedParam === "true" ? "Watched" : "Unwatched"}
            onRemove={() => removeParam("watched")}
          />
        )}
        {recommendedBy && (
          <FilterChip
            label={`Recommended by ${recommendedBy}`}
            onRemove={() => removeParam("friends_recommended")}
          />
        )}
        {tag && (
          <FilterChip
            label={`#${tag}`}
            onRemove={() => removeParam("my_tag")}
          />
        )}
        {(sortBy !== "created_at" || order !== "desc") && (
          <FilterChip
            label={`Sorted by ${sortBy} (${order})`}
            onRemove={() => {
              const params = new URLSearchParams(window.location.search);
              params.delete("sort_by");
              params.delete("order");
              window.location.href = `/library/movies?${params.toString()}`;
            }}
          />
        )}
      </div>

      {/* Movie list */}
      <div className="flex flex-col gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdb_id}
            movie={movie}
            onWatched={(msg) => {
              setMessage(msg);
              setTimeout(() => setMessage(null), 3000);
              loadMovies();
            }}
          />
        ))}
      </div>

      {message && <Toast message={message} />}
    </main>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1">
      {label}
      <button onClick={onRemove} className="text-zinc-500 hover:text-zinc-300">
        ✕
      </button>
    </span>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 rounded-lg border border-emerald-700 bg-emerald-900/90 px-4 py-2 text-sm text-emerald-100 shadow">
      {message}
    </div>
  );
}

function removeParam(key: string) {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  window.location.href = `/library/movies?${params.toString()}`;
}
