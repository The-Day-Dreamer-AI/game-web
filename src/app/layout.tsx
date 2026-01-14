import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { LoginModalProvider } from "@/providers/login-modal-provider";
import { LoadingOverlayProvider } from "@/providers/loading-overlay-provider";
import { MobileContainer } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gameweb.com"),
  title: {
    default: "GameWeb - Online Casino & Sports Betting Platform",
    template: "%s | GameWeb",
  },
  description:
    "Experience the best online casino games, sports betting, live dealer games, and slots. Join GameWeb for exciting gaming action with top providers like Pragmatic Play, Evolution, and more.",
  keywords: [
    "online casino",
    "sports betting",
    "live casino",
    "slots",
    "pragmatic play",
    "evolution gaming",
    "online gambling",
    "casino games",
    "sportsbook",
  ],
  authors: [{ name: "GameWeb" }],
  creator: "GameWeb",
  publisher: "GameWeb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GameWeb",
    title: "GameWeb - Online Casino & Sports Betting Platform",
    description:
      "Experience the best online casino games, sports betting, live dealer games, and slots.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GameWeb - Online Casino & Sports Betting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GameWeb - Online Casino & Sports Betting Platform",
    description:
      "Experience the best online casino games, sports betting, live dealer games, and slots.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EntertainmentBusiness",
    name: "GameWeb",
    description:
      "Online casino and sports betting platform with slots, live games, and sports betting",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://gameweb.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://gameweb.com"}/logo.png`,
    sameAs: [
      // Add your social media URLs here
      // "https://facebook.com/gameweb",
      // "https://twitter.com/gameweb",
      // "https://instagram.com/gameweb",
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <I18nProvider>
              <LoadingOverlayProvider>
                <LoginModalProvider>
                  <MobileContainer>{children}</MobileContainer>
                </LoginModalProvider>
              </LoadingOverlayProvider>
            </I18nProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
