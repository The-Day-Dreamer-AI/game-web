"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A link component that checks authentication before navigating.
 * If user is not authenticated, opens login modal instead of navigating.
 */
export function ProtectedLink({ href, children, className }: ProtectedLinkProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openLoginModal();
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
