// app/auth/page.tsx

import { Suspense } from "react";
import AuthClient from "./AuthClient";

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <AuthClient />
    </Suspense>
  );
}
