"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { Building2, Loader2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRequestBankTac, useAddBankAccount } from "@/hooks/use-bank";

// Common Malaysian banks
const BANK_OPTIONS = [
  "Maybank",
  "CIMB Bank",
  "Public Bank",
  "RHB Bank",
  "Hong Leong Bank",
  "AmBank",
  "Bank Islam",
  "Bank Rakyat",
  "Affin Bank",
  "BSN",
  "OCBC Bank",
  "HSBC Bank",
  "Standard Chartered",
  "UOB Bank",
];

export default function AddBankAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  const requestTac = useRequestBankTac();
  const addBankAccount = useAddBankAccount();

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [tac, setTac] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [tacExpiresIn, setTacExpiresIn] = useState<number | null>(null);
  const [tacRequested, setTacRequested] = useState(false);

  // Countdown timer for TAC
  useEffect(() => {
    if (tacExpiresIn === null || tacExpiresIn <= 0) return;

    const timer = setInterval(() => {
      setTacExpiresIn((prev) => {
        if (prev === null || prev <= 0) {
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tacExpiresIn]);

  const handleRequestTac = async () => {
    try {
      const response = await requestTac.mutateAsync();
      setTacRequested(true);
      setTacExpiresIn(response.ExpiresIn || 300); // Default 5 minutes
    } catch (error) {
      console.error("Failed to request TAC:", error);
    }
  };

  const handleSubmit = async () => {
    if (!bankName || !accountNumber || !tac) return;

    try {
      await addBankAccount.mutateAsync({
        BankName: bankName,
        AccountNumber: accountNumber,
        Tac: tac,
      });
      // On success, redirect back to bank accounts list
      router.push("/account/bank");
    } catch (error) {
      console.error("Failed to add bank account:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.addBankAccount")} backHref="/account/bank" />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="subpage" title={t("account.addBankAccount")} backHref="/account/bank" />

      <main className="flex-1 px-4 py-6">
        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 space-y-4">
          {/* Bank Name Dropdown */}
          <div>
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("bank.bankName")}<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-left flex items-center justify-between focus:outline-none focus:border-primary"
              >
                <span className={cn(
                  bankName ? "text-zinc-700" : "text-zinc-400"
                )}>
                  {bankName || t("bank.selectBank")}
                </span>
                <ChevronDown className={cn(
                  "w-5 h-5 text-zinc-400 transition-transform",
                  showBankDropdown && "rotate-180"
                )} />
              </button>

              {showBankDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {BANK_OPTIONS.map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => {
                        setBankName(bank);
                        setShowBankDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 flex items-center justify-between",
                        bankName === bank && "bg-primary/5 text-primary"
                      )}
                    >
                      {bank}
                      {bankName === bank && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("bank.accountNumber")}<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Building2 className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder={t("bank.enterAccountNumber")}
                className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* TAC Code */}
          <div>
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("bank.tacCode")}<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tac}
                onChange={(e) => setTac(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder={t("bank.enterTac")}
                maxLength={6}
                className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleRequestTac}
                disabled={requestTac.isPending || (tacExpiresIn !== null && tacExpiresIn > 0)}
                className="px-4 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                {requestTac.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : tacExpiresIn !== null && tacExpiresIn > 0 ? (
                  formatTime(tacExpiresIn)
                ) : (
                  t("bank.requestTac")
                )}
              </button>
            </div>
            {tacRequested && requestTac.isSuccess && (
              <p className="text-xs text-green-600 mt-1">
                {t("bank.tacSent")}
              </p>
            )}
            {requestTac.isError && (
              <p className="text-xs text-red-500 mt-1">
                {requestTac.error?.message || t("bank.tacRequestFailed")}
              </p>
            )}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            {t("bank.addBankNote")}
          </p>
        </div>
      </main>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-200">
        <button
          onClick={handleSubmit}
          disabled={addBankAccount.isPending || !bankName || !accountNumber || !tac}
          className="w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {addBankAccount.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          {t("common.submit")}
        </button>
        {addBankAccount.isError && (
          <p className="text-red-500 text-sm text-center mt-2">
            {addBankAccount.error?.message || t("bank.addFailed")}
          </p>
        )}
      </div>
    </div>
  );
}
