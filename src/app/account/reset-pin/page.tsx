"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, KeyRound, MessageSquare, Mail } from "lucide-react";
import { Header } from "@/components/layout";
import { cn } from "@/lib/utils";

// Mock send options
const sendOptions = [
  { id: "phone", label: "+60 *** ***1234", icon: MessageSquare },
  { id: "email", label: "e***@gmail.com", icon: Mail },
];

export default function ResetPinPage() {
  const [sendTo, setSendTo] = useState("");
  const [showSendDropdown, setShowSendDropdown] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const selectedSendOption = sendOptions.find((opt) => opt.id === sendTo);

  const handleRequestOtp = () => {
    if (!sendTo) return;
    setIsRequestingOtp(true);
    // TODO: API call to request OTP
    console.log("Requesting OTP to:", sendTo);
    setTimeout(() => setIsRequestingOtp(false), 2000);
  };

  const handleConfirm = () => {
    // TODO: API call to reset PIN
    console.log("Resetting PIN:", { sendTo, otpCode, pin, confirmPin });
  };

  const isFormValid = sendTo && otpCode && pin && confirmPin && pin === confirmPin;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Reset PIN" backHref="/account" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {/* Send To Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSendDropdown(!showSendDropdown)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary shrink-0" />
              <span className={cn("text-sm", sendTo ? "text-zinc-800" : "text-zinc-400")}>
                {selectedSendOption?.label || "Send to"}
              </span>
            </div>
            <ChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", showSendDropdown && "rotate-180")} />
          </button>

          {showSendDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
              {sendOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSendTo(option.id);
                    setShowSendDropdown(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-zinc-50 transition-colors",
                    sendTo === option.id ? "text-primary font-roboto-medium" : "text-zinc-700"
                  )}
                >
                  <option.icon className="w-5 h-5 text-primary" />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* OTP Code with Request Button */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
            <MessageSquare className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="OTP Code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              className="flex-1 focus:outline-none text-zinc-800 text-sm placeholder:text-zinc-400"
            />
          </div>
          <button
            onClick={handleRequestOtp}
            disabled={!sendTo || isRequestingOtp}
            className="px-4 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isRequestingOtp ? "Sending..." : "Request OTP"}
          </button>
        </div>

        {/* Enter PIN */}
        <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
          <KeyRound className="w-5 h-5 text-primary shrink-0" />
          <input
            type={showPin ? "text" : "password"}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={6}
            className="flex-1 focus:outline-none text-zinc-800 text-sm placeholder:text-zinc-400"
          />
          <button
            onClick={() => setShowPin(!showPin)}
            className="text-zinc-400 hover:text-zinc-600"
          >
            {showPin ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm PIN */}
        <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
          <KeyRound className="w-5 h-5 text-primary shrink-0" />
          <input
            type={showConfirmPin ? "text" : "password"}
            placeholder="Confirm PIN"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            maxLength={6}
            className="flex-1 focus:outline-none text-zinc-800 text-sm placeholder:text-zinc-400"
          />
          <button
            onClick={() => setShowConfirmPin(!showConfirmPin)}
            className="text-zinc-400 hover:text-zinc-600"
          >
            {showConfirmPin ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!isFormValid}
          className="w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          CONFIRM
        </button>
      </main>
    </div>
  );
}
