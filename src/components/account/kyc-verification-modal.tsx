"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Phone, KeyRound, ChevronDown } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";

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
          <FormInput
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            type="tel"
            placeholder="Phone Number"
            prefix={<Phone className="h-6 w-auto" />}
            error={errors.phoneNumber?.message}
          />

          {/* Send to Dropdown */}
          <div className="form-input-wrapper relative flex items-center w-full rounded-lg border border-[#959595] bg-white transition-all duration-200">
            <div className="flex items-center justify-center pl-4 text-zinc-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <select
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              className={`flex-1 w-full py-3.5 pl-3 pr-10 bg-transparent focus:outline-none appearance-none ${
                !sendTo ? "text-zinc-500" : "text-zinc-900"
              }`}
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
            <FormInput
              {...register("otpCode")}
              type="text"
              placeholder="OTP Code"
              prefix={<KeyRound className="w-auto h-6" />}
              wrapperClassName="flex-1"
            />
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
