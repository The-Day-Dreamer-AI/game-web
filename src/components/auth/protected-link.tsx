"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useLoginModal } from "@/providers/login-modal-provider";

interface ProtectedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A link component that checks authentication before navigating.
 * If user is not authenticated, opens login modal instead of navigating.
 */
export function ProtectedLink({ href, children, className, onClick }: ProtectedLinkProps) {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openLoginModal();
      return;
    }
    // Run additional onClick handler (e.g., KYC check) after auth check passes
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
