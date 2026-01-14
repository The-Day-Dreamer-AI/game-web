"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import type { GameCategory } from "@/lib/api/types";

interface GameCategoriesProps {
  categories: GameCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

/**
 * Get the correct category image based on locale and active state
 * @param category - The game category from API
 * @param locale - Current locale (en, zh, ms)
 * @param isActive - Whether the category is currently selected
 * @returns The image URL to use
 */
function getCategoryImage(
  category: GameCategory,
  locale: string,
  isActive: boolean
): string | null {
  // Map i18n locale to API image field prefixes
  // en -> default (DayImage)
  // zh -> Cn (CnDayImage)
  // ms -> My (MyDayImage)

  if (isActive) {
    // Selected/Active state
    switch (locale) {
      case "zh":
        return category.CnDayImageSelected || category.DayImageSelected;
      case "ms":
        return category.MyDayImageSelected || category.DayImageSelected;
      default: // "en" or any other
        return category.DayImageSelected;
    }
  } else {
    // Default/Inactive state
    switch (locale) {
      case "zh":
        return category.CnDayImage || category.DayImage;
      case "ms":
        return category.MyDayImage || category.DayImage;
      default: // "en" or any other
        return category.DayImage;
    }
  }
}

export function GameCategories({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: GameCategoriesProps) {
  const { locale } = useI18n();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex overflow-x-auto scrollbar-hide", className)}>
      {categories.map((category) => {
        const isActive = activeCategory === category.Name.toLowerCase();
        const imageSrc = getCategoryImage(category, locale, isActive);

        return (
          <button
            key={category.Id}
            onClick={() => onCategoryChange(category.Name.toLowerCase())}
            className="flex flex-col items-center flex-1 min-w-0 cursor-pointer"
          >
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={category.Name}
                width={100}
                height={100}
                className="object-contain w-full h-full"
                unoptimized
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
