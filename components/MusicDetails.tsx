import { Section } from "./Section";
import MinimalMusicPreview from "./PreviewPlayer";

function DetailBlock({ label, value }: any) {
  if (!value || value === "N/A") return null;

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="text-sm text-zinc-300 leading-relaxed">{value}</p>
    </div>
  );
}

export default function MusicDetails({ data }: any) {
  if (!data) return null;

  const duration = data.trackTimeMillis
    ? `${Math.floor(data.trackTimeMillis / 60000)}:${String(
        Math.floor((data.trackTimeMillis % 60000) / 1000),
      ).padStart(2, "0")} min`
    : null;

  const releaseYear = data.releaseDate
    ? new Date(data.releaseDate).getFullYear()
    : null;

  return (
    <div className="space-y-16">
      {/* Artist & Album */}
      <Section title="Artist & Album">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailBlock label="Artist" value={data.artistName} />
          <DetailBlock label="Album" value={data.collectionName} />
          <DetailBlock label="Track" value={data.trackName} />
        </div>
      </Section>

      {/* Release Info */}
      <Section title="Release Info">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailBlock label="Released" value={releaseYear} />
          <DetailBlock label="Genre" value={data.primaryGenreName} />
          <DetailBlock label="Country" value={data.country} />
          <DetailBlock
            label="Explicit"
            value={data.trackExplicitness === "explicit" ? "Yes" : "No"}
          />
        </div>
      </Section>

      {/* Technical Info */}
      <Section title="Technical Info">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailBlock label="Duration" value={duration} />
          <DetailBlock
            label="Track Position"
            value={
              data.trackNumber && data.trackCount
                ? `${data.trackNumber} of ${data.trackCount}`
                : null
            }
          />
          <DetailBlock
            label="Price"
            value={
              data.trackPrice ? `${data.currency} ${data.trackPrice}` : null
            }
          />
        </div>
      </Section>
    </div>
  );
}
