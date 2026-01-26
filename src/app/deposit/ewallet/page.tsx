"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { RequireAuth } from "@/components/auth";
import { FormInput } from "@/components/ui/form-input";
import { ChevronDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useEWalletPaygates, useSubmitDepositPg } from "@/hooks/use-deposit";
import type { Paygate, PaygateNetwork, DepositPromo } from "@/lib/api/types";
import { FaCheck } from "react-icons/fa";

// Quick amount options
const quickAmounts = [50, 100, 500, 1000];

export default function EWalletPage() {
  const { t } = useI18n();
  const { data: paygatesData, isLoading } = useEWalletPaygates();
  const submitDeposit = useSubmitDepositPg();

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [selectedPaymentTypeId, setSelectedPaymentTypeId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [selectedPromotion, setSelectedPromotion] = useState<DepositPromo | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [showPromotionDropdown, setShowPromotionDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const promotionDropdownRef = useRef<HTMLDivElement>(null);

  // Derive selected method: user selection takes priority, otherwise use first from API
  const selectedMethod =
    paygatesData?.Rows?.find((m) => m.Id === selectedMethodId) ||
    paygatesData?.Rows?.[0] ||
    null;

  // Derive selected payment type: user selection if valid for current method, otherwise first network
  const selectedPaymentType =
    selectedMethod?.Networks?.find((n) => n.Id === selectedPaymentTypeId) ||
    selectedMethod?.Networks?.[0] ||
    null;

  // Handle method selection - also reset payment type
  const handleMethodSelect = (method: Paygate) => {
    setSelectedMethodId(method.Id);
    setSelectedPaymentTypeId(null); // Reset to let it default to first network
  };

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

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-4 py-4">
          {/* Method Selection */}
          <div className="mb-4">
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 flex gap-1">
              {t("deposit.method")}
              <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-5 max-[380px]:grid-cols-4 gap-3 items-start overflow-x-auto scrollbar-hide pb-1">
              {paymentMethods.map((method) => (
                <button
                  key={method.Id}
                  onClick={() => handleMethodSelect(method)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-full aspect-square rounded-lg border-2 shadow-sm relative flex items-center justify-center bg-white",
                      selectedMethod?.Id === method.Id
                        ? "border-primary"
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    {method.Image ? (
                      <Image
                        src={method.Image}
                        alt={method.Name}
                        width={35}
                        height={35}
                        className="object-contain rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <span className="text-sm font-roboto-bold text-zinc-600">
                        {method.Name.substring(0, 3)}
                      </span>
                    )}
                    {selectedMethod?.Id === method.Id && (
                      <div className="absolute bottom-0 right-0 pl-1.5 py-1 pr-0.5 bg-primary rounded-tl-lg rounded-br-md flex items-center justify-center">
                        <FaCheck className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center mt-1 font-roboto-regular",
                      selectedMethod?.Id === method.Id
                        ? "text-primary"
                        : "text-[#28323C]"
                    )}
                  >
                    {method.Name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Type Selection */}
          {networks.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-roboto-medium text-[#28323C] mb-2 flex gap-1">
                {t("deposit.paymentType")}
                <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-5 max-[380px]:grid-cols-4 gap-3 items-start">
                {networks.map((network) => (
                  <button
                    key={network.Id}
                    onClick={() => setSelectedPaymentTypeId(network.Id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 shadow-sm relative flex items-center justify-center bg-white",
                        selectedPaymentType?.Id === network.Id
                          ? "border-primary"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      {network.Image ? (
                        <Image
                          src={network.Image}
                          alt={network.Name}
                          width={35}
                          height={35}
                          className="object-contain rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-roboto-bold text-zinc-600">
                          {network.Name.substring(0, 3)}
                        </span>
                      )}
                      {selectedPaymentType?.Id === network.Id && (
                        <div className="absolute bottom-0 right-0 pl-1.5 py-1 pr-0.5 bg-primary rounded-tl-lg rounded-br-md flex items-center justify-center">
                          <FaCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs text-center mt-1 font-roboto-regular",
                        selectedPaymentType?.Id === network.Id
                          ? "text-primary"
                          : "text-[#28323C]"
                      )}
                    >
                      {network.Name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enter Amount */}
          <div className="mb-4">
            <label className="text-sm font-roboto-medium text-[#28323C] mb-2 flex gap-1">
              {t("deposit.enterAmount")}
              <span className="text-primary">*</span>
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
                    "flex-1 py-4 rounded-2xl text-sm border font-roboto-medium transition-colors cursor-pointer",
                    amount === value.toString()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-[#959595] bg-white text-zinc-600"
                  )}
                >
                  {value.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Promotion Dropdown */}
          <div className="mb-2">
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
                  <span
                    className={cn(
                      "text-sm font-roboto-regular",
                      selectedPromotion ? "text-zinc-900" : "text-[#959595]"
                    )}
                  >
                    {selectedPromotion?.Name || t("deposit.selectPromotion")}
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
          <div className="bg-white border border-[#959595] rounded-2xl p-4">
            <h3 className="font-roboto-bold text-zinc-800 mb-3">
              {t("deposit.importantNotice")}
            </h3>
            {/* Basic Info */}
            <div className="space-y-1 text-sm text-[#5F7182] mb-4">
              <div>
                <span>{t("deposit.option")}: </span>
                <span>{selectedPaymentType?.Name || "-"} {t("deposit.eWallet")}</span>
              </div>
              <div>
                <span>{t("deposit.mode")}: </span>
                <span>{t("deposit.online")}</span>
              </div>
              <div>
                <span>{t("deposit.minMaxLimit")}: </span>
                <span>
                  MYR {selectedMethod?.Min?.toLocaleString() || "0"} / {selectedMethod?.Max?.toLocaleString() || "0"}
                </span>
              </div>
              <div>
                <span>{t("deposit.dailyLimitBalance")}: </span>
                <span>{t("deposit.unlimited")}</span>
              </div>
              <div>
                <span>{t("deposit.totalAllowed")}: </span>
                <span>{t("deposit.unlimited")}</span>
              </div>
              {selectedMethod?.ConversionRate !== undefined &&
                selectedMethod?.ConversionRate !== 0 &&
                selectedMethod?.ConversionRate !== 1 && (
                  <div>
                    <span>{t("deposit.conversionRate")}: </span>
                    <span>{selectedMethod?.ConversionRate}</span>
                  </div>
                )}
              {selectedMethod?.ChargeRate !== undefined &&
                selectedMethod?.ChargeRate !== 0 && (
                  <div>
                    <span>{t("deposit.chargeRate")}: </span>
                    <span>{selectedMethod?.ChargeRate}%</span>
                  </div>
                )}
            </div>

            {/* Numbered Instructions */}
            <div className="space-y-3 text-sm text-[#5F7182]">
              <p>1.{t("deposit.ewalletNotice1")}</p>
              <p>2.{t("deposit.ewalletNotice2")}</p>
              <p>3.{t("deposit.ewalletNotice3")}</p>
              <p>4.{t("deposit.ewalletNotice4")}</p>
              <p>5.{t("deposit.ewalletNotice5")}</p>
              <p>6.{t("deposit.ewalletNotice6")}</p>
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
