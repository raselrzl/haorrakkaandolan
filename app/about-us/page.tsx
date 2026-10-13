"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar";
import { Grid2X2, List, Phone, Users } from "lucide-react";

type Member = {
  id: number;
  name: string;
  phone: string;
  image: string;
};

const chairman = {
  name: "Chairman's Name",
  phone: "Add phone number",
  image: "/img/monu1.jpg",
  history:
    "Add the chairman's biography, background, leadership experience, and contributions to Haor Rokkha Andolan. Include relevant environmental activities, community initiatives, and achievements.",
};

const members: Member[] = [
  {
    id: 1,
    name: "Member One",
    phone: "Add phone number",
    image: "/img/monu2.jpg",
  },
  {
    id: 2,
    name: "Member Two",
    phone: "Add phone number",
    image: "/img/monu3.jpg",
  },
  {
    id: 3,
    name: "Member Three",
    phone: "Add phone number",
    image: "/img/monu1.jpg",
  },
  {
    id: 4,
    name: "Member Four",
    phone: "Add phone number",
    image: "/img/monu2.jpg",
  },
  {
    id: 5,
    name: "Member Five",
    phone: "Add phone number",
    image: "/img/monu3.jpg",
  },
  {
    id: 6,
    name: "Member Six",
    phone: "Add phone number",
    image: "/img/monu1.jpg",
  },
];

export default function AboutPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate flex min-h-[230px] items-center justify-center overflow-hidden bg-emerald-950 sm:min-h-[280px]">
        <Image
          src="/img/monu1.jpg"
          alt="Haor Rokkha Andolan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/75 to-emerald-950/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-300 sm:text-xs">
            Haor Rokkha Andolan · Moulvibazar
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            About Us
          </h1>

          <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-emerald-400" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* About the Organization */}
        <section>
          <div className="mb-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              About the Organization
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              Haor Rokkha Andolan
            </h2>
          </div>

          <div className="rounded-xl border border-emerald-900/10 bg-white p-5 sm:p-7">
            <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Haor Rokkha Andolan is an environmental and community-oriented
                initiative dedicated to protecting the haors, rivers, wetlands,
                and natural ecosystems of the region. The organization seeks
                to raise public awareness about environmental challenges and
                encourage collective action to preserve these valuable natural
                resources for present and future generations.
              </p>

              <p>
                The haor region supports a rich diversity of wildlife, fisheries,
                agriculture, and local livelihoods. Protecting these ecosystems
                is essential to maintaining environmental balance and
                safeguarding the well-being of the communities that depend on
                them.
              </p>

              <p>
                Through public awareness, community participation, environmental
                advocacy, and conservation initiatives, Haor Rokkha Andolan
                aims to bring people together to address environmental
                degradation and promote responsible stewardship of nature.
              </p>
            </div>

            {/* Mission and Vision */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4">
                <h3 className="mb-2 font-bold text-emerald-950">
                  Our Mission
                </h3>

                <p className="text-sm leading-6 text-slate-600">
                  To protect haor ecosystems, preserve biodiversity, raise
                  environmental awareness, and encourage communities to take
                  meaningful action for conservation.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-2 font-bold text-slate-900">
                  Our Vision
                </h3>

                <p className="text-sm leading-6 text-slate-600">
                  A healthy and sustainable haor region where rivers flow,
                  biodiversity thrives, and local communities can live in
                  harmony with nature.
                </p>
              </div>
            </div>

            {/* Objectives */}
            <div className="mt-4 rounded-lg border border-slate-100 p-4">
              <h3 className="mb-3 font-bold text-emerald-950">
                Our Objectives
              </h3>

              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                <li>
                  Protect haors, rivers, wetlands, and biodiversity.
                </li>
                <li>
                  Raise awareness about pollution and environmental degradation.
                </li>
                <li>
                  Encourage community participation in conservation.
                </li>
                <li>
                  Promote sustainable use of natural resources.
                </li>
                <li>
                  Support collective efforts to safeguard the region&apos;s
                  environment.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chairman's Profile */}
        <section>
          <div className="mb-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              Leadership
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              Chairman&apos;s Profile
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-emerald-900/10 bg-white p-5 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full border-4 border-emerald-100 bg-slate-100 sm:h-56 sm:w-56">
                <Image
                  src={chairman.image}
                  alt={chairman.name}
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 text-center sm:pt-3 sm:text-left">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                  Chairman
                </span>

                <h3 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
                  {chairman.name}
                </h3>

                <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={15} className="text-emerald-700" />
                  {chairman.phone}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <h4 className="mb-2 text-sm font-bold text-emerald-950">
                    Biography &amp; Contributions
                  </h4>

                  <p className="text-sm leading-7 text-slate-600">
                    {chairman.history}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Members */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                Our Team
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                Our Members
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Meet the people working together to protect our haors.
              </p>
            </div>

            {/* Grid / List Toggle */}
            <div className="inline-flex self-start rounded-lg border border-slate-200 bg-white p-1 sm:self-auto">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-pressed={view === "grid"}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  view === "grid"
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Grid2X2 size={16} />
                Grid
              </button>

              <button
                type="button"
                onClick={() => setView("list")}
                aria-pressed={view === "list"}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  view === "list"
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List size={16} />
                List
              </button>
            </div>
          </div>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
                : "flex flex-col gap-3"
            }
          >
            {members.map((member) => (
              <article
                key={member.id}
                className={
                  view === "grid"
                    ? "flex min-w-0 flex-col items-center rounded-xl border border-slate-200/80 bg-white p-4 text-center transition hover:border-emerald-700/30 hover:shadow-md sm:p-5"
                    : "flex min-w-0 items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-3 transition hover:border-emerald-700/30 hover:shadow-sm sm:gap-5 sm:p-4"
                }
              >
                <div
                  className={`relative shrink-0 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100 ${
                    view === "grid"
                      ? "h-24 w-24 sm:h-28 sm:w-28"
                      : "h-16 w-16 sm:h-20 sm:w-20"
                  }`}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes={view === "grid" ? "112px" : "80px"}
                    className="object-cover"
                  />
                </div>

                <div
                  className={`min-w-0 ${
                    view === "grid" ? "mt-3 w-full" : "flex-1"
                  }`}
                >
                  <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                    {member.name}
                  </h3>

                  <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500 sm:text-sm">
                    {view === "list" && (
                      <Phone
                        size={14}
                        className="shrink-0 text-emerald-700"
                      />
                    )}

                    <span className="truncate">{member.phone}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>

          {members.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
              <Users
                className="mx-auto mb-3 text-slate-400"
                size={28}
              />

              <p className="text-sm font-medium text-slate-600">
                No members have been added yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}