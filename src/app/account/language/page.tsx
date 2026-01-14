"use client";

import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";
import { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Language options with flag components
const languages: { id: Locale; name: string; flag: React.ReactNode }[] = [
  {
    id: "en",
    name: "English",
    flag: (
      <svg viewBox="0 0 60 40" className="w-10 h-7 rounded">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    ),
  },
  {
    id: "zh",
    name: "中文",
    flag: (
      <svg viewBox="0 0 60 40" className="w-10 h-7 rounded">
        <rect width="60" height="40" fill="#DE2910" />
        <g fill="#FFDE00">
          <polygon points="12,8 13.5,12.5 18,12.5 14.25,15.5 15.75,20 12,17 8.25,20 9.75,15.5 6,12.5 10.5,12.5" />
          <polygon points="22,4 22.6,6 24.5,6 23,7.2 23.5,9 22,8 20.5,9 21,7.2 19.5,6 21.4,6" />
          <polygon points="26,8 26.6,10 28.5,10 27,11.2 27.5,13 26,12 24.5,13 25,11.2 23.5,10 25.4,10" />
          <polygon points="26,14 26.6,16 28.5,16 27,17.2 27.5,19 26,18 24.5,19 25,17.2 23.5,16 25.4,16" />
          <polygon points="22,18 22.6,20 24.5,20 23,21.2 23.5,23 22,22 20.5,23 21,21.2 19.5,20 21.4,20" />
        </g>
      </svg>
    ),
  },
  {
    id: "ms",
    name: "Malay",
    flag: (
      <svg viewBox="0 0 60 40" className="w-10 h-7 rounded">
        {/* Malaysian flag stripes */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} y={i * (40 / 14) * 2} width="60" height={40 / 14} fill={i % 2 === 0 ? "#CC0001" : "#fff"} />
        ))}
        <rect width="30" height={40 / 14 * 8} fill="#010066" />
        <circle cx="12" cy="11.5" r="6" fill="#FC0" />
        <circle cx="14" cy="11.5" r="5" fill="#010066" />
        <polygon points="20,6 21,9 24,9 21.5,11 22.5,14 20,12 17.5,14 18.5,11 16,9 19,9" fill="#FC0" />
      </svg>
    ),
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
      <Header variant="subpage" title={t("language.title")} backHref="/account" />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <h2 className="text-center text-zinc-700 font-roboto-medium mb-6">
          {t("language.chooseLanguage")}
        </h2>

        {/* Language Options */}
        <div className="flex justify-center gap-4">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelectLanguage(lang.id)}
              className="flex flex-col items-center"
            >
              <div
                className={cn(
                  "w-20 h-20 rounded-xl flex items-center justify-center border-2 transition-all bg-white",
                  locale === lang.id
                    ? "border-primary bg-primary/5"
                    : "border-zinc-200 hover:border-zinc-300"
                )}
              >
                {lang.flag}
              </div>
              <span
                className={cn(
                  "text-sm mt-2",
                  locale === lang.id
                    ? "text-primary font-roboto-medium"
                    : "text-zinc-600"
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
