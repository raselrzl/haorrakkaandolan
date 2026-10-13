"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from "../Navbar";
import {
  Grid2X2,
  List,
  Phone,
  Users,
  LoaderCircle,
  UserRound,
  RefreshCw,
} from "lucide-react";
import { getPublicTeamAction } from "./aboutActions";

type TeamPerson = Awaited<ReturnType<typeof getPublicTeamAction>>[number];

export default function AboutPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [people, setPeople] = useState<TeamPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTeam() {
      try {
        setLoading(true);
        setError("");

        const result = await getPublicTeamAction();

        if (!cancelled) {
          setPeople(result);
        }
      } catch (err) {
        console.error("Failed to load organization team:", err);

        if (!cancelled) {
          setError("Unable to load the organization team. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTeam();

    return () => {
      cancelled = true;
    };
  }, []);

  // A designation of "Chairperson" takes priority over the database role.
  const chairperson = people.find(
    (person) => person.designation?.trim().toLowerCase() === "chairperson",
  );

  // Fall back to the CHAIRMAN role when no designated Chairperson exists.
  const chairman = people.find((person) => person.role === "CHAIRMAN");

  const leadershipPerson = chairperson ?? chairman;

  const leadershipTitle = chairperson
    ? "Chairperson"
    : leadershipPerson
      ? "Chairman"
      : "Chairperson";

  // Do not show the selected leader a second time in the members list.
  const members = people.filter(
    (person) => person.role === "MEMBER" && person.id !== leadershipPerson?.id,
  );

  const getImage = (person: TeamPerson) =>
    person.imageUrl?.trim() || "/img/monu1.jpg";

  return (
    <main className="min-h-screen bg-[#f7f9f6]">
      <Navbar />

      {/* Hero */}
      <section className="relative isolate flex min-h-52 items-center justify-center overflow-hidden bg-emerald-950 sm:min-h-64 md:min-h-72 mt-16">
        <Image
          src="/monu1.jpg"
          alt="Haor Rokkha Andolan"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/65" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs sm:tracking-[0.28em]">
            Haor Rokkha Andolan · Moulvibazar
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            About Us
          </h1>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-emerald-400" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-7 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
        {/* About the Organization */}
        <section>
          <div className="mb-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-[10px] sm:tracking-[0.2em]">
              About the Organization
            </p>

            <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              Haor Rokkha Andolan
            </h2>
          </div>

          <div className="rounded-lg border border-emerald-900/10 bg-white p-4 sm:rounded-xl sm:p-7">
            <div className="space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
              <p>
                Haor Rokkha Andolan is an environmental and community-oriented
                initiative dedicated to protecting the haors, rivers, wetlands,
                and natural ecosystems of the region. The organization seeks to
                raise public awareness about environmental challenges and
                encourage collective action to preserve these valuable natural
                resources for present and future generations.
              </p>

              <p>
                The haor region supports a rich diversity of wildlife,
                fisheries, agriculture, and local livelihoods. Protecting these
                ecosystems is essential to maintaining environmental balance and
                safeguarding the well-being of the communities that depend on
                them.
              </p>

              <p>
                Through public awareness, community participation, environmental
                advocacy, and conservation initiatives, Haor Rokkha Andolan aims
                to bring people together to address environmental degradation
                and promote responsible stewardship of nature.
              </p>
            </div>

            {/* Mission and Vision */}
            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <h3 className="mb-2 font-bold text-emerald-950">Our Mission</h3>

                <p className="text-sm leading-6 text-slate-600">
                  To protect haor ecosystems, preserve biodiversity, raise
                  environmental awareness, and encourage communities to take
                  meaningful action for conservation.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-2 font-bold text-slate-900">Our Vision</h3>

                <p className="text-sm leading-6 text-slate-600">
                  A healthy and sustainable haor region where rivers flow,
                  biodiversity thrives, and local communities can live in
                  harmony with nature.
                </p>
              </div>
            </div>

            {/* Objectives */}
            <div className="mt-3 rounded-lg border border-slate-100 p-4 sm:mt-4">
              <h3 className="mb-3 font-bold text-emerald-950">
                Our Objectives
              </h3>

              <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                <li>Protect haors, rivers, wetlands, and biodiversity.</li>
                <li>
                  Raise awareness about pollution and environmental degradation.
                </li>
                <li>Encourage community participation in conservation.</li>
                <li>Promote sustainable use of natural resources.</li>
                <li>
                  Support collective efforts to safeguard the region&apos;s
                  environment.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chairperson / Chairman Profile */}
        <section>
          <div className="mb-4">
            <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-[10px] sm:tracking-[0.2em]">
              Leadership
            </p>

            <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
              {leadershipTitle}&apos;s Profile
            </h2>
          </div>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading leadership profile...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-white p-5 text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center gap-1 font-semibold text-emerald-800"
              >
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          ) : leadershipPerson ? (
            <article className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white sm:rounded-xl">
              <div className="grid sm:grid-cols-[220px_minmax(0,1fr)] md:grid-cols-[280px_minmax(0,1fr)]">
                <div className="relative mx-auto mt-5 h-36 w-36 overflow-hidden rounded-full border-4 border-emerald-100 bg-slate-100 sm:mx-0 sm:my-0 sm:h-full sm:min-h-64 sm:w-full sm:rounded-none sm:border-0">
                  <Image
                    src={getImage(leadershipPerson)}
                    alt={leadershipPerson.name}
                    fill
                    sizes="(max-width: 640px) 144px, 280px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 p-4 sm:p-6 md:p-8">
                  <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                    {leadershipPerson.designation?.trim() || leadershipTitle}
                  </span>

                  <h3 className="mt-3 break-words text-xl font-bold text-slate-950 sm:text-2xl md:text-3xl">
                    {leadershipPerson.name}
                  </h3>

                  {leadershipPerson.designation?.trim() && (
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {leadershipPerson.designation}
                    </p>
                  )}

                  {leadershipPerson.phone && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                      <Phone size={15} className="shrink-0 text-emerald-700" />

                      <a
                        href={`tel:${leadershipPerson.phone}`}
                        className="break-all transition hover:text-emerald-800"
                      >
                        {leadershipPerson.phone}
                      </a>
                    </p>
                  )}

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="mb-2 text-sm font-bold text-emerald-950">
                      Organization Leadership
                    </h4>

                    <p className="text-sm leading-6 text-slate-600">
                      {leadershipPerson.name} serves as{" "}
                      {leadershipPerson.designation?.trim() || leadershipTitle}{" "}
                      of Haor Rokkha Andolan. The profile information displayed
                      here comes from the organization&apos;s published member
                      record.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <UserRound
                size={30}
                className="mx-auto mb-3 text-emerald-800"
                strokeWidth={1.5}
              />

              <h3 className="font-bold text-slate-800">
                Chairperson profile not published
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                The Chairperson&apos;s profile will appear here when an active
                person with the appropriate designation or chairman role is
                published.
              </p>
            </div>
          )}
        </section>

        {/* Members */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div className="min-w-0">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 sm:text-[10px] sm:tracking-[0.2em]">
                Our Team
              </p>

              <h2 className="text-xl font-bold tracking-tight text-emerald-950 sm:text-3xl">
                Our Members
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">
                Meet the people working together to protect our haors.
              </p>
            </div>

            {/* Grid / List Toggle */}
            <div className="inline-flex shrink-0 rounded-md border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-2 text-xs font-semibold transition sm:px-3 ${
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
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-2 text-xs font-semibold transition sm:px-3 ${
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
            <div className="flex min-h-32 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading members...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-white p-4 text-sm text-red-700"
            >
              Team information could not be loaded.
            </div>
          ) : members.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
                  : "flex flex-col gap-2.5"
              }
            >
              {members.map((member) => (
                <article
                  key={member.id}
                  className={
                    view === "grid"
                      ? "flex min-w-0 flex-col items-center rounded-lg border border-slate-200/80 bg-white p-3 text-center transition hover:border-emerald-700/30 hover:shadow-md sm:p-5"
                      : "flex min-w-0 items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 transition hover:border-emerald-700/30 hover:shadow-sm sm:gap-5 sm:p-4"
                  }
                >
                  <div
                    className={`relative shrink-0 overflow-hidden rounded-full border-2 border-emerald-100 bg-slate-100 ${
                      view === "grid"
                        ? "h-20 w-20 sm:h-28 sm:w-28"
                        : "h-14 w-14 sm:h-20 sm:w-20"
                    }`}
                  >
                    <Image
                      src={getImage(member)}
                      alt={member.name}
                      fill
                      sizes={
                        view === "grid"
                          ? "(max-width: 640px) 80px, 112px"
                          : "80px"
                      }
                      className="object-cover"
                    />
                  </div>

                  <div
                    className={`min-w-0 ${
                      view === "grid" ? "mt-3 w-full" : "flex-1"
                    }`}
                  >
                    <h3 className="break-words text-sm font-bold text-slate-900 sm:text-base">
                      {member.name}
                    </h3>

                    {member.designation?.trim() && (
                      <p className="mt-1 break-words text-[10px] font-semibold leading-4 text-emerald-800 sm:text-xs">
                        {member.designation}
                      </p>
                    )}

                    {member.phone && (
                      <p
                        className={`mt-2 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs ${
                          view === "grid" ? "justify-center" : ""
                        }`}
                      >
                        <Phone
                          size={12}
                          className="shrink-0 text-emerald-700"
                        />

                        <a
                          href={`tel:${member.phone}`}
                          className="min-w-0 break-all hover:text-emerald-800"
                        >
                          {member.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
              <Users
                size={30}
                className="mx-auto mb-3 text-emerald-800"
                strokeWidth={1.5}
              />

              <h3 className="text-sm font-bold text-slate-800">
                No members published yet
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Active members will appear here when they are added to the
                organization.
              </p>
            </div>
          )}

          {!loading && !error && (
            <p className="mt-3 text-right text-[10px] text-slate-500 sm:text-xs">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
