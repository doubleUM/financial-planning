import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "@/auth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const initialCurrency = session?.user?.currency || "USD";

  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers initialCurrency={initialCurrency}>
          <Navbar isLoggedIn={!!session?.user} />
          <main style={{ paddingBottom: "7rem" }}>
            {children}
          </main>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

