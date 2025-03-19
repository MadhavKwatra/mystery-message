import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from "@/config/config";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

export const metadata: Metadata = {
  title: `${APP_NAME} - Send anonymous messages`,
  description:
    "Send and receive anonymous messages effortlessly. Get honest feedback or fun secrets from friends.",
  openGraph: {
    title: `${APP_NAME} - Send anonymous messages`,
    description:
      "Send and receive anonymous messages effortlessly. Get honest feedback or fun secrets from friends.",

    url: baseUrl,
    siteName: `${APP_NAME} - Send anonymous messages`,
    images: [
      {
        url: `${baseUrl}/images/og.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} Preview Image`
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Send anonymous messages`,
    description:
      "Send and receive anonymous messages effortlessly. Get honest feedback or fun secrets from friends.",
    images: [`${baseUrl}/images/og.png`]
  },
  keywords: [
    "anonymous messaging",
    "send anonymous messages",
    "honest feedback",
    "ask me anything",
    "anonymous chat"
  ],
  icons: {
    icon: `${baseUrl}/favicon.svg`,
    apple: `${baseUrl}/favicon.svg`
  },
  robots: "index, follow"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
