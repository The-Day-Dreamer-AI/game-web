"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddFriendBannerProps {
  requestCount?: number;
  onClick?: () => void;
  className?: string;
}

export function AddFriendBanner({
  requestCount = 0,
  onClick,
  className,
}: AddFriendBannerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between bg-primary px-4 py-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Image
          src="/aone/Icon_AddNewFriend.webp"
          alt="Add Friend"
          width={24}
          height={24}
          unoptimized
          className="w-6 h-6 object-contain"
        />
        <span className="text-white font-roboto-medium">Add New Friend</span>
      </div>
      <div className="flex items-center gap-2">
        {requestCount > 0 && (
          <span className="w-6 h-6 rounded-full bg-white text-primary text-sm font-roboto-bold flex items-center justify-center">
            {requestCount}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-white" />
      </div>
    </button>
  );
}
