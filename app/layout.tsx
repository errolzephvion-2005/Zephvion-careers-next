import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zephvion Careers",
  description: "Career Opportunities at Zephvion",
};

import Navbar from "@/shared/components/Navbar";
import RightRail from "@/shared/components/RightRail";
import ZephvionFooter from "@/shared/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@200;300;400;500;700&family=DM+Mono:wght@300;400;500&family=Source+Sans+3:wght@200;300;400;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black">
        {/* LEFT NAV */}
        <Navbar />
        {/* RIGHT RAIL */}
        <RightRail />
        
        {/* MAIN SCROLL */}
        <main className="ml-0 mr-0 lg:ml-14 lg:mr-14">
          {children}
          <ZephvionFooter />
        </main>
      </body>
    </html>
  );
}
