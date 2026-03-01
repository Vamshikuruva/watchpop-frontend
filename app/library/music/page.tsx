// front/app/library/music/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSongs } from "@/lib/api";
import SongCard from "@/components/SongCard";
import { Song } from "@/types/song";

export default function MusicLibraryPage() {
  const searchParams = useSearchParams();

  const listenedParam = searchParams.get("listened");
  const recommendedBy = searchParams.get("friends_recommended");
  const tag = searchParams.get("my_tags");

  const sortBy = searchParams.get("sort_by") ?? "created_at";
  const order = searchParams.get("order") ?? "desc";

  const [songs, setSongs] = useState<Song[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadSongs = async () => {
    const params: any = {
      sort_by: sortBy,
      order,
      limit: 100,
    };

    if (listenedParam === "true") params.listened = true;
    if (listenedParam === "false") params.listened = false;
    if (recommendedBy) params.friends_recommended = recommendedBy;
    if (tag) params.my_tags = tag;

    const data = await getSongs(params);
    setSongs(data);
  };

  useEffect(() => {
    loadSongs();
  }, [listenedParam, recommendedBy, tag, sortBy, order]);

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
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/library" className="hover:text-zinc-300 transition">
          Library
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Music</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-zinc-100">Music</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your personal music library
        </p>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <select
          value={listenedParam ?? ""}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            e.target.value
              ? params.set("listened", e.target.value)
              : params.delete("listened");
            window.location.href = `/library/music?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="">All</option>
          <option value="true">Listened</option>
          <option value="false">Unlistened</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("sort_by", e.target.value);
            if (!params.get("order")) params.set("order", "desc");
            window.location.href = `/library/music?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="created_at">Recently added</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
        </select>

        <select
          value={order}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            params.set("order", e.target.value);
            window.location.href = `/library/music?${params.toString()}`;
          }}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Active filters */}
      <div className="mb-6 flex flex-wrap gap-2 text-xs text-zinc-400">
        {listenedParam && (
          <FilterChip
            label={listenedParam === "true" ? "Listened" : "Unlistened"}
            onRemove={() => removeParam("listened")}
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
            onRemove={() => removeParam("my_tags")}
          />
        )}

        {(sortBy !== "created_at" || order !== "desc") && (
          <FilterChip
            label={`Sorted by ${sortBy} (${order})`}
            onRemove={() => {
              removeParam("sort_by");
              removeParam("order");
            }}
          />
        )}
      </div>

      {/* Song list */}
      <div className="flex flex-col gap-4">
        {songs.map((song) => (
          <SongCard
            key={song.track_id}
            song={song}
            onListened={(msg) => {
              setMessage(msg);
              setTimeout(() => setMessage(null), 3000);
              loadSongs();
            }}
          />
        ))}
      </div>

      {message && <Toast message={message} />}
    </main>
  );
}

/* ---------- Helpers ---------- */

function removeParam(key: string) {
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  window.location.href = `/library/music?${params.toString()}`;
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
