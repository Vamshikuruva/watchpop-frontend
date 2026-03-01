"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMovies, getSongs } from "@/lib/api";
import { movieToMediaItem, songToMediaItem } from "@/lib/mediaMappers";
import { MediaItem } from "@/types/media";
import MediaPoster from "@/components/MediaPoster";
import { useAuth } from "@/context/AuthContext";

function getStatusLabel(item: MediaItem) {
  if (item.type === "movie") return "Not watched";
  if (item.type === "music") return "Not listened";
  return "Unfinished";
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-3xl font-medium tracking-tight text-zinc-100">
        {value}
      </span>
      <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "music">("movie");
  const [continueItems, setContinueItems] = useState<MediaItem[]>([]);
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    movies: 0,
    music: 0,
    planned: 0,
  });

  useEffect(() => {
    if (loading || !user) return;

    const loadContinue = async () => {
      try {
        const [movies, songs] = await Promise.all([getMovies(), getSongs()]);

        const movieItems = movies.map(movieToMediaItem);
        const songItems = songs.map(songToMediaItem);

        const items: MediaItem[] = [...movieItems, ...songItems];

        const unfinished = items
          .filter((i) => i.status === "planned")
          .sort(
            (a, b) =>
              new Date(b.created_at ?? "").getTime() -
              new Date(a.created_at ?? "").getTime(),
          )
          .slice(0, 6);

        setContinueItems(unfinished);

        // 👇 NEW: set stats
        setStats({
          movies: movieItems.length,
          music: songItems.length,
          planned: items.filter((i) => i.status === "planned").length,
        });
      } catch (err) {
        console.error("Failed to load continue items", err);
      }
    };

    loadContinue();
  }, [user, loading]);

  return (
    <main className="mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 py-8">
      {user && (
        <section className="mb-16">
          <div className="flex flex-col gap-6">
            {/* Greeting styled like labels */}
            <div className="text-xl font-semibold text-zinc-100">
              {getGreeting()}, {user.name?.split(" ")[0] ?? "there"}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 max-w-lg">
              <StatBlock value={stats.movies} label="Movies" />
              <StatBlock value={stats.music} label="Music" />
              <StatBlock value={stats.planned} label="Planned" />
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <section className="mb-12">
        <h2 className="text-l font-semibold text-zinc-100 mb-3">
          Search & add
        </h2>

        <div className="mb-3 flex gap-2">
          {(["movie", "music"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSearchType(type)}
              className={`rounded-full border px-3 py-1 text-sm ${
                searchType === type
                  ? "border-zinc-600 bg-zinc-900 text-zinc-100"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              {type === "movie" ? "Movies" : "Music"}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                router.push(
                  `/discover?q=${encodeURIComponent(query)}&type=${searchType}`,
                );
              }
            }}
            placeholder="Search anything you want to add…"
            className="
              flex-1 rounded-md border border-zinc-700
              bg-zinc-900 px-3 py-2
              text-sm text-zinc-100
              placeholder:text-zinc-500
            "
          />

          <button
            type="button"
            onClick={() => {
              if (!query.trim()) return;
              router.push(
                `/discover?q=${encodeURIComponent(query)}&type=${searchType}`,
              );
            }}
            className="
              rounded-md border border-zinc-700
              bg-zinc-900 px-4 py-2
              text-sm text-zinc-100
              hover:bg-zinc-800
            "
          >
            Discover
          </button>
        </div>
      </section>
      {!user && !loading && (
        <section className="mb-12 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-lg font-medium text-zinc-100 mb-2">
            Start building your personal library
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Track movies. Save music. Mark watched. Add your own tags.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="rounded-md bg-white text-black px-4 py-2 text-sm hover:bg-zinc-200"
          >
            Sign in to continue
          </button>
        </section>
      )}
      {/* Continue */}
      {user && (
        <section className="mb-12">
          <h2 className="text-l font-semibold text-zinc-100 mb-3">Continue</h2>

          {continueItems.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Nothing unfinished — add something new.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {continueItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="
                  flex gap-3 rounded-xl border border-zinc-800
                  bg-zinc-950 p-3
                "
                >
                  <MediaPoster
                    src={item.image_url}
                    alt={item.title ?? "Untitled"}
                    className="h-[72px] w-[48px] rounded-md object-cover shrink-0"
                  />

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="text-sm font-medium text-zinc-100">
                      {item.title}
                    </div>

                    <div className="text-xs text-zinc-500">
                      {getStatusLabel(item)}
                    </div>

                    {item.recommendedBy && item.recommendedBy.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.recommendedBy.slice(0, 2).map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() =>
                              router.push(
                                `/recommended?friends_recommended=${encodeURIComponent(
                                  name,
                                )}`,
                              )
                            }
                            className="
                              rounded-full border border-zinc-700
                              bg-zinc-900 px-2 py-0.5
                              text-xs text-zinc-300
                              hover:bg-zinc-800
                            "
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      {/* Library */}
      {user && (
        <section className="mb-12">
          <h2 className="text-l font-semibold text-zinc-100 mb-3">
            Your library
          </h2>

          <button
            type="button"
            onClick={() => router.push("/library")}
            className="
            rounded-md border border-zinc-700
            bg-zinc-900 px-4 py-2
            text-sm text-zinc-100
            hover:bg-zinc-800
          "
          >
            Go to Library
          </button>
        </section>
      )}
      {/* Vibe placeholder */}
      {user && (
        <section>
          <h2 className="text-l font-semibold text-zinc-100 mb-3">
            Browse by vibe
          </h2>
          <p className="text-sm text-zinc-500">
            #chill #rewatch #weekend (coming soon)
          </p>
        </section>
      )}
      <footer className="mt-24 pb-6 text-center text-xs text-zinc-500">
        WatchPop · Your personal media library
      </footer>
    </main>
  );
}
