"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKyc } from "@/providers/kyc-provider";

interface RequireKycProps {
  children: React.ReactNode;
}

/**
 * Component that gates routes requiring KYC verification.
 * If KYC is not verified:
 * - In-app navigation: redirects back to the previous page and shows KYC modal
 * - Direct URL access: redirects to home and shows KYC modal
 */
export function RequireKyc({ children }: RequireKycProps) {
  const router = useRouter();
  const { isKycVerified, openKycModal, getPreviousPathname } = useKyc();

  useEffect(() => {
    if (!isKycVerified) {
      openKycModal();
      const prevPath = getPreviousPathname();
      if (prevPath) {
        // In-app navigation: go back to the page the user was on
        router.replace(prevPath);
      } else {
        // Direct URL access: redirect to home
        router.replace("/");
      }
    }
  }, [isKycVerified, router, openKycModal, getPreviousPathname]);

  if (!isKycVerified) {
    return null;
  }

  return <>{children}</>;
}
