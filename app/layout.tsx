import type { Metadata } from "next";
import "./globals.css";
import Header from "./sections/Header";
import Footer from "./sections/Footer";
import CookieBanner from "./components/CookieBanner";

export const metadata: Metadata = {
  title: "Tunnel Picks — Best VPN Services Compared",
  description:
    "Compare top VPN services with expert reviews, speed test results, and privacy analysis. Find the best VPN for your needs. Trusted by privacy-conscious users worldwide.",
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
    title: "Tunnel Picks — Best VPN Services Compared",
    description:
      "Compare top VPN services with expert reviews, speed tests, and privacy analysis. Find the perfect VPN for your needs.",
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
        <Header />

        <main className="relative">{children}</main>

        <Footer />

        <CookieBanner />
      </body>
    </html>
  );
}
