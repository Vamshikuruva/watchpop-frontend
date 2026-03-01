"use client";

import { useEffect, useState } from "react";

export default function EditMediaMetadataModal({
  open,
  onClose,
  title,
  initialTags,
  initialRating,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  initialTags: string[];
  initialRating: number;
  onSave: (data: { tags: string[]; rating: number }) => void;
}) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [rating, setRating] = useState<number>(initialRating);
  const [input, setInput] = useState("");

  // 🔥 Sync state every time modal opens
  useEffect(() => {
    if (open) {
      setTags(initialTags);
      setRating(initialRating);
    }
  }, [open, initialTags, initialRating]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();

        const active = document.activeElement as HTMLElement | null;

        // If focused on input and there's text → add tag
        if (active?.tagName === "INPUT" && input.trim()) {
          addTag();
          return;
        }

        // Otherwise always save
        onSave({ tags, rating });
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, input, tags, rating]);

  if (!open) return null;

  const addTag = () => {
    if (!input.trim()) return;
    setTags((prev) => Array.from(new Set([...prev, input.trim()])));
    setInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div
      className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/60
      backdrop-blur-sm
      animate-fadeIn
    "
      onClick={onClose}
    >
      <div
        className="
        w-[92%] max-w-lg
        rounded-2xl
        border border-zinc-800
        bg-zinc-950
        p-8
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
        animate-scaleIn
      "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
          >
            ✕
          </button>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <div className="mb-2 text-sm text-zinc-500">Rating</div>

          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="mb-3 text-sm text-zinc-500">Tags</div>

          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="
                flex items-center gap-2
                rounded-full
                border border-blue-500/30
                bg-blue-500/10
                px-3 py-1
                text-xs
                text-blue-300
              "
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-200 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add new tag"
              className="
              flex-1
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              px-3 py-2
              text-sm text-zinc-100
              placeholder:text-zinc-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500/40
            "
            />
            <button
              onClick={addTag}
              className="
                rounded-lg
                border border-zinc-500/20
                bg-zinc-500/5
                px-4 py-2
                text-sm
                text-zinc-300
                hover:bg-zinc-500/15
                transition
                "
            >
              Add
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
            rounded-lg
            border border-zinc-800
            px-4 py-2
            text-sm
            text-zinc-400
            hover:bg-zinc-900
            transition
          "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave({ tags, rating });
              onClose();
            }}
            className="
            rounded-lg
            border border-blue-500/30
            bg-blue-500/10
            px-5 py-2
            text-sm font-medium
            text-blue-300
            hover:bg-blue-500/20
            hover:border-blue-400/50
            transition
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
