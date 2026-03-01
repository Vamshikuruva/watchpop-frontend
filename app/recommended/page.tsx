import { Suspense } from "react";
import RecommendedClient from "./RecommmendedClient";

export default function RecommendedPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RecommendedClient />
    </Suspense>
  );
}
