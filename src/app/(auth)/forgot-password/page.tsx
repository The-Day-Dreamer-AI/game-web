"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Headphones,
  Menu,
  CreditCard,
  Phone,
  Wallet,
  Lock,
  ChevronDown,
  EyeOff,
  Eye,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      uid: "",
      phoneNumber: "",
      otpCode: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: {
    uid: string;
    phoneNumber: string;
    otpCode?: string;
    newPassword: string;
  }) => {
    setIsLoading(true);

    // TODO: Implement forgot password API call
    console.log("Reset password", data);

    setIsLoading(false);

    // After successful password reset
    // router.push("/");
  };

  const handleRequestOTP = () => {
    // TODO: Implement OTP request
    console.log("Request OTP");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Header */}
      <header className="bg-dark px-4 py-3 flex items-center justify-between relative">
        <button
          onClick={() => router.back()}
          className="text-white hover:text-zinc-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-roboto-bold text-base absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">Forgot Password</h1>
        <div className="flex items-center gap-3">
          <button
            // onClick={onSupportClick}
            className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            aria-label="Support"
          >
            <Image
              src="/aone/Header_Icon_Customer Service.webp"
              alt="AON1E support"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
            />
          </button>
          <button
            // onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <Image
              src="/aone/Header_Icon_Menu.webp"
              alt="AON1E menu"
              width={24}
              height={24}
              className="h-7 w-auto object-contain"
            />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
          {/* UID */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Image
                  src="/aone/Icon_UID.webp"
                  alt="AON1E uid"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <input
                {...register("uid", { required: "UID is required" })}
                type="text"
                placeholder="UID"
                className="w-full pl-12 pr-4 py-3.5 border border-[#959595] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>
            {errors.uid && (
              <p className="text-xs text-red-500 mt-1">{errors.uid.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Image
                  src="/aone/Icon_Phone.webp"
                  alt="AON1E phone"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <input
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                type="tel"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-3.5 border border-[#959595] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Send to Dropdown */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Image
                src="/aone/Icon_OTP.webp"
                alt="AON1E otp"
                width={24}
                height={24}
                className="h-6 w-auto object-contain"
              />
            </div>
            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 border border-[#959595] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white appearance-none text-zinc-500"
            >
              <option value="">Send to</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>

          {/* OTP Code */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Image
                  src="/aone/Icon_OTP.webp"
                  alt="AON1E otp"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <input
                {...register("otpCode")}
                type="text"
                placeholder="OTP Code"
                className="w-full pl-12 pr-4 py-3.5 border border-[#959595] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleRequestOTP}
              className="px-6 py-3.5 bg-primary text-white text-sm font-roboto-bold rounded-lg whitespace-nowrap"
            >
              Request OTP
            </button>
          </div>

          {/* New Password */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Image
                  src="/aone/lock.png"
                  alt="AON1E password"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              <input
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full pl-12 pr-12 py-3.5 border border-[#959595] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
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
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

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
            className="w-full py-3.5 bg-primary text-white text-base font-roboto-bold rounded-lg"
          >
            {isLoading ? "PROCESSING..." : "CONFIRM"}
          </button>
        </form>
      </main>
    </div>
  );
}
