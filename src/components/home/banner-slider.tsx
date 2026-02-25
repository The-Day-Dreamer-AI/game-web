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
  const [containerWidth, setContainerWidth] = useState(0);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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

    const threshold = containerWidth > 0 ? containerWidth * 0.2 : 80;

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
    if (isDragging && containerWidth > 0) {
      const offsetPercent = (dragOffset / containerWidth) * 100;
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
          "relative overflow-hidden w-full touch-pan-y",
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
            "flex select-none",
            !isDragging && "transition-transform duration-500 ease-out"
          )}
          style={{ transform: getTransform() }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full shrink-0">
              {!imgErrors.has(banner.id) ? (
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto pointer-events-none"
                  onError={() => handleImageError(banner.id)}
                  priority={currentIndex === 0}
                  unoptimized
                  draggable={false}
                />
              ) : (
                <div className="w-full aspect-video bg-zinc-200 flex items-center justify-center">
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
