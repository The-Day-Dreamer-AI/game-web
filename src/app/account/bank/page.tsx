"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Loader2, X } from "lucide-react";
import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useUserBankAccounts, useDeleteBankAccount } from "@/hooks/use-bank";
import type { UserBankAccount } from "@/lib/api/types";

export default function BankAccountsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const { data, isLoading, error } = useUserBankAccounts({
    enabled: isAuthenticated,
  });
  const deleteBankAccount = useDeleteBankAccount();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<UserBankAccount | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleDeleteClick = (account: UserBankAccount) => {
    setAccountToDelete(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAccountToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      await deleteBankAccount.mutateAsync({ Id: accountToDelete.Id });
      showSuccess(t("bank.deleteSuccess") || "Bank account deleted successfully");
      handleCloseModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("bank.deleteFailed");
      showError(errorMessage);
      handleCloseModal();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("account.bankAccount")}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  const bankAccounts = data?.Rows ?? [];
  const hasBankAccounts = bankAccounts.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="subpage"
        title={t("account.bankAccount")}
      />

      <main className="flex-1 px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-xl bg-white animate-pulse border border-zinc-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <p className="text-sm text-red-500">{t("common.errorLoading")}</p>
          </div>
        ) : hasBankAccounts ? (
          // Bank accounts list
          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <div
                key={account.Id}
                className="shadow-sm grid grid-cols-[auto_1fr_0.25fr] gap-4 p-4 bg-[#D4F1F0] rounded-2xl items-center"
              >
                <div className="w-full h-auto aspect-square rounded-xl bg-white flex items-center justify-center p-4">
                  {account.BankImage ? (
                    <Image
                      src={account.BankImage}
                      alt={account.BankName}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain rounded-full"
                      unoptimized
                    />
                  ) : (
                    <span className="text-zinc-600 text-xs font-roboto-bold">
                      {account.BankName.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-roboto-bold text-[#5F7182]">
                    {account.BankName}
                  </p>
                  <p className="text-base text-[#28323C] font-roboto-bold">
                    {account.No}
                  </p>
                  <p className="text-sm text-[#5F7182] font-roboto-regular">{account.Name}</p>
                </div>
                {/* Delete Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDeleteClick(account)}
                    className="p-2 text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state - centered card with X icon
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-5">
            {/* Card with X icon */}
            <div className="relative mb-4">
              <Image
                src="/images/icon/no_bank_account_icon.png"
                alt="Username"
                width={24}
                height={24}
                unoptimized
                className="h-28 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#959595] font-roboto-regular">
              {t("bank.noBanksAdded")}
            </p>
          </div>
        )}
      </main>

      {/* Add Bank Account Button - Sticky at bottom */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-primary">
        <button
          type="button"
          onClick={() => router.push("/account/bank/add")}
          className="cursor-pointer w-full py-4 bg-primary text-white font-roboto-semibold rounded-xl uppercase"
        >
          {t("account.addBankAccount")}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && accountToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-hidden"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-[350px] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Content */}
            <div className="px-4 pb-4 py-6 pt-8 text-center">

              {/* Title */}
              <h3 className="text-base font-roboto-bold text-[#28323C] mb-6">
                {t("bank.deleteConfirmTitle")}
              </h3>

              {/* Action Buttons */}
              <div className="flex gap-3 font-roboto-bold text-[14px]">
                <button
                  onClick={handleCloseModal}
                  disabled={deleteBankAccount.isPending}
                  className="shadow-lg font-roboto-bold bg-[#28323C] uppercase cursor-pointer flex-1 py-3 text-white rounded-lg disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteBankAccount.isPending}
                  className="shadow-lg font-roboto-bold cursor-pointer uppercase flex-1 py-3 bg-[#FF4444] text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteBankAccount.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
