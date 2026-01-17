"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { useChangePasswordGetTac, useChangePassword } from "@/hooks";

type SendToOption = "sms" | "email";

const sendToOptions: { value: SendToOption; labelKey: string }[] = [
  { value: "sms", labelKey: "profile.sendToSms" },
  { value: "email", labelKey: "profile.sendToEmail" },
];

export default function ChangePasswordPage() {
  const router = useRouter();
  const { t } = useI18n();

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendTo, setSendTo] = useState<SendToOption>("sms");
  const [showSendToDropdown, setShowSendToDropdown] = useState(false);
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
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // API hooks
  const getTacMutation = useChangePasswordGetTac();
  const changePasswordMutation = useChangePassword();

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOtp = async () => {
    setError("");
    setFieldErrors({});

    try {
      const result = await getTacMutation.mutateAsync();
      if (result.Code === 0) {
        setOtpSent(true);
        setCountdown(result.ExpiresIn || 60);
      } else {
        setError(result.Message || t("common.error"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      setError(t("auth.requestOtpFirst"));
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
        // Success - navigate back to profile
        router.push("/account/profile");
      } else {
        setError(result.Message || t("common.error"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    }
  };

  const selectedSendToOption = sendToOptions.find((opt) => opt.value === sendTo);
  const canRequestOtp = countdown === 0;
  const isSubmitting = changePasswordMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("profile.changePassword")}
        backHref="/account/profile"
      />

      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number Input */}
          <FormInput
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t("profile.phoneNumber")}
            prefix={
              <Image
                src="/images/icon/phone_icon.png"
                alt="Phone"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
          />

          {/* Send To Dropdown */}
          <div className="relative">
            <div className="form-input-wrapper relative flex items-center w-full rounded-lg border border-[#959595] bg-white transition-all duration-200">
              <div className="flex items-center justify-center pl-4 text-zinc-400">
                <Image
                  src="/images/icon/otp_icon.png"
                  alt="Send To"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSendToDropdown(!showSendToDropdown)}
                className="flex-1 w-full py-3.5 pl-3 pr-4 bg-transparent text-left flex items-center justify-between focus:outline-none"
              >
                <span className={selectedSendToOption ? "text-black text-sm font-roboto-regular" : "text-[#959595] text-sm font-roboto-regular"}>
                  {selectedSendToOption ? t(selectedSendToOption.labelKey) : t("profile.sendTo")}
                </span>
                <ChevronDown
                  className={cn(
                    "w-auto h-6 text-zinc-400 transition-transform",
                    showSendToDropdown && "rotate-180"
                  )}
                />
              </button>
            </div>
            {showSendToDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {sendToOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSendTo(option.value);
                      setShowSendToDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-zinc-50",
                      sendTo === option.value ? "text-primary bg-zinc-50" : "text-zinc-700"
                    )}
                  >
                    {t(option.labelKey)}
                  </button>
                ))}
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
          {otpSent && countdown > 0 && (
            <p className="text-xs text-green-600 ml-1">
              {t("auth.otpSentSuccess")}
            </p>
          )}

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

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

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
