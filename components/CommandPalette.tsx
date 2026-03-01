"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function CommandPalette() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const actions = [
    { label: "Home", action: () => router.push("/") },
    { label: "Discover", action: () => router.push("/discover") },
    { label: "Library", action: () => router.push("/library") },
    ...(user
      ? [{ label: "Profile", action: () => router.push("/profile") }]
      : []),
    ...(user
      ? [
          {
            label: "Logout",
            action: async () => {
              await logout();
              router.push("/");
            },
          },
        ]
      : []),
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-2xl p-4"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command..."
              className="w-full bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500 pb-3 border-b border-zinc-800"
            />

            <div className="mt-3 flex flex-col gap-1">
              {filtered.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                    item.action();
                  }}
                  className="text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                >
                  {item.label}
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="text-sm text-zinc-500 px-3 py-2">
                  No results
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
