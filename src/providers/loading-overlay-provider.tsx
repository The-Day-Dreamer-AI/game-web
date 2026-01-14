"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface LoadingOverlayContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextType | undefined>(undefined);

interface LoadingOverlayProviderProps {
  children: ReactNode;
}

export function LoadingOverlayProvider({ children }: LoadingOverlayProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg);
    setIsLoading(true);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
    // Restore body scroll
    document.body.style.overflow = "";
  }, []);

  return (
    <LoadingOverlayContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <LoadingOverlay isVisible={isLoading} message={message} />
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const context = useContext(LoadingOverlayContext);
  if (context === undefined) {
    throw new Error("useLoadingOverlay must be used within a LoadingOverlayProvider");
  }
  return context;
}
