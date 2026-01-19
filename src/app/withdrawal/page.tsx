"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { Plus, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useWithdrawAccounts, useSubmitWithdraw } from "@/hooks/use-withdrawal";

export default function WithdrawalPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  // Fetch real bank accounts from API
  const { data: accountsData, isLoading: isLoadingAccounts } = useWithdrawAccounts({
    enabled: isAuthenticated,
  });

  const submitWithdraw = useSubmitWithdraw();

  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  // Set first bank as default when accounts load
  useEffect(() => {
    if (accountsData?.Rows?.length && !selectedBankId) {
      setSelectedBankId(accountsData.Rows[0].Id);
    }
  }, [accountsData, selectedBankId]);

  const selectedBank = accountsData?.Rows?.find(b => b.Id === selectedBankId);
  const cashBalance = accountsData?.Cash ?? 0;
  const currency = accountsData?.Currency ?? "MYR";
  const rollover = accountsData?.Rollover ?? 0;
  const targetRollover = accountsData?.TargetRollover ?? 0;
  const minAmount = currency === "MYR" ? accountsData?.MinMYR : accountsData?.MinUSD;
  const maxAmount = currency === "MYR" ? accountsData?.MaxMYR : accountsData?.MaxUSD;
  const dailyLimit = accountsData?.DailyWithdrawLimit ?? 0;
  const dailyFreq = accountsData?.DailyWithdrawFreq ?? 0;
  const hasLinkedBanks = (accountsData?.Rows?.length ?? 0) > 0;

  const handleSubmit = async () => {
    if (!selectedBankId || !amount || !pin) return;

    try {
      await submitWithdraw.mutateAsync({
        BankAccountId: selectedBankId,
        Amount: parseFloat(amount),
        Pin: pin,
      });
      // On success, redirect to transactions or show success message
      router.push("/transaction");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("withdrawal.title")} backHref="/deposit" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-4">
        {/* Bank Account Selection */}
        <div className="mb-4">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
            {t("withdrawal.bankAccount")}<span className="text-red-500">*</span>
          </label>

          {isLoadingAccounts ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : !hasLinkedBanks ? (
            // No linked banks - show message and add bank button
            <div className="bg-white rounded-xl border border-dashed border-zinc-300 p-6 text-center">
              <p className="text-sm text-zinc-500 mb-4">
                {t("withdrawal.noBankAccounts")}
              </p>
              <button
                onClick={() => router.push("/account/bank")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t("account.addBankAccount")}
              </button>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {accountsData?.Rows?.map((bank) => (
                <button
                  key={bank.Id}
                  onClick={() => setSelectedBankId(bank.Id)}
                  className="flex flex-col items-center"
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all relative overflow-hidden bg-white",
                      selectedBankId === bank.Id
                        ? "border-primary"
                        : "border-zinc-200"
                    )}
                  >
                    {bank.BankImage ? (
                      <Image
                        src={bank.BankImage}
                        alt={bank.BankName}
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="text-zinc-600 text-xs font-roboto-bold">
                        {bank.BankName.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    {selectedBankId === bank.Id && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-1 max-w-[60px] truncate",
                    selectedBankId === bank.Id ? "text-primary font-roboto-medium" : "text-zinc-500"
                  )}>
                    {bank.BankName}
                  </span>
                </button>
              ))}
              {/* Add Bank Button */}
              <button
                onClick={() => router.push("/account/bank")}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-zinc-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Account Details Card - Only show when a bank is selected */}
        {selectedBank && (
          <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
            {/* Account Name Row */}
            <div className="flex items-center py-2 border-b border-zinc-100">
              <span className="text-sm text-zinc-500 w-24">{t("common.name")}</span>
              <span className="text-sm text-zinc-700">: {selectedBank.Name}</span>
            </div>

            {/* Bank Name Row */}
            <div className="flex items-center py-2 border-b border-zinc-100">
              <span className="text-sm text-zinc-500 w-24">{t("bank.bankName")}</span>
              <span className="text-sm text-zinc-700">: {selectedBank.BankName}</span>
            </div>

            {/* Account No Row */}
            <div className="flex items-center py-2">
              <span className="text-sm text-zinc-500 w-24">{t("common.accountNo")}</span>
              <span className="text-sm text-zinc-700">: {selectedBank.No}</span>
            </div>
          </div>
        )}

        {/* Enter Amount - Only show when banks are linked */}
        {hasLinkedBanks && (
          <>
            <div className="mb-2">
              <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
                {t("withdrawal.enterAmount")}<span className="text-red-500">*</span>
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
                  placeholder={minAmount && maxAmount ? `Min: ${formatCurrency(minAmount)} / Max: ${formatCurrency(maxAmount)}` : t("deposit.minMax")}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
                />
              </div>
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
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={t("withdrawal.pin")}
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-4">
              <h3 className="font-roboto-medium text-zinc-700 mb-3">{t("deposit.importantNotice")}</h3>
              <div className="space-y-1 text-sm text-zinc-500 mb-4">
                <p>{t("withdrawal.minMaxLimit")}: {currency} {minAmount ? formatCurrency(minAmount) : "0.00"}/{maxAmount ? formatCurrency(maxAmount) : "0.00"}</p>
                <p>{t("withdrawal.dailyLimit")}: {currency} {formatCurrency(dailyLimit)}</p>
                <p>{t("withdrawal.dailyCount")}: {dailyFreq}</p>
              </div>
              <div className="space-y-3 text-sm text-zinc-500">
                <p>1.{t("withdrawal.notice1")}</p>
                <p>2.{t("withdrawal.notice2")}</p>
                <p>3.{t("withdrawal.notice3")}</p>
                <p>4.{t("withdrawal.notice4")}</p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Submit Button - Sticky at bottom - Only show when banks are linked */}
      {hasLinkedBanks && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200">
          <button
            onClick={handleSubmit}
            disabled={submitWithdraw.isPending || !selectedBankId || !amount || !pin}
            className="w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitWithdraw.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            {t("common.submit")}
          </button>
          {submitWithdraw.isError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {submitWithdraw.error?.message || "Withdrawal failed. Please try again."}
            </p>
          )}
        </div>
      )}
    </div>
    </RequireAuth>
  );
}
