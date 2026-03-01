// front/types/movie.ts
export interface Movie {
  imdb_id: string;
  title?: string;
  year?: number;
  image_url?: string;
  watched: boolean;
  friends_recommended: string;
  my_tags?: string;
  rating?: number;
  created_at: string;
}
