"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Component that protects routes requiring authentication.
 * If user is not authenticated, redirects to home and opens login modal.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to home and open login modal
      router.replace("/");
      openLoginModal();
    }
  }, [isAuthenticated, router, openLoginModal]);

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
