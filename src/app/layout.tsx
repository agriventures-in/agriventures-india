import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth/session-provider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "AgriVentures India — The Verified Impact Platform for Indian Agritech",
    template: "%s | AgriVentures India",
  },
  description:
    "The Verified Impact Platform for Indian Agritech. Making India's 4,255+ unfunded agritech startups visible to investors, corporates, and farmers.",
  keywords: [
    "agritech",
    "India",
    "startups",
    "agriculture",
    "technology",
    "impact",
    "investment",
    "farming",
    "agriventures",
    "verified impact",
    "Indian agritech startups",
  ],
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://agriventures.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "AgriVentures India",
    title: "AgriVentures India — The Verified Impact Platform for Indian Agritech",
    description:
      "Making India's 4,255+ unfunded agritech startups visible to investors, corporates, and farmers.",
    images: [
      {
        url: "/api/og?title=AgriVentures%20India&tagline=Making%20India%27s%20Agritech%20Startups%20Visible",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriVentures India",
    description:
      "The Verified Impact Platform for Indian Agritech.",
    images: [
      "/api/og?title=AgriVentures%20India&tagline=Making%20India%27s%20Agritech%20Startups%20Visible",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
