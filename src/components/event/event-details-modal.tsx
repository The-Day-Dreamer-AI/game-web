"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    image: string;
    htmlContent: string;
  } | null;
}

export function EventDetailsModal({
  isOpen,
  onClose,
  event,
}: EventDetailsModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[398px] max-h-[85vh] flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-zinc-300 transition-colors bg-black/30 rounded-full p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Event Banner */}
        <div className="relative h-48 bg-gradient-to-r from-zinc-700 to-zinc-500 flex-shrink-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            unoptimized
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-xl font-roboto-semibold text-zinc-800">
            {event.title}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose prose-sm max-w-none prose-headings:text-zinc-800 prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-800"
            dangerouslySetInnerHTML={{ __html: event.htmlContent }}
          />
        </div>

        {/* Footer with Apply Button */}
        <div className="p-6 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-primary text-white font-roboto-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
