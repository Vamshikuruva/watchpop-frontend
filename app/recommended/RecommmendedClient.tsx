"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMovies, getSongs } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import SongCard from "@/components/SongCard";
import { Movie } from "@/types/movie";
import { Song } from "@/types/song";

export default function RecommendedClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const person = searchParams.get("friends_recommended");

  const [activeTab, setActiveTab] = useState<"all" | "movies" | "music">("all");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  /* ---------------- DATA FETCH ---------------- */

  const load = async () => {
    if (!person) return;

    setIsLoading(true);

    const [filteredMovies, filteredSongs] = await Promise.all([
      getMovies({ friends_recommended: person, limit: 100 }),
      getSongs({ friends_recommended: person, limit: 100 }),
    ]);

    setMovies(filteredMovies);
    setSongs(filteredSongs);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [person]);

  if (!person) {
    return (
      <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-zinc-400">No person selected.</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-4 text-sm text-zinc-300 hover:text-zinc-100"
        >
          Go home
        </button>
      </main>
    );
  }

  const isEmpty = !isLoading && movies.length === 0 && songs.length === 0;

  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-zinc-500">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hover:text-zinc-300 transition"
        >
          Home
        </button>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Recommended</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-zinc-100">
          Recommended by {person}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          All media recommended by {person} in your library
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {[
          { key: "all", label: "All" },
          { key: "movies", label: "Movies" },
          { key: "music", label: "Music" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as any)}
            className={`rounded-full border px-3 py-1 text-sm ${
              activeTab === tab.key
                ? "border-zinc-600 bg-zinc-900 text-zinc-100"
                : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------------- LOADING SKELETON ---------------- */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ---------------- EMPTY STATE ---------------- */}
      {isEmpty && (
        <div className="mt-16 text-sm text-zinc-500">
          No media recommendations from {person} yet.
          <div className="mt-1 text-xs text-zinc-500">
            Recommendations appear once you add items suggested by them.
          </div>
        </div>
      )}

      {/* ---------------- MOVIES ---------------- */}
      {!isLoading &&
        (activeTab === "all" || activeTab === "movies") &&
        movies.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-sm font-medium text-zinc-300">
              Movies recommended by {person}
            </h2>

            <div className="flex flex-col gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdb_id}
                  movie={movie}
                  onWatched={(msg) => {
                    setMessage(msg);
                    load(); // 🔑 refetch to sync UI
                    setTimeout(() => setMessage(null), 3000);
                  }}
                />
              ))}
            </div>
          </section>
        )}

      {/* ---------------- MUSIC ---------------- */}
      {!isLoading &&
        (activeTab === "all" || activeTab === "music") &&
        songs.length > 0 && (
          <section>
            <h2 className="mb-4 text-sm font-medium text-zinc-300">
              Music recommended by {person}
            </h2>

            <div className="flex flex-col gap-4">
              {songs.map((song) => (
                <SongCard
                  key={song.track_id}
                  song={song}
                  onListened={(msg) => {
                    setMessage(msg);
                    load(); // 🔑 refetch to sync UI
                    setTimeout(() => setMessage(null), 3000);
                  }}
                />
              ))}
            </div>
          </section>
        )}

      {/* Toast */}
      {message && (
        <div className="fixed bottom-6 right-6 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 shadow">
          {message}
        </div>
      )}
    </main>
  );
}

/* ---------------- SKELETON ---------------- */

function SkeletonCard() {
  return (
    <div className="flex gap-4 items-start rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="h-[72px] w-[48px] rounded-md bg-zinc-800 animate-pulse" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-zinc-800 animate-pulse" />
        <div className="h-3 w-1/3 rounded bg-zinc-800 animate-pulse" />
        <div className="h-6 w-24 rounded bg-zinc-800 animate-pulse mt-1" />
      </div>
    </div>
  );
}
