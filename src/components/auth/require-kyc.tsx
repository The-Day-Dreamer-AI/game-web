"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKyc } from "@/providers/kyc-provider";

interface RequireKycProps {
  children: React.ReactNode;
}

/**
 * Component that gates routes requiring KYC verification.
 * If KYC is not verified, redirects to home and shows the KYC modal.
 */
export function RequireKyc({ children }: RequireKycProps) {
  const router = useRouter();
  const { isKycVerified, openKycModal } = useKyc();

  useEffect(() => {
    if (!isKycVerified) {
      router.replace("/");
      openKycModal();
    }
  }, [isKycVerified, router, openKycModal]);

  if (!isKycVerified) {
    return null;
  }

  return <>{children}</>;
}
