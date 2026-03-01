"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google: any;
  }
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

      const body =
        mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Authentication failed");
      }

      const data = await res.json();
      await login(data.access_token);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Google Init (first-load safe)
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && document.getElementById("googleBtn")) {
        window.google.accounts.id.initialize({
          client_id:
            "881288169563-1h7o3ocu33tv8f907720ddh6l3n2d6l1.apps.googleusercontent.com",
          callback: async (response: any) => {
            const res = await fetch(`${API}/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                token: response.credential,
              }),
            });

            if (!res.ok) return;

            const data = await res.json();
            await login(data.access_token);
            router.push(redirect);
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleBtn"),
          {
            theme: "filled_black",
            size: "large",
            shape: "pill",
            width: 280,
          },
        );

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [login, router, redirect]);

  return (
    <>
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h1 className="text-lg font-medium text-zinc-100 mb-1">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>

          <p className="text-sm text-zinc-500 mb-6">
            {mode === "login"
              ? "Access your personal media library."
              : "Start building your personal media library."}
          </p>

          {/* Toggle */}
          <div className="mb-6 flex gap-4 text-sm">
            <button
              onClick={() => setMode("login")}
              className={
                mode === "login"
                  ? "text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }
            >
              Sign in
            </button>

            <button
              onClick={() => setMode("register")}
              className={
                mode === "register"
                  ? "text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }
            >
              Create account
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === "register" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
              />
            )}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
            />

            {error && <div className="text-sm text-red-400">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500">OR</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* Google */}
          <div className="flex justify-center">
            <div id="googleBtn" />
          </div>
        </section>
      </main>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
    </>
  );
}
