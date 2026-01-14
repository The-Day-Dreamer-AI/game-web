"use client";

import { useState } from "react";
import Image from "next/image";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { Copy, Check, Loader2 } from "lucide-react";
import { useQrCode } from "@/hooks/use-user";
import { useI18n } from "@/providers/i18n-provider";

const shareOptions = [
  {
    id: "telegram",
    label: "Telegram",
    icon: "/images/icon/telegram_icon.png",
    getShareUrl: (link: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}`,
  },
  {
    id: "whatsapp",
    label: "Whatsapp",
    icon: "/images/icon/whatsapp_icon.png",
    getShareUrl: (link: string) =>
      `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    id: "line",
    label: "Line",
    icon: "/images/icon/line_icon.png",
    getShareUrl: (link: string) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        link
      )}`,
  },
];

export default function ReferralPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { t } = useI18n();

  // Fetch QR code data from API (includes user info, QR image, referral code and link)
  const { data: qrData, isLoading: isQrLoading, error: qrError } = useQrCode();

  // Use data from API response
  const referralCode = qrData?.ReferralCode || "N/A";
  const referralLink = qrData?.Link || "";
  const userName = qrData?.Name || qrData?.Username || "User";
  const userId = qrData?.Username || "N/A";
  const userAvatar = qrData?.Avatar;

  const handleCopyCode = async () => {
    if (!referralCode || referralCode === "N/A") return;
    await navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (getShareUrl: (link: string) => string) => {
    if (!referralLink) return;
    window.open(getShareUrl(referralLink), "_blank");
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Header */}
        <Header variant="logo" />

        {/* QR Code Section with Background */}
        <div className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/referral/qr_code_background.png"
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content */}
          <div
            className="
              mx-8 rounded-lg mt-24 relative flex flex-col items-center 
              pt-8 pb-10 px-4 border 
              bg-linear-to-b from-white to-[#F2F4F9]
              shadow-[0px_1px_4px_0px_#151A1F26]
            "
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-[#0DC3B1] shadow-lg mb-3 -mt-18">
              {!imgError && userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  width={80}
                  height={80}
                  unoptimized
                  className="object-cover w-full h-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-500 text-2xl font-roboto-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex flex-col text-center text-[#5F7182]">
              {/* Username */}
              <span className="text-2xl font-roboto-bold text-[#28323C]">
                {userName}
              </span>

              {/* UID */}
              <p className="text-xs font-roboto-regular">UID: {userId}</p>

              {/* Referral Code */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs">
                  {t("referral.code")}:
                </span>
                <span className="text-xs font-roboto-bold text-primary">
                  {referralCode}
                </span>
                <button
                  onClick={handleCopyCode}
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-primary cursor-pointer" />
                  ) : (
                    <Copy className="w-4 h-4 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="h-56 flex items-center justify-center overflow-hidden">
              {isQrLoading ? (
                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
              ) : qrError ? (
                <div className="text-center text-zinc-400 text-xs p-2">
                  <p>{t("common.errorLoading")}</p>
                </div>
              ) : qrData?.QrImageUrl ? (
                <Image
                  src={qrData.QrImageUrl}
                  alt="QR Code"
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                  <span className="text-zinc-400 text-xs">No QR Code</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mx-8 mt-8 flex gap-2">
          <div className="flex flex-1 items-center gap-2 bg-white border border-[#959595] rounded-lg overflow-hidden shadow-sm">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 p-3 text-xs text-zinc-600 bg-transparent outline-none"
            />
          </div>
          <button
              onClick={handleCopyLink}
              className="px-5 py-4 bg-primary text-white text-xs font-roboto-bold rounded-lg"
            >
              {copiedLink ? t("common.copied") : t("common.copyLink")}
            </button>
        </div>

        {/* Share Section */}
        <div className="mx-4 mt-8 flex-1 mb-10">
          <div className="text-center text-base font-roboto-bold text-[#28323C] mb-2">
            {t("referral.shareQr")}:
          </div>
          <div className="flex justify-center gap-6">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShare(option.getShareUrl)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden group-hover:opacity-80 transition-opacity">
                  <Image
                    src={option.icon}
                    alt={option.label}
                    width={48}
                    height={48}
                    unoptimized
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-[#5F7182] font-roboto-regular">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </RequireAuth>
  );
}
