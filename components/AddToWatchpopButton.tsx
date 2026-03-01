"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMovie, addSong } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AddToWatchPop({
  item,
  type,
  isAdded,
  onAdded,
}: {
  item: any;
  type: "movie" | "music";
  isAdded?: boolean;
  onAdded?: (updatedEntry: any) => void;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(isAdded ?? false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);

    const friends = friendInput
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    let res;

    if (type === "movie") {
      res = await addMovie(item.id, friends);
    } else {
      res = await addSong(item.id, friends);
    }

    setSaving(false);
    setAdded(true);
    setActive(false);
    setMessage(res.message);
    const updatedEntry = {
      friends_recommended: friends.join(", "),
    };

    onAdded?.(updatedEntry);

    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    setAdded(isAdded ?? false);
  }, [isAdded]);

  return (
    <>
      <button
        type="button"
        disabled={!!user && added}
        onClick={() => {
          if (!user) {
            router.push(
              `/auth?redirect=${encodeURIComponent(
                window.location.pathname + window.location.search,
              )}`,
            );
            return;
          }

          if (!added) setActive(true);
        }}
        className={`
          mt-2 w-fit rounded-md px-3 py-1.5 text-sm
          transition-all duration-200 ease-out
          ${
            !user
              ? "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
              : added
                ? "border border-green-700 bg-green-900/40 text-green-300 cursor-not-allowed"
                : "border border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
          }
        `}
      >
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.span
              key="signin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Sign in to add
            </motion.span>
          ) : added ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1"
            >
              ✓ Added
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Add to WatchPop
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h3 className="text-lg font-medium text-zinc-100">
              Add to WatchPop
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Who recommended <b>{item.title}</b>?
            </p>

            <input
              value={friendInput}
              onChange={(e) => setFriendInput(e.target.value)}
              placeholder="Friend names (comma-separated)"
              className="mt-4 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setActive(false);
                  setFriendInput("");
                }}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={handleSave}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {message && (
        <div className="fixed bottom-6 right-6 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 shadow">
          {message}
        </div>
      )}
    </>
  );
}
