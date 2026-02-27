"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useMyRewards } from "@/hooks";
import { cn } from "@/lib/utils";

export default function RedeemHistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Fetch my rewards history
  const { data: myRewardsData, isLoading } = useMyRewards({
    enabled: isAuthenticated,
  });

  const rewards = myRewardsData?.Rewards ?? [];

  const formatPoints = (points: number) => {
    return points.toLocaleString("en-US");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    // Handle formats like "DD/MM/YYYY HH:mm:ss" or "DD/MM/YYYY"
    const normalized = dateString.includes("/")
      ? dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
      : dateString;
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "progress":
      case "processing":
        return "bg-amber-500 text-white";
      default:
        return "bg-primary text-white";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return "Success";
      case "progress":
      case "pending":
      case "processing":
        return "Progress";
      case "failed":
        return "Failed";
      case "rejected":
        return "Rejected";
      default:
        return status;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Rewards History List */}
      <main className="flex-1 overflow-auto">
        {rewards.length > 0 ? (
          <div className="divide-y divide-zinc-200">
            {rewards.map((reward) => (
              <div
                key={reward.Id}
                className="px-4 py-4 flex flex-col gap-2 cursor-pointer active:bg-zinc-50"
                onClick={() => router.push(`/account/redeem-history/${reward.Id}`)}
              >
                {/* Top row: Name & Points */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-roboto-medium text-zinc-800">
                    {reward.Name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-roboto-medium text-zinc-800">
                      - {formatPoints(reward.Price)}
                    </span>
                    <Image
                      src="/images/icon/A1_point_icon.png"
                      alt="A-Point"
                      width={20}
                      height={20}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                {/* Bottom row: Date & Status */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">
                    {formatDate(reward.Datetime)}
                  </p>
                  <span
                    className={cn(
                      "px-3 py-1 text-xs font-roboto-medium rounded-full",
                      getStatusColor(reward.Status)
                    )}
                  >
                    {getStatusLabel(reward.Status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            {/* Empty State Icon - Clipboard with X */}
            <div className="flex flex-col justify-center items-center py-26 text-[#A9ADB1] text-xs font-roboto-medium gap-9">
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
        )}
      </main>
    </div>
  );
}
