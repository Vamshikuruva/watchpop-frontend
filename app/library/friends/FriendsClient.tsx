"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMovies, getSongs } from "@/lib/api";

export default function FriendsClient() {
  const router = useRouter();

  const [friends, setFriends] = useState<[string, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      const [movies, songs] = await Promise.all([getMovies(), getSongs()]);

      const allFriends: string[] = [];

      movies.forEach((m: any) => {
        if (m.friends_recommended) {
          allFriends.push(
            ...m.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }
      });

      songs.forEach((s: any) => {
        if (s.friends_recommended) {
          allFriends.push(
            ...s.friends_recommended
              .split(",")
              .map((f: string) => f.trim())
              .filter(Boolean),
          );
        }
      });

      const counts: Record<string, number> = {};
      allFriends.forEach((f) => {
        counts[f] = (counts[f] || 0) + 1;
      });

      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

      setFriends(sorted);
      setIsLoading(false);
    };

    loadFriends();
  }, []);

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
        <button
          type="button"
          onClick={() => router.push("/library")}
          className="hover:text-zinc-300 transition"
        >
          Library
        </button>
        <span className="mx-2">/</span>
        <span className="text-zinc-300">Friends</span>
      </nav>

      {/* Header */}
      <h1 className="text-2xl font-semibold text-zinc-100">
        Your Social Taste
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Friends reflected across your movies and music.
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg bg-zinc-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && friends.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-sm text-zinc-400">
            No recommendations from friends yet.
          </p>
        </div>
      )}

      {/* Friends cards only */}
      {!isLoading && friends.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friends.map(([friend, count]) => (
            <button
              key={friend}
              type="button"
              onClick={() =>
                router.push(
                  `/recommended?friends_recommended=${encodeURIComponent(
                    friend,
                  )}`,
                )
              }
              className="
                rounded-lg border border-zinc-800
                bg-zinc-950 px-4 py-3
                text-left
                hover:bg-zinc-900
                transition
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  {friend}
                </span>
                <span className="text-xs text-zinc-500">{count}</span>
              </div>

              <div className="mt-1 text-xs text-zinc-500">recommendations</div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
