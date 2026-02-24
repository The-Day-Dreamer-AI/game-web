"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Sidebar } from "./sidebar";
import { getRouteConfig } from "@/lib/route-config";
import { getBackDestination } from "@/lib/navigation";
import { useI18n } from "@/providers/i18n-provider";
import { MdHome } from "react-icons/md";

interface HeaderProps {
  /** Override the auto-detected variant */
  variant?: "logo" | "subpage";
  /** Override the auto-detected title (useful for dynamic titles like game names) */
  title?: string;
  /** Custom back navigation href (overrides auto-detection) */
  backHref?: string;
  /** Custom back navigation handler (overrides everything) */
  onBack?: () => void;
  /** Show a home button next to the back button (calls onHomeClick if provided, otherwise navigates to /home) */
  showHomeButton?: boolean;
  /** Custom home button click handler */
  onHomeClick?: () => void;
  /** Custom support click handler */
  onSupportClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function Header({
  variant: variantProp,
  title: titleProp,
  backHref: backHrefProp,
  onBack,
  showHomeButton,
  onHomeClick,
  onSupportClick,
  className,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [imgError, setImgError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get route config for auto-detection
  const routeConfig = getRouteConfig(pathname);

  // Use props if provided, otherwise use auto-detected values
  const variant = variantProp ?? routeConfig.variant;
  const title = titleProp ?? (routeConfig.titleKey ? t(routeConfig.titleKey) : undefined);

  // Get back destination - use prop if provided, otherwise auto-detect
  const backDestination = getBackDestination(pathname, searchParams);
  const backHref = backHrefProp ?? backDestination.href;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(backHref);
    }
  };

  return (
    <>
      <header
        className={cn(
          "bg-dark px-5 py-3 flex items-center justify-between sticky top-0 z-50",
          className
        )}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2 cursor-pointer">
          {variant === "logo" ? (
            <Link href="/" className="flex items-center">
              {!imgError ? (
                <Image
                  src="/images/title_white.png"
                  alt="AON1E"
                  width={80}
                  height={32}
                  className="h-8 w-auto object-contain"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <span className="text-xl font-roboto-bold text-white">
                  AON<span className="text-primary">1</span>E
                </span>
              )}
            </Link>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-white cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              {showHomeButton && (
                <button
                  onClick={() => onHomeClick ? onHomeClick() : router.push("/home")}
                  className="flex items-center text-white cursor-pointer"
                >
                  <MdHome className="w-6 h-6" />
                </button>
              )}
            </>
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
            onClick={() => {
              if (onSupportClick) {
                onSupportClick();
              } else {
                window.open("https://a1livechat.com/Home/LiveChat", "_blank");
              }
            }}
            className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            aria-label="Support"
          >
            <Image
              src="/images/header/customer_service_icon.png"
              alt="AON1E support"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
              onError={() => setImgError(true)}
              unoptimized
            />
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <Image
              src="/images/header/menu_icon.png"
              alt="AON1E menu"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
              onError={() => setImgError(true)}
              unoptimized
            />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
