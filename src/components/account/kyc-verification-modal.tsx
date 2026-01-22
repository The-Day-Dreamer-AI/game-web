"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, KeyRound, ChevronDown } from "lucide-react";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { useToast } from "@/providers/toast-provider";

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KycVerificationModal({
  isOpen,
  onClose,
}: KycVerificationModalProps) {
  const { showError } = useToast();
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Title */}
        <div className="text-base font-roboto-bold text-[#28323C] mb-6">
          KYC Verification
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Phone Number */}
          <FormInput
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            type="tel"
            placeholder="Phone Number"
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
          <div className="form-input-wrapper relative flex items-center w-full rounded-lg border border-[#959595] bg-white transition-all duration-200">
            <div className="flex items-center justify-center pl-4 text-zinc-400">
              <Image
                src="/images/icon/otp_icon.png"
                alt="AON1E otp"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
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
              wrapperClassName="flex-1"
            />
            <button
              type="button"
              onClick={handleRequestOTP}
              className="cursor-pointer px-6 py-2 bg-primary text-sm text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Request OTP
            </button>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer mt-3 w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "PROCESSING..." : "CONFIRM"}
          </button>
        </form>
      </div>
    </div>
  );
}
