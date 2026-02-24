"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useChangePasswordGetTac, useChangePassword } from "@/hooks";
import { authApi } from "@/lib/api";
import type { MessageSelectionOption } from "@/lib/api/types";

export default function ChangePasswordPage() {
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();

  // Form state
  const [sendTo, setSendTo] = useState<string>("");
  const [sendToOptions, setSendToOptions] = useState<{ value: string; label: string }[]>([]);
  const [isSendToDropdownOpen, setIsSendToDropdownOpen] = useState(false);
  const sendToDropdownRef = useRef<HTMLDivElement | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP countdown state
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  // Error state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // API hooks
  const getTacMutation = useChangePasswordGetTac();
  const changePasswordMutation = useChangePassword();

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

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

  const handleRequestOtp = async () => {
    setFieldErrors({});

    if (!sendTo) {
      showError(t("auth.selectOtpMethod"));
      return;
    }

    try {
      const result = await getTacMutation.mutateAsync(sendTo);
      if (result.Code === 0) {
        setOtpSent(true);
        setCountdown(result.ExpiresIn || 60);
        showSuccess(t("auth.otpSentSuccess"));
      } else {
        showError(result.Message || t("common.error"));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("common.error");
      showError(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = t("profile.oldPasswordRequired");
    }

    if (!newPassword.trim()) {
      errors.newPassword = t("profile.newPasswordRequired");
    } else if (newPassword.length < 6) {
      errors.newPassword = t("auth.passwordMinLength");
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = t("profile.confirmPasswordRequired");
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = t("auth.passwordsNoMatch");
    }

    if (!otpSent) {
      showError(t("auth.requestOtpFirst"));
      return;
    }

    if (!otpCode.trim()) {
      errors.otpCode = t("auth.otpRequired");
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await changePasswordMutation.mutateAsync({
        OldPassword: oldPassword,
        NewPassword: newPassword,
        Tac: otpCode,
      });

      if (result.Code === 0) {
        showSuccess(t("profile.passwordChanged"));
        // Clear all fields and TAC state
        setSendTo("");
        setOtpCode("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setCountdown(0);
        setOtpSent(false);
        setFieldErrors({});
      } else {
        showError(result.Message || t("common.error"));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("common.error");
      showError(errorMessage);
    }
  };

  const canRequestOtp = countdown === 0;
  const isSubmitting = changePasswordMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  alt="Send To"
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
          <div className="flex gap-2">
            <FormInput
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder={t("profile.otpCode")}
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
              wrapperClassName="flex-1"
              error={fieldErrors.otpCode}
            />
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={!canRequestOtp || getTacMutation.isPending}
              className="cursor-pointer px-4 py-3.5 bg-primary text-white text-sm font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[100px]"
            >
              {getTacMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : countdown > 0 ? (
                `${countdown}s`
              ) : otpSent ? (
                t("auth.resendOtp")
              ) : (
                t("profile.requestOtp")
              )}
            </button>
          </div>

          {/* Old Password Input */}
          <FormInput
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t("profile.oldPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showOldPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
            error={fieldErrors.oldPassword}
          />

          {/* New Password Input */}
          <FormInput
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("profile.newPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showNewPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
            error={fieldErrors.newPassword}
          />

          {/* Confirm New Password Input */}
          <FormInput
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("profile.confirmNewPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showConfirmPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
            error={fieldErrors.confirmPassword}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.confirm")
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
