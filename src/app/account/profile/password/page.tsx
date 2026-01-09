"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Phone, Mail, Lock, Eye, EyeOff, ChevronDown } from "lucide-react";
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
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { t } = useI18n();

  const handleRequestOtp = () => {
    // Mock OTP request
    setOtpSent(true);
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
    <div className="min-h-screen flex flex-col bg-zinc-100">
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
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t("profile.phoneNumber")}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Send To Dropdown */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Mail className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={() => setShowSendToDropdown(!showSendToDropdown)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-left flex items-center justify-between focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <span className={selectedSendToOption ? "text-zinc-700" : "text-zinc-400"}>
                {selectedSendToOption ? t(selectedSendToOption.labelKey) : t("profile.sendTo")}
              </span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-zinc-400 transition-transform",
                  showSendToDropdown && "rotate-180"
                )}
              />
            </button>
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
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={t("profile.otpCode")}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={countdown > 0}
              className="px-4 py-3.5 bg-primary text-white text-sm font-roboto-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {countdown > 0 ? `${countdown}s` : t("profile.requestOtp")}
            </button>
          </div>

          {/* Old Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder={t("profile.oldPassword")}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showOldPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("profile.newPassword")}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm New Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("profile.confirmNewPassword")}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("common.confirm")}
          </button>
        </form>
      </main>
    </div>
  );
}
