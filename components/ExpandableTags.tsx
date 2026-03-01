"use client";

import { useState } from "react";

export default function ExpandableTags({
  tags,
  libraryPath,
  param,
}: {
  tags: string[];
  libraryPath: string;
  param: string;
}) {
  const MAX_VISIBLE = 6;
  const [expanded, setExpanded] = useState(false);

  const visibleTags = expanded ? tags : tags.slice(0, MAX_VISIBLE);
  const hiddenCount = tags.length - MAX_VISIBLE;

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => (
        <a
          key={tag}
          href={`${libraryPath}?${param}=${encodeURIComponent(tag)}`}
          className="
            px-3 py-1 text-xs rounded-full
            bg-white/5 border border-white/10
            hover:bg-white/10 transition
          "
        >
          #{tag}
        </a>
      ))}

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="
            px-3 py-1 text-xs rounded-full
            border border-zinc-700
            text-zinc-400
            hover:bg-zinc-800
            transition
          "
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
