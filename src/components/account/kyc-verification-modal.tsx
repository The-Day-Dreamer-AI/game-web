"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Phone, Wallet, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KycVerificationModal({
  isOpen,
  onClose,
}: KycVerificationModalProps) {
  const [sendTo, setSendTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      otpCode: "",
    },
  });

  const onSubmit = async (data: { phoneNumber: string; otpCode?: string }) => {
    setIsLoading(true);

    // TODO: Implement KYC verification API call
    console.log("KYC Verification", data);

    setIsLoading(false);

    // After successful verification
    // onClose();
  };

  const handleRequestOTP = () => {
    // TODO: Implement OTP request
    console.log("Request OTP");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-roboto-semibold text-zinc-800 mb-6">
          KYC Verification
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Phone Number */}
          <div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                {...register("phoneNumber", {
                  required: "Phone number is required",
                })}
                type="tel"
                placeholder="Phone Number"
                className={cn(
                  "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50",
                  errors.phoneNumber ? "border-red-500" : "border-zinc-300"
                )}
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
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <Wallet className="w-5 h-5" />
            </div>
            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white appearance-none text-zinc-500"
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <Wallet className="w-5 h-5" />
              </div>
              <input
                {...register("otpCode")}
                type="text"
                placeholder="OTP Code"
                className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleRequestOTP}
              className="px-6 py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Request OTP
            </button>
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
            className="w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "PROCESSING..." : "CONFIRM"}
          </button>
        </form>
      </div>
    </div>
  );
}
