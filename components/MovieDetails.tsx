import { Section } from "./Section";
import { DetailBlock } from "./Detail";

export default function MovieDetails({ data }: any) {
  if (!data) return null;

  return (
    <div className="space-y-16">
      <Section title="Cast & Crew">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailBlock label="Director" value={data.Director} />
          <DetailBlock label="Writer" value={data.Writer} />
          <DetailBlock label="Actors" value={data.Actors} />
        </div>
      </Section>

      <Section title="Ratings">
        <div className="grid md:grid-cols-3 gap-10">
          <DetailBlock label="IMDb" value={data.imdbRating} />
          <DetailBlock label="Metascore" value={data.Metascore} />
          <DetailBlock label="Votes" value={data.imdbVotes} />
        </div>
      </Section>

      <Section title="Technical Info">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailBlock label="Runtime" value={data.Runtime} />
          <DetailBlock label="Language" value={data.Language} />
          <DetailBlock label="Country" value={data.Country} />
          <DetailBlock label="Box Office" value={data.BoxOffice} />
          <DetailBlock label="Awards" value={data.Awards} />
        </div>
      </Section>
    </div>
  );
}
