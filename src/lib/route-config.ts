/**
 * Route configuration for automatic header title and variant detection
 * Based on the current pathname
 */

type HeaderVariant = "logo" | "subpage";

interface RouteConfig {
  titleKey?: string; // i18n translation key
  variant: HeaderVariant;
}

// Routes that should show the logo variant (main hub pages)
const logoRoutes = ["/", "/home", "/account", "/event", "/referral", "/transaction"];

// Route to title key mapping
// Uses exact match first, then prefix match for dynamic routes
const routeTitleMap: Record<string, string> = {
  // Auth pages
  "/login": "",
  "/register": "auth.register",
  "/register/scan-qr": "scanner.title",
  "/forgot-password": "auth.forgotPassword",

  // Main pages
  "/deposit": "wallet.title",
  "/withdrawal": "withdrawal.title",
  "/transfer": "transfer.title",
  "/transaction": "transaction.title",
  "/event": "nav.event",
  "/referral": "referral.title",

  // Account pages
  "/account/profile": "account.profile",
  "/account/profile/username": "profile.changeUsername",
  "/account/profile/password": "profile.changePassword",
  "/account/profile/avatar": "profile.changeAvatar",
  "/account/bank": "account.bankAccount",
  "/account/bank/add": "account.addBankAccount",
  "/account/contact": "contact.myContact",
  "/account/contact/new-friend": "contact.addNewFriend",
  "/account/contact/new-friend/scan-qr": "scanner.title",
  "/account/inbox": "inbox.title",
  "/account/language": "language.title",
  "/account/rebate": "account.rebateList",
  "/account/redeem-code": "account.redeemCode",
  "/account/redeem-gift": "redeemGift.title",
  "/account/redeem-gift/shipping": "redeemGift.title",
  "/account/redeem-gift/confirm": "redeemGift.title",
  "/account/redeem-history": "redeemGift.redeemHistory",
  "/account/reset-pin": "account.resetPin",

  // Deposit sub-pages
  "/deposit/bank": "deposit.bankTransfer",
  "/deposit/instant": "deposit.instantDeposit",
  "/deposit/ewallet": "deposit.eWallet",
  "/deposit/crypto": "deposit.crypto",

  // Report pages
  "/report": "account.report",
  "/report/game-record": "report.gameRecord",
  "/report/turnover": "report.turnoverReport",

  // Info pages
  "/about": "about.title",
  "/terms": "terms.title",

  // Game page - title is dynamic, handled separately
  "/game": "",
};

/**
 * Get the header configuration for a given pathname
 */
export function getRouteConfig(pathname: string): RouteConfig {
  // Determine variant
  const variant: HeaderVariant = logoRoutes.includes(pathname) ? "logo" : "subpage";

  // Try exact match first
  if (routeTitleMap[pathname] !== undefined) {
    return {
      titleKey: routeTitleMap[pathname] || undefined,
      variant,
    };
  }

  // Try prefix matching for dynamic routes (e.g., /account/contact/[id])
  const sortedRoutes = Object.keys(routeTitleMap).sort((a, b) => b.length - a.length);
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route + "/")) {
      // For dynamic child routes, use parent's title or a generic one
      // e.g., /account/contact/123 -> use "contact.friendDetail"
      // e.g., /account/contact/123/alias -> use "contact.changeAlias"
      if (route === "/account/contact") {
        if (pathname.endsWith("/alias")) {
          return { titleKey: "contact.changeAlias", variant };
        }
        return { titleKey: "contact.friendDetail", variant };
      }
      return {
        titleKey: routeTitleMap[route] || undefined,
        variant,
      };
    }
  }

  // Default fallback
  return { variant };
}

/**
 * Check if the current route should show the header
 * Some routes like auth pages or pages with custom headers should hide the layout header
 */
export function shouldShowHeader(pathname: string): boolean {
  const noHeaderRoutes = [
    "/login",
    "/game", // Game page has custom header with special back handler
  ];
  return !noHeaderRoutes.includes(pathname);
}

/**
 * Check if the current route should show the bottom navigation
 */
export function shouldShowBottomNav(pathname: string): boolean {
  const bottomNavRoutes = ["/", "/home", "/account", "/event", "/referral", "/transaction", "/deposit"];
  return bottomNavRoutes.includes(pathname);
}
