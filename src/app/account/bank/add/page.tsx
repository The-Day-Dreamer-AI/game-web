"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Building2, Loader2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useUserBanks, useRequestBankTac, useAddBankAccount } from "@/hooks/use-bank";

export default function AddBankAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  // Fetch available banks list - also checks if PIN is set
  const { data: banksData, isLoading: isLoadingBanks, error: banksError } = useUserBanks({
    enabled: isAuthenticated,
  });

  const requestTac = useRequestBankTac();
  const addBankAccount = useAddBankAccount();

  const [selectedBankId, setSelectedBankId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [tac, setTac] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [tacExpiresIn, setTacExpiresIn] = useState<number | null>(null);
  const [tacRequested, setTacRequested] = useState(false);

  // Check if user needs to set PIN first (Code: 1)
  useEffect(() => {
    if (banksData?.Code === 1) {
      // Redirect to reset PIN page
      router.replace("/account/reset-pin?from=add-bank");
    }
  }, [banksData, router]);

  // Pre-fill account name from API response
  useEffect(() => {
    if (banksData?.FullName && !accountName) {
      setAccountName(banksData.FullName);
    }
  }, [banksData, accountName]);

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

  const selectedBank = banksData?.Rows?.find(b => b.Id === selectedBankId);

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
    if (!selectedBankId || !accountName || !accountNumber || !tac) return;

    try {
      await addBankAccount.mutateAsync({
        Name: accountName,
        No: accountNumber,
        Tac: tac,
        UserBankId: selectedBankId,
      });
      // On success, redirect back to bank accounts list then to withdrawal
      router.push("/withdrawal");
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
        <Header variant="subpage" title={t("account.addBankAccount")} backHref="/withdrawal" />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  // Show loading while checking if PIN is required
  if (isLoadingBanks) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.addBankAccount")} backHref="/withdrawal" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // Show error if failed to load banks
  if (banksError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.addBankAccount")} backHref="/withdrawal" />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-red-500 text-center">
            {t("common.errorLoading")}
          </p>
        </div>
      </div>
    );
  }

  // Don't render form if redirecting to PIN page
  if (banksData?.Code === 1) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.addBankAccount")} backHref="/withdrawal" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const bankOptions = banksData?.Rows ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="subpage" title={t("account.addBankAccount")} backHref="/withdrawal" />

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
                <div className="flex items-center gap-3">
                  {selectedBank?.Image && (
                    <Image
                      src={selectedBank.Image}
                      alt={selectedBank.Name}
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                      unoptimized
                    />
                  )}
                  <span className={cn(
                    selectedBankId ? "text-zinc-700" : "text-zinc-400"
                  )}>
                    {selectedBank?.Name || t("bank.selectBank")}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-zinc-400 transition-transform",
                  showBankDropdown && "rotate-180"
                )} />
              </button>

              {showBankDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {bankOptions.map((bank) => (
                    <button
                      key={bank.Id}
                      type="button"
                      onClick={() => {
                        setSelectedBankId(bank.Id);
                        setShowBankDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 flex items-center justify-between gap-3",
                        selectedBankId === bank.Id && "bg-primary/5 text-primary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {bank.Image && (
                          <Image
                            src={bank.Image}
                            alt={bank.Name}
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                            unoptimized
                          />
                        )}
                        <span>{bank.Name}</span>
                      </div>
                      {selectedBankId === bank.Id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Name */}
          <div>
            <label className="text-sm font-roboto-medium text-zinc-700 mb-2 block">
              {t("bank.accountName")}<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Building2 className="w-5 h-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder={t("bank.enterAccountName")}
                className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary"
              />
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
          disabled={addBankAccount.isPending || !selectedBankId || !accountName || !accountNumber || !tac}
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
