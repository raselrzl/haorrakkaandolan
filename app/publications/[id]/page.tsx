import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import { ArrowLeft, CalendarDays, FileText, UserRound } from "lucide-react";
import LanguageSwitcher from "@/app/LanguageSwitcher";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(value);
}

export default async function PublicationDetailPage({ params }: Props) {
  const { id } = await params;

  // Use request-time rendering before accessing the current date.
  await connection();

  const now = new Date();

  const item = await prisma.publication.findFirst({
    where: {
      id,
      status: "ACTIVE",
      publishedAt: {
        lte: now,
      },
    },
  });

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-[#f5f8f5] text-slate-800">
      <article className="mx-auto max-w-4xl px-3 py-8 sm:px-6 lg:px-8">
        {/* Back to publications */}
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#176b45] transition-colors hover:text-[#123b2b]"
        >
          <ArrowLeft size={16} />
          All Research & Publications
        </Link>

        {/* Publication content */}
        <div className="mt-6 border border-emerald-100 bg-white shadow-sm">
          {item.coverImageUrl && (
            <img
              src={item.coverImageUrl}
              alt={item.title}
              className="max-h-[460px] w-full bg-emerald-50 object-cover"
            />
          )}

          <div className="p-5 sm:p-8">
            {/* Publication type */}
            <span className="inline-block bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#176b45] ring-1 ring-inset ring-emerald-200">
              {item.type === "RESEARCH" ? "Research" : "Publication"}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-2xl font-black leading-tight text-[#123b2b] sm:text-4xl">
              {item.title}
            </h1>

            {item.subtitle && (
              <p className="mt-3 text-lg leading-7 text-slate-600">
                {item.subtitle}
              </p>
            )}

            {/* Publication date */}
            <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays size={14} className="text-[#176b45]" />
              Published {formatDate(item.publishedAt)}
            </p>

            {/* Author information */}
            <div className="my-6 flex items-start gap-3 border-y border-emerald-100 py-5">
              {item.authorImageUrl ? (
                <img
                  src={item.authorImageUrl}
                  alt={item.authorName}
                  className="h-14 w-14 shrink-0 rounded-full border border-emerald-100 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-[#176b45]">
                  <UserRound size={24} />
                </div>
              )}

              <div>
                <p className="font-bold text-[#123b2b]">{item.authorName}</p>

                {item.authorDesignation && (
                  <p className="mt-0.5 text-sm text-slate-600">
                    {item.authorDesignation}
                  </p>
                )}

                {item.authorBio && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.authorBio}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            {item.excerpt && (
              <p className="mb-6 border-l-4 border-[#176b45] bg-emerald-50/80 px-4 py-3 text-sm font-medium leading-6 text-slate-700">
                {item.excerpt}
              </p>
            )}

            {/* Full publication text */}
            <div className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-700 sm:text-base">
              {item.content}
            </div>

            {/* Supporting document */}
            {item.documentUrl && (
              <div className="mt-8 border-t border-emerald-100 pt-5">
                <a
                  href={item.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#176b45] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#123b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  <FileText size={16} />
                  {item.documentName || "Open Supporting Document"}
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </main>
  );
}
