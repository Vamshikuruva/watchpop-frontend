// front/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

/* ----------------------------- */
/* 🔐 Core Auth-Aware Fetch */
/* ----------------------------- */

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let res = await fetch(`${API}${endpoint}`, {
    ...options,
    credentials: "include", // 🔥 critical
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // If access token expired → attempt refresh
  if (res.status === 401) {
    const refreshRes = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Unauthorized");
    }

    // Retry original request
    res = await fetch(`${API}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  return res;
}

/* ----------------------------- */
/* 🎬 Movies */
/* ----------------------------- */

export async function getMovies(params?: Record<string, any>) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  const res = await apiFetch(`/movies${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function updateMovie(
  imdb_id: string,
  payload: {
    watched?: boolean;
    rating?: number;
    my_tags?: string;
  },
) {
  const res = await apiFetch(`/movies/${imdb_id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update movie");
  }

  return res.json();
}

export async function addMovie(imdb_id: string, friends_recommended: string[]) {
  const res = await apiFetch("/movies", {
    method: "POST",
    body: JSON.stringify({
      imdb_id,
      friends_recommended,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add movie");
  }

  return res.json();
}

/* ----------------------------- */
/* 🔍 Discover (NO AUTH NEEDED) */
/* ----------------------------- */

export async function discoverMovies(query: string) {
  if (!query) return [];

  const res = await fetch(
    `${API}/discover/movies?query=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    throw new Error("Discover failed");
  }

  return res.json();
}

/* ----------------------------- */
/* 🎵 Songs */
/* ----------------------------- */

export async function getSongs(params?: Record<string, any>) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]),
      ).toString()
    : "";

  const res = await apiFetch(`/songs${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch songs");
  }

  return res.json();
}

export async function addSong(track_id: string, friends_recommended: string[]) {
  const res = await apiFetch("/songs", {
    method: "POST",
    body: JSON.stringify({
      track_id,
      friends_recommended,
      listened: false,
      rating: 0,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add song");
  }

  return res.json();
}

export async function updateSong(
  song_id: string,
  payload: {
    listened?: boolean;
    rating?: number;
    my_tags?: string[];
  },
) {
  const res = await apiFetch(`/songs/${song_id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update song");
  }

  return res.json();
}

export async function discoverSongs(query: string) {
  if (!query) return [];

  const res = await fetch(
    `${API}/discover/songs?query=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    throw new Error("Discover failed");
  }

  return res.json();
}
