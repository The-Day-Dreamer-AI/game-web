"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout";
import { ChevronDown, Copy, Ticket, Ban, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Bank accounts available for transfer
const bankAccounts = [
  {
    id: "bankislam",
    name: "Bank Islam",
    icon: "BI",
    color: "bg-yellow-500",
    accountName: "Restoran 36",
    accountNo: "14069010051044",
  },
  {
    id: "hlbank",
    name: "Hong Leong Bank",
    icon: "HLB",
    color: "bg-blue-600",
    accountName: "Restoran 36",
    accountNo: "20812345678",
  },
];

// Quick amount options
const quickAmounts = [50, 100, 500, 1000];

// Promotion options
const promotions = [
  { id: "none", label: "- N/A -" },
  { id: "welcome", label: "Welcome Bonus 100%" },
  { id: "reload", label: "Reload Bonus 50%" },
];

export default function BankTransferPage() {
  const [selectedBank, setSelectedBank] = useState(bankAccounts[0]);
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState("none");
  const [promoCode, setPromoCode] = useState("");
  const [showPromotionDropdown, setShowPromotionDropdown] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    console.log({
      bank: selectedBank.id,
      amount,
      receipt,
      promotion: selectedPromotion,
      promoCode,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Bank Transfer" backHref="/deposit" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        {/* Bank Account Selection */}
        <div className="mb-4">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Bank Account<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {bankAccounts.map((bank) => (
              <button
                key={bank.id}
                onClick={() => setSelectedBank(bank)}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all relative",
                    selectedBank.id === bank.id
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", bank.color)}>
                    <span className="text-white text-xs font-roboto-bold">{bank.icon}</span>
                  </div>
                  {selectedBank.id === bank.id && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  selectedBank.id === bank.id ? "text-primary font-roboto-medium" : "text-zinc-500"
                )}>
                  {bank.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
          {/* Name Row */}
          <div className="flex items-center justify-between py-2 border-b border-zinc-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500 w-20">Name</span>
              <span className="text-sm text-zinc-700">: {selectedBank.accountName}</span>
            </div>
            <button
              onClick={() => handleCopy(selectedBank.accountName, "name")}
              className="p-2 text-zinc-400 hover:text-primary transition-colors"
            >
              <Copy className={cn("w-4 h-4", copiedField === "name" && "text-primary")} />
            </button>
          </div>

          {/* Account No Row */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500 w-20">Account No.</span>
              <span className="text-sm text-zinc-700">: {selectedBank.accountNo}</span>
            </div>
            <button
              onClick={() => handleCopy(selectedBank.accountNo, "accountNo")}
              className="p-2 text-zinc-400 hover:text-primary transition-colors"
            >
              <Copy className={cn("w-4 h-4", copiedField === "accountNo" && "text-primary")} />
            </button>
          </div>
        </div>

        {/* Enter Amount */}
        <div className="mb-4">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Enter Amount<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12M9 9h6M9 15h6" />
              </svg>
            </div>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="Min. MYR 10/ Max. MYR 30,000"
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-3">
            {quickAmounts.map((value) => (
              <button
                key={value}
                onClick={() => handleQuickAmount(value)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg border text-sm font-roboto-medium transition-colors",
                  amount === value.toString()
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                )}
              >
                {value.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Receipt */}
        <div className="mb-4">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Upload Receipt<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white border border-zinc-200 rounded-lg">
              <ImageIcon className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400 text-sm truncate">
                {receipt ? receipt.name : "Receipt"}
              </span>
            </div>
            <button
              onClick={handleUploadClick}
              className="px-4 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Upload Receipt
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Promotion Dropdown */}
        <div className="mb-4">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Promotion
          </label>
          <div className="relative">
            <button
              onClick={() => setShowPromotionDropdown(!showPromotionDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 rounded-lg text-left"
            >
              <div className="flex items-center gap-3">
                <Ban className="w-5 h-5 text-zinc-400" />
                <span className="text-zinc-600">
                  {promotions.find((p) => p.id === selectedPromotion)?.label}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-zinc-400 transition-transform",
                  showPromotionDropdown && "rotate-180"
                )}
              />
            </button>

            {showPromotionDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
                {promotions.map((promo) => (
                  <button
                    key={promo.id}
                    onClick={() => {
                      setSelectedPromotion(promo.id);
                      setShowPromotionDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-zinc-50 first:rounded-t-lg last:rounded-b-lg",
                      selectedPromotion === promo.id
                        ? "text-primary bg-primary/5"
                        : "text-zinc-600"
                    )}
                  >
                    {promo.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promo Code Input */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Ticket className="w-5 h-5 text-zinc-400" />
            </div>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-4">
          <h3 className="font-roboto-medium text-zinc-700 mb-3">Important Notice</h3>
          <div className="space-y-3 text-sm text-zinc-500">
            <p>
              1.Always check for the latest active deposit bank details before making a deposit.
            </p>
            <p>
              2.For using deposit option - Bank Transfer, Please make the transfer before submit the transaction to avoid the transaction to be rejected.
            </p>
          </div>
        </div>
      </main>

      {/* Submit Button - Sticky at bottom */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
