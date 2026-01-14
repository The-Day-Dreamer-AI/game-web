"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainMenuItems = [
  {
    id: "referral",
    labelKey: "sidebar.referral",
    href: "/referral",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    color: "text-primary",
    requiresAuth: true,
  },
  {
    id: "deposit",
    labelKey: "sidebar.deposit",
    href: "/deposit",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    color: "text-primary",
    requiresAuth: true,
  },
  {
    id: "withdrawal",
    labelKey: "sidebar.withdrawal",
    href: "/withdrawal",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
      </svg>
    ),
    color: "text-primary",
    requiresAuth: true,
  },
  {
    id: "events",
    labelKey: "sidebar.events",
    href: "/event",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
      </svg>
    ),
    color: "text-primary",
    requiresAuth: true,
  },
  {
    id: "transactions",
    labelKey: "sidebar.transactions",
    href: "/transaction",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5v-2h7v2zm5-4H5v-2h12v2zm0-4H5V7h12v2z"/>
      </svg>
    ),
    color: "text-primary",
    requiresAuth: true,
  },
  {
    id: "inbox",
    labelKey: "sidebar.inbox",
    href: "/account/inbox",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    color: "text-primary",
    badge: 1,
    requiresAuth: true,
  },
];

const secondaryMenuItems = [
  {
    id: "about",
    labelKey: "sidebar.aboutUs",
    href: "/about",
    icon: (
      <span className="text-xs font-roboto-bold text-primary">A1</span>
    ),
  },
  {
    id: "terms",
    labelKey: "sidebar.termsConditions",
    href: "/terms",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
  },
  {
    id: "language",
    labelKey: "sidebar.language",
    href: "/account/language",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor">
        <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
      </svg>
    ),
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();
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
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(",", "");
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

  if (!mounted) return null;

  const container = document.getElementById("mobile-container");
  if (!container) return null;

  return createPortal(
    <div
      className={cn(
        "absolute inset-0 z-50 overflow-hidden",
        !isOpen && "pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "absolute top-0 right-0 h-[100dvh] w-[85%] max-w-[360px] bg-white transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* Header Section */}
          <div className="pt-8 pb-4 px-6 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-2">
              {!imgError ? (
                <Image
                  src="/logo-header.png"
                  alt="AON1E"
                  width={140}
                  height={48}
                  unoptimized
                  className="h-12 w-auto object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-3xl font-roboto-bold text-zinc-800">
                  AON<span className="text-primary">1</span>E
                </span>
              )}
            </div>
            {/* DateTime */}
            <p className="text-xs text-zinc-500">{currentTime}</p>
          </div>

          {/* Feature Buttons */}
          <div className="px-6 pb-4">
            <div className="flex gap-3">
              <Link
                href="/check-in"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="#4FD1C5" strokeWidth="1.5"/>
                  <path d="M3 9h18" stroke="#4FD1C5" strokeWidth="1.5"/>
                  <path d="M9 4V2M15 4V2" stroke="#4FD1C5" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 13l2 2 4-4" stroke="#4FD1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs font-roboto-medium text-zinc-700">{t("sidebar.checkIn")}</span>
              </Link>
              <Link
                href="/spin-wheel"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#4FD1C5" strokeWidth="1.5"/>
                  <path d="M12 3v9l6 3" stroke="#4FD1C5" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="2" fill="#4FD1C5"/>
                </svg>
                <span className="text-xs font-roboto-medium text-zinc-700">{t("sidebar.spinWheel")}</span>
              </Link>
            </div>
          </div>

          {/* Main Menu */}
          <div className="px-6 py-2">
            <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
              {mainMenuItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    if (!handleProtectedNavigation(item.href, item.requiresAuth)) {
                      e.preventDefault();
                    } else {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors",
                    index !== mainMenuItems.length - 1 && "border-b border-zinc-100"
                  )}
                >
                  <span className={item.color}>{item.icon}</span>
                  <span className="flex-1 text-sm font-roboto-medium text-zinc-700">{t(item.labelKey)}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary Menu */}
          <div className="px-6 py-2">
            <div className="bg-white rounded-xl border border-zinc-100 overflow-hidden">
              {secondaryMenuItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors",
                    index !== secondaryMenuItems.length - 1 && "border-b border-zinc-100"
                  )}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                  <span className="text-sm font-roboto-medium text-zinc-700">{t(item.labelKey)}</span>
                </Link>
              ))}

              {/* Logout */}
              <button
                onClick={async () => {
                  onClose();
                  await logout();
                  openLoginModal();
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-50 transition-colors border-t border-zinc-100"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-red-500" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span className="text-sm font-roboto-medium text-zinc-700">{t("sidebar.logout")}</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 text-center">
            <p className="text-xs text-zinc-400">{t("sidebar.copyright")}</p>
            <p className="text-xs text-zinc-400">{t("sidebar.allRightsReserved")}</p>
          </div>
        </div>
      </div>
    </div>,
    container
  );
}
