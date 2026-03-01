import { Suspense } from "react";
import MusicClient from "./MusicClient";

export default function MusicPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <MusicClient />
    </Suspense>
  );
}
