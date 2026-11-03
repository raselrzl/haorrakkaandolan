
import type { Metadata } from "next";
import { Playfair_Display, Roboto, Tiro_Bangla } from "next/font/google";
import { connection } from "next/server";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import FloatingContact from "./FloatingContact";
import LanguageSwitcher from "./LanguageSwitcher";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  variable: "--font-tiro-bangla",
  subsets: ["bengali", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  // Official website
  metadataBase: new URL("https://wrihra.com"),

  // Google AdSense account verification
  other: {
    "google-adsense-account": "ca-pub-5945782633100386",
  },

  // SEO Title
  title: {
    default:
      "Wetlands Resilience Initiatives | Haor Rokkha Andolan | Bangladesh",
    template: "%s | Wetlands Resilience Initiatives",
  },

  // SEO Description
  description:
    "Wetlands Resilience Initiatives (WRIHRA) is dedicated to protecting, restoring, and strengthening Bangladesh's haors, rivers, canals, wetlands, and biodiversity through community-led conservation, climate resilience, environmental awareness, and sustainable ecosystem management.",

  // SEO Keywords
  keywords: [
    // Organization and brand
    "Wetlands Resilience Initiatives",
    "WRIHRA",
    "Haor Rokkha Andolan",
    "Haor Rokkha",
    "হাওর রক্ষা আন্দোলন",

    // Wetlands resilience
    "Wetlands Resilience Initiatives Bangladesh",
    "Wetland Resilience Bangladesh",
    "Wetlands Resilience",
    "Wetland Conservation Bangladesh",
    "Wetland Restoration Bangladesh",
    "Wetland Ecosystem Restoration",
    "Sustainable Wetland Management",
    "Wetland Protection Initiatives",
    "Community Based Wetland Conservation",
    "Wetland Ecosystem Management",

    // Haor, rivers and water resources
    "Haor Conservation",
    "Haor Protection Bangladesh",
    "Haor Ecosystem Protection",
    "Bangladesh Wetland Conservation",
    "Protect Bangladesh Wetlands",
    "Rivers and Canals Conservation",
    "River Restoration Bangladesh",
    "River Conservation Bangladesh",
    "Water Resource Conservation",

    // Climate resilience and biodiversity
    "Climate Resilience Bangladesh",
    "Climate Resilient Wetlands",
    "Climate Change Adaptation",
    "Biodiversity Conservation Bangladesh",
    "Environmental Conservation Bangladesh",
    "Ecosystem Restoration",
    "Nature Based Solutions Bangladesh",
    "Sustainable Ecosystem Management",
    "Natural Resource Management",
    "Environmental Sustainability",

    // Community and environmental initiatives
    "Community Led Conservation",
    "Community Environmental Awareness",
    "Environmental Protection Movement",
    "Environmental Advocacy Bangladesh",
    "Wetland Awareness Bangladesh",
    "Local Environmental Initiatives",
    "Sustainable Future Bangladesh",
    "Environmental NGO Bangladesh",

    // Bangla keywords
    "জলাভূমি সংরক্ষণ",
    "হাওর সংরক্ষণ",
    "পরিবেশ সংরক্ষণ বাংলাদেশ",
    "জীববৈচিত্র্য সংরক্ষণ",
    "জলাভূমি পুনরুদ্ধার",
    "জলবায়ু সহনশীলতা",
    "নদী ও খাল সংরক্ষণ",
    "পরিবেশ রক্ষা আন্দোলন",
    "প্রাকৃতিক সম্পদ সংরক্ষণ",
  ],

  authors: [
    {
      name: "Wetlands Resilience Initiatives - Haor Rokkha Andolan",
      url: "https://wrihra.com",
    },
  ],

  creator: "Wetlands Resilience Initiatives",
  publisher: "Wetlands Resilience Initiatives",
  applicationName: "Wetlands Resilience Initiatives",
  category: "environment",

  // Canonical URL
  alternates: {
    canonical: "https://wrihra.com",
  },

  // Search engine indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Facebook, LinkedIn and other social platforms
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://wrihra.com",
    siteName: "Wetlands Resilience Initiatives",
    title:
      "Wetlands Resilience Initiatives | Protecting Wetlands, Preserving Life",
    description:
      "Working to protect and restore Bangladesh's haors, rivers, canals, wetlands, and biodiversity through climate resilience, community-led conservation, environmental awareness, and sustainable ecosystem management.",
    images: [
      {
        url: "https://wrihra.com/h2.png",
        width: 1200,
        height: 630,
        alt: "Wetlands Resilience Initiatives - Protecting Wetlands, Preserving Life",
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title:
      "Wetlands Resilience Initiatives | WRIHRA",
    description:
      "Protecting Bangladesh's wetlands, haors, rivers, and biodiversity through restoration, climate resilience, and community-led conservation.",
    images: ["https://wrihra.com/h2.png"],
  },

  // Website icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  referrer: "origin-when-cross-origin",
};

async function UploadThingSSR() {
  await connection();

  return (
    <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${playfairDisplay.variable} ${roboto.variable} ${tiroBangla.variable}`}
    >
      <head>
        {/* Impact site verification */}
        <meta
          name="impact-site-verification"
          content="bfb46410-0651-45ca-b8dd-b2704df55aea"
        />
      </head>

      <body>
          <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5945782633100386"
          crossOrigin="anonymous"
        />

        <Suspense fallback={null}>
          <UploadThingSSR />
        </Suspense>

        {children}
      </body>
    </html>
  );
}
