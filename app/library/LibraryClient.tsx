"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMovies, getSongs } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LibraryClient() {
  const router = useRouter();
  const MIN_SKELETON_TIME = 400;

  const [movieTopFriends, setMovieTopFriends] = useState<[string, number][]>(
    [],
  );
  const [movieTopTags, setMovieTopTags] = useState<[string, number][]>([]);
  const [musicTopFriends, setMusicTopFriends] = useState<[string, number][]>(
    [],
  );
  const [musicTopTags, setMusicTopTags] = useState<[string, number][]>([]);

  const [topFriends, setTopFriends] = useState<[string, number][]>([]);

  const [counts, setCounts] = useState({ movies: 0, music: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading]);

  useEffect(() => {
    const loadData = async () => {
      const start = Date.now();
      const [movies, songs] = await Promise.all([getMovies(), getSongs()]);

      /* -------- MOVIES -------- */
      const movieFriends: string[] = [];
      const movieTags: string[] = [];

      movies.forEach((m: any) => {
        if (m.friends_recommended) {
          movieFriends.push(
            ...m.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }

        if (m.my_tags) {
          movieTags.push(
            ...m.my_tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
          );
        }
      });

      setMovieTopFriends(extractCounts(movieFriends));
      setMovieTopTags(extractCounts(movieTags));

      /* -------- MUSIC -------- */
      const musicFriends: string[] = [];
      const musicTags: string[] = [];

      songs.forEach((s: any) => {
        if (s.friends_recommended) {
          musicFriends.push(
            ...s.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }

        if (s.my_tags) {
          musicTags.push(
            ...s.my_tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean),
          );
        }
      });

      setMusicTopFriends(extractCounts(musicFriends));
      setMusicTopTags(extractCounts(musicTags));

      setCounts({
        movies: movies.length,
        music: songs.length,
      });

      /* -------- COMBINED FRIENDS (MOVIES + MUSIC) -------- */
      const combinedFriends: string[] = [];

      movies.forEach((m: any) => {
        if (m.friends_recommended) {
          combinedFriends.push(
            ...m.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }
      });

      songs.forEach((s: any) => {
        if (s.friends_recommended) {
          combinedFriends.push(
            ...s.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }
      });

      setTopFriends(extractCounts(combinedFriends));

      const elapsed = Date.now() - start;
      const remaining = MIN_SKELETON_TIME - elapsed;

      if (remaining > 0) {
        setTimeout(() => setIsLoading(false), remaining);
      } else {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const isEmpty = !isLoading && counts.movies === 0 && counts.music === 0;

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
        <span className="text-zinc-300">Library</span>
      </nav>

      {/* ---------------- LOADING SKELETON ---------------- */}
      {isLoading && (
        <>
          <div className="mb-6">
            <div className="h-6 w-40 rounded bg-zinc-800 animate-pulse" />
            <div className="mt-2 h-4 w-72 rounded bg-zinc-800 animate-pulse" />
          </div>

          <section className="mt-10">
            <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
            <InsightSkeleton />
            <InsightSkeleton />
          </section>

          <section className="mt-10">
            <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
            <InsightSkeleton />
            <InsightSkeleton />
          </section>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LibraryNavSkeleton />
            <LibraryNavSkeleton />
          </div>
        </>
      )}

      {/* ---------------- EMPTY STATE ---------------- */}
      {isEmpty && (
        <div className="mx-auto max-w-md py-24 text-center">
          <h1 className="text-2xl font-semibold text-zinc-100">Your Library</h1>

          <p className="mt-3 text-sm text-zinc-400">
            Your personal space to track and explore media you care about.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/discover")}
              className="
                rounded-md border border-zinc-700
                bg-zinc-900 px-5 py-2
                text-sm text-zinc-100
                hover:bg-zinc-800
              "
            >
              Discover media
            </button>

            <div className="flex gap-4 text-sm text-zinc-500">
              <button
                type="button"
                onClick={() => router.push("/library/movies")}
                className="hover:text-zinc-300"
              >
                Movies
              </button>

              <button
                type="button"
                onClick={() => router.push("/library/music")}
                className="hover:text-zinc-300"
              >
                Music
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- POPULATED STATE ---------------- */}
      {!isLoading && !isEmpty && (
        <>
          <h1 className="text-2xl font-semibold text-zinc-100">Your Library</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Explore your media through tags and recommendations.
          </p>

          {/* ---------------- RECOMMENDED BY FRIENDS ---------------- */}
          {topFriends.length > 0 && (
            <section className="mt-10 rounded-xl border border-zinc-800/60 bg-zinc-950 p-5">
              <h2 className="text-sm font-medium text-zinc-200">
                Your Social Taste
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Friends who shape your library across movies and music
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {topFriends.map(([friend, count]) => (
                  <button
                    key={friend}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/recommended?friends_recommended=${encodeURIComponent(friend)}`,
                      )
                    }
                    className="
                      rounded-full border border-zinc-700
                      bg-zinc-900 px-4 py-1.5
                      text-sm text-zinc-300
                      hover:bg-zinc-800
                      transition
                    "
                  >
                    {friend} · {count}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => router.push("/library/friends")}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition"
                >
                  Explore influence →
                </button>
              </div>
            </section>
          )}

          {/* MOVIES */}
          {movieTopFriends.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-medium text-zinc-100">Movies</h2>

              <InsightBlock
                label="Recommended by"
                items={movieTopFriends}
                onClick={(v) =>
                  router.push(
                    `/library/movies?friends_recommended=${encodeURIComponent(
                      v,
                    )}`,
                  )
                }
              />

              <InsightBlock
                label="Popular tags"
                items={movieTopTags}
                prefix="#"
                onClick={(v) =>
                  router.push(`/library/movies?my_tag=${encodeURIComponent(v)}`)
                }
              />
            </section>
          )}

          {/* MUSIC */}
          {musicTopFriends.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-medium text-zinc-100">Music</h2>

              <InsightBlock
                label="Recommended by"
                items={musicTopFriends}
                onClick={(v) =>
                  router.push(
                    `/library/music?friends_recommended=${encodeURIComponent(
                      v,
                    )}`,
                  )
                }
              />

              <InsightBlock
                label="Popular tags"
                items={musicTopTags}
                prefix="#"
                onClick={(v) =>
                  router.push(`/library/music?my_tags=${encodeURIComponent(v)}`)
                }
              />
            </section>
          )}

          {/* NAV */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LibraryNavCard
              title="Movies"
              count={counts.movies}
              onClick={() => router.push("/library/movies")}
            />
            <LibraryNavCard
              title="Music"
              count={counts.music}
              onClick={() => router.push("/library/music")}
            />
          </div>
        </>
      )}
    </main>
  );
}

/* ---------------- HELPERS ---------------- */

function InsightBlock({
  label,
  items,
  prefix = "",
  onClick,
}: {
  label: string;
  items: [string, number][];
  prefix?: string;
  onClick: (value: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {items.map(([value]) => (
          <button
            key={value}
            type="button"
            onClick={() => onClick(value)}
            className="
              rounded-full border border-zinc-700
              bg-zinc-900 px-3 py-1
              text-sm text-zinc-300
              hover:bg-zinc-800
            "
          >
            {prefix}
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function LibraryNavCard({
  title,
  count,
  onClick,
}: {
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        text-left rounded-xl border border-zinc-800
        bg-zinc-950 p-4
        hover:bg-zinc-900
      "
    >
      <div className="text-sm font-medium text-zinc-100">{title}</div>
      <div className="mt-1 text-xs text-zinc-500">{count} items</div>
    </button>
  );
}

function InsightSkeleton() {
  return (
    <div className="mt-4">
      <div className="h-3 w-32 rounded bg-zinc-800 animate-pulse" />

      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

function LibraryNavSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse" />
      <div className="mt-2 h-3 w-16 rounded bg-zinc-800 animate-pulse" />
    </div>
  );
}

function extractCounts(items: string[]) {
  const map: Record<string, number> = {};

  items.forEach((item) => {
    map[item] = (map[item] || 0) + 1;
  });

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}
