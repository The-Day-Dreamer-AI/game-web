"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginModal } from "@/providers/login-modal-provider";

export default function LoginPage() {
  const router = useRouter();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    // Redirect to home and open login modal
    router.replace("/");
    openLoginModal();
  }, [router, openLoginModal]);

  // Show nothing while redirecting
  return null;
}
