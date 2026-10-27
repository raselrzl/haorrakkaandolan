import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import DashboardClient from "./DashboardClient";

export const instant = false;

function DashboardLoading() {
  return (
    <main className="min-h-screen space-y-5 bg-[#f5f8f5] p-4 sm:p-6">
      <div className="animate-pulse border border-emerald-100 bg-white p-5">
        <div className="h-7 w-56 bg-emerald-100" />
        <div className="mt-3 h-4 w-80 max-w-full bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse border border-slate-200 bg-white p-4"
          >
            <div className="h-4 w-24 bg-slate-100" />
            <div className="mt-4 h-8 w-16 bg-emerald-50" />
            <div className="mt-3 h-3 w-28 bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse border border-slate-200 bg-white"
          />
        ))}
      </div>
    </main>
  );
}

async function DashboardData() {
  await connection();

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    roleCounts,
    newsCount,
    activityCount,
    riverCount,
    haorCount,
    imageCount,
    videoCount,
    activeWebsiteContent,
    activeConstitutions,
    activeDemands,
    totalDemandPoints,
    activePublications,
    totalContactMessages,
    totalDonationAccounts,
    successfulDonationsBdt,
    pendingDonations,
    recentNews,
    recentUsers,
    recentPublications,
    recentMessages,
  ] = await Promise.all([
    // Users and roles
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "INACTIVE" } }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),

    // News and activities
    prisma.news.count({ where: { type: "NEWS" } }),
    prisma.news.count({ where: { type: "ACTIVITY" } }),
    prisma.news.count({ where: { riverOrHaor: "RIVER" } }),
    prisma.news.count({ where: { riverOrHaor: "HAOR" } }),
    prisma.news.count({ where: { mediaType: "IMAGE" } }),
    prisma.news.count({ where: { mediaType: "VIDEO" } }),

    // Other website content
    prisma.websiteContent.count({ where: { status: "ACTIVE" } }),
    prisma.constitution.count({ where: { status: "ACTIVE" } }),
    prisma.demand.count({ where: { status: "ACTIVE" } }),
    prisma.demandPoint.count(),

    // Research and publications
    prisma.publication.count({ where: { status: "ACTIVE" } }),

    // Contact messages and donation accounts
    prisma.contactMessage.count(),
    prisma.donationAccount.count(),

    // Only aggregate successful BDT donations, avoiding mixed currencies
    prisma.donation.aggregate({
      where: {
        status: "SUCCESS",
        currency: "BDT",
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),

    prisma.donation.count({ where: { status: "PENDING" } }),

    // Recent news and activities
    prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        heading: true,
        type: true,
        riverOrHaor: true,
        mediaType: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
      },
    }),

    // Recent accounts
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),

    // Recent publications
    prisma.publication.findMany({
      take: 5,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        type: true,
        authorName: true,
        publishedAt: true,
        status: true,
      },
    }),

    // Recent contact messages
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        reason: true,
        createdAt: true,
      },
    }),
  ]);

  const metrics = [
    {
      label: "Total accounts",
      value: totalUsers,
      description: "All registered accounts",
      icon: "users" as const,
    },
    {
      label: "Active accounts",
      value: activeUsers,
      description: "Accounts marked active",
      icon: "userCheck" as const,
    },
    {
      label: "News articles",
      value: newsCount,
      description: "News entries",
      icon: "newspaper" as const,
    },
    {
      label: "Activities",
      value: activityCount,
      description: "Activity entries",
      icon: "activity" as const,
    },
    {
      label: "Publications",
      value: activePublications,
      description: "Active research and publications",
      icon: "bookOpen" as const,
    },
    {
      label: "Website content",
      value: activeWebsiteContent,
      description: "Active content records",
      icon: "panels" as const,
    },
    {
      label: "Demands",
      value: activeDemands,
      description: "Active demand records",
      icon: "fileText" as const,
    },
    {
      label: "Contact messages",
      value: totalContactMessages,
      description: "All received messages",
      icon: "messages" as const,
    },
  ];

  const data = {
    metrics,

    accounts: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      roles: roleCounts.map((item) => ({
        label: item.role.replaceAll("_", " "),
        value: item._count._all,
      })),
    },

    content: {
      news: newsCount,
      activities: activityCount,
      rivers: riverCount,
      haors: haorCount,
      images: imageCount,
      videos: videoCount,
    },

    records: {
      websiteContent: activeWebsiteContent,
      constitutions: activeConstitutions,
      demands: activeDemands,
      demandPoints: totalDemandPoints,
      publications: activePublications,
      contactMessages: totalContactMessages,
      donationAccounts: totalDonationAccounts,
      successfulDonationCount: successfulDonationsBdt._count._all,
      successfulDonationAmountBdt: Number(
        successfulDonationsBdt._sum.amount ?? 0,
      ),
      pendingDonations,
    },

    recentNews: recentNews.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      userName: item.user.name,
    })),

    recentUsers: recentUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
    })),

    recentPublications: recentPublications.map((item) => ({
      ...item,
      publishedAt: item.publishedAt.toISOString(),
    })),

    recentMessages: recentMessages.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  };

  return <DashboardClient data={data} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardData />
    </Suspense>
  );
}