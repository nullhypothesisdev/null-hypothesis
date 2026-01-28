// src/app/layout.tsx

import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "katex/dist/katex.min.css";
import "./globals.css";

// 1. HEADINGS (Serif Display) - For Titles
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

// 2. BODY (Serif Text) - For Paragraphs/Reading
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-body",
  display: "swap",
});

// 3. CODE (Monospace) - For Data/Terminals
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// --- METADATA FOR SOCIAL SHARING & SEO ---
export const metadata: Metadata = {
  // Base SEO tags
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nullhypothesis.dev'),
  title: "The Null Hypothesis | Calculated Uncertainty",
  description: "Reject the default. A data science platform for the rigorous.",

  // Open Graph (Facebook, WhatsApp, LinkedIn, general sharing)
  openGraph: {
    title: "The Null Hypothesis",
    description: "Reject the default. A data science platform for the rigorous.",
    url: 'https://nullhypothesis.dev',
    siteName: 'The Null Hypothesis',
    images: [
      {
        url: '/api/og?title=The%20Null%20Hypothesis', // Dynamic Fallback
        width: 1200,
        height: 630,
        alt: 'Null Hypothesis Social Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: "The Null Hypothesis",
    description: "Reject the default. A data science platform for the rigorous.",
    creator: '@theonlyezzio',
    images: ['/api/og?title=The%20Null%20Hypothesis'],
  },
};
// ------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/computer-modern@0.1.2/cmu-serif.min.css" />
      </head>
      <body
        className={`
          ${cormorant.variable} 
          ${ebGaramond.variable} 
          ${jetbrains.variable} 
          bg-paper 
          text-ink 
          antialiased 
        `}
      >
        <Providers>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}