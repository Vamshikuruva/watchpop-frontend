import { Suspense } from "react";
import LibraryClient from "./LibraryClient";

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LibraryClient />
    </Suspense>
  );
}
