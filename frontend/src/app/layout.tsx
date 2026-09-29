import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-merriweather",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicPulse BRICS | Digital Public Good Platform",
  description: "Scalable, multilingual Digital Public Good platform for cross-border civic infrastructure and pulse intelligence across BRICS nations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen bg-background text-text-main antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
