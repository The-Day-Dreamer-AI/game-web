"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RequireAuth, RequireKyc } from "@/components/auth";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { FaCheck } from "react-icons/fa";
import { FormInput } from "@/components/ui/form-input";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useWithdrawAccounts, useSubmitWithdraw } from "@/hooks/use-withdrawal";

export default function WithdrawalPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  // Fetch real bank accounts from API
  const { data: accountsData, isLoading: isLoadingAccounts } = useWithdrawAccounts({
    enabled: isAuthenticated,
  });

  const submitWithdraw = useSubmitWithdraw();

  const [selectedBankIdState, setSelectedBankId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  // Derive selected bank ID: user selection takes priority, otherwise use first from API
  const selectedBankId = selectedBankIdState || accountsData?.Rows?.[0]?.Id || "";

  const selectedBank = accountsData?.Rows?.find((bank) => bank.Id === selectedBankId) ?? null;

  const cashBalance = accountsData?.Cash ?? 0;
  const currency = accountsData?.Currency ?? "MYR";
  const rollover = accountsData?.Rollover ?? 0;
  const targetRollover = accountsData?.TargetRollover ?? 0;
  const minAmount = currency === "MYR" ? (accountsData?.MinMYR ?? 10) : (accountsData?.MinUSD ?? 10);
  const maxAmount = currency === "MYR" ? (accountsData?.MaxMYR ?? 30000) : (accountsData?.MaxUSD ?? 30000);
  const dailyLimit = accountsData?.DailyWithdrawLimit ?? 50000;
  const dailyFreq = accountsData?.DailyWithdrawFreq ?? 10;

  const handleSubmit = async () => {
    if (!selectedBankId || !amount || !pin) return;

    try {
      await submitWithdraw.mutateAsync({
        BankAccountId: selectedBankId,
        Amount: parseFloat(amount),
        Pin: pin,
      });
      // On success, show toast and redirect to transactions
      showSuccess(t("withdrawal.success") || "Withdrawal submitted successfully");
      router.push("/transaction");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("withdrawal.failed") || "Withdrawal failed. Please try again.";
      showError(errorMessage);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  return (
    <RequireAuth>
      <RequireKyc>
      <div className="min-h-screen flex flex-col">

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-4 py-4">
          {/* Bank Account Selection */}
          <div className="mb-4">
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 flex gap-1">
              {t("withdrawal.bankAccount")}
              <span className="text-primary">*</span>
            </label>

            {isLoadingAccounts ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-5 max-[380px]:grid-cols-4 gap-3 items-start">
                {/* Existing bank accounts */}
                {accountsData?.Rows?.map((bank) => (
                  <button
                    key={bank.Id}
                    onClick={() => setSelectedBankId(bank.Id)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div
                      className={cn(
                        "w-full aspect-square rounded-lg border-2 shadow-sm relative flex items-center justify-center bg-white",
                        selectedBankId === bank.Id
                          ? "border-primary"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      {bank.BankImage ? (
                        <Image
                          src={bank.BankImage}
                          alt={bank.BankName}
                          width={35}
                          height={35}
                          className="object-contain rounded-lg"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-roboto-bold text-zinc-600">
                          {bank.BankName.substring(0, 3)}
                        </span>
                      )}
                      {selectedBankId === bank.Id && (
                        <div className="absolute bottom-0 right-0 pl-1.5 py-1 pr-0.5 bg-primary rounded-tl-lg rounded-br-md flex items-center justify-center">
                          <FaCheck className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs text-center mt-1 font-roboto-regular",
                        selectedBankId === bank.Id
                          ? "text-primary"
                          : "text-[#28323C]"
                      )}
                    >
                      {bank.BankName}
                    </span>
                  </button>
                ))}
                {/* Add Bank Button - Always visible */}
                <button
                  onClick={() => router.push("/account/bank?returnUrl=/withdrawal")}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-lg border-2 border-dashed border-zinc-300 shadow-sm flex items-center justify-center bg-white hover:border-primary transition-colors">
                    <Plus className="w-6 h-6 text-zinc-400" />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Account Details Card */}
          {selectedBank && (
            <div className="bg-white rounded-2xl border border-[#959595] px-4 py-5 mb-4 mt-2">
              <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-4">
                {/* Name Row */}
                <span className="text-sm text-[#5F7182] whitespace-nowrap">
                  {t("deposit.accountName")}
                </span>
                <span className="text-sm text-[#5F7182] font-roboto-bold">
                  : {selectedBank.Name}
                </span>

                {/* Account No Row */}
                <span className="text-sm text-[#5F7182] whitespace-nowrap">
                  {t("deposit.accountNo")}
                </span>
                <span className="text-sm text-[#5F7182] font-roboto-bold">
                  : {selectedBank.No}
                </span>
              </div>
            </div>
          )}


          {/* Enter Amount */}
          <div className="mb-2">
            <label className="text-sm font-roboto-medium text-[#28323C] mb-2 flex gap-1">
              {t("withdrawal.enterAmount")}
              <span className="text-primary">*</span>
            </label>
            <FormInput
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder={`Min. ${currency} ${formatCurrency(minAmount)}/ Max. ${currency} ${formatCurrency(maxAmount)}`}
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
          </div>

          {/* Available Balance */}
          <div className="mb-2">
            <span className="text-sm text-zinc-500">{t("withdrawal.availableBalance")}: </span>
            <span className="text-sm text-primary font-roboto-medium">{currency} {formatCurrency(cashBalance)}</span>
          </div>

          {/* Turnover / Target */}
          <div className="mb-6">
            <p className="text-sm text-zinc-500">{t("withdrawal.turnoverTarget")}</p>
            <p className="text-sm text-zinc-700">{formatCurrency(rollover)} / {formatCurrency(targetRollover)}</p>
          </div>

          {/* PIN Input */}
          <div className="mb-6">
            <FormInput
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={t("withdrawal.pin")}
              maxLength={6}
              prefix={
                <Image
                  src="/images/icon/reset_pin_icon.png"
                  alt="PIN"
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
            <h3 className="font-roboto-bold text-zinc-800 mb-3">{t("deposit.importantNotice")}</h3>
            {/* Basic Info */}
            <div className="space-y-1 text-sm text-[#5F7182] mb-4">
              <div>
                <span>{t("withdrawal.minMaxLimit")}: </span>
                <span>{currency} {formatCurrency(minAmount)}/{formatCurrency(maxAmount)}</span>
              </div>
              <div>
                <span>{t("withdrawal.dailyLimit")}: </span>
                <span>{currency} {formatCurrency(dailyLimit)}</span>
              </div>
              <div>
                <span>{t("withdrawal.dailyCount")}: </span>
                <span>{dailyFreq}</span>
              </div>
            </div>
            {/* Notice Items */}
            <div className="space-y-4 text-sm text-[#5F7182]">
              <p>1.{t("withdrawal.notice1")}</p>
              <p>2.{t("withdrawal.notice2")}</p>
              <p>3.{t("withdrawal.notice3")}</p>
              <p>4.{t("withdrawal.notice4")}</p>
              <p>5.{t("withdrawal.notice5")}</p>
            </div>
          </div>
        </main>

        {/* Submit Button - Sticky at bottom */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-primary">
          <button
            onClick={handleSubmit}
            disabled={submitWithdraw.isPending || !selectedBankId || !amount || !pin}
            className="cursor-pointer w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitWithdraw.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            {t("common.submit")}
          </button>
        </div>
      </div>
      </RequireKyc>
    </RequireAuth>
  );
}
