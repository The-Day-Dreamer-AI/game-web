"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

interface GameCategory {
  id: string;
  labelKey: string;
  imageName: string; // Maps to Categorie_{imageName}_Active/Default.webp
}

interface GameCategoriesProps {
  categories?: GameCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

const defaultCategories: GameCategory[] = [
  { id: "slots", labelKey: "games.slots", imageName: "Slot" },
  { id: "appSlot", labelKey: "games.appSlot", imageName: "AppSlot" },
  { id: "live", labelKey: "games.live", imageName: "Live" },
  { id: "sports", labelKey: "games.sports", imageName: "Sports" },
  { id: "lottery", labelKey: "games.lottery", imageName: "Lottery" },
  { id: "fishing", labelKey: "games.fishing", imageName: "Fishing" },
];

export function GameCategories({
  categories = defaultCategories,
  activeCategory,
  onCategoryChange,
  className,
}: GameCategoriesProps) {
  const { t } = useI18n();

  return (
    <div className={cn("flex gap-1 overflow-x-auto scrollbar-hide", className)}>
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const imageState = isActive ? "Active" : "Default";
        const imagePath = `/aone/Category/Categorie_${category.imageName}_${imageState}.png`;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-col items-center flex-1 min-w-0 px-3 py-2 rounded-lg transition-all",
              isActive
                ? "bg-primary text-white border border-primary"
                : "text-zinc-600 border border-transparent"
            )}
            style={
              !isActive
                ? {
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F2F4F9 100%) padding-box, linear-gradient(180deg, #F2F2F2 0%, #FFFFFF 100%) border-box",
                  }
                : undefined
            }
          >
            <span className="mb-1 w-8 h-8 relative flex items-center">
              <Image
                src={imagePath}
                alt={t(category.labelKey)}
                width={32}
                height={32}
                className="object-contain"
              />
            </span>
            <span className="text-xs font-roboto-bold whitespace-nowrap">{t(category.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

export { defaultCategories };
