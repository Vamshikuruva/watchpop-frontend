// front/components/MovieCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { updateMovie } from "@/lib/api";
import MediaPoster from "@/components/MediaPoster";
import EditMediaMetadataModal from "@/components/EditMediaMetadataDrawer";

export default function MovieCard({
  movie,
  onWatched,
}: {
  movie: Movie;
  onWatched: (message: string) => void;
}) {
  const friendTags =
    typeof movie.friends_recommended === "string"
      ? Array.from(
          new Set(
            movie.friends_recommended
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          ),
        )
      : [];

  const myTags = movie.my_tags
    ? Array.from(
        new Set(
          movie.my_tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        ),
      )
    : [];
  const MAX_VISIBLE_TAGS = 5;
  const visibleTags = myTags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = myTags.length - visibleTags.length;
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState<number>(movie.rating ?? 0);
  const [showDetails, setShowDetails] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const activeFriend = params?.get("friends_recommended");
  const activeTag = params?.get("my_tag");

  useEffect(() => {
    setRating(movie.rating ?? 0);
  }, [movie.rating]);

  return (
    <div
      className="
      flex
      gap-4
      min-h-[180px]
      items-start
      rounded-xl
      border border-zinc-800
      bg-zinc-950
      p-4
    "
    >
      {/* Poster */}
      <MediaPoster
        src={movie.image_url}
        alt={movie.title ?? "Untitled"}
        className="
            w-[80px]
            sm:w-[90px]
            md:w-[110px]
            shrink-0
            rounded-lg
            object-cover
            self-start
          "
      />

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Title */}
        <div>
          <h3 className="text-base font-medium text-zinc-100">
            {movie.title ?? movie.imdb_id}
            {movie.year && (
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({movie.year})
              </span>
            )}
          </h3>

          <div
            className={`mt-1 text-xs ${
              movie.watched ? "text-emerald-400/70" : "text-amber-400/70"
            }`}
          >
            ● {movie.watched ? "Watched" : "Not watched"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="mt-2 w-fit text-xs text-zinc-500 hover:text-zinc-300 md:hidden"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>

        {/* Watched content */}
        {movie.watched && (
          <div
            className={`
              mt-3
              ${showDetails ? "block" : "hidden"}
              md:block
            `}
          >
            <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
              {/* Friends */}
              <div>
                <div className="mb-1 text-xs text-zinc-500">Recommended by</div>
                <div className="flex flex-wrap gap-2">
                  {friendTags.map((friend) => {
                    const isActive =
                      activeFriend?.toLowerCase() === friend.toLowerCase();

                    return (
                      <button
                        key={friend}
                        onClick={() => {
                          const p = new URLSearchParams(window.location.search);
                          isActive
                            ? p.delete("friends_recommended")
                            : p.set("friends_recommended", friend);
                          window.location.href = `/library/movies?${p.toString()}`;
                        }}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          isActive
                            ? "border border-blue-500 bg-blue-500/10 text-blue-300"
                            : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {friend}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                  <span>My tags</span>

                  {movie.watched && (
                    <button
                      onClick={() => setShowEditor(true)}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(showAllTags ? myTags : visibleTags).map((tag) => {
                    const isActive =
                      activeTag?.toLowerCase() === tag.toLowerCase();

                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          const p = new URLSearchParams(window.location.search);
                          isActive ? p.delete("my_tag") : p.set("my_tag", tag);
                          window.location.href = `/library/movies?${p.toString()}`;
                        }}
                        className={`rounded-full px-3 py-1 text-xs transition ${
                          isActive
                            ? "border border-blue-500 bg-blue-500/10 text-blue-300"
                            : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}

                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAllTags((prev) => !prev)}
                      className="
                        rounded-full
                        border border-zinc-700
                        px-3 py-1
                        text-xs
                        text-zinc-400
                        hover:bg-zinc-800
                        transition
                      "
                    >
                      {showAllTags ? "Show less" : `+${hiddenCount} more`}
                    </button>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <div className="mb-1 text-xs text-zinc-500">Rating</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={async () => {
                        setRating(star);
                        const data = await updateMovie(movie.imdb_id, {
                          rating: star,
                        });

                        onWatched(data.message);
                      }}
                      className={`text-lg transition ${
                        star <= rating
                          ? "text-yellow-400/80"
                          : "text-zinc-600 hover:text-zinc-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <EditMediaMetadataModal
              open={showEditor} // 🔥 ADD THIS
              onClose={() => setShowEditor(false)}
              title={`Edit ${movie.title}`}
              initialTags={myTags}
              initialRating={rating}
              onSave={async ({ tags, rating }) => {
                const data = await updateMovie(movie.imdb_id, {
                  my_tags: tags.join(","),
                  rating,
                });

                setRating(rating); // immediate UI update
                onWatched(data.message);
              }}
            />
          </div>
        )}

        {/* Unwatched */}
        {!movie.watched && (
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3 md:gap-4">
            <div className="text-xs text-zinc-500">
              My tags (comma-separated)
            </div>

            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. action, rewatch"
              className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
            />

            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);

                const uniqueTags = Array.from(
                  new Set(
                    tagInput
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  ),
                ).join(",");

                const data = await updateMovie(movie.imdb_id, {
                  watched: true,
                  my_tags: uniqueTags,
                });

                onWatched(data.message);
                setSaving(false);
              }}
              className="
                w-fit
                rounded-lg
                border border-zinc-700
                bg-zinc-900
                px-4 py-2
                text-sm font-medium text-zinc-300
                hover:bg-zinc-800
                disabled:opacity-50
              "
            >
              {saving ? "Saving…" : "Mark as Watched"}
            </button>

            <div className="hidden md:block h-[24px]" />
          </div>
        )}
      </div>
    </div>
  );
}
