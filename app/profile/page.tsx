"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMovies, getSongs } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [movieCount, setMovieCount] = useState(0);
  const [musicCount, setMusicCount] = useState(0);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth");
      return;
    }

    const loadStats = async () => {
      try {
        const [movies, songs] = await Promise.all([getMovies(), getSongs()]);

        setMovieCount(movies.length);
        setMusicCount(songs.length);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, [user, loading]);

  if (!user) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="h-20 w-20 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center text-2xl text-zinc-300">
          {user?.profile_picture ? (
            <img
              src={user.profile_picture}
              alt="profile"
              className="h-full w-full object-cover"
            />
          ) : (
            (user?.name?.charAt(0)?.toUpperCase() ?? "U")
          )}
        </div>

        {/* Name */}
        <h1 className="mt-6 text-2xl font-semibold text-zinc-100">
          {user.name ?? "User"}
        </h1>

        {/* Email */}
        <p className="mt-2 text-sm text-zinc-500">{user.email}</p>

        {/* Provider */}
        <p className="mt-1 text-xs text-zinc-600">
          Signed in with {user.provider}
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          <Stat label="Movies" value={movieCount} />
          <Stat label="Music" value={musicCount} />
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-8 py-6">
      <div className="text-xl font-medium text-zinc-100">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{label}</div>
    </div>
  );
}
