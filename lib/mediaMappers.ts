// front/lib/mediaMappers.ts
import { Movie } from "@/types/movie";
import { Song } from "@/types/song";
import { MediaItem } from "@/types/media";

export function movieToMediaItem(movie: Movie): MediaItem {
  const tags = movie.my_tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const recommendedBy = movie.friends_recommended
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id: movie.imdb_id,
    type: "movie",
    title: movie.title ?? "Untitled movie",
    image_url: movie.image_url,
    year: movie.year,
    rating: movie.rating,
    status: movie.watched ? "consumed" : "planned",
    created_at: movie.created_at,
    tags: tags?.length ? tags : undefined,
    recommendedBy: recommendedBy?.length ? recommendedBy : undefined,
  };
}

// front/lib/mediaMappers.ts

export function songToMediaItem(song: Song): MediaItem {
  const tags = song.my_tags
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const recommendedBy = song.friends_recommended
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id: song.track_id,
    type: "music",
    title: song.title ?? "Untitled track",
    image_url: song.image_url,
    year: song.year,
    rating: song.rating,
    status: song.listened ? "consumed" : "planned",
    created_at: song.created_at,
    tags: tags?.length ? tags : undefined,
    recommendedBy: recommendedBy?.length ? recommendedBy : undefined,
  };
}
