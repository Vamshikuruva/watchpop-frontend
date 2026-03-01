"use client";

import Link from "next/link";
import { useState } from "react";
import AddToWatchPop from "@/components/AddToWatchpopButton";

export default function MediaUserSection({
  type,
  id,
  title,
  initialUserEntry,
  libraryPath,
}: {
  type: "movie" | "music";
  id: string;
  title: string;
  initialUserEntry: any;
  libraryPath: string;
}) {
  const [userEntry, setUserEntry] = useState(initialUserEntry);

  const friends =
    typeof userEntry?.friends_recommended === "string"
      ? userEntry.friends_recommended
          .split(",")
          .map((f: string) => f.trim())
          .filter(Boolean)
      : [];

  const tags =
    typeof userEntry?.my_tags === "string"
      ? userEntry.my_tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

  const isAdded = !!userEntry;

  return (
    <>
      {/* Rating */}
      {Number(userEntry?.rating) > 0 && (
        <div className="space-y-5">
          <div>
            <div className="mb-1 text-xs tracking-widest uppercase text-zinc-500">
              Rating
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= userEntry.rating
                      ? "text-yellow-400/80"
                      : "text-zinc-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended */}
      {friends.length > 0 && (
        <div>
          <div className="mb-2 text-xs tracking-widest uppercase text-zinc-500">
            Recommended By
          </div>

          <div className="flex flex-wrap gap-2">
            {friends.map((f: string) => (
              <Link
                key={f}
                href={`/recommended?friends_recommended=${encodeURIComponent(f)}`}
                className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:scale-105 active:scale-95 transition"
              >
                {f}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Edit hint */}
      {isAdded && (
        <div className="pt-3 text-xs text-zinc-500">
          Want to change your rating or tags?{" "}
          <a
            href={libraryPath}
            className="underline hover:text-zinc-300 transition"
          >
            Manage in Library →
          </a>
        </div>
      )}

      {/* Add Button */}
      <div className="pt-2">
        <AddToWatchPop
          item={{ id, title }}
          type={type}
          isAdded={isAdded}
          onAdded={(updatedEntry: any) => {
            setUserEntry({
              ...userEntry,
              ...updatedEntry,
            });
          }}
        />
      </div>
    </>
  );
}
