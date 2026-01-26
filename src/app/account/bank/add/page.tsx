"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormInput } from "@/components/ui/form-input";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useUserBanks, useAddBankAccount } from "@/hooks/use-bank";

export default function AddBankAccountPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  // Fetch available banks list - also checks if PIN is set
  const {
    data: banksData,
    isLoading: isLoadingBanks,
    error: banksError,
  } = useUserBanks({
    enabled: isAuthenticated,
  });

  const addBankAccount = useAddBankAccount();

  const [selectedBankId, setSelectedBankId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // Check if user needs to set PIN first (Code: 1)
  useEffect(() => {
    if (banksData?.Code === 1) {
      // Redirect to reset PIN page
      router.replace("/account/reset-pin?from=add-bank");
    }
  }, [banksData, router]);

  const handleSubmit = async () => {
    if (!selectedBankId || !accountName || !accountNumber) return;

    try {
      await addBankAccount.mutateAsync({
        Name: accountName,
        No: accountNumber,
        Tac: "", // TAC not required per user request
        UserBankId: selectedBankId,
      });
      // On success, show toast and clear form
      showSuccess(t("bank.addSuccess"));
      setSelectedBankId("");
      setAccountNumber("");
      // Keep accountName as it's pre-filled from user's full name
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("bank.addFailed");
      showError(errorMessage);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
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
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const bankOptions = banksData?.Rows ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-4 overflow-auto">
        {/* Bank Account Selection - Grid of banks */}
        <div className="mb-6">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 flex gap-1">
            {t("bank.bankAccount")}
            <span className="text-primary">*</span>
          </label>

          <div className="grid grid-cols-5 max-[380px]:grid-cols-4 gap-3">
            {bankOptions.map((bank) => (
              <button
                key={bank.Id}
                type="button"
                onClick={() => setSelectedBankId(bank.Id)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all bg-white overflow-hidden",
                    selectedBankId === bank.Id
                      ? "border-primary"
                      : "border-zinc-200"
                  )}
                >
                  {bank.Image ? (
                    <Image
                      src={bank.Image}
                      alt={bank.Name}
                      width={44}
                      height={44}
                      className="w-11 h-11 object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-zinc-600 text-xs font-roboto-bold">
                      {bank.Name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 text-center leading-tight max-w-[56px]",
                    selectedBankId === bank.Id
                      ? "text-primary font-roboto-medium"
                      : "text-zinc-500"
                  )}
                >
                  {bank.Name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Account Info Section */}
        <div className="space-y-3">
          <label className="text-sm font-roboto-medium text-zinc-700 mb-2 flex gap-1">
            {t("bank.accountInfo")}
            <span className="text-primary">*</span>
          </label>

          {/* Bank Holder Name */}
          <FormInput
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder={t("bank.bankHolderName")}
            prefix={
              <Image
                src="/images/icon/user_icon.png"
                alt="User"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
          />

          {/* Account Number */}
          <FormInput
            type="text"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder={t("bank.accountNo")}
            prefix={
              <Image
                src="/images/icon/card_icon.png"
                alt="Card"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
          />
        </div>
      </main>

      {/* Submit Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100">
        <button
          onClick={handleSubmit}
          disabled={
            addBankAccount.isPending ||
            !selectedBankId ||
            !accountName ||
            !accountNumber
          }
          className="cursor-pointer w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase"
        >
          {addBankAccount.isPending && (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          {t("common.submit")}
        </button>
      </div>
    </div>
  );
}
