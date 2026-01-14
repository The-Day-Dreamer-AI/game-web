"use client";

import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-100 flex items-center justify-center bg-black/70 max-w-[430px] mx-auto",
        "transition-opacity duration-200"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>

        {/* Message */}
        {message && (
          <p className="text-white text-sm font-roboto-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
