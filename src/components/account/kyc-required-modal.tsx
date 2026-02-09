"use client";

import { useEffect } from "react";
import { useI18n } from "@/providers/i18n-provider";

interface KycRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KycRequiredModal({ isOpen, onClose }: KycRequiredModalProps) {
  const { t } = useI18n();

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-base font-roboto-bold text-[#28323C] mb-4 text-center">
          {t("account.kyc")}
        </div>

        {/* Message */}
        <p className="text-sm text-[#5F7182] text-center mb-6">
          {t("account.kycRequiredMessage")}
        </p>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t("common.confirm")}
        </button>
      </div>
    </div>
  );
}
