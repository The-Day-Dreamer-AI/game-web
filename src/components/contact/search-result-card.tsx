"use client";

import Image from "next/image";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  username: string;
  avatar: string;
  onAdd?: () => void;
  isAdding?: boolean;
  className?: string;
}

export function SearchResultCard({
  username,
  avatar,
  onAdd,
  isAdding = false,
  className,
}: SearchResultCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center justify-between bg-zinc-100 rounded-lg p-3",
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

      <button
        onClick={onAdd}
        disabled={isAdding}
        className="flex items-center gap-1.5 px-4 py-2 bg-dark text-white text-sm font-roboto-medium rounded-md hover:bg-dark/90 transition-colors disabled:opacity-50"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add</span>
      </button>
    </div>
  );
}
