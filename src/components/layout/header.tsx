"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Sidebar } from "./sidebar";

interface HeaderProps {
  variant?: "logo" | "subpage";
  title?: string;
  backHref?: string;
  onBack?: () => void;
  onSupportClick?: () => void;
  className?: string;
}

export function Header({
  variant = "logo",
  title,
  backHref,
  onBack,
  onSupportClick,
  className,
}: HeaderProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <>
      <header
        className={cn(
          "bg-dark px-5 py-3 flex items-center justify-between relative",
          className
        )}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {variant === "logo" ? (
            <Link href="/" className="flex items-center">
              {!imgError ? (
                <Image
                  src="/aone/Aone Logo_White.webp"
                  alt="AON1E"
                  width={80}
                  height={32}
                  className="h-8 w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-xl font-roboto-bold text-white">
                  AON<span className="text-primary">1</span>E
                </span>
              )}
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Center Section - Title for subpage variant */}
        {variant === "subpage" && title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-white font-roboto-medium text-base">
            {title}
          </h1>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSupportClick}
            className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            aria-label="Support"
          >
            <Image
              src="/aone/Header_Icon_Customer Service.webp"
              alt="AON1E support"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
              onError={() => setImgError(true)}
            />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <Image
              src="/aone/Header_Icon_Menu.webp"
              alt="AON1E menu"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
              onError={() => setImgError(true)}
            />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
