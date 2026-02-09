// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://a1bo-qa.azurewebsites.net",
  platform: "Web" as const,
  defaultLanguage: "en",
};

// Storage keys (matches auth-provider.tsx)
export const AUTH_STORAGE_KEY = "aone-auth";
