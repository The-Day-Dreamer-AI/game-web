"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  EyeOff,
  Eye,
  Loader2,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { useI18n } from "@/providers/i18n-provider";
import Image from "next/image";

type SendToOption = "SMS" | "WhatsApp";

interface ForgotPasswordFormData {
  username: string;
  phoneNumber: string;
  otpCode: string;
  newPassword: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [sendTo, setSendTo] = useState<SendToOption | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendToDropdownOpen, setIsSendToDropdownOpen] = useState(false);
  const sendToDropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      username: "",
      phoneNumber: "",
      otpCode: "",
      newPassword: "",
    },
  });

  const usernameValue = watch("username");
  const phoneValue = watch("phoneNumber");
  const sendToOptions: Array<{ value: SendToOption; label: string }> = [
    { value: "SMS", label: t("auth.sms") },
    { value: "WhatsApp", label: t("auth.whatsapp") },
  ];

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

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

  // Handle OTP request
  const handleRequestOTP = useCallback(async () => {
    // Validate username
    if (!usernameValue || usernameValue.trim().length < 1) {
      setError("username", { message: t("auth.usernameRequired") });
      return;
    }

    // Validate phone number
    if (!phoneValue || phoneValue.trim().length < 10) {
      setError("phoneNumber", { message: t("auth.phoneMinLength") });
      return;
    }

    // Validate send to option
    if (!sendTo) {
      setError("root", {
        message: t("auth.selectOtpMethod"),
      });
      return;
    }

    clearErrors("root");
    setIsRequestingOtp(true);

    try {
      const result = await authApi.forgotPasswordGetTac({
        Username: usernameValue.trim(),
        Phone: phoneValue.trim(),
        Option: sendTo,
      });

      if (result.Code === 0) {
        setOtpSent(true);
        setOtpCountdown(result.ExpiresIn || 300);
      } else {
        setError("root", { message: result.Message || t("auth.otpSendFailed") });
      }
    } catch {
      setError("root", { message: t("auth.otpSendFailed") });
    } finally {
      setIsRequestingOtp(false);
    }
  }, [usernameValue, phoneValue, sendTo, setError, clearErrors, t]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Validate OTP was requested and code is entered
    if (!otpSent) {
      setError("root", { message: t("auth.requestOtpFirst") });
      return;
    }

    if (!data.otpCode || data.otpCode.trim().length < 4) {
      setError("otpCode", { message: t("auth.otpInvalid") });
      return;
    }

    setIsLoading(true);

    try {
      const result = await authApi.forgotPassword({
        Username: data.username.trim(),
        Phone: data.phoneNumber.trim(),
        Tac: data.otpCode.trim(),
        Password: data.newPassword,
      });

      if (result.Code === 0) {
        // Password reset successful - redirect to login
        alert(t("auth.resetSuccess"));
        router.push("/login");
      } else {
        setError("root", {
          message: result.Message || t("auth.resetFailed"),
        });
      }
    } catch {
      setError("root", {
        message: t("auth.resetFailed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canRequestOtp =
    usernameValue &&
    usernameValue.trim().length > 0 &&
    phoneValue &&
    phoneValue.trim().length >= 10 &&
    sendTo &&
    otpCountdown === 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("auth.forgotPassword")} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* Username */}
          <FormInput
            {...register("username", { required: t("auth.usernameRequired") })}
            type="text"
            placeholder={t("auth.uid")}
            prefix={
              <Image
                src="/images/icon/uuid_icon.png"
                alt="AON1E uid"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            error={errors.username?.message}
          />

          {/* Phone Number */}
          <FormInput
            {...register("phoneNumber", {
              required: t("auth.phoneRequired"),
              minLength: {
                value: 10,
                message: t("auth.phoneMinLength"),
              },
            })}
            type="tel"
            placeholder={t("auth.phone")}
            prefix={
              <Image
                src="/images/icon/phone_icon.png"
                alt="AON1E phone"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            error={errors.phoneNumber?.message}
          />

          {/* Send to Dropdown */}
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
                  alt="AON1E otp"
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
                    ? sendTo === "WhatsApp"
                      ? t("auth.whatsapp")
                      : t("auth.sms")
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

          {/* OTP Code */}
          <div className="flex gap-2">
            <FormInput
              {...register("otpCode", {
                required: otpSent ? t("auth.otpRequired") : false,
              })}
              type="text"
              placeholder={t("auth.otpCode")}
              maxLength={6}
              prefix={
                <Image
                  src="/images/icon/otp_icon.png"
                  alt="AON1E otp"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              }
              error={errors.otpCode?.message}
              wrapperClassName="flex-1"
            />
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={!canRequestOtp || isRequestingOtp}
              className="px-4 py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {isRequestingOtp ? (
                <Loader2 className="w-auto h-6 animate-spin" />
              ) : otpCountdown > 0 ? (
                `${t("auth.resendOtp")} (${otpCountdown}s)`
              ) : otpSent ? (
                t("auth.resendOtp")
              ) : (
                t("auth.requestOtp")
              )}
            </button>
          </div>
          {otpSent && otpCountdown > 0 && (
            <p className="text-xs text-green-600 ml-1">
              {t("auth.otpSentSuccess")}
            </p>
          )}

          {/* New Password */}
          <FormInput
            {...register("newPassword", {
              required: t("auth.passwordRequired"),
              minLength: {
                value: 6,
                message: t("auth.passwordMinLength"),
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.newPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="AON1E lock"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? (
                  <EyeOff className="w-auto h-6" />
                ) : (
                  <Eye className="w-auto h-6" />
                )}
              </button>
            }
            error={errors.newPassword?.message}
          />

          {/* Error Message */}
          {errors.root && (
            <p className="text-sm text-red-500 text-center">
              {errors.root.message}
            </p>
          )}

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 text-base w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-auto h-6 animate-spin" />
                {t("auth.processing")}
              </>
            ) : (
              t("common.confirm").toUpperCase()
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
