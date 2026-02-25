"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useResetPinTac, useResetPin } from "@/hooks/use-bank";
import { authApi } from "@/lib/api";
import type { MessageSelectionOption } from "@/lib/api/types";

export default function ResetPinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

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
  const [, setTacRequested] = useState(false);

  // Send To dropdown state
  const [sendTo, setSendTo] = useState<string>("");
  const [sendToOptions, setSendToOptions] = useState<{ value: string; label: string }[]>([]);
  const [isSendToDropdownOpen, setIsSendToDropdownOpen] = useState(false);
  const sendToDropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Fetch message selection options on mount
  useEffect(() => {
    const fetchMessageOptions = async () => {
      try {
        const response = await authApi.getMessageSelection();
        if (response.Code === 200 && response.Data && response.Data.length > 0) {
          const options = response.Data
            .filter((opt: MessageSelectionOption) => opt.Value !== "Select")
            .map((opt: MessageSelectionOption) => ({
              value: opt.Value,
              label: opt.Text,
            }));
          setSendToOptions(options);
        }
      } catch (error) {
        console.error("Failed to fetch message options:", error);
      }
    };

    fetchMessageOptions();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isSendToDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sendToDropdownRef.current &&
        !sendToDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSendToDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSendToDropdownOpen]);

  const handleRequestTac = async () => {
    if (!sendTo) {
      showError(t("auth.selectOtpMethod"));
      return;
    }

    try {
      const response = await resetPinTac.mutateAsync(sendTo);
      setTacRequested(true);
      setTacExpiresIn(response.ExpiresIn || 300); // Default 5 minutes
      showSuccess(t("pin.tacSent"));
    } catch (err) {
      showError(err instanceof Error ? err.message : t("pin.tacRequestFailed"));
    }
  };

  const handleConfirm = async () => {
    if (!tacCode || !pin || !confirmPin) {
      showError(t("common.fillAllFields"));
      return;
    }

    if (pin !== confirmPin) {
      showError(t("pin.mismatch"));
      return;
    }

    if (pin.length !== 6) {
      showError(t("pin.requirements"));
      return;
    }

    try {
      await resetPin.mutateAsync({
        Pin: pin,
        Tac: tacCode,
      });

      showSuccess(t("pin.resetSuccess") || t("common.success"));
      // Clear all fields and TAC state
      setTacCode("");
      setPin("");
      setConfirmPin("");
      setSendTo("");
      setTacExpiresIn(null);
      setTacRequested(false);
      // Redirect back to add bank page or account page
      if (fromPage === "add-bank") {
        router.replace("/account/bank/add");
      } else {
        router.replace("/account");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : t("pin.resetFailed"));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isFormValid =
    tacCode && pin && confirmPin && pin === confirmPin && pin.length === 6;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {/* Send To Dropdown */}
        <div className="relative w-full" ref={sendToDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSendToDropdownOpen((prev) => !prev)}
            className={`cursor-pointer form-input-wrapper relative flex w-full items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none ${
              isSendToDropdownOpen
                ? "border-[#0DC3B1] bg-[rgba(0,214,198,0.1)] shadow-[0_0_20px_rgba(20,187,176,0.2)]"
                : "border-[#959595] bg-white"
            }`}
            aria-haspopup="listbox"
            aria-expanded={isSendToDropdownOpen}
          >
            <span className="flex items-center gap-3">
              <Image
                src="/images/icon/otp_icon.png"
                alt="Send to"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
              <span
                className={`text-sm font-roboto-regular ${
                  sendTo ? "text-zinc-900" : "text-[#959595]"
                }`}
              >
                {sendTo
                  ? sendToOptions.find((opt) => opt.value === sendTo)?.label || sendTo
                  : t("auth.sendTo")}
              </span>
            </span>
            <ChevronDown
              className={`w-5 h-6 text-zinc-400 ${
                isSendToDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSendToDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 rounded-lg border border-[#959595] bg-white shadow-lg z-20 py-2 flex flex-col gap-2">
              {sendToOptions.map((option) => {
                const isSelected = sendTo === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className="w-full px-2 text-left group cursor-pointer"
                    onClick={() => {
                      setSendTo(option.value);
                      setIsSendToDropdownOpen(false);
                    }}
                  >
                    <span
                      className={`block rounded-lg px-3 py-2 text-sm font-roboto-regular transition-colors ${
                        isSelected
                          ? "border border-[#1ECAD3] bg-[#DDF7F7] text-[#008D92]"
                          : "text-zinc-900 group-hover:bg-zinc-100"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* OTP Code Input with Request Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <FormInput
              type="text"
              placeholder={t("pin.otpCode")}
              value={tacCode}
              onChange={(e) =>
                setTacCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              maxLength={6}
              prefix={
                <Image
                  src="/images/icon/otp_icon.png"
                  alt="OTP"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              }
            />
          </div>
          <button
            type="button"
            onClick={handleRequestTac}
            disabled={
              resetPinTac.isPending ||
              (tacExpiresIn !== null && tacExpiresIn > 0)
            }
            className="cursor-pointer px-4 py-3.5 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
          >
            {resetPinTac.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : tacExpiresIn !== null && tacExpiresIn > 0 ? (
              formatTime(tacExpiresIn)
            ) : (
              t("pin.requestOtp")
            )}
          </button>
        </div>

        {/* Enter PIN */}
        <FormInput
          type={showPin ? "text" : "password"}
          placeholder={t("pin.enterPin")}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
          maxLength={6}
          prefix={
            <Image
              src="/images/icon/reset_pin_icon.png"
              alt="PIN"
              width={24}
              height={24}
              unoptimized
              className="h-6 w-auto object-contain"
            />
          }
          suffix={
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              {showPin ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Confirm PIN */}
        <FormInput
          type={showConfirmPin ? "text" : "password"}
          placeholder={t("pin.confirmPin")}
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ""))}
          maxLength={6}
          prefix={
            <Image
              src="/images/icon/reset_pin_icon.png"
              alt="Confirm PIN"
              width={24}
              height={24}
              unoptimized
              className="h-6 w-auto object-contain"
            />
          }
          suffix={
            <button
              type="button"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPin ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Confirm Button - Same style as change username page */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isFormValid || resetPin.isPending}
          className="mt-6 cursor-pointer uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {resetPin.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("common.loading")}
            </>
          ) : (
            t("common.confirm")
          )}
        </button>
      </main>
    </div>
  );
}
