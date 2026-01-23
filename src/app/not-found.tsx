"use client";

import { useI18n } from "@/providers/i18n-provider";



export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <div className="text-lg font-roboto-regular text-zinc-800 mb-4">
        {t("common.notFound")}
      </div>
    </div>
  );
}
