import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/app/utils/db";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  UserRound,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
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

function PublicationLoading() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-9 w-52 rounded-full bg-slate-100" />

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-md shadow-amber-100/70 sm:p-8">
          <div className="h-5 w-24 rounded-full bg-amber-100" />
          <div className="mt-5 h-8 w-3/4 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-8 h-24 rounded bg-amber-50" />

          <div className="mt-6 space-y-3">
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 rounded bg-slate-100" />
            <div className="h-4 w-4/5 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function PublicationDetailContent({ params }: Props) {
  // Access request-time values inside the Suspense boundary.
  const { id } = await params;

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

  if (!item) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-3 py-8 sm:px-6 lg:px-8">
      {/* BACK NAVIGATION */}
      <Link
        href="/publications"
        className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        <ArrowLeft
          size={15}
          className="transition-transform group-hover:-translate-x-1"
        />
        All Research & Publications
      </Link>

      {/* PUBLICATION CARD */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-md shadow-amber-100/70">
        {/* COVER IMAGE */}
        {item.coverImageUrl && (
          <div className="relative overflow-hidden bg-slate-100">
            <img
              src={item.coverImageUrl}
              alt={item.title}
              className="max-h-[460px] w-full object-cover"
            />
          </div>
        )}

        <div className="p-5 sm:p-8">
          {/* CATEGORY */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
              <BookOpen size={12} />
              {item.type === "RESEARCH" ? "Research" : "Publication"}
            </span>
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {item.title}
          </h1>

          {/* SUBTITLE */}
          {item.subtitle && (
            <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
              {item.subtitle}
            </p>
          )}

          {/* PUBLICATION DATE */}
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={14} className="text-amber-700" />
            Published {formatDate(item.publishedAt)}
          </p>

          {/* AUTHOR INFORMATION */}
          <div className="my-6 flex items-start gap-3 border-y border-slate-100 py-5">
            {item.authorImageUrl ? (
              <img
                src={item.authorImageUrl}
                alt={item.authorName}
                className="h-14 w-14 shrink-0 rounded-full border border-amber-200 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                <UserRound size={24} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900">{item.authorName}</p>

              {item.authorDesignation && (
                <p className="mt-0.5 text-sm text-slate-500">
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

          {/* SUMMARY */}
          {item.excerpt && (
            <div className="mb-7 rounded-lg border border-amber-100 bg-amber-50/60 p-4">
              <p className="border-l-[3px] border-amber-500 pl-3 text-sm font-medium leading-7 text-slate-700">
                {item.excerpt}
              </p>
            </div>
          )}

          {/* FULL PUBLICATION CONTENT */}
          <div className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-700 sm:text-base">
            {item.content}
          </div>

          {/* SUPPORTING DOCUMENT */}
          {item.documentUrl && (
            <div className="mt-8 border-t border-slate-100 pt-5">
              <a
                href={item.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-bold text-amber-950 transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                <FileText size={16} />
                {item.documentName || "Open Supporting Document"}
                <ArrowUpRight size={15} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* BACK TO PUBLICATIONS */}
      <div className="mt-5">
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 transition-colors hover:text-amber-800"
        >
          <ArrowLeft size={14} />
          Back to all publications
        </Link>
      </div>
    </article>
  );
}

export default function PublicationDetailPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-[#f7f9f6] text-slate-800">
      <Suspense fallback={<PublicationLoading />}>
        <PublicationDetailContent params={params} />
      </Suspense>

      {/* FLOATING LANGUAGE SWITCHER */}
      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>
    </main>
  );
}
