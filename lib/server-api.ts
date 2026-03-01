import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

export async function getFullMedia(type: string, id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API}/full/${type}/${id}`, {
    headers: {
      Cookie: cookieHeader, // 🔥 THIS IS THE FIX
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch full media");
  }

  return res.json();
}
