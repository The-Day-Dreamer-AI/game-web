"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle drag/swipe
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = containerRef.current ? containerRef.current.offsetWidth * 0.2 : 80;

    if (dragOffset > threshold) {
      goToPrev();
    } else if (dragOffset < -threshold) {
      goToNext();
    }

    setDragOffset(0);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1 || isDragging) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [banners.length, autoPlayInterval, goToNext, isDragging]);

  const handleImageError = (id: string) => {
    setImgErrors((prev) => new Set(prev).add(id));
  };

  if (banners.length === 0) return null;

  // Calculate transform with drag offset
  const getTransform = () => {
    const baseTranslate = -currentIndex * 100;
    if (isDragging && containerRef.current) {
      const offsetPercent = (dragOffset / containerRef.current.offsetWidth) * 100;
      return `translateX(calc(${baseTranslate}% + ${offsetPercent}%))`;
    }
    return `translateX(${baseTranslate}%)`;
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Slider Container */}
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden aspect-[16/7] touch-pan-y",
          rounded && "rounded-lg",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={cn(
            "flex h-full select-none",
            !isDragging && "transition-transform duration-500 ease-out"
          )}
          style={{ transform: getTransform() }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              {!imgErrors.has(banner.id) ? (
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover pointer-events-none"
                  onError={() => handleImageError(banner.id)}
                  priority={currentIndex === 0}
                  unoptimized
                  draggable={false}
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
