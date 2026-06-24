import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/next";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "SpendWise | Premium Expense Tracker",
  description: "Track your finances with style and ease.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers>
          <Navbar />
          <main style={{ paddingBottom: "7rem" }}>
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
