"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/auth";
import { Dropdown } from "@/components/ui/dropdown";
import { Copy, Check } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { useTransactions } from "@/hooks/use-transactions";
import type { TransactionAction } from "@/lib/api/services/transactions";
import Image from "next/image";

type TransactionStatus = "progress" | "failed" | "success";
type TableLayout = "all" | "default" | "game" | "withdraw" | "transfer";

// Generate last 12 months dynamically from current date
function getLast12Months() {
  const months: { value: string; label: string; month: string; year: number; apiMonth: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const monthNum = String(date.getMonth() + 1).padStart(2, "0");

    months.push({
      value: `${monthName}-${year}`,
      label: `${monthName}-${year}`,
      month: monthName,
      year: year,
      apiMonth: `${year}-${monthNum}`, // Format: YYYY-MM
    });
  }

  return months;
}

// Map API ActionDetail to display status
function getTransactionStatus(actionDetail: string): TransactionStatus {
  const detail = actionDetail.toLowerCase();
  if (detail.includes("request") || detail.includes("pending") || detail.includes("progress")) {
    return "progress";
  }
  if (detail.includes("fail") || detail.includes("reject") || detail.includes("cancel")) {
    return "failed";
  }
  return "success";
}

// Extract transaction reference from Remark (e.g. "DP00100379 (Ok2PayMYR)" -> "DP00100379")
function extractTransRef(remark: string): string {
  if (!remark) return "";
  const match = remark.match(/^(\S+)/);
  return match ? match[1] : remark;
}

// Truncate UUID for display
function truncateId(id: string): string {
  return id.length > 13 ? id.substring(0, 13) : id;
}

// Determine table layout based on action type
function getTableLayout(action: string): TableLayout {
  switch (action) {
    case "":
      return "all";
    case "Launch Game":
    case "Quit Game":
    case "Auto Quit Game":
      return "game";
    case "Withdraw":
      return "withdraw";
    case "Transfer In":
    case "Transfer Out":
      return "transfer";
    default:
      return "default";
  }
}

// Format date from API (e.g. "2026-01-26T12:21:31.223")
function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

// Grid class config per layout
const GRID_CLASS: Record<TableLayout, string> = {
  all: "grid-cols-[70px_80px_50px_1fr_80px]",
  default: "grid-cols-[80px_1fr_90px_80px]",
  game: "grid-cols-[70px_1fr_90px_60px_80px]",
  withdraw: "grid-cols-[70px_1fr_1fr_80px_80px]",
  transfer: "grid-cols-[70px_1fr_1fr_80px]",
};

// Transaction types that support detail view
const CLICKABLE_ACTIONS = new Set([
  "Launch Game",
  "Quit Game",
  "Auto Quit Game",
  "Deposit",
  "Withdraw",
  "Transfer In",
  "Transfer Out",
  "Payout",
  "Payout Rollback",
]);

export default function TransactionPage() {
  const monthOptions = getLast12Months();
  const [selectedType, setSelectedType] = useState<TransactionAction>("");
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { t } = useI18n();
  const router = useRouter();

  const transactionTypeOptions = [
    { value: "", label: t("transaction.all") },
    { value: "Deposit", label: t("transaction.deposit") },
    { value: "Withdraw", label: t("transaction.withdraw") },
    { value: "Transfer In", label: t("transaction.transferIn") },
    { value: "Transfer Out", label: t("transaction.transferOut") },
    { value: "Payout", label: t("transaction.payout") },
    { value: "Payout Rollback", label: t("transaction.payoutRollback") },
    { value: "Launch Game", label: t("transaction.launchGame") },
    { value: "Quit Game", label: t("transaction.quitGame") },
    { value: "Auto Quit Game", label: t("transaction.autoQuitGame") },
    { value: "Game Refund", label: t("transaction.gameRefund") },
    { value: "DailyCheckIn", label: t("transaction.dailyCheckIn") },
    { value: "FortuneWheel", label: t("transaction.fortuneWheel") },
    { value: "Bonus", label: t("transaction.bonus") },
  ];

  const statusConfig: Record<TransactionStatus, { labelKey: string; className: string }> = {
    progress: { labelKey: "common.progress", className: "bg-primary text-white" },
    failed: { labelKey: "common.failed", className: "bg-red-500 text-white" },
    success: { labelKey: "common.success", className: "bg-primary text-white" },
  };

  const selectedMonthData = monthOptions.find((m) => m.value === selectedMonth);
  const tableLayout = getTableLayout(selectedType);
  const gridClass = GRID_CLASS[tableLayout];
  const needsScroll = tableLayout === "all" || tableLayout === "game" || tableLayout === "withdraw";

  // Fetch transactions from API
  const { data: transactionsData, isLoading, error } = useTransactions({
    page: 1,
    month: selectedMonthData?.apiMonth,
    action: selectedType,
  });

  // Transform API data
  const transactions = useMemo(() => {
    if (!transactionsData?.Rows) return [];

    return transactionsData.Rows.map((tx) => {
      const { date, time } = formatDate(tx.Datetime);
      return {
        id: tx.Id,
        refId: tx.RefId,
        date,
        time,
        action: tx.Action,
        transRef: extractTransRef(tx.Remark),
        transIdShort: truncateId(tx.Id),
        amount: tx.Amount,
        status: getTransactionStatus(tx.ActionDetail || ""),
        remark: tx.Remark,
        image: tx.Image,
        actionDetail: tx.ActionDetail,
        actionDetail2: tx.ActionDetail2,
      };
    });
  }, [transactionsData]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAmount = (amount: number) => {
    return Math.abs(amount).toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  // Reusable cell renderers
  const renderDateCell = (date: string, time: string) => (
    <div className="text-[#5F7182] text-xs leading-tight font-roboto-regular text-center">
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );

  const renderTransIdCell = (displayId: string, copyId: string) => (
    <div className="flex items-center justify-center gap-1.5">
      <span className="text-[#5F7182] text-xs font-roboto-regular truncate">{displayId}</span>
      <button
        onClick={() => handleCopy(copyId)}
        className="text-[#5F7182] transition-colors shrink-0"
      >
        {copiedId === copyId ? (
          <Check className="w-4 h-4 text-primary" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  const renderAmountCell = (amount: number) => (
    <div className="text-center text-[#5F7182] text-sm font-roboto-regular">
      {formatAmount(amount)}
    </div>
  );

  const renderStatusCell = (status: TransactionStatus) => (
    <div className="flex justify-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-roboto-medium ${statusConfig[status].className}`}
      >
        {t(statusConfig[status].labelKey)}
      </span>
    </div>
  );

  // Table headers per layout
  const renderHeader = () => {
    const base = `sticky top-0 bg-[#28323C] px-4 py-1.5 grid ${gridClass} gap-2 text-sm text-white font-roboto-bold text-center items-center`;

    switch (tableLayout) {
      case "all":
        return (
          <div className={base}>
            <span>{t("common.date")}</span>
            <span></span>
            <span>{t("common.action")}</span>
            <span>{t("common.details")}</span>
            <span>{t("common.amount")}<br />(MYR)</span>
          </div>
        );
      case "game":
        return (
          <div className={base}>
            <span>{t("common.date")}</span>
            <span>{t("common.transId")}</span>
            <span>{t("transaction.provider")}</span>
            <span>{t("transaction.game")}</span>
            <span>{t("common.amount")}<br />(MYR)</span>
          </div>
        );
      case "withdraw":
        return (
          <div className={base}>
            <span>{t("common.date")}</span>
            <span>{t("common.transId")}</span>
            <span>{t("transaction.withdrawTo")}</span>
            <span>{t("common.amount")}<br />(MYR)</span>
            <span>{t("common.status")}</span>
          </div>
        );
      case "transfer":
        return (
          <div className={base}>
            <span>{t("common.date")}</span>
            <span>{t("common.transId")}</span>
            <span>{t("transaction.transferTo")}</span>
            <span>{t("common.amount")}<br />(MYR)</span>
          </div>
        );
      default:
        return (
          <div className={base}>
            <span>{t("common.date")}</span>
            <span>{t("common.transId")}</span>
            <span>{t("common.amount")}<br />(MYR)</span>
            <span>{t("common.status")}</span>
          </div>
        );
    }
  };

  const handleRowClick = (tx: (typeof transactions)[number]) => {
    if (CLICKABLE_ACTIONS.has(tx.action)) {
      // Deposit and Withdraw use RefId for the detail API
      const detailId = (tx.action === "Deposit" || tx.action === "Withdraw") ? tx.refId : tx.id;
      router.push(`/transaction/${detailId}?action=${encodeURIComponent(tx.action)}`);
    }
  };

  // Table row per layout
  const renderRow = (tx: (typeof transactions)[number]) => {
    const isClickable = CLICKABLE_ACTIONS.has(tx.action);
    const base = `shadow-xs rounded-lg px-4 py-4 grid ${gridClass} gap-2 border-black items-center text-sm bg-gradient-to-b from-white to-[#F2F4F9]${isClickable ? " cursor-pointer active:scale-[0.99] transition-transform" : ""}`;

    switch (tableLayout) {
      case "all":
        return (
          <div key={tx.id} className={base} onClick={() => handleRowClick(tx)}>
            {renderDateCell(tx.date, tx.time)}
            <div className="flex justify-center">
              {tx.image ? (
                <Image
                  src={tx.image}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-200" />
              )}
            </div>
            <div className="text-[#5F7182] text-xs font-roboto-medium text-center leading-tight">
              {tx.action}
            </div>
            <div className="text-[#5F7182] text-xs font-roboto-regular text-center truncate">
              {tx.remark || "-"}
            </div>
            {renderAmountCell(tx.amount)}
          </div>
        );
      case "game":
        return (
          <div key={tx.id} className={base} onClick={() => handleRowClick(tx)}>
            {renderDateCell(tx.date, tx.time)}
            {renderTransIdCell(tx.transIdShort, tx.id)}
            <div className="text-[#5F7182] text-xs font-roboto-regular text-center">{tx.remark}</div>
            <div className="flex justify-center">
              {tx.image ? (
                <Image
                  src={tx.image}
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-200" />
              )}
            </div>
            {renderAmountCell(tx.amount)}
          </div>
        );
      case "withdraw":
        return (
          <div key={tx.id} className={base} onClick={() => handleRowClick(tx)}>
            {renderDateCell(tx.date, tx.time)}
            {renderTransIdCell(tx.transRef, tx.transRef)}
            <div className="text-[#5F7182] text-xs font-roboto-regular text-center leading-tight">
              {tx.actionDetail2 || tx.remark || "-"}
            </div>
            {renderAmountCell(tx.amount)}
            {renderStatusCell(tx.status)}
          </div>
        );
      case "transfer":
        return (
          <div key={tx.id} className={base} onClick={() => handleRowClick(tx)}>
            {renderDateCell(tx.date, tx.time)}
            {renderTransIdCell(tx.transIdShort, tx.id)}
            <div className="text-[#5F7182] text-xs font-roboto-regular text-center leading-tight">
              {tx.remark || "-"}
            </div>
            {renderAmountCell(tx.amount)}
          </div>
        );
      default:
        return (
          <div key={tx.id} className={base} onClick={() => handleRowClick(tx)}>
            {renderDateCell(tx.date, tx.time)}
            {renderTransIdCell(tx.transRef, tx.transRef)}
            {renderAmountCell(tx.amount)}
            {renderStatusCell(tx.status)}
          </div>
        );
    }
  };

  // Loading skeleton per layout
  const renderSkeleton = () => {
    const colCount = tableLayout === "all" || tableLayout === "game" || tableLayout === "withdraw" ? 5 : 4;
    return [...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`px-4 py-3 grid ${gridClass} gap-2 items-center`}
      >
        <div className="space-y-1">
          <div className="h-3 bg-zinc-200 rounded animate-pulse w-14" />
          <div className="h-3 bg-zinc-200 rounded animate-pulse w-10" />
        </div>
        <div className="h-3 bg-zinc-200 rounded animate-pulse w-20 mx-auto" />
        {colCount >= 4 && <div className="h-3 bg-zinc-200 rounded animate-pulse w-16 mx-auto" />}
        {colCount >= 5 && <div className="h-3 bg-zinc-200 rounded animate-pulse w-16 mx-auto" />}
        {(tableLayout === "default" || tableLayout === "withdraw") && (
          <div className="h-6 bg-zinc-200 rounded-full animate-pulse w-16 mx-auto" />
        )}
      </div>
    ));
  };

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col">

      {/* Filters */}
      <div className="px-4 py-3 flex gap-3">
        <Dropdown
          options={transactionTypeOptions}
          value={selectedType}
          onChange={(val) => setSelectedType(val as TransactionAction)}
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
        <div className={needsScroll ? "overflow-x-auto" : ""}>
          <div className={needsScroll ? "min-w-[530px]" : ""}>
            {/* Table Header */}
            {renderHeader()}

            {/* Table Body */}
            <div className="flex flex-col gap-1 p-1">
              {isLoading ? renderSkeleton() : transactions.map(renderRow)}
            </div>
          </div>
        </div>
      </div>
      }

    </div>
    </RequireAuth>
  );
}
