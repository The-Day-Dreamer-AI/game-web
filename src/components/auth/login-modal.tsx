"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { FormInput } from "@/components/ui/form-input";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const result = await login(data);
    setIsLoading(false);

    if (result.success) {
      reset();
      onClose();
    } else {
      setError("root", { message: result.error || t("auth.loginFailed") });
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-88 px-6 py-10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#DBDBDB] cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-9">
          <Image
            src="/images/title.png"
            alt="AON1E"
            width={120}
            height={48}
            unoptimized
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Username */}
          <FormInput
            {...register("username")}
            type="text"
            placeholder={t("auth.username")}
            prefix={
              <Image
                src="/images/icon/user_icon.png"
                alt="Username"
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
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="AON1E password"
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
                className="text-[#959595]"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
            error={errors.password?.message}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
              />
              <span className="text-[#5F7182] text-xs font-roboto-regular">{t("auth.rememberMe")}</span>
            </label>
            <Link
              href="/forgot-password"
              onClick={onClose}
              className="text-primary hover:underline text-xs font-roboto-regular"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          {/* Error Message */}
          {errors.root && (
            <p className="text-sm text-red-500 text-center">
              {errors.root.message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer mt-3 w-full py-3 bg-primary text-white text-base font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("auth.signingIn") : t("auth.login").toUpperCase()}
          </button>

          {/* Register Link */}
          <p className="text-center text-xs text-[#5F7182] font-roboto-regular">
            {t("auth.noAccount")}{" "}
            <Link
              href="/register"
              onClick={onClose}
              className="text-primary hover:underline font-roboto-regular"
            >
              {t("auth.registerHere")}
            </Link>
          </p>

          <p className="h-[2px] w-full bg-[#f4f4f4]"></p>

          {/* Support Notice */}
          <p className="text-xs text-center text-[#959595] mt-4 font-roboto-regular">
            {t("auth.supportNotice")}
          </p>
        </form>
      </div>
    </div>
  );
}
