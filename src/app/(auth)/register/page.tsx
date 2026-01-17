"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown, Loader2 } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { useRegister } from "@/hooks/use-register";
import { authApi } from "@/lib/api";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";

interface RegisterFormData {
  referralCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  otpCode: string;
}

type SendToOption = "SMS" | "WhatsApp";

const DEFAULT_REFERRAL_CODE = "196B48";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sendTo, setSendTo] = useState<SendToOption | "">("");
  const [isValidatingUpline, setIsValidatingUpline] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isSendToDropdownOpen, setIsSendToDropdownOpen] = useState(false);
  const sendToDropdownRef = useRef<HTMLDivElement | null>(null);

  // API hooks
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    clearErrors,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      referralCode: "",
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      otpCode: "",
    },
  });

  // Handle referral code from URL params (e.g., from QR scanner)
  useEffect(() => {
    const referralCodeFromUrl = searchParams.get("referralCode");
    if (referralCodeFromUrl) {
      setValue("referralCode", referralCodeFromUrl);
    }
  }, [searchParams, setValue]);

  const phoneValue = watch("phone");
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

  // Handle OTP request
  const handleRequestOTP = useCallback(async () => {
    // Validate phone number
    if (!phoneValue || phoneValue.trim().length < 10) {
      setError("phone", { message: t("auth.phoneMinLength") });
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
      const result = await authApi.registerGetTac({
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
  }, [phoneValue, sendTo, setError, clearErrors, t]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) {
      setError("root", { message: t("auth.agreeTermsRequired") });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: t("auth.passwordsNoMatch") });
      return;
    }

    // Validate OTP was requested and code is entered
    if (!otpSent) {
      setError("root", { message: t("auth.requestOtpFirst") });
      return;
    }

    if (!data.otpCode || data.otpCode.trim().length < 4) {
      setError("otpCode", { message: t("auth.otpInvalid") });
      return;
    }

    try {
      let uplineValue = data.referralCode?.trim() || "";

      // If referral code is provided, verify it
      if (uplineValue) {
        setIsValidatingUpline(true);

        try {
          const uplineResult = await authApi.getUpline(uplineValue);

          if (uplineResult.Code !== 0) {
            setError("referralCode", {
              message: uplineResult.Message || t("auth.referralInvalid"),
            });
            setIsValidatingUpline(false);
            return;
          }

          // Use the validated ReferralCode from the response
          uplineValue = uplineResult.ReferralCode;
        } catch {
          setError("referralCode", {
            message: t("auth.referralVerifyFailed"),
          });
          setIsValidatingUpline(false);
          return;
        }

        setIsValidatingUpline(false);
      } else {
        // No referral code provided, use default
        uplineValue = DEFAULT_REFERRAL_CODE;
      }

      // Proceed with registration using the upline value
      const result = await registerMutation.mutateAsync({
        Name: data.fullName,
        Password: data.password,
        Phone: data.phone,
        Tac: data.otpCode,
        UplineReferralCode: uplineValue,
        Username: data.username,
      });

      if (result.Code === 0) {
        // Registration successful - redirect to login
        router.push("/login");
      } else {
        setError("root", { message: result.Message || t("auth.registrationFailed") });
      }
    } catch {
      setError("root", { message: t("auth.registrationFailed") });
    }
  };

  const isSubmitting = isValidatingUpline || registerMutation.isPending;
  const canRequestOtp =
    phoneValue &&
    phoneValue.trim().length >= 10 &&
    sendTo &&
    otpCountdown === 0;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <Header variant="subpage" title={t("auth.register")} backHref="/" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Welcome Banner */}
        <Image
          src="/images/welcome_banner.png"
          alt="register banner"
          width={32}
          height={32}
          className="h-auto w-full object-fill"
          unoptimized
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* Referral Code */}
          <div>
            <FormInput
              {...register("referralCode")}
              type="text"
              placeholder={t("auth.referralCode")}
              prefix={
                <Image
                  src="/images/icon/referral_icon.png"
                  alt="AON1E referral"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              }
              suffix={
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <Image
                      src="/images/icon/folder_icon.png"
                      alt="AON1E folder"
                      width={24}
                      height={24}
                      unoptimized
                      className="h-6 w-auto object-contain"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/register/scan-qr?returnTo=/register")}
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <Image
                      src="/images/icon/camera_icon.png"
                      alt="AON1E camera"
                      width={24}
                      height={24}
                      unoptimized
                      className="h-6 w-auto object-contain"
                    />
                  </button>
                </div>
              }
              error={errors.referralCode?.message}
            />
            {!errors.referralCode && (
              <p className="text-xs text-[#5F7182] mt-1 mx-2">
                {t("auth.referralCodeNote")}
              </p>
            )}
          </div>

          {/* Username */}
          <FormInput
            {...register("username", { required: t("auth.usernameRequired") })}
            type="text"
            placeholder={t("auth.uid")}
            prefix={
              <Image
                src="/images/icon/uuid_icon.png"
                alt="AON1E uuid"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            error={errors.username?.message}
          />

          {/* Password */}
          <FormInput
            {...register("password", {
              required: t("auth.passwordRequired"),
              minLength: {
                value: 6,
                message: t("auth.passwordMinLength"),
              },
            })}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
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
                className="text-zinc-400 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-6" />
                ) : (
                  <Eye className="w-5 h-6" />
                )}
              </button>
            }
            error={errors.password?.message}
          />

          {/* Confirm Password */}
          <FormInput
            {...register("confirmPassword", {
              required: t("auth.confirmPasswordRequired"),
            })}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.confirmPassword")}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-zinc-400 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-6" />
                ) : (
                  <Eye className="w-5 h-6" />
                )}
              </button>
            }
            error={errors.confirmPassword?.message}
          />

          {/* Full Name */}
          <FormInput
            {...register("fullName", { required: t("auth.fullNameRequired") })}
            type="text"
            placeholder={t("auth.fullName")}
            prefix={
              <Image
                src="/images/icon/user_icon.png"
                alt="AON1E user"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            error={errors.fullName?.message}
          />

          {/* Phone Number */}
          <FormInput
            {...register("phone", {
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
            error={errors.phone?.message}
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
          {otpSent && otpCountdown > 0 && (
            <p className="text-xs text-green-600 ml-1">
              {t("auth.otpSentSuccess")}
            </p>
          )}

          {/* Terms & Conditions */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-[#5F7182] font-roboto-regular">
              {t("auth.termsAgree")}{" "}
              <Link href="/terms" className="text-primary hover:underline text-sm font-roboto-regular">
                {t("auth.termsConditions")}
              </Link>
            </span>
          </label>

          {/* Error Message */}
          {errors.root && (
            <p className="text-sm text-red-500 text-center">
              {errors.root.message}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer mt-6 text-base w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {isValidatingUpline
                  ? t("auth.verifyingReferral")
                  : t("auth.creatingAccount")}
              </>
            ) : (
              t("auth.register").toUpperCase()
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-[#5F7182] pb-4 font-roboto-regular">
            {t("auth.haveAccount")}{" "}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-primary hover:underline font-roboto-regular text-sm"
            >
              {t("auth.loginHere")}
            </button>
          </p>
        </form>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
