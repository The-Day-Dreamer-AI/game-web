"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { FormInput } from "@/components/ui/form-input";
import { ChevronDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useCryptoPaygates, useSubmitDepositPg } from "@/hooks/use-deposit";
import type { Paygate, PaygateNetwork, DepositPromo } from "@/lib/api/types";

// Quick amount options
const quickAmounts = [50, 100, 500, 1000];

export default function CryptoPage() {
  const { t } = useI18n();
  const { data: paygatesData, isLoading } = useCryptoPaygates();
  const submitDeposit = useSubmitDepositPg();

  const [selectedMethod, setSelectedMethod] = useState<Paygate | null>(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaygateNetwork | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<DepositPromo | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [showPromotionDropdown, setShowPromotionDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const promotionDropdownRef = useRef<HTMLDivElement>(null);

  // Set initial selections when data loads
  useEffect(() => {
    if (paygatesData?.Rows?.length && !selectedMethod) {
      const firstMethod = paygatesData.Rows[0];
      setSelectedMethod(firstMethod);
      if (firstMethod.Networks?.length) {
        setSelectedPaymentType(firstMethod.Networks[0]);
      }
    }
  }, [paygatesData, selectedMethod]);

  // Update payment type selection when method changes
  useEffect(() => {
    if (selectedMethod?.Networks?.length) {
      setSelectedPaymentType(selectedMethod.Networks[0]);
    } else {
      setSelectedPaymentType(null);
    }
  }, [selectedMethod]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showPromotionDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        promotionDropdownRef.current &&
        !promotionDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPromotionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPromotionDropdown]);

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmDeposit = async () => {
    if (!selectedMethod || !selectedPaymentType || !amount) return;

    setSubmitError(null);

    try {
      const result = await submitDeposit.mutateAsync({
        Amount: parseFloat(amount),
        PaygateId: selectedMethod.Id,
        PaygateNetworkId: selectedPaymentType.Id,
        PromoCode: promoCode || "",
        PromoId: selectedPromotion?.Id || "",
      });

      if (result.Code === 0 && result.Url) {
        // Open the payment URL in a new tab
        window.open(result.Url, "_blank");
        setShowConfirmModal(false);
      } else {
        setSubmitError(result.Message || t("common.error"));
      }
    } catch {
      setSubmitError(t("common.error"));
    }
  };

  const paymentMethods = paygatesData?.Rows || [];
  const promotions = paygatesData?.Promos || [];
  const networks = selectedMethod?.Networks || [];

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <Header variant="subpage" title={t("deposit.crypto")} backHref="/deposit" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header variant="subpage" title={t("deposit.crypto")} backHref="/deposit" />

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-4 py-4">
          {/* Method Selection */}
          <div className="mb-4">
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("deposit.method")}<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {paymentMethods.map((method) => (
                <button
                  key={method.Id}
                  onClick={() => setSelectedMethod(method)}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div
                    className={cn(
                      "w-16 h-16 rounded-xl border-2 transition-all relative flex items-center justify-center bg-white",
                      selectedMethod?.Id === method.Id
                        ? "border-primary"
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    {method.Image ? (
                      <Image
                        src={method.Image}
                        alt={method.Name}
                        width={48}
                        height={48}
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-roboto-bold text-zinc-600">
                        {method.Name.substring(0, 3)}
                      </span>
                    )}
                    {selectedMethod?.Id === method.Id && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-1.5 max-w-[64px] truncate text-center",
                    selectedMethod?.Id === method.Id ? "text-primary font-roboto-medium" : "text-zinc-500"
                  )}>
                    {method.Name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type Selection */}
          {networks.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
                {t("deposit.paymentType")}<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {networks.map((network) => (
                  <button
                    key={network.Id}
                    onClick={() => setSelectedPaymentType(network)}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        "w-full aspect-square rounded-xl border-2 transition-all relative flex items-center justify-center bg-white p-2",
                        selectedPaymentType?.Id === network.Id
                          ? "border-primary"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      {network.Image ? (
                        <Image
                          src={network.Image}
                          alt={network.Name}
                          width={40}
                          height={40}
                          className="object-contain"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-roboto-bold text-zinc-600">
                          {network.Name.substring(0, 3)}
                        </span>
                      )}
                      {selectedPaymentType?.Id === network.Id && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] mt-1 text-center leading-tight line-clamp-2",
                      selectedPaymentType?.Id === network.Id ? "text-primary font-roboto-medium" : "text-zinc-500"
                    )}>
                      {network.Name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enter Amount */}
          <div className="mb-4">
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("deposit.enterAmount")}<span className="text-red-500">*</span>
            </label>
            <FormInput
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder={selectedMethod
                ? `Min. MYR ${selectedMethod.Min.toLocaleString()}/ Max. MYR ${selectedMethod.Max.toLocaleString()}`
                : t("deposit.enterAmount")
              }
              prefix={
                <Image
                  src="/images/icon/amount_icon.png"
                  alt="Amount"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              }
            />

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
              {t("deposit.promotion")}
            </label>
            <div className="relative" ref={promotionDropdownRef}>
              <button
                type="button"
                onClick={() => setShowPromotionDropdown(!showPromotionDropdown)}
                className={cn(
                  "cursor-pointer relative flex w-full items-center justify-between rounded-lg border px-4 py-3.5 transition-all duration-200 focus:outline-none",
                  showPromotionDropdown
                    ? "border-[#0DC3B1] bg-[rgba(0,214,198,0.1)] shadow-[0_0_20px_rgba(20,187,176,0.2)]"
                    : "border-[#959595] bg-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Image
                    src="/images/icon/rebate_icon.png"
                    alt="Promotion"
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-auto object-contain"
                  />
                  <span className={cn(
                    "text-sm font-roboto-regular",
                    selectedPromotion ? "text-zinc-900" : "text-[#959595]"
                  )}>
                    {selectedPromotion?.Name || `- ${t("deposit.noPromotion")} -`}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-zinc-400 transition-transform",
                    showPromotionDropdown && "rotate-180"
                  )}
                />
              </button>

              {showPromotionDropdown && (
                <div className="absolute left-0 right-0 mt-1 rounded-lg border border-[#959595] bg-white shadow-lg z-20 py-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {/* No Promotion Option */}
                  <button
                    type="button"
                    className="w-full px-2 text-left group cursor-pointer"
                    onClick={() => {
                      setSelectedPromotion(null);
                      setShowPromotionDropdown(false);
                    }}
                  >
                    <span
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-roboto-regular transition-colors",
                        !selectedPromotion
                          ? "border border-[#1ECAD3] bg-[#DDF7F7] text-[#008D92]"
                          : "text-zinc-900 group-hover:bg-zinc-100"
                      )}
                    >
                      - {t("deposit.noPromotion")} -
                    </span>
                  </button>
                  {/* Promotion Options */}
                  {promotions.map((promo) => {
                    const isSelected = selectedPromotion?.Id === promo.Id;
                    return (
                      <button
                        key={promo.Id}
                        type="button"
                        className="w-full px-2 text-left group cursor-pointer"
                        onClick={() => {
                          setSelectedPromotion(promo);
                          setShowPromotionDropdown(false);
                        }}
                      >
                        <span
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-roboto-regular transition-colors",
                            isSelected
                              ? "border border-[#1ECAD3] bg-[#DDF7F7] text-[#008D92]"
                              : "text-zinc-900 group-hover:bg-zinc-100"
                          )}
                        >
                          {promo.Image && (
                            <Image
                              src={promo.Image}
                              alt={promo.Name}
                              width={32}
                              height={20}
                              className="object-contain rounded"
                              unoptimized
                            />
                          )}
                          {promo.Name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Promo Code Input */}
          <div className="mb-6">
            <FormInput
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder={t("deposit.promoCode")}
              prefix={
                <Image
                  src="/images/icon/redeem_code_icon.png"
                  alt="Promo Code"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              }
            />
          </div>

          {/* Important Notice */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <h3 className="font-roboto-medium text-zinc-700 mb-3">{t("deposit.importantNotice")}</h3>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("deposit.option")}:</span>
                <span className="font-roboto-medium">{selectedPaymentType?.Name || "-"} {t("deposit.crypto")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("deposit.mode")}:</span>
                <span className="font-roboto-medium">{t("deposit.online")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("deposit.minMaxLimit")}:</span>
                <span className="font-roboto-medium">
                  MYR {selectedMethod?.Min.toLocaleString() || "0"} / {selectedMethod?.Max.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("deposit.dailyLimitBalance")}:</span>
                <span className="font-roboto-medium">{t("deposit.unlimited")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("deposit.totalAllowed")}:</span>
                <span className="font-roboto-medium">{t("deposit.unlimited")}</span>
              </div>
              {selectedMethod?.ConversionRate !== undefined && selectedMethod?.ConversionRate !== 0 && selectedMethod?.ConversionRate !== 1 && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">{t("deposit.conversionRate")}:</span>
                  <span className="font-roboto-medium">{selectedMethod?.ConversionRate}</span>
                </div>
              )}
              {selectedMethod?.ChargeRate !== undefined && selectedMethod?.ChargeRate !== 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">{t("deposit.chargeRate")}:</span>
                  <span className="font-roboto-medium">{selectedMethod?.ChargeRate}%</span>
                </div>
              )}
            </div>

            {/* Crypto specific notices */}
            <div className="mt-4 pt-3 border-t border-zinc-200 space-y-2 text-sm text-zinc-500">
              <p>1. {t("deposit.cryptoNotice1")}</p>
              <p>2. {t("deposit.cryptoNotice2")}</p>
            </div>
          </div>
        </main>

        {/* Submit Button - Sticky at bottom */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200">
          <button
            onClick={handleSubmit}
            disabled={!selectedMethod || !selectedPaymentType || !amount}
            className="w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("common.submit").toUpperCase()}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-[90%] max-w-sm mx-4 overflow-hidden shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200">
                <h3 className="font-roboto-bold text-lg text-zinc-800">
                  {t("deposit.confirmDeposit")}
                </h3>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1 rounded-full hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t("deposit.method")}:</span>
                  <span className="font-roboto-medium text-zinc-800">{selectedMethod?.Name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t("deposit.paymentType")}:</span>
                  <span className="font-roboto-medium text-zinc-800">{selectedPaymentType?.Name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{t("common.amount")}:</span>
                  <span className="font-roboto-bold text-primary">MYR {parseFloat(amount).toLocaleString()}</span>
                </div>
                {selectedPromotion && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">{t("deposit.promotion")}:</span>
                    <span className="font-roboto-medium text-zinc-800">{selectedPromotion.Name}</span>
                  </div>
                )}
                {promoCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">{t("deposit.promoCode")}:</span>
                    <span className="font-roboto-medium text-zinc-800">{promoCode}</span>
                  </div>
                )}

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 p-4 border-t border-zinc-200">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={submitDeposit.isPending}
                  className="flex-1 py-3 border border-zinc-300 text-zinc-700 font-roboto-medium rounded-lg hover:bg-zinc-50 transition-colors disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirmDeposit}
                  disabled={submitDeposit.isPending}
                  className="flex-1 py-3 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitDeposit.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("auth.processing")}
                    </>
                  ) : (
                    t("common.confirm")
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
