import type { Metadata } from "next";
import { Playfair_Display, Roboto, Tiro_Bangla } from "next/font/google";
import { connection } from "next/server";
import { Suspense } from "react";

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
  metadataBase: new URL("https://haorrokkhaandolan.com"),

  title: {
    default: "Haor Rokkha Andolan | Protecting Wetlands, Preserving Life",
    template: "%s | Haor Rokkha Andolan",
  },

  description:
    "Haor Rokkha Andolan is an environmental conservation initiative dedicated to protecting Bangladesh's haors, rivers, canals, wetlands, and biodiversity for future generations.",

  keywords: [
    "Haor Rokkha Andolan",
    "Haor Rokkha",
    "হাওর রক্ষা আন্দোলন",
    "Wetland Conservation Bangladesh",
    "Haor Conservation",
    "Protect Bangladesh Wetlands",
    "Bangladesh Environmental Movement",
    "Haor Protection",
    "Wetland Protection Bangladesh",
    "Biodiversity Conservation Bangladesh",
    "Community Environmental Awareness",
    "Rivers and Canals Conservation",
    "Nature Conservation Bangladesh",
    "Sustainable Future Bangladesh",
    "Environmental NGO Bangladesh",
  ],

  authors: [
    {
      name: "Haor Rokkha Andolan",
      url: "https://haorrokkhaandolan.com",
    },
  ],

  creator: "Haor Rokkha Andolan",
  publisher: "Haor Rokkha Andolan",
  applicationName: "Haor Rokkha Andolan",
  category: "environment",

  alternates: {
    canonical: "https://haorrokkhaandolan.com",
  },

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

  openGraph: {
    type: "website",
    locale: "en_BD",
    url: "https://haorrokkhaandolan.com",
    siteName: "Haor Rokkha Andolan",
    title: "Haor Rokkha Andolan | Protecting Wetlands, Preserving Life",
    description:
      "Working to conserve Bangladesh's haors, rivers, canals, wetlands, and natural ecosystems through awareness, community action, and environmental responsibility.",
    images: [
      {
        url: "https://haorrokkhaandolan.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Haor Rokkha Andolan - Protecting Wetlands, Preserving Life",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Haor Rokkha Andolan | Protecting Wetlands, Preserving Life",
    description:
      "An environmental movement dedicated to protecting Bangladesh's haors, wetlands, rivers, and biodiversity.",
    images: ["https://haorrokkhaandolan.com/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  referrer: "origin-when-cross-origin",
};

async function UploadThingSSR() {
  await connection();

  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
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
      
      <body>
        <Suspense fallback={null}>
          <UploadThingSSR />
        </Suspense>
   
        {children}
      </body>
    </html>
  );
}
