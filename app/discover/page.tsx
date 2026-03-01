import { Suspense } from "react";
import DiscoverClient from "./DiscoverClient";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <DiscoverClient />
    </Suspense>
  );
}
