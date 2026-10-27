"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar";
import {
  Grid2X2,
  List,
  Phone,
  Mail,
  Users,
  LoaderCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { getPublicTeamAction } from "./aboutActions";
import FloatingContact from "../FloatingContact";
import Footer from "../Footer";
import LanguageSwitcher from "../LanguageSwitcher";

type TeamPerson = Awaited<ReturnType<typeof getPublicTeamAction>>[number];

const designationOrder = [
  "SOVAPOTI",
  "SADHARONSOMPADOK",
  "SOHOSOVAPOTI",
  "SOHOSADHARONSOMPADOK",
  "SANGOTONIKSOMPADOK",
  "SOHOSANGOTONIKSOMPADOK",
  "ARTHOSOMPADOK",
  "PROCHARSOMPADOK",
  "DOPTORSOMPADOK",
  "SANGSKRITIKSOMPADOK",
  "MOHILASOMPADOK",
  "AINBISHOYOKSOMPADOK",
  "CHATROOJUBOSOMPADOK",
  "UPODESTAPORISHOD",
  "KARJONIRBAHISODOSSHO",
  "MEMBER",
  "CHAIRMAN",
] as const;

// These two designation sections use one card per row.
const singleColumnDesignations = ["SOVAPOTI", "SADHARONSOMPADOK"];

const designationLabels: Record<string, string> = {
  SOVAPOTI: "সভাপতি (President)",
  SADHARONSOMPADOK: "সাধারণ সম্পাদক (General Secretary)",
  SOHOSOVAPOTI: "সহ-সভাপতি (Vice President)",
  SOHOSADHARONSOMPADOK: "সহ-সাধারণ সম্পাদক (Joint General Secretary)",
  SANGOTONIKSOMPADOK: "সাংগঠনিক সম্পাদক (Organizing Secretary)",
  SOHOSANGOTONIKSOMPADOK: "সহ-সাংগঠনিক সম্পাদক (Joint Organizing Secretary)",
  ARTHOSOMPADOK: "অর্থ সম্পাদক (Treasurer)",
  PROCHARSOMPADOK: "প্রচার সম্পাদক (Publicity Secretary)",
  DOPTORSOMPADOK: "দপ্তর সম্পাদক (Office Secretary)",
  SANGSKRITIKSOMPADOK: "সাংস্কৃতিক সম্পাদক (Cultural Secretary)",
  MOHILASOMPADOK: "মহিলা সম্পাদক (Women's Secretary)",
  AINBISHOYOKSOMPADOK: "আইন বিষয়ক সম্পাদক (Legal Affairs Secretary)",
  CHATROOJUBOSOMPADOK: "ছাত্র ও যুব সম্পাদক (Student and Youth Secretary)",
  UPODESTAPORISHOD: "উপদেষ্টা পরিষদ (Advisory Council)",
  KARJONIRBAHISODOSSHO: "কার্যনির্বাহী সদস্য (Executive Member)",
  MEMBER: "সাধারণ সদস্য (General Member)",
  CHAIRMAN: "চেয়ারম্যান (Chairman)",
};

function getDesignationKey(person: TeamPerson): string {
  const designation = person.designation?.trim().toUpperCase();

  if (
    designation &&
    designationOrder.includes(
      designation as (typeof designationOrder)[number],
    )
  ) {
    return designation;
  }

  if (person.role === "CHAIRMAN") {
    return "CHAIRMAN";
  }

  return "MEMBER";
}

function formatDesignation(designation: string): string {
  return designationLabels[designation] ?? designation.replaceAll("_", " ");
}

function BiographyToggle({ biography }: { biography: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 border-t border-emerald-100 pt-3 text-left">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-950">
        Biography
      </h4>

      <p
        className={`whitespace-pre-line break-words text-sm leading-6 text-slate-600 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {biography}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        aria-expanded={expanded}
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 transition hover:text-emerald-950"
      >
        {expanded ? "Show less" : "Read full biography"}
        <ChevronRight
          size={14}
          className={`transition-transform duration-200 ${
            expanded ? "-rotate-90" : "rotate-90"
          }`}
        />
      </button>
    </div>
  );
}

export default function AboutPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [people, setPeople] = useState<TeamPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Automatically retries failed requests without requiring a page reload.
  useEffect(() => {
    let cancelled = false;
    let failures = 0;

    const delay = (milliseconds: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
      });

    async function loadTeam() {
      setLoading(true);
      setError("");

      while (!cancelled) {
        try {
          const result = await getPublicTeamAction();

          if (cancelled) return;

          setPeople(result);
          setError("");
          setLoading(false);

          return;
        } catch (err) {
          if (cancelled) return;

          failures += 1;

          console.error(
            `[getPublicTeamAction] Attempt ${failures} failed:`,
            err,
          );

          // Show the error message after three failures,
          // but keep retrying automatically in the background.
          if (failures >= 3) {
            setError(
              "Unable to load the organization team. Retrying automatically...",
            );
            setLoading(false);
          }

          // Retry quickly at first, then wait longer between attempts.
          const retryDelay =
            failures <= 3
              ? failures * 1000
              : Math.min(5000 * 2 ** Math.min(failures - 4, 2), 20000);

          await delay(retryDelay);

          if (cancelled) return;

          // Keep the error visible during background retries.
          // The existing team data is preserved until a request succeeds.
        }
      }
    }

    void loadTeam();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const getImage = (person: TeamPerson) =>
    person.imageUrl?.trim() || "/img/monu1.jpg";

  const groupedPeople = designationOrder
    .map((designation) => ({
      designation,
      label: formatDesignation(designation),
      people: people
        .filter((person) => getDesignationKey(person) === designation)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.people.length > 0);

  const renderPerson = (
    person: TeamPerson,
    designation: string,
    index: number,
  ) => {
    const biography = person.biography?.trim();
    const hasBiography = Boolean(biography);

    const email =
      "email" in person && typeof person.email === "string"
        ? person.email.trim()
        : "";

    return (
      <article
        key={person.id}
        style={{ animationDelay: `${index * 90}ms` }}
        className={`team-card min-w-0 overflow-hidden border border-emerald-900/10 bg-white transition duration-300 hover:border-emerald-700/40 hover:shadow-md ${
          hasBiography
            ? "w-full p-4 sm:p-6"
            : view === "grid"
              ? "p-3 sm:p-4"
              : "flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
        }`}
      >
        <div
          className={`relative shrink-0 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100 ${
            hasBiography
              ? "mx-auto h-24 w-24 sm:mx-0 sm:h-28 sm:w-28"
              : view === "grid"
                ? "mx-auto h-20 w-20 sm:h-24 sm:w-24"
                : "mx-auto h-16 w-16 sm:mx-0 sm:h-20 sm:w-20"
          }`}
        >
          <Image
            src={getImage(person)}
            alt={person.name}
            fill
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover transition duration-500 hover:scale-105"
          />
        </div>

        <div
          className={`min-w-0 ${
            hasBiography
              ? "mt-4 text-center sm:mt-0 sm:flex-1 sm:text-left"
              : view === "grid"
                ? "mt-3 text-center"
                : "flex-1 text-center sm:text-left"
          }`}
        >
          <h3 className="break-words text-sm font-bold text-slate-900 sm:text-base">
            {person.name}
          </h3>

          <p className="mt-1 break-words text-xs font-semibold text-emerald-800">
            {formatDesignation(designation)}
          </p>

          {email && (
            <p className="mt-2 flex min-w-0 items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
              <Mail size={13} className="shrink-0 text-emerald-700" />
              <a
                href={`mailto:${email}`}
                className="break-all hover:text-emerald-800"
              >
                {email}
              </a>
            </p>
          )}

          {person.phone && (
            <p className="mt-2 flex min-w-0 items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
              <Phone size={13} className="shrink-0 text-emerald-700" />
              <a
                href={`tel:${person.phone}`}
                className="break-all hover:text-emerald-800"
              >
                {person.phone}
              </a>
            </p>
          )}

          {biography && <BiographyToggle biography={biography} />}
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <Navbar />

      <div className="fixed right-4 top-1/2 z-[9999] -translate-y-1/2">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto mt-16 w-full max-w-7xl space-y-7 px-4 py-7 sm:space-y-9 sm:px-6 sm:py-10 lg:px-8">
        <header className="border-b border-emerald-900/10 pb-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
            Haor Rokkha Andolan
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-4xl">
            Our Organization
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Meet the people working together to protect our haors and preserve
            the natural environment.
          </p>
        </header>

        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-emerald-950 sm:text-xl">
              Committee &amp; Members
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Organized by designation
            </p>
          </div>

          <div className="inline-flex shrink-0 border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold transition ${
                view === "grid"
                  ? "bg-emerald-800 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Grid2X2 size={15} />
              <span>Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold transition ${
                view === "list"
                  ? "bg-emerald-800 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List size={15} />
              <span>List</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center gap-2 border border-slate-200 bg-white text-sm text-slate-500">
            <LoaderCircle size={18} className="animate-spin" />
            Loading organization members...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="border border-amber-200 bg-white p-5 text-sm text-amber-800"
          >
            <div className="flex items-center gap-2">
              <LoaderCircle size={16} className="shrink-0 animate-spin" />
              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-3 inline-flex items-center gap-1 font-semibold text-emerald-800"
            >
              <RefreshCw size={13} />
              Retry now
            </button>
          </div>
        ) : groupedPeople.length > 0 ? (
          <div className="space-y-7 sm:space-y-9">
            {groupedPeople.map((group, groupIndex) => {
              const singleColumn = singleColumnDesignations.includes(
                group.designation,
              );

              return (
                <section
                  key={group.designation}
                  style={{ animationDelay: `${groupIndex * 100}ms` }}
                  className="designation-row"
                >
                  <div className="mb-3 flex items-center gap-3 border-b border-emerald-900/15 pb-2.5">
                    <div className="h-6 w-1 shrink-0 bg-emerald-700" />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-bold text-emerald-950 sm:text-lg">
                        {group.label}
                      </h2>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {group.people.length}{" "}
                        {group.people.length === 1 ? "person" : "people"}
                      </p>
                    </div>

                    <ChevronRight
                      size={17}
                      className="shrink-0 text-emerald-700"
                    />
                  </div>

                  <div
                    className={
                      view === "list"
                        ? "flex flex-col gap-2.5"
                        : singleColumn
                          ? "grid grid-cols-1 gap-3"
                          : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                    }
                  >
                    {group.people.map((person, index) => {
                      const hasBiography = Boolean(person.biography?.trim());

                      return (
                        <div
                          key={person.id}
                          className={
                            view === "grid" && !singleColumn && hasBiography
                              ? "col-span-full"
                              : "min-w-0"
                          }
                        >
                          {renderPerson(person, group.designation, index)}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
            <Users
              size={30}
              className="mx-auto mb-3 text-emerald-800"
              strokeWidth={1.5}
            />

            <h3 className="text-sm font-bold text-slate-800">
              No active members published yet
            </h3>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Designation rows will appear when active members are available.
            </p>
          </div>
        )}

        {!loading && !error && (
          <p className="border-t border-slate-200 pt-3 text-right text-xs text-slate-500">
            {people.length} active {people.length === 1 ? "person" : "people"}
          </p>
        )}
      </div>

      <FloatingContact />
      <Footer />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .designation-row {
          animation: fadeInUp 0.55s ease-out both;
        }

        .team-card {
          animation: fadeInUp 0.5s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .designation-row,
          .team-card {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}