"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useI18n } from "@/providers/i18n-provider";
import type { AnnouncementResponse } from "@/lib/api/types";
import { X } from "lucide-react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementResponse | null;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  announcement,
}: AnnouncementModalProps) {
  const { t, locale } = useI18n();

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

  if (typeof window === "undefined" || !isOpen || !announcement) return null;

  const image = (() => {
    if (locale === "zh" && announcement.ImageCn) return announcement.ImageCn;
    if (locale === "ms" && announcement.ImageMy) return announcement.ImageMy;
    return announcement.Image;
  })();

  const message = (() => {
    if (locale === "zh" && announcement.MsgCn) return announcement.MsgCn;
    if (locale === "ms" && announcement.MsgMy) return announcement.MsgMy;
    return announcement.Msg;
  })();

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-[398px] max-h-[85vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 shrink-0">
          <label className="text-lg font-roboto-bold text-[#28323C]">
            {t("home.announcementTitle")}
          </label>
          <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#DBDBDB] cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        </div>
        <div className="w-full h-px bg-primary"></div>

        {/* Image */}
        {image && (
          <div className="relative w-full aspect-square shrink-0">
            <Image
              src={image}
              alt="Announcement"
              fill
              unoptimized
              className="object-cover p-4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="px-4 pb-4 shrink-0">
            <p className="text-sm font-roboto-regular text-[#28323C]">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
