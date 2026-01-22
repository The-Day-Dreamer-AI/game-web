"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useRedeemCode } from "@/hooks";

export default function RedeemCodePage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  const [redeemCode, setRedeemCode] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redeem code mutation
  const redeemCodeMutation = useRedeemCode();

  const handleConfirm = async () => {
    if (!redeemCode.trim()) {
      setMessage({ type: "error", text: t("redeemCode.enterCode") });
      return;
    }

    setMessage(null);

    try {
      const response = await redeemCodeMutation.mutateAsync({
        RedeemCode: redeemCode.trim(),
      });

      if (response.Code === 0) {
        setMessage({
          type: "success",
          text: response.Message || t("redeemCode.success"),
        });
        setRedeemCode("");
      } else {
        setMessage({
          type: "error",
          text: response.Message || t("redeemCode.invalid"),
        });
      }
    } catch (error) {
      console.error("Failed to redeem code:", error);
      setMessage({ type: "error", text: t("redeemCode.failed") });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("account.redeemCode")}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("account.redeemCode")}
      />

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* Redeem Code Input */}
        <FormInput
          type="text"
          placeholder={t("redeemCode.placeholder")}
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
          prefix={
            <Image
              src="/images/icon/redeem_code_icon.png"
              alt="Redeem Code"
              width={24}
              height={24}
              unoptimized
              className="h-6 w-auto object-contain"
            />
          }
        />

        {/* Message */}
        {/* {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )} */}

        {/* Confirm Button - Same style as change username page */}
        <button
          onClick={handleConfirm}
          disabled={redeemCodeMutation.isPending}
          className="cursor-pointer uppercase w-full py-3 bg-primary text-white font-roboto-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {redeemCodeMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("common.loading")}
            </>
          ) : (
            t("common.confirm")
          )}
        </button>
      </main>
    </div>
  );
}
