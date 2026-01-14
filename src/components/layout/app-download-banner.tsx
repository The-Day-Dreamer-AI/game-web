"use client";

import { useState } from "react";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { cn } from "@/lib/utils";

interface AppDownloadBannerProps {
  className?: string;
}

export function AppDownloadBanner({ className }: AppDownloadBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [imgError, setImgError] = useState(false);

  if (!isVisible) return null;

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
          <span className="text-white truncate font-roboto-bold text-base" style={{ lineHeight: '0.85' }} >
            AONE APP
          </span>
          <span className="text-white truncate font-roboto-regular text-sm" style={{ lineHeight: '0.85' }}>
            Download App Now
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
          className="bg-white py-1.5 px-2.5 rounded-md font-roboto-bold text-xs text-primary shadow-xl"
        >
          DOWNLOAD NOW
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:opacity-80 transition-opacity shrink-0"
          aria-label="Close download banner"
        >
          <IoIosCloseCircleOutline size={32.5} />
        </button>
      </div>
    </div>
  );
}
