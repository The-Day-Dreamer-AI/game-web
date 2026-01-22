"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useTransferInfo, usePostTransfer } from "@/hooks/use-contact";

export default function TransferPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showError } = useToast();

  // Get target ID from query param
  const targetId = searchParams.get("id") || "";

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch transfer info
  const {
    data: transferInfo,
    isLoading,
    error,
  } = useTransferInfo(targetId, {
    enabled: isAuthenticated && !!targetId,
  });

  // Transfer mutation
  const postTransfer = usePostTransfer();

  // Handle error - show toast and redirect back
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : t("transfer.loadFailed");
      showError(errorMessage);
      router.back();
    }
  }, [error, showError, t, router]);

  const handleTransfer = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!targetId || !amount || !pin) return;

    try {
      const response = await postTransfer.mutateAsync({
        Id: targetId,
        Amount: parseFloat(amount),
        Pin: pin,
      });

      if (response.Code === 0) {
        setShowConfirm(false);
        setShowSuccess(true);
      } else {
        // Show error message from API via toast
        showError(response.Message || t("transfer.failed"));
        setShowConfirm(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("transfer.failed");
      showError(errorMessage);
      setShowConfirm(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/account/contact");
  };

  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("transfer.title")}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("transfer.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  if (!targetId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("transfer.title")}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("transfer.noRecipient")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("transfer.title")}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  // If error or no transfer info, show loading (will redirect via useEffect)
  if (error || !transferInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("transfer.title")}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  const displayName = transferInfo.Name || transferInfo.Username;
  const availableCash = transferInfo.AvailableCash ?? 0;
  const currency = transferInfo.Currency || "MYR";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("transfer.title")} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Contact Avatar & Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-200 mb-4">
            {!imgError && transferInfo.Image ? (
              <Image
                src={transferInfo.Image}
                alt={displayName}
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-roboto-bold text-2xl">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-xl font-roboto-bold text-[#28323C]">
            {displayName}
          </h2>
          <span className="text-sm text-[#28323C]">
            UID: {transferInfo.Username}
          </span>
        </div>

        {/* Amount Field */}
        <div className="mb-4">
          <FormInput
            type="number"
            placeholder={t("transfer.amountPlaceholder")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
          <p className="mt-1 text-sm text-[#5F7182] font-roboto-regular">
            {t("transfer.availableBalance")}:{" "}
            <span className="text-primary font-roboto-regular">
              {currency}{" "}
              {availableCash.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

        {/* PIN Field */}
        <div className="mb-6">
          <FormInput
            type="password"
            placeholder={t("transfer.pin")}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
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

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={!amount || !pin || postTransfer.isPending}
          className="cursor-pointer w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("transfer.transferButton")}
        </button>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !postTransfer.isPending && setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
            <p className="text-center text-zinc-800 mb-6">
              {t("transfer.confirmMessage")}{" "}
              <span className="text-primary font-roboto-medium">
                {currency} {formattedAmount}
              </span>{" "}
              {t("transfer.toFriend")}{" "}
              <span className="text-primary font-roboto-medium">
                {displayName}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={postTransfer.isPending}
                className="cursor-pointer flex-1 py-3 bg-dark text-white font-roboto-medium rounded-lg hover:bg-dark/90 transition-colors disabled:opacity-50"
              >
                {t("transfer.cancel")}
              </button>
              <button
                onClick={handleConfirm}
                disabled={postTransfer.isPending}
                className="cursor-pointer flex-1 py-3 bg-primary text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {postTransfer.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("transfer.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleSuccessClose}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-roboto-semibold text-zinc-800 mb-2">
              {t("transfer.successTitle")}
            </h3>
            <p className="text-zinc-600 mb-6">
              {currency} {formattedAmount} {t("transfer.successMessage")} {displayName}.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 bg-primary text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("transfer.ok")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
