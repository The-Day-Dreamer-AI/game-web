"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { ProtectedLink } from "@/components/auth";

interface NavItem {
  labelKey: string;
  href: string;
  imageName: string; // Maps to Footer_Icon_{imageName}_Active/Default.webp
}

const navItems: NavItem[] = [
  { labelKey: "referral", href: "/referral", imageName: "Referral" },
  { labelKey: "event", href: "/event", imageName: "Event" },
  { labelKey: "transaction", href: "/transaction", imageName: "Transaction" },
  { labelKey: "account", href: "/account", imageName: "Account" },
];

// Label translations mapping
const labelTranslations: Record<string, string> = {
  referral: "nav.referral",
  event: "nav.event",
  transaction: "transaction.title",
  account: "account.title",
};

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const renderNavItem = (item: NavItem) => {
    const isActive = pathname === item.href;
    const imageState = isActive ? "Active" : "Default";
    const imagePath = `/images/footer/${item.imageName}_icon_${imageState}.png`;

    return (
      <ProtectedLink
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-2 text-xs transition-colors",
          isActive ? "text-primary" : "text-white"
        )}
      >
        <Image
          src={imagePath}
          alt={t(labelTranslations[item.labelKey] || item.labelKey)}
          width={30}
          height={30}
          unoptimized
          className="w-[30px] h-[30px] object-contain"
        />
        <span>{t(labelTranslations[item.labelKey] || item.labelKey)}</span>
      </ProtectedLink>
    );
  };

  return (
    <nav className="bg-dark px-4 py-[11px] sticky bottom-0 left-0 right-0 overflow-visible">
      <div className="grid grid-cols-[1fr_1fr_1.2fr_1fr_1fr] items-end overflow-visible">
        {/* Left items */}
        {navItems.slice(0, 2).map(renderNavItem)}

        {/* Center Home Button */}
        <Link
          href="/"
          className="flex flex-col items-center justify-end -mt-10"
        >
          <Image
            src="/images/footer/home_icon.png"
            alt="Home"
            height={80}
            width={80}
            unoptimized
            className="w-full h-full"
          />
        </Link>

        {/* Right items */}
        {navItems.slice(2).map(renderNavItem)}
      </div>
    </nav>
  );
}
