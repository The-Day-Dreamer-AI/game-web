"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import QrScanner from "qr-scanner";
import { X } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

export default function ScanQrPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const scanner = useRef<QrScanner | null>(null);
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);

  const [qrOn, setQrOn] = useState<boolean>(true);
  const [showInvalidModal, setShowInvalidModal] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Extract UID from QR data
  const extractUid = useCallback((data: string): string | null => {
    try {
      // Try to parse as URL first
      const url = new URL(data);

      // Look for UID parameters
      const uid =
        url.searchParams.get("uid") ||
        url.searchParams.get("Id") ||
        url.searchParams.get("id") ||
        url.searchParams.get("UserId") ||
        url.searchParams.get("userId");

      if (uid) {
        return uid;
      }

      // Check if the path contains a UID pattern (e.g., /profile/ABC123)
      const pathParts = url.pathname.split("/").filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && /^[A-Za-z0-9_-]{3,32}$/.test(lastPart)) {
        return lastPart;
      }

      return null;
    } catch {
      // If not a valid URL, check if it's a plain UID
      const trimmed = data.trim();
      if (/^[A-Za-z0-9_-]{3,32}$/.test(trimmed)) {
        return trimmed;
      }
      return null;
    }
  }, []);

  const handleClose = useCallback(() => {
    scanner.current?.stop();
    const returnTo =
      searchParams.get("returnTo") || "/account/contact/new-friend";
    router.push(returnTo);
  }, [router, searchParams]);

  const onScanSuccess = useCallback(
    (result: QrScanner.ScanResult) => {
      const uid = extractUid(result.data);

      if (!uid) {
        setShowInvalidModal(true);
        scanner.current?.stop();
        return;
      }

      scanner.current?.stop();

      // Navigate back to new-friend page with the UID
      const returnTo =
        searchParams.get("returnTo") || "/account/contact/new-friend";
      router.push(`${returnTo}?uid=${encodeURIComponent(uid)}`);
    },
    [extractUid, router, searchParams]
  );

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: () => {}, // Ignore decode errors (normal when scanning)
        preferredCamera: "environment",
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => {
          setQrOn(true);
          setCameraError(null);
        })
        .catch((err: Error) => {
          setQrOn(false);
          setCameraError(err.message || t("scanner.cameraError"));
        });
    }

    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current.destroy();
        scanner.current = null;
      }
    };
  }, [onScanSuccess, t]);

  const handleRetry = () => {
    setShowInvalidModal(false);
    scanner.current?.start();
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Video Element - Full area behind content */}
        <video
          ref={videoEl}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* QR Frame and Instructions */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-[280px] px-4">
          <Image
            src="/images/qr-frame.svg"
            alt="QR Scanner Frame"
            width={280}
            height={280}
            className="w-full h-auto"
            unoptimized
            priority
          />
          <p className="text-white text-center text-sm mt-6 px-4">
            {t("scanner.scanUidQr")}
          </p>
        </div>

        {/* QR Box Overlay */}
        <div ref={qrBoxEl} className="qr-box" />

        {/* Camera Error */}
        {!qrOn && cameraError && (
          <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-6">
            <div className="text-white text-center">
              <p className="text-lg font-roboto-medium mb-2">
                {t("scanner.cameraAccessDenied")}
              </p>
              <p className="text-sm text-zinc-400 mb-6">
                {t("scanner.cameraAccessInfo")}
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-primary text-white rounded-lg font-roboto-medium cursor-pointer"
              >
                {t("common.back")}
              </button>
            </div>
          </div>
        )}

        {/* Invalid QR Modal */}
        {showInvalidModal && (
          <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-roboto-bold text-zinc-900 mb-2">
                {t("scanner.invalidQr")}
              </h3>
              <p className="text-sm text-zinc-600 mb-6">
                {t("scanner.invalidUidQrMessage")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-roboto-medium cursor-pointer"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleRetry}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-roboto-medium cursor-pointer"
                >
                  {t("scanner.tryAgain")}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
