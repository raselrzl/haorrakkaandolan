"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid2X2, List, Phone, Users, ChevronRight } from "lucide-react";

type TeamPerson = {
  id: string;
  name: string;
  phone: string | null;
  imageUrl: string | null;
  role: string;
  biography: string | null;
  designation: string | null;
  startDate: Date | null;
  endDate: Date | null;
};

const designationOrder = [
  "SOVAPOTI",
  "SADHARONSOMPADOK",
  "SOHOSOVAPOTI",
  "PRODHANUPODESHTA",
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
];

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
  PRODHANUPODESHTA: "প্রধান উপদেষ্টা (Chief Adviser)",
};

function getDesignationKey(person: TeamPerson): string {
  const designation = person.designation?.trim().toUpperCase();

  if (designation && designationOrder.includes(designation)) {
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
    <div className="mt-4 border-t border-amber-100 pt-3 text-left">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-950">
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
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-800 transition hover:text-amber-950"
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

export default function AboutTeamClient({ people }: { people: TeamPerson[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

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

    return (
      <article
        key={person.id}
        style={{
          animationDelay: `${index * 90}ms`,
        }}
        className={`team-card min-w-0 overflow-hidden border border-amber-900/10 bg-white shadow-sm shadow-slate-900/5 transition duration-300 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-900/10 ${
          hasBiography
            ? "w-full p-4 sm:p-6"
            : view === "grid"
              ? "p-3 sm:p-4"
              : "flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
        }`}
      >
        {/* PROFILE IMAGE */}
        <div
          className={`relative shrink-0 overflow-hidden rounded-full border-2 border-amber-100 bg-slate-100 shadow-md shadow-amber-900/10 ${
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

        {/* MEMBER INFORMATION */}
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

    {/*       <p className="mt-1 break-words text-xs font-semibold text-amber-800">
            {formatDesignation(designation)}
          </p> */}

          {/* PHONE */}
          {person.phone && (
            <p className="mt-2 flex min-w-0 items-center justify-center gap-1.5 text-xs text-slate-500 sm:justify-start">
              <Phone size={13} className="shrink-0 text-amber-700" />

              <a
                href={`tel:${person.phone}`}
                className="break-all transition hover:text-amber-800"
              >
                {person.phone}
              </a>
            </p>
          )}

          {/* BIOGRAPHY */}
          {biography && <BiographyToggle biography={biography} />}
        </div>
      </article>
    );
  };

  return (
    <>
      {/* COMMITTEE HEADER AND VIEW SWITCHER */}
      <div className="flex items-center justify-between gap-3 border-amber-200 pb-3">
        <div className="min-w-0"></div>

        <div className="inline-flex shrink-0 border border-slate-300 bg-white shadow-sm shadow-slate-900/10">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold transition ${
              view === "grid"
                ? "bg-gradient-to-b from-amber-200 to-amber-400 text-amber-950"
                : "text-slate-600 hover:bg-slate-100"
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
            className={`inline-flex items-center gap-1.5 border-l border-slate-300 px-2.5 py-2 text-xs font-semibold transition ${
              view === "list"
                ? "bg-gradient-to-b from-amber-200 to-amber-400 text-amber-950"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <List size={15} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* TEAM CONTENT */}
      {groupedPeople.length > 0 ? (
        <div className="space-y-7 sm:space-y-9">
          {groupedPeople.map((group, groupIndex) => {
            const singleColumn = singleColumnDesignations.includes(
              group.designation,
            );

            return (
              <section
                key={group.designation}
                style={{
                  animationDelay: `${groupIndex * 100}ms`,
                }}
                className="designation-row"
              >
                {/* DESIGNATION HEADER */}
                <div className="mb-3 flex items-center gap-3 border-b border-amber-200 pb-2.5">
                  <div className="h-7 w-1 shrink-0 bg-gradient-to-b from-amber-300 to-amber-600 shadow-sm shadow-amber-600/30" />

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-amber-950 sm:text-lg">
                      {group.label}
                    </h2>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {group.people.length}{" "}
                      {group.people.length === 1 ? "person" : "people"}
                    </p>
                  </div>

                  <ChevronRight size={17} className="shrink-0 text-amber-700" />
                </div>

                {/* MEMBERS GRID / LIST */}
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
        <div className="border border-dashed border-amber-300 bg-amber-50/40 px-4 py-10 text-center shadow-sm shadow-amber-900/5">
          <Users
            size={30}
            className="mx-auto mb-3 text-amber-700"
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

      {/* TOTAL MEMBERS */}
      <p className="border-t border-amber-200 pt-3 text-right text-xs text-slate-500">
        {people.length} active {people.length === 1 ? "person" : "people"}
      </p>

      {/* ANIMATIONS */}
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
    </>
  );
}
