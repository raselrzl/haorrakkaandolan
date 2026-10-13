"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  Leaf,
  Users,
  Sprout,
  Waves,
  Bird,
  HeartHandshake,
  Trees,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  ChevronRight,
  Globe,
} from "lucide-react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import HaorSection from "./HaorSection";
import RiverSection from "./RiverSection";
import HaorActivities from "./HaorActivities";
import RiverActivities from "./RiverActivities";

const photos = {
  hero: "/h2.jpg",
  wetland:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=85",
  forest:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=85",
  river:
    "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=85",
  bird: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=85",
  planting:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=85",
  water:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=85",
  community:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=85",
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "News & Updates", href: "#news" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const priorities = [
  {
    icon: Leaf,
    title: "Wetland Conservation",
    description:
      "Protecting haors, rivers, canals, and aquatic habitats for future generations.",
  },
  {
    icon: Users,
    title: "Community Awareness",
    description:
      "Encouraging communities to take collective action for a healthier environment.",
  },
  {
    icon: Sprout,
    title: "Biodiversity Protection",
    description:
      "Supporting the protection of native species and their natural habitats.",
  },
  {
    icon: Waves,
    title: "Sustainable Future",
    description:
      "Promoting responsible use of water, land, and natural resources.",
  },
];

const news = [
  {
    date: "Environmental Awareness",
    title: "Protecting Our Wetlands Starts With Us",
    description:
      "Raising awareness about the importance of haors, rivers, canals, and freshwater ecosystems.",
    image: photos.wetland,
  },
  {
    date: "Community Initiative",
    title: "Building a Greener Future Together",
    description:
      "Community participation can help create cleaner, healthier, and more sustainable surroundings.",
    image: photos.planting,
  },
  {
    date: "Nature & Wildlife",
    title: "Why Wetlands Matter for Biodiversity",
    description:
      "Wetlands provide essential habitats for birds, fish, plants, and many other living species.",
    image: photos.bird,
  },
];

const gallery = [
  { image: photos.wetland, label: "Wetland landscapes" },
  { image: photos.water, label: "Natural landscapes" },
  { image: photos.river, label: "Rivers and waterways" },
  { image: photos.bird, label: "Birdlife and biodiversity" },
  { image: photos.community, label: "Community participation" },
  { image: photos.forest, label: "Green environments" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  const riverActivities = [
    {
      id: "river-1",
      title: "River and Waterway Conservation",
      description:
        "Promoting the protection of rivers, canals, and waterways to preserve aquatic ecosystems and natural resources.",
      image: photos.river,
      date: "2026-10-01",
      category: "River Conservation",
      href: "/activities",
    },
    {
      id: "river-2",
      title: "Clean Rivers Initiative",
      description:
        "Encouraging communities to reduce water pollution and help maintain cleaner, healthier rivers.",
      image: photos.water,
      date: "2026-10-05",
      category: "Clean Water",
      href: "/activities",
    },
    {
      id: "river-3",
      title: "Community River Protection",
      description:
        "Building community awareness and participation to protect riverbanks, aquatic habitats, and biodiversity.",
      image: photos.community,
      date: "2026-10-10",
      category: "Community",
      href: "/activities",
    },
  ];
  const activities = [
    {
      id: "1",
      title: "Haor and Wetland Conservation",
      description:
        "Promoting the protection of haors, wetlands, and aquatic habitats for future generations.",
      image: photos.wetland,
      date: "2026-10-01",
      category: "Conservation",
      href: "/activities",
    },
    {
      id: "2",
      title: "Bird and Biodiversity Protection",
      description:
        "Raising awareness about migratory birds, native wildlife, and the biodiversity of haor ecosystems.",
      image: photos.bird,
      date: "2026-10-05",
      category: "Wildlife",
      href: "/activities",
    },
    {
      id: "3",
      title: "Community Environmental Awareness",
      description:
        "Encouraging local communities to participate in protecting waterways and preserving natural resources.",
      image: photos.community,
      date: "2026-10-10",
      category: "Community",
      href: "/activities",
    },
  ];

  return (
    <main
      id="home"
      className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800 antialiased"
    >
      {/* HERO */}
      <Navbar />

      <HeroSection />

      <HaorSection />
      <HaorActivities activities={activities} />

      {/*      <RiverSection /> */}
      <RiverActivities activities={riverActivities} />
    </main>
  );
}
