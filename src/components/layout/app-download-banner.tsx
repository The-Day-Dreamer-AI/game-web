"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

interface AppDownloadBannerProps {
  className?: string;
}

export function AppDownloadBanner({ className }: AppDownloadBannerProps) {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Detect mobile device on client side
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
      setIsMobileDevice(isMobile);
    };
    checkMobile();
  }, []);

  // Don't render if not mobile or dismissed
  if (!isMobileDevice || !isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-primary py-1.5 px-3",
        className
      )}
    >
      {/* Left: Logo and Text */}
      <div className="flex items-center gap-3">
        <div className="shrink-0 overflow-hidden w-auto h-10">
          {imgError ? (
            <div className="w-full h-full rounded-lg bg-dark flex items-center justify-center">
              <span className="text-xs font-roboto-bold text-white">
                A<span className="text-primary">1</span>
              </span>
            </div>
          ) : (
            <Image
              src="/images/app_icon.png"
              alt="Aone App"
              width={50}
              height={50}
              className="object-contain w-full h-full"
              onError={() => setImgError(true)}
              unoptimized
            />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white truncate font-roboto-bold text-base" style={{ lineHeight: '0.95' }} >
            {t("appBanner.title")}
          </span>
          <span className="text-white truncate font-roboto-regular text-sm" style={{ lineHeight: '1' }}>
            {t("appBanner.subtitle")}
          </span>
        </div>
      </div>

      {/* Right: Download Button and Close */}
      <div className="flex items-center shrink-0 gap-1">
        <button
          onClick={() => {
            // TODO: Link to app store
            window.open("#download", "_blank");
          }}
          className="bg-white py-1.5 px-2.5 rounded-md font-roboto-bold text-xs text-primary shadow-xl cursor-pointer"
        >
          {t("appBanner.downloadButton")}
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="text-white shrink-0 cursor-pointer"
          aria-label={t("appBanner.closeAria")}
        >
          <IoIosCloseCircleOutline size={32.5} />
        </button>
      </div>
    </div>
  );
}
