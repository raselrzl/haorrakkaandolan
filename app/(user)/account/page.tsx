
import { Suspense } from "react";
import { logoutAction } from "@/app/(login)/login/loginActions";
import { getCurrentUser } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  HeartHandshake,
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  Fingerprint,
  LogOut,
  Leaf,
} from "lucide-react";

function AccountLoading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="h-72 rounded-2xl bg-slate-200" />
          <div className="h-72 rounded-2xl bg-white" />
        </div>
      </div>
    </main>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard");
  }

  const isPending = user.role === "USER";
  const isMember = user.role === "MEMBER";
  const isChairman = user.role === "CHAIRMAN";

  const roleLabel = user.role.replaceAll("_", " ");

  const heading = isPending
    ? "Thank You for Registering"
    : isMember
      ? "Welcome, Member!"
      : isChairman
        ? "Welcome, Chairman!"
        : "Welcome to Haor Rokkha Andolan";

  const message = isPending
    ? "Thank you for joining our community. Your account is ready, and your membership application is awaiting approval."
    : isMember
      ? "Thank you for becoming a member. Together, we can help protect our rivers, haors, wetlands, and communities."
      : isChairman
        ? "Welcome to your organisation account. Thank you for your leadership and commitment."
        : "Thank you for supporting the protection of our rivers, haors, and wetlands.";

  const cardTitle = isPending
    ? "MEMBERSHIP APPLICANT"
    : isMember
      ? "MEMBER ID CARD"
      : isChairman
        ? "CHAIRMAN ID CARD"
        : "DIGITAL PROFILE CARD";

  const statusLabel = isPending
    ? "Awaiting Approval"
    : "Account Active";

  const userId = user.id
    ? user.id.slice(-8).toUpperCase()
    : "NOT AVAILABLE";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mb-7">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-emerald-800">
            <Leaf size={16} />
            HAOR ROKKHA ANDOLAN
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {heading}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            {message}
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Digital ID card */}
          <section
            className="overflow-hidden rounded-2xl border border-emerald-950/10 bg-white shadow-sm"
            aria-label="Digital identification card"
          >
            <div className="relative overflow-hidden bg-emerald-950 px-5 py-6 text-white sm:px-7">
              <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-8 h-32 w-32 rounded-full border border-white/10" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                  <Leaf size={26} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-wide">
                    HAOR ROKKHA ANDOLAN
                  </p>
                  <p className="mt-1 text-xs text-emerald-100">
                    Protecting Rivers, Haors & Wetlands
                  </p>
                </div>
              </div>

              <div className="relative mt-6 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-200">
                    DIGITAL IDENTIFICATION
                  </p>
                  <h2 className="mt-1 text-sm font-bold sm:text-base">
                    {cardTitle}
                  </h2>
                </div>

                <div
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                    isPending
                      ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                      : "border-emerald-300/40 bg-emerald-300/10 text-emerald-100"
                  }`}
                >
                  {isPending ? "PENDING" : "ACTIVE"}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Profile picture */}
                <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-36 sm:w-30">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={`${user.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                      <UserRound size={42} strokeWidth={1.3} />
                      <span className="text-[10px] font-medium">
                        No photo
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-[10px] font-semibold tracking-[0.16em] text-slate-500">
                    FULL NAME
                  </p>

                  <h3 className="mt-1 break-words text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                    {user.name}
                  </h3>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    ROLE
                  </p>
                  <p className="mt-1 inline-flex max-w-full rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    {roleLabel}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Fingerprint size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-500">
                      ACCOUNT ID
                    </p>
                    <p className="mt-1 break-all font-mono text-xs font-bold text-slate-900">
                      {userId}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <ShieldCheck size={17} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-wide text-slate-500">
                      ACCOUNT STATUS
                    </p>
                    <p
                      className={`mt-1 text-xs font-bold ${
                        isPending ? "text-amber-700" : "text-emerald-800"
                      }`}
                    >
                      {statusLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-dashed border-slate-200 pt-4">
                <p className="text-center text-[10px] leading-5 text-slate-500">
                  {isPending
                    ? "APPLICATION CARD · NOT VALID AS PROOF OF MEMBERSHIP"
                    : "DIGITAL PROFILE CARD · VERIFY STATUS WITH THE ORGANISATION"}
                </p>
              </div>
            </div>
          </section>

          {/* Account details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Account details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Your registered information
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <UserRound size={20} />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                  <UserRound size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Full name</p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                  <Mail size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Email address</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                  <Phone size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Phone number</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
                  <ShieldCheck size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Current role</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>

            {isPending && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                  <div>
                    <p className="text-sm font-bold text-amber-950">
                      Membership awaiting approval
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-900/80">
                      Your registration is complete. Please wait while an
                      authorised administrator reviews your membership
                      application.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isMember && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <HeartHandshake
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-800"
                  />
                  <div>
                    <p className="text-sm font-bold text-emerald-950">
                      Thank you for being a member
                    </p>
                    <p className="mt-1 text-xs leading-5 text-emerald-900/80">
                      Your participation helps support our mission to protect
                      haors, rivers, and wetlands.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form action={logoutAction} className="mt-7 border-t border-slate-100 pt-5">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </form>
          </section>
        </div>

        <footer className="mt-7 text-center">
          <p className="text-xs leading-6 text-slate-500">
            Haor Rokkha Andolan · Protecting our natural heritage together.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}
