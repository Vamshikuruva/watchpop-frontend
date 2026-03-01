import { getFullMedia } from "@/lib/server-api";
import BackButton from "@/components/BackButton";
import MovieDetails from "@/components/MovieDetails";
import MusicDetails from "@/components/MusicDetails";
import MusicPoster from "@/components/MusicPoster";
import MediaUserSection from "@/components/MediaUserSection";
import ExpandableTags from "@/components/ExpandableTags";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const media = await getFullMedia(type, id);
  const typeConfig = {
    movie: { path: "movies", param: "my_tag" },
    music: { path: "music", param: "my_tags" },
  };

  const config = typeConfig[type as "movie" | "music"];

  const isAdded = !!media.user_entry;
  const friends =
    typeof media.user_entry?.friends_recommended === "string"
      ? media.user_entry.friends_recommended
          .split(",")
          .map((f: string) => f.trim())
          .filter(Boolean)
      : [];

  const tags =
    typeof media.user_entry?.my_tags === "string"
      ? media.user_entry.my_tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];
  const highResPoster = media.poster?.replace("100x100bb.jpg", "600x600bb.jpg");

  return (
    <div className="relative max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-32 text-zinc-100">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/70 to-black" />

      {/* Back Button */}
      <div className="mb-10">
        <BackButton />
      </div>

      {/* HERO */}
      <section className="grid md:grid-cols-[260px_1fr] gap-12 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div className="shrink-0">
            {type === "music" && media.provider_data?.previewUrl ? (
              <MusicPoster
                poster={media.poster}
                previewUrl={media.provider_data.previewUrl}
                title={media.title}
              />
            ) : (
              <img
                src={media.poster}
                alt={media.title}
                className="w-[280px] rounded-2xl shadow-xl object-cover"
              />
            )}
          </div>

          {/* Personal Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-zinc-500 mb-3">
                Your Tags
              </p>

              <ExpandableTags
                tags={tags}
                libraryPath={`/library/${config.path}`}
                param={config.param}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-2xl space-y-6">
          {/* Title Block */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-[44px] font-semibold tracking-tight leading-tight">
              {media.title}
            </h1>

            {media.subtitle && (
              <p className="text-zinc-400 text-base">{media.subtitle}</p>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
            {media.genre && <span>{media.genre}</span>}
            {media.release_date && <span>{media.release_date}</span>}
          </div>

          {/* Rating + Recommended */}
          <MediaUserSection
            type={type as "movie" | "music"}
            id={id}
            title={media.title}
            initialUserEntry={media.user_entry}
            libraryPath={`/library/${config.path}`}
          />
        </div>
      </section>

      {/* OVERVIEW */}
      {media.description && (
        <section className="mt-12 max-w-4xl">
          <div className="border-t border-zinc-800 pt-12">
            <p className="text-xs tracking-widest text-zinc-500 uppercase mb-8">
              Overview
            </p>

            <p className="text-zinc-400 leading-relaxed text-[15px]">
              {media.description}
            </p>
          </div>
        </section>
      )}

      {/* TYPE-SPECIFIC DETAILS */}
      <section className="mt-16 space-y-16">
        {type === "movie" && <MovieDetails data={media.provider_data} />}
        {type === "music" && <MusicDetails data={media.provider_data} />}
      </section>
    </div>
  );
}
