"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LoginModal } from "@/components/auth/login-modal";

interface LoginModalContextType {
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

interface LoginModalProviderProps {
  children: ReactNode;
}

export function LoginModalProvider({ children }: LoginModalProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Derive modal open state: open if explicitly set OR if ?login=true is in URL
  const shouldOpenFromUrl = searchParams.get("login") === "true";
  const isModalOpen = isOpen || shouldOpenFromUrl;

  const openLoginModal = () => setIsOpen(true);

  const closeLoginModal = useCallback(() => {
    setIsOpen(false);
    // Clean the ?login param from URL if present
    if (shouldOpenFromUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl);
    }
  }, [shouldOpenFromUrl, searchParams, router, pathname]);

  return (
    <LoginModalContext.Provider
      value={{
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen: isModalOpen,
      }}
    >
      {children}
      <LoginModal isOpen={isModalOpen} onClose={closeLoginModal} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
}
