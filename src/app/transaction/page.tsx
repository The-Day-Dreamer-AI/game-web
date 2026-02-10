"use client";

import { useState, useMemo } from "react";
import { RequireAuth } from "@/components/auth";
import { Dropdown } from "@/components/ui/dropdown";
import { Copy, Check } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { useTransactions } from "@/hooks/use-transactions";
import Image from "next/image";

type TransactionStatus = "progress" | "failed" | "success";

// Generate last 12 months dynamically from current date
function getLast12Months() {
  const months: { value: string; label: string; month: string; year: number; dateFrom: string; dateTo: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    // Calculate date range for the month
    const firstDay = new Date(year, date.getMonth(), 1);
    const lastDay = new Date(year, date.getMonth() + 1, 0);

    months.push({
      value: `${monthName}-${year}`,
      label: `${monthName}-${year}`,
      month: monthName,
      year: year,
      dateFrom: firstDay.toISOString().split("T")[0],
      dateTo: lastDay.toISOString().split("T")[0],
    });
  }

  return months;
}

// Map API transaction type to display status
function getTransactionStatus(type: string): TransactionStatus {
  const typeLower = type.toLowerCase();
  if (typeLower.includes("pending") || typeLower.includes("progress")) {
    return "progress";
  }
  if (typeLower.includes("fail") || typeLower.includes("reject") || typeLower.includes("cancel")) {
    return "failed";
  }
  return "success";
}

// Format date from API
function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

export default function TransactionPage() {
  const monthOptions = getLast12Months();
  const [selectedType, setSelectedType] = useState("deposit");
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t } = useI18n();

  const transactionTypeOptions = [
    { value: "deposit", label: t("transaction.deposit") },
    { value: "withdrawal", label: t("transaction.withdrawal") },
    { value: "transfer", label: t("transaction.transfer") },
    { value: "bonus", label: t("transaction.bonus") },
  ];

  const statusConfig: Record<TransactionStatus, { labelKey: string; className: string }> = {
    progress: { labelKey: "common.progress", className: "bg-primary text-white" },
    failed: { labelKey: "common.failed", className: "bg-red-500 text-white" },
    success: { labelKey: "common.success", className: "bg-primary text-white" },
  };

  const selectedMonthData = monthOptions.find((m) => m.value === selectedMonth);

  // Fetch transactions from API
  const { data: transactionsData, isLoading, error } = useTransactions({
    page: 1,
    dateFrom: selectedMonthData?.dateFrom,
    dateTo: selectedMonthData?.dateTo,
  });

  // Transform API data
  const transactions = useMemo(() => {
    if (!transactionsData?.Rows) return [];

    return transactionsData.Rows.map((tx) => {
      const { date, time } = formatDate(tx.CreatedDate);
      return {
        id: tx.Id,
        date,
        time,
        transId: tx.Id,
        amount: tx.Amount,
        status: getTransactionStatus(tx.Type),
        description: tx.Description,
        type: tx.Type,
      };
    });
  }, [transactionsData]);

  const handleCopy = async (transId: string) => {
    await navigator.clipboard.writeText(transId);
    setCopiedId(transId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col">

      {/* Filters */}
      <div className="px-4 py-3 flex gap-3">
        <Dropdown
          options={transactionTypeOptions}
          value={selectedType}
          onChange={setSelectedType}
          className="flex-1"
        />
        <Dropdown
          options={monthOptions}
          value={selectedMonth}
          onChange={setSelectedMonth}
          className="flex-1"
        />
      </div>

      {/* Month Banner */}
      <div className="h-26 bg-primary flex items-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
            <Image
              src="/images/icon/A1_logo_white.png"
              alt="AON1E"
              width={200}
              height={200}
              unoptimized
              className="h-24 w-auto object-contain absolute right-0 top-2"
            />
        </div>
        <p className="text-white text-xl italic font-roboto-semibold">
          {selectedMonthData?.month} <span className="text-sm font-roboto-regular not-italic">{selectedMonthData?.year}</span>
        </p>
      </div>

      {!isLoading && (error || transactions.length === 0) ? (
            <div className="flex-1 flex flex-col py-12">
            {/* Empty State Icon - Clipboard with X */}
            <div className="flex flex-col justify-center items-center py-12 text-[#A9ADB1] text-xs font-roboto-medium gap-9">
              <Image
                src="/images/icon/no_report_icon.png"
                alt="AON1E"
                width={200}
                height={200}
                unoptimized
                className="h-36 w-auto object-contain"
              />
              {t("redeemGift.noHistory")}
            </div>
          </div>
          ) :
      <div className="flex-1 overflow-auto">
        {/* Table Header */}
        <div className="sticky top-0 bg-zinc-700 px-4 py-3 grid grid-cols-[80px_1fr_90px_80px] gap-2 text-sm text-white font-roboto-bold text-center items-center">
          <span>{t("common.date")}</span>
          <span>{t("common.transId")}</span>
          <span className="text-center">{t("common.amount")}<br />(MYR)</span>
          <span className="text-center">{t("common.status")}</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-100">
          {isLoading ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 grid grid-cols-[80px_1fr_90px_80px] gap-2 items-center"
              >
                <div className="space-y-1">
                  <div className="h-3 bg-zinc-200 rounded animate-pulse w-16" />
                  <div className="h-3 bg-zinc-200 rounded animate-pulse w-10" />
                </div>
                <div className="h-3 bg-zinc-200 rounded animate-pulse w-24" />
                <div className="h-3 bg-zinc-200 rounded animate-pulse w-16 mx-auto" />
                <div className="h-6 bg-zinc-200 rounded-full animate-pulse w-16 mx-auto" />
              </div>
            ))
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="px-4 py-3 grid grid-cols-[80px_1fr_90px_80px] gap-2 items-center text-sm"
              >
                {/* Date */}
                <div className="text-zinc-600 text-xs leading-tight">
                  <div>{tx.date}</div>
                  <div>{tx.time}</div>
                </div>

                {/* Trans ID with Copy */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-700 text-xs font-mono truncate">{tx.transId}</span>
                  <button
                    onClick={() => handleCopy(tx.transId)}
                    className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
                  >
                    {copiedId === tx.transId ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Amount */}
                <div className="text-center text-zinc-700 text-sm">
                  {formatAmount(tx.amount)}
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-roboto-medium ${statusConfig[tx.status].className}`}
                  >
                    {t(statusConfig[tx.status].labelKey)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      }

    </div>
    </RequireAuth>
  );
}
