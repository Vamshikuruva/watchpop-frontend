export type DiscoverMediaItem = {
  id: string; // 🔑 canonical ID
  type: "movie" | "music";
  title: string;
  image_url?: string;
  year?: string;
  artist?: string;
  raw: any; // keep original if needed
};

export function discoverMovieToItem(movie: any): DiscoverMediaItem {
  return {
    id: movie.external_id, // external_id === imdb_id
    type: "movie",
    title: movie.title,
    image_url: movie.image_url,
    year: movie.year,
    raw: movie,
  };
}

export function discoverSongToItem(song: any): DiscoverMediaItem {
  return {
    id: song.external_id, // track-level external ID
    type: "music",
    title: song.title,
    image_url: song.image_url,
    artist: song.artist,
    raw: song,
  };
}
