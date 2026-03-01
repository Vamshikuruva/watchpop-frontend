import { Suspense } from "react";
import MoviesClient from "./MoviesClient";

export default function MoviesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <MoviesClient />
    </Suspense>
  );
}
