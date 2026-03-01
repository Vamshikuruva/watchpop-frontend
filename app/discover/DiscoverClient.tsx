"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  discoverMovies,
  discoverSongs,
  addMovie,
  addSong,
  getMovies,
  getSongs,
} from "@/lib/api";
import { discoverMovieToItem, discoverSongToItem } from "@/lib/discoverMappers";
import { useAuth } from "@/context/AuthContext";
import MediaPoster from "@/components/MediaPoster";
import AddToWatchPop from "@/components/AddToWatchpopButton";

export default function DiscoverClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQueryFromUrl = searchParams.get("q");
  const typeFromUrl = searchParams.get("type") as "movie" | "music" | null;
  const isIdle = searchQueryFromUrl === null;

  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "music">("movie");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [existingMediaIds, setExistingMediaIds] = useState<Set<string>>(
    new Set(),
  );

  const [activeItem, setActiveItem] = useState<any | null>(null);
  const [friendInput, setFriendInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  /* ---------- Load existing library items ---------- */
  useEffect(() => {
    if (!user) return; // 🔥 only load if logged in

    async function loadExisting() {
      try {
        const [movies, songs] = await Promise.all([
          getMovies({ limit: 100 }),
          getSongs({ limit: 100 }),
        ]);

        setExistingMediaIds(
          new Set([
            ...movies.map((m: any) => m.imdb_id),
            ...songs.map((s: any) => s.track_id),
          ]),
        );
      } catch (err) {
        console.error("Failed to load existing library", err);
      }
    }

    loadExisting();
  }, [user]);

  /* ---------- URL-driven search ---------- */
  useEffect(() => {
    if (searchQueryFromUrl === null) {
      setResults([]);
      setQuery("");
      setLoading(false);
      return;
    }

    const q = searchQueryFromUrl.trim();
    if (!q) return;

    const resolvedType =
      typeFromUrl === "music" || typeFromUrl === "movie"
        ? typeFromUrl
        : "movie";

    setSearchType(resolvedType);
    setQuery(q);
    setLoading(true);

    const run = async () => {
      const data =
        resolvedType === "movie"
          ? (await discoverMovies(q)).map(discoverMovieToItem)
          : (await discoverSongs(q)).map(discoverSongToItem);

      setResults(data);
      setLoading(false);
    };

    run();
  }, [searchQueryFromUrl, typeFromUrl]);

  /* ---------- Reset on type switch ---------- */
  useEffect(() => {
    // If Discover loaded with a query, do NOT reset
    if (searchParams.get("q")) return;

    setResults([]);
    setQuery("");
    setActiveItem(null);
    router.push("/discover");
  }, [searchType]);

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
        <span className="text-zinc-300">Discover</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-zinc-100">Discover</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Search and add media to your library.
        </p>
      </header>

      {/* Media toggle */}
      <div className="mb-4 flex gap-2">
        {(["movie", "music"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              router.push("/discover"); // 🔑 clear q + type
              setSearchType(type);
            }}
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

      {/* Search row */}
      <div className="mb-8 flex gap-3">
        <input
          value={query}
          placeholder={
            searchType === "movie" ? "Search movies..." : "Search music..."
          }
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              router.push(
                `/discover?q=${encodeURIComponent(
                  query.trim(),
                )}&type=${searchType}`,
              );
            }
          }}
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
        />

        <button
          type="button"
          onClick={() => {
            if (!query.trim()) return;
            router.push(
              `/discover?q=${encodeURIComponent(
                query.trim(),
              )}&type=${searchType}`,
            );
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
        >
          Search
        </button>
      </div>

      {/* Idle state */}
      {isIdle && (
        <div className="mt-16 text-center text-sm text-zinc-500">
          Start typing to search and add media to your library.
        </div>
      )}

      {/* Results */}
      {!isIdle && (
        <div className="flex flex-col gap-4">
          {loading && (
            <div className="flex flex-col gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!loading &&
            results.map((item) => {
              const isAdded = user ? existingMediaIds.has(item.id) : false;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 items-start rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <MediaPoster
                    src={item.image_url}
                    alt={item.title ?? "Untitled"}
                    className="w-[80px] shrink-0 rounded-lg object-cover"
                  />

                  <div className="flex flex-1 flex-col gap-1">
                    <div
                      onClick={() =>
                        router.push(`/media/${searchType}/${item.id}`)
                      }
                      className="text-sm font-medium text-zinc-100 hover:text-white hover:underline underline-offset-4 transition"
                    >
                      {item.title}
                    </div>

                    <div className="text-xs text-zinc-500">
                      {item.year || item.artist}
                    </div>

                    <AddToWatchPop
                      item={item}
                      type={searchType}
                      isAdded={isAdded}
                      onAdded={() =>
                        setExistingMediaIds((prev) =>
                          new Set(prev).add(item.id),
                        )
                      }
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Add modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-medium text-zinc-100">
              Add to WatchPop
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Who recommended <b>{activeItem.title}</b>?
            </p>

            <input
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              placeholder="Friend names (comma-separated)"
              className="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveItem(null);
                  setFriendInput("");
                }}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  const friends = friendInput
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);

                  if (searchType === "movie") {
                    const res = await addMovie(activeItem.id, friends);
                    setExistingMediaIds((prev) =>
                      new Set(prev).add(activeItem.id),
                    );
                    setMessage(res.message);
                  } else {
                    const res = await addSong(activeItem.id, friends);
                    setExistingMediaIds((prev) =>
                      new Set(prev).add(activeItem.id),
                    );
                    setMessage(res.message);
                  }

                  setSaving(false);
                  setActiveItem(null);
                  setFriendInput("");
                  setTimeout(() => setMessage(null), 3000);
                }}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
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
