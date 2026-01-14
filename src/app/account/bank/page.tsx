"use client";

import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useHaveBankAccount } from "@/hooks/use-user";
import type { BankAccount } from "@/lib/api/types";

export default function BankAccountsPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error } = useHaveBankAccount({
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.bankAccount")} backHref="/account" />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  const linkedAccounts: BankAccount[] = data?.Accounts ?? [];
  const hasLinkedAccounts = data?.Have && linkedAccounts.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="subpage" title={t("account.bankAccount")} backHref="/account" />

      <main className="flex-1 px-4 py-6 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-white animate-pulse border border-zinc-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-6 text-center">
            <p className="text-sm text-red-500">{t("common.errorLoading")}</p>
          </div>
        ) : hasLinkedAccounts ? (
          <div className="space-y-3">
            {linkedAccounts.map((account) => (
              <div
                key={account.Id}
                className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-roboto-semibold text-zinc-800">
                        {account.BankName}
                      </p>
                      <p className="text-xs text-zinc-500">{account.AccountName}</p>
                      <p className="text-sm text-zinc-600 font-mono">
                        {account.AccountNo}
                      </p>
                    </div>
                  </div>
                  {account.IsPrimary && (
                    <span className="text-xs font-roboto-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {t("account.primaryAccount")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : data?.Have ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 text-center">
            <p className="text-sm text-zinc-600">
              {t("account.noBankData")}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-200 py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-zinc-500">
              {t("account.noBankAccounts")}
            </p>
          </div>
        )}
      </main>

      <div className="p-4 border-t border-zinc-100 bg-white">
        <button
          type="button"
          onClick={() => router.push("/account/bank/add")}
          className="w-full py-3.5 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          {t("account.addBankAccount")}
        </button>
      </div>
    </div>
  );
}
