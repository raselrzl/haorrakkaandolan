import { prisma } from "@/app/utils/db";
import WebsiteContentSliderClient from "./WebsiteContentSliderClient";

export default async function WebsiteContentSlider() {
  const contents = await prisma.news.findMany({
    where: {
      mediaUrl: {
        not: null,
      },
      mediaType: "IMAGE",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    select: {
      id: true,
      mediaUrl: true,
      heading: true,
      details: true,
      createdAt: true,
    },
  });

  if (contents.length === 0) return null;

  return (
    <WebsiteContentSliderClient
      contents={contents.map((item) => ({
        id: item.id,
        imageUrl: item.mediaUrl!,
        heading: item.heading,
        text: item.details,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
