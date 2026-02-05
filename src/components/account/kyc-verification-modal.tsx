"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { useToast } from "@/providers/toast-provider";
import { useI18n } from "@/providers/i18n-provider";
import { userApi, authApi, ApiError } from "@/lib/api";
import type { MessageSelectionOption } from "@/lib/api/types";

interface SendToOption {
  value: string;
  label: string;
}

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface KycFormData {
  phoneNumber: string;
  otpCode: string;
}

export function KycVerificationModal({
  isOpen,
  onClose,
  userId,
}: KycVerificationModalProps) {
  const { t } = useI18n();
  const { showError, showSuccess } = useToast();
  const [sendTo, setSendTo] = useState("");
  const [sendToOptions, setSendToOptions] = useState<SendToOption[]>([]);
  const [isSendToDropdownOpen, setIsSendToDropdownOpen] = useState(false);
  const sendToDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    reset,
  } = useForm<KycFormData>({
    defaultValues: {
      phoneNumber: "",
      otpCode: "",
    },
  });

  const phoneValue = watch("phoneNumber");

  // Fetch message selection options on mount
  useEffect(() => {
    if (!isOpen) return;

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
          if (options.length > 0) {
            setSendToOptions(options);
          }
        }
      } catch (error) {
        console.error("Failed to fetch message options:", error);
      }
    };

    fetchMessageOptions();
  }, [isOpen]);

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Close the send-to dropdown when clicking outside
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

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSendTo("");
      setOtpSent(false);
      setOtpCountdown(0);
      setIsSendToDropdownOpen(false);
      reset();
    }
  }, [isOpen, reset]);

  // Handle OTP request (Submit KYC - step 1)
  const handleRequestOTP = useCallback(async () => {
    if (!phoneValue || phoneValue.trim().length < 10) {
      setError("phoneNumber", { message: t("auth.phoneMinLength") });
      return;
    }

    if (!sendTo) {
      showError(t("auth.selectOtpMethod"));
      return;
    }

    setIsRequestingOtp(true);

    try {
      const result = await userApi.kycSubmit({
        UserId: userId,
        Phone: phoneValue.trim(),
        Option: sendTo,
      });

      if (result.Code === 0) {
        clearErrors("otpCode");
        setOtpSent(true);
        setOtpCountdown(result.ExpiresIn || 300);
        showSuccess(t("auth.otpSentSuccess"));
      } else if (result.ExpiresIn && result.ExpiresIn > 0) {
        clearErrors("otpCode");
        setOtpSent(true);
        setOtpCountdown(result.ExpiresIn);
        showError(t("auth.otpAlreadySent"));
      } else {
        showError(result.Message || t("auth.otpSendFailed"));
      }
    } catch (error) {
      if (error instanceof ApiError && error.data?.ExpiresIn) {
        const expiresIn = error.data.ExpiresIn as number;
        if (expiresIn > 0) {
          clearErrors("otpCode");
          setOtpSent(true);
          setOtpCountdown(expiresIn);
          showError(t("auth.otpAlreadySent"));
          return;
        }
      }
      showError(error instanceof ApiError ? error.message : t("auth.otpSendFailed"));
    } finally {
      setIsRequestingOtp(false);
    }
  }, [phoneValue, sendTo, userId, setError, clearErrors, t, showSuccess, showError]);

  // Handle form submit (Verify OTP - step 2)
  const onSubmit = async (data: KycFormData) => {
    if (!otpSent) {
      showError(t("auth.requestOtpFirst"));
      return;
    }

    if (!data.otpCode || data.otpCode.trim().length < 4) {
      setError("otpCode", { message: t("auth.otpInvalid") });
      return;
    }

    setIsLoading(true);

    try {
      const result = await userApi.kycVerify({
        UserId: userId,
        Phone: data.phoneNumber.trim(),
        Tac: data.otpCode.trim(),
      });

      if (result.Code === 0) {
        showSuccess(result.Message || "KYC verified successfully!");
        onClose();
      } else {
        showError(result.Message || "KYC verification failed.");
      }
    } catch (error) {
      showError(error instanceof ApiError ? error.message : "KYC verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const canRequestOtp =
    phoneValue &&
    phoneValue.trim().length >= 10 &&
    sendTo &&
    otpCountdown === 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm max-[380px]:p-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Title */}
        <div className="text-base font-roboto-bold text-[#28323C] mb-6">
          {t("account.kyc")}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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

          {/* Send to Dropdown - matching register page style */}
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
              className="h-fit cursor-pointer px-4 py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
            >
              {isRequestingOtp ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : otpCountdown > 0 ? (
                `${t("auth.resendOtp")} (${otpCountdown}s)`
              ) : otpSent ? (
                t("auth.resendOtp")
              ) : (
                t("auth.requestOtp")
              )}
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer mt-3 w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                PROCESSING...
              </>
            ) : (
              "CONFIRM"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
