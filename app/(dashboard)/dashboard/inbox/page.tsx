import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowLeft,
  Inbox,
  Mail,
  Phone,
  CalendarDays,
  MessageSquareText,
  Trash2,
  UserRound,
  ChevronRight,
} from "lucide-react";

import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";
import { deleteContactMessageAction } from "./inboxActions";

export default function InboxPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl animate-pulse space-y-5">
            <div className="h-16 rounded-xl bg-slate-200" />
            <div className="h-40 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      <InboxContent />
    </Suspense>
  );
}

async function InboxContent() {
  await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-800"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900 text-white">
                <Inbox size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Inbox
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Contact messages received from your website.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <MessageSquareText size={19} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Total messages
              </p>
              <p className="text-xl font-bold leading-6 text-slate-900">
                {messages.length}
              </p>
            </div>
          </div>
        </div>

        {/* Message list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Received Messages
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Newest messages appear first.
              </p>
            </div>

            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {messages.length}{" "}
              {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <Inbox size={30} />
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                Your inbox is empty
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Contact messages submitted through your website will appear
                here.
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              >
                Visit website
                <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className="p-5 transition-colors hover:bg-slate-50/70 sm:p-6"
                >
                  {/* Sender and actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                        <UserRound size={21} />
                      </div>

                      <div className="min-w-0">
                        <h3 className="wrap-break-words font-semibold text-slate-900">
                          {message.name}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                          <span className="inline-flex min-w-0 items-center gap-1.5 break-all">
                            <Mail
                              size={14}
                              className="shrink-0 text-slate-400"
                            />
                            {message.email}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Phone
                              size={14}
                              className="shrink-0 text-slate-400"
                            />
                            {message.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <form action={deleteContactMessageAction}>
                      <input
                        type="hidden"
                        name="id"
                        value={message.id}
                      />

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </form>
                  </div>

                  {/* Message details */}
                  <div className="mt-5 sm:ml-14">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                        {message.reason}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={13} />
                        {new Intl.DateTimeFormat("en-GB", {
                          timeZone: "Asia/Dhaka",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(message.createdAt)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:p-5">
                      <p className="whitespace-pre-wrap wrap-break-words text-sm leading-7 text-slate-700">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="px-1 text-xs text-slate-400">
          Haor Rokkha Andolan · Website Inbox
        </p>
      </div>
    </main>
  );
}