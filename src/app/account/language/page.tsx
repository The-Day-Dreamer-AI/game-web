"use client";

import Image from "next/image";
import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";
import { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Language options with icon paths
const languages: { id: Locale; name: string; icon: string }[] = [
  {
    id: "en",
    name: "English",
    icon: "/images/icon/english_icon.png",
  },
  {
    id: "zh",
    name: "中文",
    icon: "/images/icon/chinese_icon.png",
  },
  {
    id: "ms",
    name: "Malay",
    icon: "/images/icon/malay_icon.png",
  },
];

export default function LanguagePage() {
  const { locale, setLocale, t } = useI18n();

  const handleSelectLanguage = (langId: Locale) => {
    setLocale(langId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("language.title")}
        backHref="/account"
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <h2 className="text-center text-[#28323C] font-roboto-bold mb-6 text-sm">
          {t("language.chooseLanguage")}
        </h2>

        {/* Language Options */}
        <div className="flex justify-center gap-6 px-9">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.id)}
              className={cn(
                "flex flex-col items-center flex-1 aspect-square rounded-2xl px-3 py-2 cursor-pointer",
                locale === lang.id
                  ? "bg-primary/20 border border-primary"
                  : "bg-white border border-[#DBDBDB]"
              )}
            >
              <Image
                src={lang.icon}
                alt={lang.name}
                width={48}
                height={48}
                unoptimized
                className="w-13 h-13 object-contain"
              />
              <span
                className={cn(
                  "text-sm mt-1 font-roboto-medium",
                  locale === lang.id
                    ? "text-[#28323C]"
                    : "text-[#5F7182]"
                )}
              >
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
