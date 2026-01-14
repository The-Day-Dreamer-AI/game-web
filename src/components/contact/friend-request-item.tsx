"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FriendRequestItemProps {
  username: string;
  avatar: string;
  type: "incoming" | "outgoing";
  onApprove?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function FriendRequestItem({
  username,
  avatar,
  type,
  onApprove,
  onReject,
  onCancel,
  className,
}: FriendRequestItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 shrink-0">
          {!imgError ? (
            <Image
              src={avatar}
              alt={username}
              width={48}
              height={48}
              unoptimized
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500 font-roboto-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-zinc-800 font-roboto-medium">{username}</span>
      </div>

      <div className="flex items-center gap-2">
        {type === "incoming" ? (
          <>
            <button
              onClick={onReject}
              className="px-4 py-1.5 bg-red-500 text-white text-sm font-roboto-medium rounded-md hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={onApprove}
              className="px-4 py-1.5 bg-primary text-white text-sm font-roboto-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Approve
            </button>
          </>
        ) : (
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-red-500 text-white text-sm font-roboto-medium rounded-md hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
