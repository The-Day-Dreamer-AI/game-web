/**
 * Navigation helper for determining back button destinations
 * Based on the current pathname and query parameters
 */

interface BackDestination {
  href: string;
}

/**
 * Get the back navigation destination for a given route
 * @param pathname - Current pathname (e.g., "/account/profile")
 * @param searchParams - URL search params for checking returnUrl and other params
 * @returns The destination path to navigate back to
 */
export function getBackDestination(
  pathname: string,
  searchParams?: URLSearchParams
): BackDestination {
  const returnUrl = searchParams?.get("returnUrl");
  const fromParam = searchParams?.get("from");
  const contactId = searchParams?.get("id");

  // Handle returnUrl for pages that support it
  if (returnUrl) {
    // Validate returnUrl is a relative path (security)
    if (returnUrl.startsWith("/")) {
      return { href: returnUrl };
    }
  }

  // === Auth pages ===
  if (pathname === "/forgot-password") {
    return { href: "/" };
  }
  if (pathname === "/register" || pathname === "/register/scan-qr") {
    return { href: "/" };
  }

  // === Info pages ===
  if (pathname === "/about") {
    return { href: "/" };
  }
  if (pathname === "/terms") {
    return { href: "/" };
  }

  // === Account settings pages ===
  if (pathname === "/account/language") {
    return { href: "/" };
  }
  if (pathname === "/account/inbox") {
    return { href: "/" };
  }

  // === Deposit pages ===
  if (pathname === "/deposit") {
    return { href: "/account" };
  }
  if (
    pathname === "/deposit/instant" ||
    pathname === "/deposit/bank" ||
    pathname === "/deposit/ewallet" ||
    pathname === "/deposit/crypto"
  ) {
    return { href: "/deposit" };
  }

  // === Withdrawal page ===
  if (pathname === "/withdrawal") {
    // Default to account page, but can be overridden by returnUrl
    return { href: "/account" };
  }

  // === Bank pages ===
  if (pathname === "/account/bank") {
    // Default to account page, but can be overridden by returnUrl
    return { href: "/account" };
  }
  if (pathname === "/account/bank/add") {
    return { href: "/account/bank" };
  }

  // === Transfer page ===
  if (pathname === "/transfer") {
    // If came from transfer list, go back to transfer list
    if (fromParam === "transfer-list") {
      return { href: "/account/contact?mode=transfer" };
    }
    // If there's a contact id, go back to that contact's page
    if (contactId) {
      return { href: `/account/contact/${contactId}` };
    }
    return { href: "/account/contact?mode=transfer" };
  }

  // === Report pages ===
  if (pathname === "/report") {
    return { href: "/account" };
  }
  if (pathname === "/report/game-record" || pathname === "/report/turnover") {
    return { href: "/report" };
  }

  // === Profile pages ===
  if (pathname === "/account/profile") {
    return { href: "/account" };
  }
  if (
    pathname === "/account/profile/username" ||
    pathname === "/account/profile/password" ||
    pathname === "/account/profile/avatar"
  ) {
    return { href: "/account/profile" };
  }

  // === Reset PIN page ===
  if (pathname === "/account/reset-pin") {
    // Check if came from add-bank flow
    if (fromParam === "add-bank") {
      return { href: "/account/bank" };
    }
    return { href: "/account" };
  }

  // === Contact pages ===
  if (pathname === "/account/contact") {
    return { href: "/account" };
  }
  if (pathname === "/account/contact/new-friend") {
    return { href: "/account/contact" };
  }
  if (pathname === "/account/contact/new-friend/scan-qr") {
    return { href: "/account/contact/new-friend" };
  }
  // Contact alias page: /account/contact/[id]/alias -> /account/contact/[id]
  if (pathname.endsWith("/alias") && pathname.startsWith("/account/contact/")) {
    const contactId = pathname.split("/")[3];
    return { href: `/account/contact/${contactId}` };
  }
  // Dynamic contact detail page: /account/contact/[id]
  if (pathname.startsWith("/account/contact/") && pathname !== "/account/contact/new-friend") {
    return { href: "/account/contact" };
  }

  // === Transaction detail page ===
  if (pathname.startsWith("/transaction/")) {
    return { href: "/transaction" };
  }

  // === Redeem pages ===
  if (pathname === "/account/redeem-gift") {
    return { href: "/account" };
  }
  if (pathname === "/account/redeem-gift/shipping") {
    return { href: "/account/redeem-gift" };
  }
  if (pathname === "/account/redeem-gift/confirm") {
    // Get rewardId from searchParams to preserve it when going back
    // Add from=confirm so shipping page knows to autofill
    const rewardId = searchParams?.get("rewardId");
    return { href: rewardId ? `/account/redeem-gift/shipping?rewardId=${rewardId}&from=confirm` : "/account/redeem-gift/shipping?from=confirm" };
  }
  if (pathname === "/account/redeem-history") {
    return { href: "/account/redeem-gift" };
  }
  if (pathname.startsWith("/account/redeem-history/")) {
    return { href: "/account/redeem-history" };
  }
  if (pathname === "/account/rebate") {
    return { href: "/account" };
  }
  if (pathname === "/account/redeem-code") {
    return { href: "/account" };
  }

  // === Default: go to home page ===
  return { href: "/" };
}
