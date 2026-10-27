"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Newspaper,
  PanelsTopLeft,
  ShieldCheck,
  UserCheck,
  Users,
  Video,
  Waves,
  MapPin,
  type LucideIcon,
  Clock1Icon,
} from "lucide-react";

type MetricIcon =
  | "users"
  | "userCheck"
  | "newspaper"
  | "activity"
  | "bookOpen"
  | "panels"
  | "fileText"
  | "messages";

type Metric = {
  label: string;
  value: number;
  description: string;
  icon: MetricIcon;
};

type DashboardData = {
  metrics: Metric[];

  accounts: {
    total: number;
    active: number;
    inactive: number;
    roles: { label: string; value: number }[];
  };

  content: {
    news: number;
    activities: number;
    rivers: number;
    haors: number;
    images: number;
    videos: number;
  };

  records: {
    websiteContent: number;
    constitutions: number;
    demands: number;
    demandPoints: number;
    publications: number;
    contactMessages: number;
    donationAccounts: number;
    successfulDonationCount: number;
    successfulDonationAmountBdt: number;
    pendingDonations: number;
  };

  recentNews: {
    id: string;
    heading: string;
    type: "NEWS" | "ACTIVITY";
    riverOrHaor: "RIVER" | "HAOR";
    mediaType: "IMAGE" | "VIDEO" | null;
    createdAt: string;
    userName: string;
  }[];

  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "ACTIVE" | "INACTIVE";
    createdAt: string;
  }[];

  recentPublications: {
    id: string;
    title: string;
    type: "RESEARCH" | "PUBLICATION";
    authorName: string;
    publishedAt: string;
    status: "ACTIVE" | "INACTIVE";
  }[];

  recentMessages: {
    id: string;
    name: string;
    email: string;
    reason: string;
    createdAt: string;
  }[];
};

const iconMap: Record<MetricIcon, LucideIcon> = {
  users: Users,
  userCheck: UserCheck,
  newspaper: Newspaper,
  activity: Activity,
  bookOpen: BookOpen,
  panels: PanelsTopLeft,
  fileText: FileText,
  messages: MessageCircle,
};

const iconStyles: Record<MetricIcon, string> = {
  users: "bg-emerald-50 text-emerald-800",
  userCheck: "bg-green-50 text-green-800",
  newspaper: "bg-teal-50 text-teal-800",
  activity: "bg-lime-50 text-lime-800",
  bookOpen: "bg-emerald-100 text-emerald-900",
  panels: "bg-slate-100 text-slate-700",
  fileText: "bg-green-100 text-green-900",
  messages: "bg-teal-100 text-teal-900",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return value.toLocaleString("en-BD");
}

function formatRole(value: string) {
  return value
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatCard({ metric }: { metric: Metric }) {
  const Icon = iconMap[metric.icon];

  return (
    <article className="border border-emerald-100 bg-white p-4 transition-colors hover:border-emerald-300 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">{metric.label}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-[#123b2b] sm:text-3xl">
            {formatNumber(metric.value)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-lg p-2.5 ${iconStyles[metric.icon]}`}
        >
          <Icon size={19} />
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-500">
        {metric.description}
      </p>
    </article>
  );
}

function SectionHeading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-emerald-100 px-4 py-4 sm:px-5">
      <div>
        <h2 className="text-sm font-bold text-[#123b2b] sm:text-base">
          {title}
        </h2>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <Icon size={19} className="shrink-0 text-[#176b45]" />
    </div>
  );
}

function DistributionRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-slate-700">{label}</span>

        <span className="shrink-0 font-bold tabular-nums text-slate-900">
          {formatNumber(value)}
          <span className="ml-2 font-normal text-slate-400">
            {percentage.toFixed(1)}%
          </span>
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#176b45] transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-4 py-8 text-center text-xs text-slate-500 sm:px-5">
      {message}
    </p>
  );
}

export default function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <main className="min-h-screen space-y-5 bg-[#f5f8f5] p-3 sm:p-5 lg:p-6">
      {/* Dashboard header */}
      <header className="overflow-hidden bg-[#123b2b] text-white">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Haor Rokkha Andolan
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-emerald-50/80 sm:text-sm">
              Overview of accounts, environmental content, publications and
              website records.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            View Website
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      {/* Main statistics */}
      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-[#123b2b] sm:text-base">
            Overview
          </h2>

          <span className="text-[10px] font-medium text-slate-400">
            Live database counts
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {data.metrics.map((metric) => (
            <StatCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      {/* Accounts and content */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="Account distribution"
            description="Registered accounts grouped by role"
            icon={Users}
          />

          <div className="space-y-5 p-4 sm:p-5">
            {data.accounts.roles.length > 0 ? (
              data.accounts.roles.map((role) => (
                <DistributionRow
                  key={role.label}
                  label={formatRole(role.label)}
                  value={role.value}
                  total={data.accounts.total}
                />
              ))
            ) : (
              <EmptyState message="No registered accounts yet." />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-emerald-100 p-4 sm:p-5">
            <div className="bg-emerald-50 p-3">
              <p className="text-xs font-medium text-emerald-800">
                Active accounts
              </p>
              <p className="mt-1 text-xl font-bold text-[#123b2b]">
                {formatNumber(data.accounts.active)}
              </p>
            </div>

            <div className="bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">
                Inactive accounts
              </p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {formatNumber(data.accounts.inactive)}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="News & environmental media"
            description="News, activities, rivers, haors and uploaded media"
            icon={Newspaper}
          />

          <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
            {[
              {
                label: "News articles",
                value: data.content.news,
                icon: Newspaper,
              },
              {
                label: "Activities",
                value: data.content.activities,
                icon: Activity,
              },
              {
                label: "River records",
                value: data.content.rivers,
                icon: Waves,
              },
              {
                label: "Haor records",
                value: data.content.haors,
                icon: MapPin,
              },
              {
                label: "Image records",
                value: data.content.images,
                icon: ImageIcon,
              },
              {
                label: "Video records",
                value: data.content.videos,
                icon: Video,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="border border-slate-100 p-3 sm:p-4"
                >
                  <div className="flex items-center gap-2 text-slate-500">
                    <Icon size={16} className="text-[#176b45]" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>

                  <p className="mt-3 text-xl font-bold text-[#123b2b] sm:text-2xl">
                    {formatNumber(item.value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Other database records */}
      {/*     <section className="border border-emerald-100 bg-white">
        <SectionHeading
          title="Website records"
          description="Content, legal documents, demands and donations"
          icon={PanelsTopLeft}
        />

        <div className="grid grid-cols-2 divide-x divide-y divide-emerald-100 sm:grid-cols-3 lg:grid-cols-4">
          {[
            {
              label: "Website content",
              value: data.records.websiteContent,
              detail: "Active records",
            },
            {
              label: "Constitutions",
              value: data.records.constitutions,
              detail: "Active records",
            },
            {
              label: "Demands",
              value: data.records.demands,
              detail: "Active records",
            },
            {
              label: "Demand points",
              value: data.records.demandPoints,
              detail: "All points",
            },
            {
              label: "Publications",
              value: data.records.publications,
              detail: "Active records",
            },
            {
              label: "Contact messages",
              value: data.records.contactMessages,
              detail: "All received messages",
            },
            {
              label: "Donation accounts",
              value: data.records.donationAccounts,
              detail: "Configured accounts",
            },
            {
              label: "Pending donations",
              value: data.records.pendingDonations,
              detail: "Awaiting payment result",
            },
          ].map((item) => (
            <div key={item.label} className="p-4">
              <p className="text-xs font-medium text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-[#123b2b]">
                {formatNumber(item.value)}
              </p>
              <p className="mt-1 text-[10px] text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-emerald-100 bg-emerald-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <p className="text-xs font-semibold text-[#123b2b]">
              Successful BDT donations
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Only successful donations recorded in BDT are included.
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xl font-black text-[#176b45]">
              BDT{" "}
              {data.records.successfulDonationAmountBdt.toLocaleString(
                "en-BD",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              {formatNumber(data.records.successfulDonationCount)} successful
              transactions
            </p>
          </div>
        </div>
      </section> */}

      {/* Recent news and accounts */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="Recent news & activities"
            description="Latest entries added to the database"
            icon={Clock1Icon}
          />

          {data.recentNews.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentNews.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-emerald-50/40 sm:px-5"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-emerald-50 text-[#176b45]">
                    {item.type === "ACTIVITY" ? (
                      <Activity size={17} />
                    ) : (
                      <Newspaper size={17} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                      {item.heading}
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                      <span className="font-semibold text-[#176b45]">
                        {item.type === "ACTIVITY" ? "Activity" : "News"}
                      </span>
                      <span>·</span>
                      <span>
                        {item.riverOrHaor === "HAOR" ? "Haor" : "River"}
                      </span>
                      {item.mediaType && (
                        <>
                          <span>·</span>
                          <span>{item.mediaType}</span>
                        </>
                      )}
                    </div>

                    <p className="mt-1 text-[11px] text-slate-400">
                      By {item.userName} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="News and activities will appear here." />
          )}
        </div>

        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="Recently registered accounts"
            description="The latest user registrations"
            icon={Users}
          />

          {data.recentUsers.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-emerald-50/40 sm:px-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#123b2b]">
                    {user.name.trim().charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Registered {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="max-w-32 truncate bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
                      {formatRole(user.role)}
                    </span>

                    <span
                      className={`px-2 py-1 text-[10px] font-semibold ${
                        user.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="New registrations will appear here." />
          )}
        </div>
      </section>

      {/* Recent publications and contact messages */}
      <section className="grid gap-4 xl:grid-cols-2">
        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="Recent research & publications"
            description="Latest publication records"
            icon={BookOpen}
          />

          {data.recentPublications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentPublications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-4 py-3 sm:px-5"
                >
                  <BookOpen
                    size={18}
                    className="mt-1 shrink-0 text-[#176b45]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.type === "RESEARCH" ? "Research" : "Publication"}
                      {" · "}
                      {item.authorName}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatDate(item.publishedAt)}
                    </p>
                  </div>

                  <Link
                    href={`/publications/${item.id}`}
                    className="shrink-0 rounded-full border border-emerald-200 px-3 py-1.5 text-[10px] font-semibold text-[#176b45] transition hover:bg-emerald-50"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Publications will appear here when added." />
          )}
        </div>

        <div className="min-w-0 border border-emerald-100 bg-white">
          <SectionHeading
            title="Recent contact messages"
            description="Latest website enquiries"
            icon={Mail}
          />

          {data.recentMessages.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 px-4 py-3 sm:px-5"
                >
                  <Mail size={17} className="mt-1 shrink-0 text-[#176b45]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {message.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {message.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {message.reason}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="No contact messages received yet." />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 border border-emerald-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          Dashboard connected to the database
        </div>

        <p className="text-[10px] text-slate-400">
          Haor Rokkha Andolan · Administration
        </p>
      </footer>
    </main>
  );
}

function ClockIcon(props: React.ComponentProps<typeof Activity>) {
  return <Activity {...props} />;
}
