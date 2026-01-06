"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  image: string;
  alt: string;
  href?: string;
}

interface BannerSliderProps {
  banners: Banner[];
  autoPlayInterval?: number;
  className?: string;
  showDots?: boolean;
  rounded?: boolean;
}

export function BannerSlider({
  banners,
  autoPlayInterval = 4000,
  className,
  showDots = true,
  rounded = true,
}: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [banners.length, autoPlayInterval, goToNext]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => new Set(prev).add(id));
  };

  if (banners.length === 0) return null;

  return (
    <div className={cn("relative w-full", className)}>
      {/* Slider Container */}
      <div className={cn("relative overflow-hidden aspect-[16/7]", rounded && "rounded-lg")}>
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              {!imgErrors.has(banner.id) ? (
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(banner.id)}
                  priority={currentIndex === 0}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">{banner.alt}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      {showDots && banners.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-4"
                  : "bg-zinc-300 hover:bg-zinc-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
