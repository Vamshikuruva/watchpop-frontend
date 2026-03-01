"use client";

import { useRef, useState } from "react";

export default function MusicPoster({
  poster,
  previewUrl,
  title,
}: {
  poster: string;
  previewUrl: string;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const highResPoster = poster.replace(/\d+x\d+bb\.jpg$/, "600x600bb.jpg");

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative w-[280px] cursor-pointer group"
      onClick={togglePlay}
    >
      <img
        src={highResPoster}
        alt={title}
        className="rounded-2xl shadow-xl object-cover"
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 rounded-2xl transition ${
          isPlaying ? "bg-black/40" : "bg-black/0 group-hover:bg-black/30"
        }`}
      />

      {/* Play / Pause */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition group-hover:scale-105">
          {isPlaying ? (
            <span className="text-white text-xl">❚❚</span>
          ) : (
            <span className="text-white text-xl">▶</span>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={previewUrl}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
