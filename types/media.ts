// front/types/media.ts
export type MediaType = "movie" | "music";

export type MediaStatus = "planned" | "consumed";

export interface MediaItem {
  id: string; // imdb_id | song_id
  type: MediaType;
  title: string;
  image_url?: string;
  year?: number;
  rating?: number;
  status: MediaStatus;
  created_at?: string;
  tags?: string[]; // vibes, moods, intent
  recommendedBy?: string[]; // people
}
