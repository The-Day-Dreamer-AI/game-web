"use client";

import { useState } from "react";
import Image from "next/image";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { Copy, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useQrCode } from "@/hooks/use-user";
import { useI18n } from "@/providers/i18n-provider";

const shareOptions = [
  {
    id: "telegram",
    label: "Telegram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
      </svg>
    ),
    color: "text-[#0088cc]",
    getShareUrl: (link: string) => `https://t.me/share/url?url=${encodeURIComponent(link)}`,
  },
  {
    id: "whatsapp",
    label: "Whatsapp",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: "text-[#25D366]",
    getShareUrl: (link: string) => `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    id: "line",
    label: "Line",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    ),
    color: "text-[#00B900]",
    getShareUrl: (link: string) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(link)}`,
  },
];

export default function ReferralPage() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { t } = useI18n();
  const { user } = useAuth();

  // Fetch QR code from API
  const { data: qrData, isLoading: isQrLoading, error: qrError } = useQrCode();

  // Generate referral link from user ID (fallback if not provided by API)
  const referralCode = user?.id || "N/A";
  const referralLink = `https://www.aonedl.com/?R=${referralCode}`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (getShareUrl: (link: string) => string) => {
    window.open(getShareUrl(referralLink), "_blank");
  };

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header variant="logo" />

      {/* Profile Card */}
      <div className="mx-4 mt-16 rounded-2xl bg-gradient-to-b from-zinc-100 to-white border border-zinc-200 relative">
        <div className="flex flex-col items-center pt-14 pb-6 px-4">
          {/* Avatar with border ring - overlapping card top */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-b from-primary/30 to-primary/10 p-1 shadow-sm">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {!imgError && user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || "User"}
                  width={88}
                  height={88}
                  className="object-cover w-full h-full"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-500 text-2xl font-bold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <h2 className="text-lg font-semibold text-zinc-800 mb-1">
            {user?.name || "User"}
          </h2>

          {/* UID */}
          <p className="text-sm text-zinc-500 mb-1">
            UID: {user?.id || "N/A"}
          </p>

          {/* Referral Code */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">{t("referral.code")}:</span>
            <span className="text-sm font-semibold text-primary">
              {referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {copiedCode ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* QR Code */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <div className="w-40 h-40 bg-zinc-100 flex items-center justify-center overflow-hidden">
              {isQrLoading ? (
                <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
              ) : qrError ? (
                <div className="text-center text-zinc-400 text-xs p-2">
                  <p>{t("common.errorLoading")}</p>
                </div>
              ) : qrData?.QrCode ? (
                <Image
                  src={`data:image/png;base64,${qrData.QrCode}`}
                  alt="QR Code"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              ) : (
                // Fallback placeholder QR code
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="10" y="10" width="25" height="25" fill="#000"/>
                  <rect x="65" y="10" width="25" height="25" fill="#000"/>
                  <rect x="10" y="65" width="25" height="25" fill="#000"/>
                  <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                  <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                  <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                  <rect x="18" y="18" width="9" height="9" fill="#000"/>
                  <rect x="73" y="18" width="9" height="9" fill="#000"/>
                  <rect x="18" y="73" width="9" height="9" fill="#000"/>
                  <rect x="40" y="40" width="20" height="20" fill="#000"/>
                  <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                  <rect x="48" y="48" width="4" height="4" fill="#000"/>
                  <rect x="65" y="65" width="25" height="25" fill="#000"/>
                  <rect x="70" y="70" width="15" height="15" fill="#fff"/>
                  <rect x="73" y="73" width="9" height="9" fill="#000"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mx-4 mt-6">
        <div className="flex items-center gap-2 border border-zinc-200 rounded-xl overflow-hidden">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 text-sm text-zinc-600 bg-white outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {copiedLink ? t("common.copied") : t("common.copyLink")}
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="mx-4 mt-8 flex-1">
        <h3 className="text-center text-sm font-medium text-zinc-700 mb-4">
          {t("referral.shareQr")}:
        </h3>
        <div className="flex justify-center gap-8">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleShare(option.getShareUrl)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`${option.color} group-hover:opacity-80 transition-opacity`}>
                {option.icon}
              </div>
              <span className="text-xs text-zinc-600">{option.label}</span>
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
