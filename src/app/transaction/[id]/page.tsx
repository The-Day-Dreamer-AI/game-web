"use client";

import { use, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useTransactionDetail } from "@/hooks";
import type {
  GameTransactionDetail,
  DepositTransactionDetail,
  TransferTransactionDetail,
  PayoutTransactionDetail,
} from "@/lib/api/types";

// Type guards
function isGameDetail(detail: unknown): detail is GameTransactionDetail {
  return (detail as GameTransactionDetail).GameName !== undefined;
}

function isDepositOrWithdrawDetail(
  detail: unknown
): detail is DepositTransactionDetail {
  return (detail as DepositTransactionDetail).No !== undefined;
}

function formatDate(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year} ${month} ${day} ${hours}:${minutes}`;
}

function formatAmount(amount: number): string {
  return Math.abs(amount).toLocaleString("en-MY", { minimumFractionDigits: 2 });
}

function getStatusColor(status: string): string {
  const s = status?.toLowerCase() || "";
  if (s.includes("fail") || s.includes("reject") || s.includes("cancel")) {
    return "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)";
  }
  if (s.includes("pending") || s.includes("progress") || s.includes("processing")) {
    return "linear-gradient(135deg, #E5A820 0%, #FFC036 100%)";
  }
  return "#0DC3B1";
}

function getStatusLabel(status: string, t: (key: string) => string): string {
  const s = status?.toLowerCase() || "";
  if (s.includes("fail")) return t("common.failed");
  if (s.includes("reject") || s.includes("cancel")) return t("common.failed");
  if (s === "new") return t("common.new");
  if (s.includes("pending") || s.includes("progress") || s.includes("processing")) return t("common.progress");
  return t("common.success");
}

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "";
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const { data: detail, isLoading, error } = useTransactionDetail(id, action, {
    enabled: isAuthenticated && !!action,
  });

  // Redirect back to /transaction on error or missing action
  useEffect(() => {
    if (!action || (error && !isLoading)) {
      router.replace("/transaction");
    }
  }, [action, error, isLoading, router]);

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

  if (isLoading || error || !detail) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // Determine which layout to render based on action
  if (isGameDetail(detail)) {
    return <GameDetailView detail={detail} t={t} />;
  }
  if (isDepositOrWithdrawDetail(detail)) {
    return <DepositWithdrawDetailView detail={detail as DepositTransactionDetail} action={action} t={t} />;
  }
  return <TransferPayoutDetailView detail={detail as TransferTransactionDetail | PayoutTransactionDetail} action={action} t={t} />;
}

// ========== Game Detail (Launch Game / Quit Game / Auto Quit Game) ==========
function GameDetailView({ detail, t }: { detail: GameTransactionDetail; t: (key: string) => string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F9]">
      {/* Header */}
      <div
        className="h-28 flex items-start p-4 relative overflow-hidden"
        style={{ background: "#0DC3B1" }}
      >
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
          {detail.Action}
        </p>
      </div>

      {/* Detail Card */}
      <div className="relative z-10 px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
          {/* Game Info */}
          <div className="bg-white grid grid-cols-[3fr_7fr] items-center gap-4">
            <div className="w-full h-full aspect-square relative shrink-0">
              {detail.GameImage ? (
                <Image
                  src={detail.GameImage}
                  alt={detail.GameName}
                  fill
                  className="object-contain rounded-lg"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-zinc-200 rounded-lg" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[#5F7182] font-roboto-regular">
                  {t("transaction.game")}
                </span>
                <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                  {detail.GameName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[#5F7182] font-roboto-regular">
                  {t("common.action")}
                </span>
                <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                  {detail.Action}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#d4f1f0] h-px" />

          {/* Details */}
          <div className="flex flex-col gap-2">
            <DetailRow label={t("transaction.transactionId")} value={detail.Id} />
            <DetailRow label={t("transaction.type")} value={detail.Type} />
            <DetailRow label={t("transaction.currency")} value={detail.Currency} />
            <DetailRow label={t("common.amount")} value={`${detail.Currency} ${formatAmount(detail.Amount)}`} />
            <DetailRow label={t("common.date")} value={formatDate(detail.Datetime)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Deposit / Withdraw Detail ==========
function DepositWithdrawDetailView({
  detail,
  action,
  t,
}: {
  detail: DepositTransactionDetail;
  action: string;
  t: (key: string) => string;
}) {
  const statusBg = getStatusColor(detail.Status);
  const statusLabel = getStatusLabel(detail.Status, t);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F9]">
      {/* Status Header */}
      <div
        className="h-28 flex items-start p-4 relative overflow-hidden"
        style={{ background: statusBg }}
      >
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
          {statusLabel}
        </p>
      </div>

      {/* Detail Card */}
      <div className="relative z-10 px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
          {/* Bank Info (if available) */}
          {detail.BankImage && (
            <>
              <div className="bg-white grid grid-cols-[3fr_7fr] items-center gap-4">
                <div className="w-full h-full aspect-square relative shrink-0">
                  <Image
                    src={detail.BankImage}
                    alt={detail.BankName || ""}
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-[#5F7182] font-roboto-regular">
                      {t("transaction.bank")}
                    </span>
                    <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                      {detail.BankName || "-"}
                    </span>
                  </div>
                  {detail.BankAccountName && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[#5F7182] font-roboto-regular">
                        {t("transaction.accountName")}
                      </span>
                      <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                        {detail.BankAccountName}
                      </span>
                    </div>
                  )}
                  {detail.BankAccountNo && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-[#5F7182] font-roboto-regular">
                        {t("common.accountNo")}
                      </span>
                      <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                        {detail.BankAccountNo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-[#d4f1f0] h-px" />
            </>
          )}

          {/* Details */}
          <div className="flex flex-col gap-2">
            <DetailRow
              label={action === "Deposit" ? t("transaction.depositNo") : t("transaction.withdrawNo")}
              value={detail.No}
            />
            <DetailRow label={t("transaction.transactionId")} value={detail.Id} />
            <DetailRow label={t("transaction.type")} value={detail.Type} />
            <DetailRow label={t("transaction.currency")} value={detail.Currency} />
            <DetailRow label={t("common.amount")} value={`${detail.Currency} ${formatAmount(detail.Amount)}`} />
            <DetailRow label={t("common.date")} value={formatDate(detail.Datetime)} />
            <DetailRow label={t("common.status")} value={statusLabel} />
            {detail.RejectReason && (
              <DetailRow label={t("transaction.rejectReason")} value={detail.RejectReason} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Transfer / Payout Detail ==========
function TransferPayoutDetailView({
  detail,
  action,
  t,
}: {
  detail: TransferTransactionDetail | PayoutTransactionDetail;
  action: string;
  t: (key: string) => string;
}) {
  const status = (detail as TransferTransactionDetail).Status || "";
  const statusBg = status ? getStatusColor(status) : "#0DC3B1";
  const statusLabel = status ? getStatusLabel(status, t) : action;

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F9]">
      {/* Header */}
      <div
        className="h-28 flex items-start p-4 relative overflow-hidden"
        style={{ background: statusBg }}
      >
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
          {statusLabel}
        </p>
      </div>

      {/* Detail Card */}
      <div className="relative z-10 px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <DetailRow label={t("transaction.transactionId")} value={detail.Id} />
            <DetailRow label={t("common.action")} value={action} />
            <DetailRow label={t("transaction.type")} value={detail.Type} />
            <DetailRow label={t("transaction.currency")} value={detail.Currency} />
            <DetailRow label={t("common.amount")} value={`${detail.Currency} ${formatAmount(detail.Amount)}`} />
            <DetailRow label={t("common.date")} value={formatDate(detail.Datetime)} />
            {status && <DetailRow label={t("common.status")} value={statusLabel} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Shared Components ==========
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-[#5F7182] font-roboto-regular shrink-0">
        {label}
      </span>
      <span className="text-sm font-roboto-medium text-[#28323C] text-right break-all ml-4">
        {value || "-"}
      </span>
    </div>
  );
}
