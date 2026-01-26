"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";
import { SpinWheelAnimation } from "../animation/spin-wheel-animation";
import { CheckInAnimation } from "../animation/check-in-animation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  labelKey: string;
  href: string;
  icon: string;
  requiresAuth?: boolean;
  badge?: number;
}

const mainMenuItems: MenuItem[] = [
  {
    id: "referral",
    labelKey: "sidebar.referral",
    href: "/referral",
    icon: "/images/sidebar/sidebar_referral_icon.png",
    requiresAuth: true,
  },
  {
    id: "deposit",
    labelKey: "sidebar.deposit",
    href: "/deposit",
    icon: "/images/sidebar/sidebar_deposit_icon.png",
    requiresAuth: true,
  },
  {
    id: "withdrawal",
    labelKey: "sidebar.withdrawal",
    href: "/withdrawal",
    icon: "/images/sidebar/sidebar_withdrawal_icon.png",
    requiresAuth: true,
  },
  {
    id: "events",
    labelKey: "sidebar.events",
    href: "/event",
    icon: "/images/sidebar/sidebar_event_icon.png",
    requiresAuth: true,
  },
  {
    id: "transactions",
    labelKey: "sidebar.transactions",
    href: "/transaction",
    icon: "/images/sidebar/sidebar_transaction_icon.png",
    requiresAuth: true,
  },
  {
    id: "inbox",
    labelKey: "sidebar.inbox",
    href: "/account/inbox",
    icon: "/images/sidebar/sidebar_inbox_icon.png",
    badge: 1,
    requiresAuth: true,
  },
];

const secondaryMenuItems: MenuItem[] = [
  {
    id: "about",
    labelKey: "sidebar.aboutUs",
    href: "/about",
    icon: "/images/sidebar/sidebar_aboutus_icon.png",
  },
  {
    id: "terms",
    labelKey: "sidebar.termsConditions",
    href: "/terms",
    icon: "/images/sidebar/sidebar_tnc_icon.png",
  },
  {
    id: "language",
    labelKey: "sidebar.language",
    href: "/account/language",
    icon: "", // Dynamically set based on locale
  },
];

// Map locale to flag icon
const localeFlagIcons: Record<string, string> = {
  en: "/images/icon/english_icon.png",
  zh: "/images/icon/chinese_icon.png",
  ms: "/images/icon/malay_icon.png",
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");
  const { t, locale } = useI18n();
  const { logout, isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const handleProtectedNavigation = (href: string, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      onClose();
      openLoginModal();
      return false;
    }
    return true;
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
      setCurrentTime(`${formatted} (GMT +08:00)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Only render after time is set (ensures we're on client)
  if (!currentTime) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50",
        !isOpen && "pointer-events-none"
      )}
    >
      {/* Backdrop - covers full screen */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Centered Container - matches mobile container max-width */}
      <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="relative w-full max-w-[430px] h-full overflow-hidden">
          {/* Sidebar Panel - slides from right edge of the 430px container */}
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-[80%] max-w-[360px] bg-[#F5F5F5] transform transition-transform duration-300 ease-out flex flex-col pointer-events-auto",
              isOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
          {/* Header Section - Dark gradient background */}
          <div className="p-10 px-6 text-center relative">
            <Image
              src="/images/sidebar/sidebar_background_icon.png"
              alt="AONE background"
              width={160}
              height={56}
              unoptimized
              className="h-auto w-full object-contain absolute inset-0 -z-10"
            />
            {/* Logo */}
            <div className="flex justify-center mb-2">
              <Image
                src="/images/title.png"
                alt="AONE"
                width={160}
                height={56}
                unoptimized
                className="h-11 w-auto object-contain"
              />
            </div>
            {/* DateTime */}
            <p className="text-xs text-[#5F7182]">{currentTime}</p>
          </div>

          {/* Feature Buttons - Check In & Spin Wheel (placeholder for now) */}
          <div className="px-4 pb-4">
            <div className="max-[380px]:grid max-[380px]:grid-cols-1 flex gap-2">
              <Link
                href="/check-in"
                onClick={onClose}
                className="max-[380px]:h-20 h-16 flex-1 gap-2 px-3 pt-1 bg-white rounded-lg hover:bg-zinc-50 transition-colors shadow-sm relative overflow-hidden"
              >
                <div className="absolute max-[380px]:left-24 left-15 bottom-0.5 translate-x-0 w-full h-auto">
                  <CheckInAnimation />
                </div>
                <span className="text-xs font-roboto-bold text-[#28323C] z-10">
                  {t("sidebar.checkIn")}
                </span>
              </Link>
              <Link
                href="/spin-wheel"
                onClick={onClose}
                className="max-[380px]:h-20 h-16 flex-1 gap-2 px-3 pt-1 bg-white rounded-lg hover:bg-zinc-50 transition-colors shadow-sm relative overflow-hidden"
              >
                <div className="absolute max-[380px]:left-24 left-16 bottom-2.5 translate-x-0 w-full h-auto">
                  <SpinWheelAnimation />
                </div>
                <span className="text-xs font-roboto-bold text-[#28323C] z-10">
                  {t("sidebar.spinWheel")}
                </span>
              </Link>
            </div>
          </div>

          {/* Main Menu */}
          <div className="px-4 pb-3">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm px-3">
              {mainMenuItems.map((item, index) => (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (
                        !handleProtectedNavigation(item.href, item.requiresAuth)
                      ) {
                        e.preventDefault();
                      } else {
                        onClose();
                      }
                    }}
                    className={cn("flex items-center gap-5 max-[380px]:px-0 px-4 py-3")}
                  >
                    <Image
                      src={item.icon}
                      alt={item.id}
                      width={24}
                      height={24}
                      unoptimized
                      className="w-6 h-6 object-contain"
                    />
                    <span className="flex-1 text-xs font-roboto-bold text-[#28323C]">
                      {t(item.labelKey)}
                    </span>
                    {item.badge && (
                      <span className="mr-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center bg-[linear-gradient(180deg,#E42A2A_0%,#AD1D1D_100%)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {index !== mainMenuItems.length - 1 && (
                    <div className="bg-[#d4f1f0] h-px mx-3 max-[380px]:mx-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Menu */}
          <div className="px-4 pb-3">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm px-3 max-[380px]:px-0">
              {secondaryMenuItems.map((item, index) => {
                // Use dynamic flag icon for language item based on current locale
                const iconSrc =
                  item.id === "language"
                    ? localeFlagIcons[locale] || localeFlagIcons.en
                    : item.icon;

                return (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn("flex items-center gap-5 px-4 py-3")}
                    >
                      <Image
                        src={iconSrc}
                        alt={item.id}
                        width={24}
                        height={24}
                        unoptimized
                        className="w-6 h-6 object-contain"
                      />
                      <span className="flex-1 text-xs font-roboto-bold text-[#28323C]">
                        {t(item.labelKey)}
                      </span>
                    </Link>
                    {index !== secondaryMenuItems.length - 1 && (
                      <div className="bg-[#d4f1f0] h-px mx-3 max-[380px]:mx-0"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logout Button - Only show when authenticated */}
          {isAuthenticated && (
            <div className="px-4 pb-3">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm px-4 max-[380px]:px-0">
                <button
                  onClick={async () => {
                    onClose();
                    await logout();
                    router.push("/home");
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 cursor-pointer"
                >
                  <Image
                    src="/images/sidebar/sidebar_logout_icon.png"
                    alt="logout"
                    width={24}
                    height={24}
                    unoptimized
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-xs font-roboto-bold text-[#28323C]">
                    {t("sidebar.logout")}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Spacer to push footer to bottom */}
          <div className="flex-1" />

          {/* Footer - Dark background */}
          <div className="px-6 py-4 text-center text-[#5F7182] font-roboto-regular text-xs">
            <p>{t("sidebar.copyright")}</p>
            <p>{t("sidebar.allRightsReserved")}</p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
