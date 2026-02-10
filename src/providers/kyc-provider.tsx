"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getKycStatus, KYC_CHANGE_EVENT } from "@/lib/kyc-storage";
import { KycRequiredModal } from "@/components/account/kyc-required-modal";

interface KycContextType {
  isKycVerified: boolean;
  openKycModal: () => void;
  /**
   * Navigate to a path only if KYC is verified.
   * If not verified, shows the KYC modal instead.
   * Returns true if navigation proceeded, false if blocked.
   */
  navigateWithKycCheck: (path: string) => boolean;
}

const KycContext = createContext<KycContextType | undefined>(undefined);

interface KycProviderProps {
  children: ReactNode;
}

export function KycProvider({ children }: KycProviderProps) {
  const [isKycVerified, setIsKycVerified] = useState(() => getKycStatus());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Listen for KYC status changes from localStorage updates
  useEffect(() => {
    const handleKycChange = () => {
      setIsKycVerified(getKycStatus());
    };
    window.addEventListener(KYC_CHANGE_EVENT, handleKycChange);
    return () => window.removeEventListener(KYC_CHANGE_EVENT, handleKycChange);
  }, []);

  const openKycModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const navigateWithKycCheck = useCallback((path: string): boolean => {
    if (getKycStatus()) {
      router.push(path);
      return true;
    }
    setIsModalOpen(true);
    return false;
  }, [router]);

  return (
    <KycContext.Provider value={{ isKycVerified, openKycModal, navigateWithKycCheck }}>
      {children}
      <KycRequiredModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </KycContext.Provider>
  );
}

export function useKyc() {
  const context = useContext(KycContext);
  if (context === undefined) {
    throw new Error("useKyc must be used within a KycProvider");
  }
  return context;
}
