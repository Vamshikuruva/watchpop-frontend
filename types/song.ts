// front/types/song.ts
export interface Song {
  track_id: string;
  title?: string;
  album?: string;
  artist?: string;
  year?: number;
  image_url?: string;
  listened: boolean;
  friends_recommended: string;
  my_tags?: string;
  rating?: number;
  created_at: string;
}
