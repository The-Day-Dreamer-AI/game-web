"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { ChevronDown, Ticket, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

// E-Wallet methods
const ewalletMethods = [
  { id: "ewallet", name: "E-Wallet", icon: "TnG", selected: true },
];

// Payment types (e-wallets)
const paymentTypes = [
  { id: "duitnow", name: "DuitNow", color: "bg-pink-500", textColor: "text-white" },
  { id: "touchngo", name: "Touch'n Go", color: "bg-blue-500", textColor: "text-white" },
  { id: "boost", name: "Boost", color: "bg-orange-500", textColor: "text-white" },
  { id: "grabpay", name: "Grab Pay", color: "bg-green-500", textColor: "text-white" },
  { id: "shopeepay", name: "Shopee Pay", color: "bg-orange-600", textColor: "text-white" },
];

// Quick amount options
const quickAmounts = [50, 100, 500, 1000];

// Promotion options
const promotions = [
  { id: "none", label: "- N/A -" },
  { id: "welcome", label: "Welcome Bonus 100%" },
  { id: "reload", label: "Reload Bonus 50%" },
];

export default function EWalletPage() {
  const [selectedMethod, setSelectedMethod] = useState("ewallet");
  const [selectedPaymentType, setSelectedPaymentType] = useState("duitnow");
  const [amount, setAmount] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState("none");
  const [promoCode, setPromoCode] = useState("");
  const [showPromotionDropdown, setShowPromotionDropdown] = useState(false);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = () => {
    console.log({
      method: selectedMethod,
      paymentType: selectedPaymentType,
      amount,
      promotion: selectedPromotion,
      promoCode,
    });
  };

  const selectedPayment = paymentTypes.find(p => p.id === selectedPaymentType);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="E-Wallet" backHref="/deposit" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        {/* Method Selection */}
        <div className="mb-6">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Method<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {ewalletMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-lg flex items-center justify-center border-2 transition-all bg-blue-500 relative",
                    selectedMethod === method.id
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <div className="text-center">
                    <span className="text-white text-[10px] font-roboto-bold block">Touch'n</span>
                    <span className="text-yellow-300 text-[10px] font-roboto-bold block">eWallet</span>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  selectedMethod === method.id ? "text-primary font-roboto-medium" : "text-zinc-500"
                )}>
                  {method.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            Payment Type<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {paymentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedPaymentType(type.id)}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all relative",
                    type.color,
                    selectedPaymentType === type.id
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <span className={cn("text-[10px] font-roboto-bold text-center px-1", type.textColor)}>
                    {type.name.split(' ')[0]}
                  </span>
                  {selectedPaymentType === type.id && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] mt-1 whitespace-nowrap",
                  selectedPaymentType === type.id ? "text-primary font-roboto-medium" : "text-zinc-500"
                )}>
                  {type.name}
                </span>
              </button>
            ))}
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
          <div className="space-y-1 text-sm text-zinc-500">
            <p>Option: {selectedPayment?.name || 'DuitNow'} E-Wallet</p>
            <p>Mode: online</p>
            <p>Min/Max Limit: MYR 30.00 / 20,000.00</p>
            <p>Daily Limit Balance: Unlimited</p>
            <p>Total Allowed: Unlimited</p>
          </div>
          <div className="mt-4 space-y-3 text-sm text-zinc-500">
            <p>
              1.Always check for the latest active notice from AONE before making a deposit.
            </p>
            <p>
              2.For using deposit option - Ewallet Deposit, Please follow all instructions to complete the transaction.
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
