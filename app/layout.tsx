import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "./components/CookieBanner";
import Header from "./sections/Header";
import Footer from "./sections/Footer";

export const metadata: Metadata = {
  title: "Tunnel Picks — VPN Comparison & Security Tool Reviews",
  description:
    "Independent VPN comparisons backed by real-world speed tests and privacy analysis. Security tool reviews and comparisons.",
  keywords: [
    "VPN comparison",
    "best VPN services",
    "VPN reviews",
    "VPN pricing",
    "VPN speed test",
    "privacy tools",
    "virtual private network",
    "VPN providers",
    "secure browsing",
    "online privacy",
  ],
  verification: {
    google: "T5bb4mZivi0CfaYYRiKZLSNIWmhvAX6_RVgDEyonTGo",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Tunnel Picks",
    title: "Tunnel Picks — VPN Comparison & Security Tool Reviews",
    description:
      "Independent VPN comparisons backed by real-world speed tests and privacy analysis.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white">
        <CookieBanner />
        <Header />

        <main className="relative">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
