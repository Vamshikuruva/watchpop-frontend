"use client";

import { useRef, useState, useEffect } from "react";

export default function MinimalMusicPreview({
  previewUrl,
  artwork,
  title,
  artist,
}: {
  previewUrl: string;
  artwork?: string;
  title: string;
  artist?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setProgress(audio.currentTime);
    const meta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", meta);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", meta);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) audio.pause();
    else audio.play();

    setPlaying(!playing);
  };

  const percent = duration ? (progress / duration) * 100 : 0;

  const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-10 max-w-xl">
      <audio ref={audioRef} src={previewUrl} />

      <div className="flex items-center gap-4">
        {artwork && (
          <img
            src={artwork}
            alt={title}
            className="w-14 h-14 rounded-xl object-cover"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-400 truncate">{artist}</p>
          <p className="text-base font-medium truncate">{title}</p>
        </div>

        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700 hover:bg-zinc-800 transition"
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="h-[2px] bg-zinc-800 rounded-full relative">
          <div
            className="absolute top-0 left-0 h-[2px] bg-zinc-100 transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-zinc-500 mt-2">
          <span>{format(progress)}</span>
          <span>{format(duration)}</span>
        </div>
      </div>
    </div>
  );
}
