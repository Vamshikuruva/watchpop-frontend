"use client";

import { useState } from "react";

export default function MediaPoster({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const showFallback = !src || error;

  return (
    <div
      className={`
        ${className}
        shrink-0 rounded-lg overflow-hidden
        relative
      `}
    >
      {showFallback ? (
        <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:6px_6px]" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
