"use client";

import { useState, useEffect, useCallback, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { useRegister } from "@/hooks/use-register";
import { authApi, ApiError } from "@/lib/api";
import { FormInput } from "@/components/ui/form-input";

interface RegisterFormData {
  referralCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const DEFAULT_REFERRAL_CODE = process.env.NEXT_DEFAULT_REFERRAL_CODE;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { showError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isValidatingUpline, setIsValidatingUpline] = useState(false);
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      referralCode: "",
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // Handle referral code from URL params (e.g., from QR scanner or redirect)
  useEffect(() => {
    // Check for UplineId first (from /Home/Qr redirect or /Player/Register)
    const uplineId = searchParams.get("UplineId");
    if (uplineId) {
      setValue("referralCode", uplineId);
      return;
    }
    // Fallback to referralCode param
    const referralCodeFromUrl = searchParams.get("referralCode");
    if (referralCodeFromUrl) {
      setValue("referralCode", referralCodeFromUrl);
    }
  }, [searchParams, setValue]);

  // Extract referral code from QR data URL
  const extractReferralCodeFromQr = useCallback((data: string): string | null => {
    try {
      const url = new URL(data);
      // Check for Id or UplineId parameters
      const id = url.searchParams.get("Id") || url.searchParams.get("UplineId");
      if (id) {
        return id;
      }
      return null;
    } catch {
      // Not a valid URL
      return null;
    }
  }, []);

  // Handle QR image file upload
  const handleQrImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        const referralCode = extractReferralCodeFromQr(result.data);

        if (referralCode) {
          clearErrors("referralCode");
          setValue("referralCode", referralCode);
        } else {
          setError("referralCode", {
            message: t("auth.invalidQrCode"),
          });
        }
      } catch {
        setError("referralCode", {
          message: t("auth.qrScanFailed"),
        });
      }

      // Reset the input so the same file can be selected again
      if (qrFileInputRef.current) {
        qrFileInputRef.current.value = "";
      }
    },
    [setValue, setError, clearErrors, extractReferralCodeFromQr, t]
  );

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) {
      showError(t("auth.agreeTermsRequired"));
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: t("auth.passwordsNoMatch") });
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
        uplineValue = DEFAULT_REFERRAL_CODE || "";
      }

      // Proceed with registration using the new API
      const result = await registerMutation.mutateAsync({
        UplineReferralCode: uplineValue,
        Username: data.username,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
        Name: data.fullName,
      });

      if (result.Code === 0) {
        // Registration successful - redirect to login
        router.push("/login");
      } else {
        showError(result.Message || t("auth.registrationFailed"));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showError(error.message || t("auth.registrationFailed"));
      } else {
        showError(t("auth.registrationFailed"));
      }
    }
  };

  const isSubmitting = isValidatingUpline || registerMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col relative">

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Welcome Banner */}
        <Image
          src="/images/welcome_banner.png"
          alt="register banner"
          width={32}
          height={32}
          className="w-full object-fill h-auto max-h-40"
          unoptimized
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* Referral Code */}
          <div>
            <FormInput
              {...register("referralCode", {
                onChange: () => clearErrors("referralCode"),
              })}
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
                  {/* Hidden file input for QR image upload */}
                  <input
                    ref={qrFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current?.click()}
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <Image
                      src="/images/icon/folder_icon.png"
                      alt="AON1E folder"
                      width={24}
                      height={24}
                      unoptimized
                      className="h-6 w-auto object-contain cursor-pointer"
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
                      className="h-6 w-auto object-contain cursor-pointer"
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
              className="cursor-pointer text-primary hover:underline font-roboto-regular text-sm"
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
