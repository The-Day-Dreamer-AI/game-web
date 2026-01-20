"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PlayerRegisterRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get the UplineId parameter from URL
    const uplineId = searchParams.get("UplineId");

    // Redirect to register page with UplineId
    if (uplineId) {
      router.replace(`/register?UplineId=${encodeURIComponent(uplineId)}`);
    } else {
      router.replace("/register");
    }
  }, [router, searchParams]);

  // Show a brief loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
