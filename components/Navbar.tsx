"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import log from "@/assets/log.png";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/50 backdrop-blur-md ">
      <div className="relative mx-auto flex max-w-screen-lg items-center justify-center px-4 py-3">
        {/* CENTER BRAND */}
        <div
          onClick={() => router.push("/")}
          className="group flex cursor-pointer items-center gap-3 leading-none transition-transform hover:translate-x-0.5"
        >
          <div className="relative rounded-2xl bg-white/5 backdrop-blur-md p-1.5 shadow-lg ring-1 ring-blue-500/10">
            <img
              src={logo.src}
              className="h-8 w-8 transition-opacity group-hover:opacity-0"
            />
            <img
              src={log.src}
              className="absolute inset-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>

          <span className="text-2xl font-semibold tracking-tight text-zinc-100">
            Watch
            <span className="text-blue-300/80 transition-colors group-hover:text-blue-300">
              Pop
            </span>
          </span>
        </div>

        {/* RIGHT AUTH */}
        <div className="absolute right-4" ref={dropdownRef}>
          {!user ? (
            <button
              onClick={() =>
                router.push(
                  `/auth?redirect=${encodeURIComponent(
                    window.location.pathname + window.location.search,
                  )}`,
                )
              }
              className="text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              Sign in
            </button>
          ) : (
            <>
              {/* Avatar button */}
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="h-8 w-8 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center text-xs text-zinc-300 hover:ring-1 hover:ring-zinc-700 transition"
              >
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user?.name?.charAt(0)?.toUpperCase() ?? "U")
                )}
              </button>

              {/* Animated Dropdown */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-xl p-4 text-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center text-xs text-zinc-300">
                        {user?.profile_picture ? (
                          <img
                            src={user.profile_picture}
                            alt="profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (user?.name?.charAt(0)?.toUpperCase() ?? "U")
                        )}
                      </div>

                      <div>
                        <div className="text-zinc-200 font-medium">
                          {user?.name ?? "User"}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-zinc-800 mb-3" />

                    <button
                      onClick={() => {
                        setOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full text-left py-1.5 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      Profile
                    </button>

                    <button
                      onClick={async () => {
                        setOpen(false);
                        await logout();
                        router.push("/");
                      }}
                      className="w-full text-left py-1.5 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
