
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Settings,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  PanelLeftClose,
  FileText,
} from "lucide-react";

const navigation = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Account management",
    items: [
      {
        label: "All accounts",
        href: "/dashboard/users",
        icon: Users,
      },
      {
        label: "Members",
        href: "/dashboard/members",
        icon: UserRound,
      },
    ],
  },
  {
    title: "Content management",
    items: [
      {
        label: "News & Activities",
        href: "/dashboard/newactivity",
        icon: FileText,
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "My account",
        href: "/account",
        icon: Settings,
      },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard" || href === "/account") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function renderNavigation() {
    return (
      <nav
        className="space-y-6 p-3"
        aria-label="Administrator navigation"
      >
        {navigation.map((group) => (
          <section key={group.title}>
            <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              {group.title}
            </h2>

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                        : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.3 : 1.8}
                      className={
                        active
                          ? "shrink-0 text-emerald-700"
                          : "shrink-0 text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    <span className="min-w-0 flex-1">
                      {item.label}
                    </span>

                    {active && (
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-emerald-700"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    );
  }

  function renderFooter() {
    return (
      <div className="mt-auto border-t border-slate-200 p-3">
        <a
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ExternalLink size={17} />
          <span>Visit public website</span>
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex lg:w-64">
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <PanelLeftClose size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                Admin Panel
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Navigation menu
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderNavigation()}
        </div>

        {renderFooter()}
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={
          mobileOpen ? "Close navigation" : "Open navigation"
        }
        aria-expanded={mobileOpen}
        aria-controls="mobile-dashboard-sidebar"
        className="fixed bottom-5 right-5 z-60 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-white shadow-lg transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 md:hidden"
      >
        {mobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-slate-950/40"
          />

          <aside
            id="mobile-dashboard-sidebar"
            className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
                  <PanelLeftClose size={19} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    Haor Rokkha Andolan
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Administration
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderNavigation()}
            </div>

            {renderFooter()}
          </aside>
        </div>
      )}
    </>
  );
}
