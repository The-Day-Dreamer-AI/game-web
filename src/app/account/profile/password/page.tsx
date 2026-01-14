"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

type SendToOption = "sms" | "email";

const sendToOptions: { value: SendToOption; labelKey: string }[] = [
  { value: "sms", labelKey: "profile.sendToSms" },
  { value: "email", labelKey: "profile.sendToEmail" },
];

export default function ChangePasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendTo, setSendTo] = useState<SendToOption>("sms");
  const [showSendToDropdown, setShowSendToDropdown] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useI18n();

  const handleRequestOtp = () => {
    // Mock OTP request
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - in real app would call API
    console.log("Changing password:", {
      phoneNumber,
      sendTo,
      otpCode,
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  const selectedSendToOption = sendToOptions.find((opt) => opt.value === sendTo);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("profile.changePassword")}
        backHref="/account/profile"
      />

      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number Input */}
          <FormInput
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t("profile.phoneNumber")}
            prefix={
              <Image
                src="/images/icon/phone_icon.png"
                alt="Phone"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
          />

          {/* Send To Dropdown */}
          <div className="relative">
            <div className="form-input-wrapper relative flex items-center w-full rounded-lg border border-[#959595] bg-white transition-all duration-200">
              <div className="flex items-center justify-center pl-4 text-zinc-400">
                <Image
                  src="/images/icon/otp_icon.png"
                  alt="Send To"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSendToDropdown(!showSendToDropdown)}
                className="flex-1 w-full py-3.5 pl-3 pr-4 bg-transparent text-left flex items-center justify-between focus:outline-none"
              >
                <span className={selectedSendToOption ? "text-black text-sm font-roboto-regular" : "text-[#959595] text-sm font-roboto-regular"}>
                  {selectedSendToOption ? t(selectedSendToOption.labelKey) : t("profile.sendTo")}
                </span>
                <ChevronDown
                  className={cn(
                    "w-auto h-6 text-zinc-400 transition-transform",
                    showSendToDropdown && "rotate-180"
                  )}
                />
              </button>
            </div>
            {showSendToDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {sendToOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSendTo(option.value);
                      setShowSendToDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-zinc-50",
                      sendTo === option.value ? "text-primary bg-zinc-50" : "text-zinc-700"
                    )}
                  >
                    {t(option.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* OTP Code Input with Request Button */}
          <div className="flex gap-2">
            <FormInput
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder={t("profile.otpCode")}
              prefix={
                <Image
                  src="/images/icon/otp_icon.png"
                  alt="OTP"
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
              onClick={handleRequestOtp}
              disabled={countdown > 0}
              className="px-4 py-3.5 bg-primary text-white text-sm font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : t("profile.requestOtp")}
            </button>
          </div>

          {/* Old Password Input */}
          <FormInput
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t("profile.oldPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showOldPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
          />

          {/* New Password Input */}
          <FormInput
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("profile.newPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
            suffix={
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showNewPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
          />

          {/* Confirm New Password Input */}
          <FormInput
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("profile.confirmNewPassword")}
            prefix={
              <Image
                src="/images/icon/lock_icon.png"
                alt="Password"
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
                className="text-zinc-400 hover:text-zinc-600"
              >
                {showConfirmPassword ? <Eye className="w-auto h-6" /> : <EyeOff className="w-auto h-6" />}
              </button>
            }
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("common.confirm")}
          </button>
        </form>
      </main>
    </div>
  );
}
