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
  title: "AIで作ってみた件",
  description: "AIやノーコードで作ったサイトやアプリを気軽に公開・共有できるプラットフォーム",
  icons: {
    icon: "/favicon.svg?v=20260215",
  },
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: baseUrl,
    siteName: "AIで作ってみた件",
    title: "AIで作ってみた件",
    description: "AIやノーコードで作ったサイトやアプリを気軽に公開・共有できるプラットフォーム",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "AIで作ってみた件",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIで作ってみた件",
    description: "AIやノーコードで作ったサイトやアプリを気軽に公開・共有できるプラットフォーム",
    images: [ogImage],
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
