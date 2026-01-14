"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useLoginModal } from "@/providers/login-modal-provider";

interface GuestWelcomeCardProps {
  className?: string;
}

export function GuestWelcomeCard({ className }: GuestWelcomeCardProps) {
  const { t } = useI18n();
  const { openLoginModal } = useLoginModal();

  return (
    <div className={cn("flex gap-2", className)}>
      <button
        onClick={openLoginModal}
        className="uppercase flex-1 py-3 text-center text-base font-roboto-bold text-white bg-dark rounded-lg cursor-pointer shadow-xl"
      >
        {t("auth.login")}
      </button>
      <Link
        href="/register"
        className="uppercase flex-1 py-3 text-center text-base font-roboto-bold text-white bg-primary rounded-lg cursor-pointer shadow-xl"
      >
        {t("auth.register")}
      </Link>
    </div>
  );
}
