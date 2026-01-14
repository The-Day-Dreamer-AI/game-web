"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ContactListItemProps {
  username: string;
  avatar: string;
  onClick?: () => void;
  className?: string;
}

export function ContactListItem({
  username,
  avatar,
  onClick,
  className,
}: ContactListItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 py-3 px-4 hover:bg-zinc-50 transition-colors",
        className
      )}
    >
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
    </button>
  );
}
