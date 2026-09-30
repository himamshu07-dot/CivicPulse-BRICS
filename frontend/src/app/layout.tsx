import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin", "cyrillic"],
  variable: "--font-fira-code",
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
    <html lang="en" className={`${inter.variable} ${firaCode.variable} dark`}>
      <body className="min-h-screen bg-background text-text-main antialiased font-sans selection:bg-accent selection:text-black">
        {children}
      </body>
    </html>
  );
}

