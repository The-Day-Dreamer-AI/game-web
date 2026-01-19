"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, MessageSquare, Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useResetPinTac, useResetPin } from "@/hooks/use-bank";

export default function ResetPinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  // Check where user came from (for redirect after success)
  const fromPage = searchParams.get("from");

  const resetPinTac = useResetPinTac();
  const resetPin = useResetPin();

  const [tacCode, setTacCode] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [tacExpiresIn, setTacExpiresIn] = useState<number | null>(null);
  const [tacRequested, setTacRequested] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState<string>("");

  // Countdown timer for TAC
  useEffect(() => {
    if (tacExpiresIn === null || tacExpiresIn <= 0) return;

    const timer = setInterval(() => {
      setTacExpiresIn((prev) => {
        if (prev === null || prev <= 0) {
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tacExpiresIn]);

  const handleRequestTac = async () => {
    try {
      const response = await resetPinTac.mutateAsync();
      setTacRequested(true);
      setTacExpiresIn(response.ExpiresIn || 300); // Default 5 minutes

      // Mask the phone number for display
      if (response.Phone) {
        const phone = response.Phone;
        const masked = phone.substring(0, 4) + " *** ***" + phone.substring(phone.length - 4);
        setMaskedPhone(masked);
      }
    } catch (error) {
      console.error("Failed to request TAC:", error);
    }
  };

  const handleConfirm = async () => {
    if (!tacCode || !pin || !confirmPin || pin !== confirmPin) return;

    try {
      await resetPin.mutateAsync({
        Pin: pin,
        Tac: tacCode,
      });

      // On success, redirect back to add bank page or account page
      if (fromPage === "add-bank") {
        router.replace("/account/bank/add");
      } else {
        router.replace("/account");
      }
    } catch (error) {
      console.error("Failed to reset PIN:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isFormValid = tacCode && pin && confirmPin && pin === confirmPin && pin.length === 6;

  // Determine back href based on where user came from
  const backHref = fromPage === "add-bank" ? "/account/bank/add" : "/account";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.resetPin")} backHref={backHref} />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("account.resetPin")} backHref={backHref} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {/* Info message if coming from add bank */}
        {fromPage === "add-bank" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-2">
            <p className="text-sm text-amber-800">
              {t("pin.setFirstMessage")}
            </p>
          </div>
        )}

        {/* TAC Request Section */}
        <div className="bg-white rounded-lg border border-zinc-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm text-zinc-700">
              {maskedPhone || t("pin.phoneNumber")}
            </span>
          </div>

          {/* TAC Code Input with Request Button */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={t("pin.enterTac")}
              value={tacCode}
              onChange={(e) => setTacCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
              className="flex-1 px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-primary text-zinc-800 text-sm placeholder:text-zinc-400"
            />
            <button
              onClick={handleRequestTac}
              disabled={resetPinTac.isPending || (tacExpiresIn !== null && tacExpiresIn > 0)}
              className="px-4 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
            >
              {resetPinTac.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : tacExpiresIn !== null && tacExpiresIn > 0 ? (
                formatTime(tacExpiresIn)
              ) : (
                t("pin.requestTac")
              )}
            </button>
          </div>

          {tacRequested && resetPinTac.isSuccess && (
            <p className="text-xs text-green-600 mt-2">
              {t("pin.tacSent")}
            </p>
          )}
          {resetPinTac.isError && (
            <p className="text-xs text-red-500 mt-2">
              {resetPinTac.error?.message || t("pin.tacRequestFailed")}
            </p>
          )}
        </div>

        {/* Enter PIN */}
        <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
          <KeyRound className="w-5 h-5 text-primary shrink-0" />
          <input
            type={showPin ? "text" : "password"}
            placeholder={t("pin.enterPin")}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={6}
            className="flex-1 focus:outline-none text-zinc-800 text-sm placeholder:text-zinc-400"
          />
          <button
            onClick={() => setShowPin(!showPin)}
            className="text-zinc-400 hover:text-zinc-600"
          >
            {showPin ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm PIN */}
        <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
          <KeyRound className="w-5 h-5 text-primary shrink-0" />
          <input
            type={showConfirmPin ? "text" : "password"}
            placeholder={t("pin.confirmPin")}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={6}
            className="flex-1 focus:outline-none text-zinc-800 text-sm placeholder:text-zinc-400"
          />
          <button
            onClick={() => setShowConfirmPin(!showConfirmPin)}
            className="text-zinc-400 hover:text-zinc-600"
          >
            {showConfirmPin ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* PIN mismatch warning */}
        {confirmPin && pin !== confirmPin && (
          <p className="text-xs text-red-500 px-1">
            {t("pin.mismatch")}
          </p>
        )}

        {/* PIN requirements */}
        <div className="bg-zinc-50 rounded-lg p-4">
          <p className="text-xs text-zinc-500">
            {t("pin.requirements")}
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!isFormValid || resetPin.isPending}
          className={cn(
            "w-full py-4 text-white font-roboto-bold text-base rounded-full transition-colors mt-4 flex items-center justify-center gap-2",
            isFormValid && !resetPin.isPending
              ? "bg-primary hover:bg-primary/90"
              : "bg-zinc-300 cursor-not-allowed"
          )}
        >
          {resetPin.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          {t("common.confirm")}
        </button>

        {resetPin.isError && (
          <p className="text-red-500 text-sm text-center">
            {resetPin.error?.message || t("pin.resetFailed")}
          </p>
        )}
      </main>
    </div>
  );
}
