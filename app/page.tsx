import { Suspense } from "react";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import HaorSection from "./HaorSection";
import HaorActivities from "./HaorActivities";
import RiverActivities from "./RiverActivities";
import { prisma } from "./utils/db";

const photos = {
  wetland:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=85",
  river:
    "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=85",
  bird:
    "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=85",
  water:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=85",
  community:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=85",
};

async function HomepageSections() {
  const [
    latestActivities,
    latestNews,
    haorActivitiesData,
    riverActivitiesData,
  ] = await Promise.all([
    prisma.news.findMany({
      where: { type: "ACTIVITY" },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),

    prisma.news.findMany({
      where: { type: "NEWS" },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),

    prisma.news.findMany({
      where: {
        type: "ACTIVITY",
        riverOrHaor: "HAOR",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        heading: true,
        details: true,
        mediaUrl: true,
        mediaType: true,
        riverOrHaor: true,
        createdAt: true,
      },
    }),

    prisma.news.findMany({
      where: {
        type: "ACTIVITY",
        riverOrHaor: "RIVER",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        heading: true,
        details: true,
        mediaUrl: true,
        mediaType: true,
        riverOrHaor: true,
        createdAt: true,
      },
    }),
  ]);

  const updates = latestActivities.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  const news = latestNews.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  const haorActivities = haorActivitiesData.map((item) => ({
    id: item.id,
    title: item.heading,
    description: item.details,
    image: item.mediaUrl,
    mediaType: item.mediaType,
    date: item.createdAt.toISOString(),
    category: "Haor Activity",
    href: `/news/${item.id}`,
  }));

  const riverActivities = riverActivitiesData.map((item) => ({
    id: item.id,
    title: item.heading,
    description: item.details,
    image: item.mediaUrl,
    mediaType: item.mediaType,
    date: item.createdAt.toISOString(),
    category: "River Activity",
    href: `/news/${item.id}`,
  }));

  return (
    <>
      <HeroSection updates={updates} news={news} />

      <HaorSection />

      <HaorActivities
        activities={haorActivities}
        fallbackImage={photos.wetland}
      />

      <RiverActivities
        activities={riverActivities}
        fallbackImage={photos.river}
      />
    </>
  );
}

function HomepageFallback() {
  return (
    <>
      <HeroSection updates={[]} news={[]} />
      <HaorSection />
      <HaorActivities activities={[]} />
      <RiverActivities activities={[]} />
    </>
  );
}

export default function Home() {
  return (
    <main
      id="home"
      className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-800 antialiased"
    >
      <Navbar />

      <Suspense fallback={<HomepageFallback />}>
        <HomepageSections />
      </Suspense>
    </main>
  );
}