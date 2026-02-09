const KYC_STORAGE_KEY = "aone-kyc";
export const KYC_CHANGE_EVENT = "kyc-status-change";

// Simple obfuscation using base64 + reversal to prevent casual inspection
function encrypt(value: string): string {
  return btoa(value.split("").reverse().join(""));
}

function decrypt(encoded: string): string {
  try {
    return atob(encoded).split("").reverse().join("");
  } catch {
    return "";
  }
}

export function getKycStatus(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(KYC_STORAGE_KEY);
  if (!stored) return false;
  return decrypt(stored) === "verified";
}

export function setKycStatus(status: string): void {
  if (typeof window === "undefined") return;
  // KycStatus from API: "Verified" means verified, anything else is not
  const isVerified = status?.toLowerCase() === "verified";
  localStorage.setItem(KYC_STORAGE_KEY, encrypt(isVerified ? "verified" : "unverified"));
  window.dispatchEvent(new Event(KYC_CHANGE_EVENT));
}

export function clearKycStatus(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KYC_STORAGE_KEY);
  window.dispatchEvent(new Event(KYC_CHANGE_EVENT));
}
