
import type { Metadata } from "next";
import LawPageContent from "./LawPageContent";

export const metadata: Metadata = {
  title: "Haor, River & Wetland Protection Laws | Haor Rokkha Andolan",
  description:
    "Explore Bangladesh's haor, wetland, river, water, wildlife and environmental protection laws in English and Bangla.",
};

export default function LawsPage() {
  return <LawPageContent />;
}
