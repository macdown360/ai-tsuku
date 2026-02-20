import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tool-park.example.com";
const ogImage = `${baseUrl}/og-image.png`;

export const metadata: Metadata = {
  title: {
    template: "%s | AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム",
    default: "AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム",
  },
  description: "ChatGPT、Notionなど最新のAI・ノーコードツールで作ったアプリやサイトを気軽に公開・共有。実例・事例を多数掲載。",
  keywords: ["AI", "ノーコード", "ChatGPT", "作品共有", "ローコード", "プラットフォーム", "Notion"],
  icons: {
    icon: "/favicon.svg?v=20260215",
  },
  metadataBase: new URL(baseUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: baseUrl,
    siteName: "AIで作ってみた件",
    title: "AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム",
    description: "ChatGPT、Notionなど最新のAI・ノーコードツールで作ったアプリやサイトを気軽に公開・共有。実例・事例を多数掲載。",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIで作ってみた件 - AI・ノーコード作品共有プラットフォーム",
    description: "ChatGPT、Notionなど最新のAI・ノーコードツールで作ったアプリやサイトを気軽に公開・共有。",
    images: [ogImage],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#f6f6f6] flex flex-col`}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
