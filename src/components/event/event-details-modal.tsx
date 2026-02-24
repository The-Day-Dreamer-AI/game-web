"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useI18n } from "@/providers/i18n-provider";
import type { Promo } from "@/lib/api/types";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    image: string | null;
    description: string;
    mode: string | null;
    type: string | null;
    freq: string | null;
    rate: number;
    amount: number;
    categoryId: string | null;
    rawPromo: Promo;
  } | null;
}

export function EventDetailsModal({
  isOpen,
  onClose,
  event,
}: EventDetailsModalProps) {
  const { t, locale } = useI18n();

  // Prevent body scroll when modal is open
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

  // Don't render on server or when not open
  if (typeof window === "undefined" || !isOpen || !event) return null;

  // Get localized T&C
  const getTnc = () => {
    if (locale === "zh" && event.rawPromo.TncCn) return event.rawPromo.TncCn;
    if (locale === "ms" && event.rawPromo.TncMy) return event.rawPromo.TncMy;
    return event.rawPromo.Tnc;
  };

  const tnc = getTnc();

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[398px] max-h-[85vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event Banner */}
        <div className="relative h-40 bg-linear-to-r from-zinc-700 to-zinc-500 shrink-0">
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              unoptimized
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        {/* Header */}
        <div className="p-6">
          <label className="capitalize text-base font-roboto-bold text-[#28323C]">
            {event.title || "-"}
          </label>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-6 px-6 gap-2">

          {/* Terms & Conditions */}
          {tnc && (
            <div className="space-y-2">
              <h3 className="text-sm font-roboto-bold text-zinc-800">
                {t("event.termsConditions")}
              </h3>
              <div
                className="prose prose-sm max-w-none prose-p:text-zinc-600 prose-li:text-zinc-600"
                dangerouslySetInnerHTML={{ __html: tnc }}
              />
            </div>
          )}
        </div>

        {/* Footer with Apply Button */}
        <div className="p-6 border-t border-primary">
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("event.apply")}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
