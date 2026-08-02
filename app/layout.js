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

export const metadata = {
  title: "Repurpr — AI Content Multiplier",
  description: "Transform 1 long-form URL into 30 days of high-converting multi-platform content assets instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#07090e] text-slate-100 selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
