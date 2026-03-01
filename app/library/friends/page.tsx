import { Suspense } from "react";
import FriendsClient from "./FriendsClient";

export default function FriendsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <FriendsClient />
    </Suspense>
  );
}
