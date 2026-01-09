"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Headphones,
  Menu,
  Users,
  CreditCard,
  Lock,
  User,
  Phone,
  Mail,
  Wallet,
  ChevronDown,
  FolderOpen,
  Camera,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { LoginModal } from "@/components/auth/login-modal";
import { useRegister } from "@/hooks/use-register";
import { authApi } from "@/lib/api";

interface RegisterFormData {
  referralCode: string;
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  email: string;
  otpCode: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [sendToId, setSendToId] = useState("");
  const [isValidatingUpline, setIsValidatingUpline] = useState(false);

  // API hooks
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: {
      referralCode: "",
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      email: "",
      otpCode: "",
    },
  });

  // Placeholder for OTP request - disabled for now
  const handleRequestOTP = () => {
    // TODO: Implement when API is available
    console.log("OTP request - API not available yet");
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) {
      setError("root", { message: "Please agree to the Terms & Conditions" });
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords don't match" });
      return;
    }

    try {
      let uplineValue = data.referralCode?.trim() || "";

      // If NO referral code provided, call GetUpline API to generate one using username
      if (!uplineValue) {
        setIsValidatingUpline(true);

        try {
          const uplineResult = await authApi.getUpline(data.username);

          if (uplineResult.Code !== 0) {
            setError("root", {
              message: uplineResult.Message || "Failed to generate referral code",
            });
            setIsValidatingUpline(false);
            return;
          }

          // Use the generated ReferralCode from the response
          uplineValue = uplineResult.ReferralCode;
        } catch {
          setError("root", {
            message: "Failed to generate referral code. Please try again.",
          });
          setIsValidatingUpline(false);
          return;
        }

        setIsValidatingUpline(false);
      }

      // Proceed with registration using the upline value
      const result = await registerMutation.mutateAsync({
        Username: data.username,
        Password: data.password,
        Email: data.email,
        Phone: data.phone,
        FullName: data.fullName,
        Upline: uplineValue,
      });

      if (result.Code === 0) {
        // Registration successful - redirect to login
        router.push("/login");
      } else {
        setError("root", { message: result.Message || "Registration failed" });
      }
    } catch {
      setError("root", { message: "Registration failed. Please try again." });
    }
  };

  const isSubmitting = isValidatingUpline || registerMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 relative">
      {/* Header */}
      <header className="bg-dark px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-roboto-bold text-base absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {t("auth.register")}
        </h1>
        <div className="flex items-center gap-3">
          <button className="text-primary hover:text-primary/80 transition-colors">
            <Headphones className="w-6 h-6" />
          </button>
          <button className="text-white hover:text-zinc-300 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Welcome Banner */}
        <Image
          src="/aone/Banner/Welcome_Banner.webp"
          alt="register banner"
          width={32}
          height={32}
          className="h-46 w-full object-fill"
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* Referral Code */}
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Users className="w-5 h-5" />
              </div>
              <input
                {...register("referralCode")}
                type="text"
                placeholder="Referral Code"
                className="w-full pl-10 pr-20 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <FolderOpen className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1 ml-1">
              <span className="font-roboto-medium">Note:</span> If no referral code,
              one will be automatically generated for you
            </p>
          </div>

          {/* Username */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <input
              {...register("username", { required: "Username is required" })}
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-12 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <User className="w-5 h-5" />
            </div>
            <input
              {...register("fullName", { required: "Full name is required" })}
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              {...register("phone", {
                required: "Phone number is required",
              })}
              type="tel"
              placeholder="Phone Number"
              className="w-full pl-10 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Send to Dropdown - DISABLED (API not available) */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Wallet className="w-5 h-5" />
            </div>
            <select
              value={sendToId}
              onChange={(e) => setSendToId(e.target.value)}
              disabled={true}
              className="w-full pl-10 pr-10 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white appearance-none text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-100"
            >
              <option value="">Send to (Coming Soon)</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          {/* OTP Code - DISABLED (API not available) */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Wallet className="w-5 h-5" />
              </div>
              <input
                {...register("otpCode")}
                type="text"
                placeholder="OTP Code (Coming Soon)"
                disabled={true}
                className="w-full pl-10 pr-4 py-3.5 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-100"
              />
            </div>
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={true}
              className="px-6 py-3.5 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px]"
            >
              Request OTP
            </button>
          </div>

          {/* Terms & Conditions */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-zinc-600">
              I have read & agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
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
            className="w-full py-3.5 bg-primary text-white font-roboto-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isValidatingUpline
                  ? "Generating referral..."
                  : t("auth.creatingAccount")}
              </>
            ) : (
              t("auth.register").toUpperCase()
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-zinc-600 pb-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="text-primary hover:underline font-roboto-medium"
            >
              Login Here
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
