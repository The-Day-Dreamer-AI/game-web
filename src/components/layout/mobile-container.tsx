"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { BottomNav } from "./bottom-nav";
import { AppDownloadBanner } from "./app-download-banner";
import { shouldShowHeader, shouldShowBottomNav } from "@/lib/route-config";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  const pathname = usePathname();
  const showHeader = shouldShowHeader(pathname);
  const showBottomNav = shouldShowBottomNav(pathname);

  return (
    <div className="min-h-screen bg-muted flex justify-center">
      <div
        id="mobile-container"
        className={cn(
          "w-full max-w-[430px] min-h-screen shadow-xl relative flex flex-col",
          className
        )}
        style={{
          backgroundImage: "url('/images/background/background_light.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed inset-0",
        }}
      >
        {/* Sticky top section: App Download Banner + Header */}
        <div className="sticky top-0 z-50">
          <AppDownloadBanner />
          {showHeader && <Header className="static!" />}
        </div>

        {/* Main content area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Bottom Navigation - fixed at bottom */}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}
