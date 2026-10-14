"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type SVGProps } from "react";

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
  Inbox,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
};

type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

const navigation: NavigationGroup[] = [
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
      {
        label: "Inbox",
        href: "/dashboard/inbox",
        icon: Inbox,
      },
    ],
  },
  {
    title: "General",
    items: [
      {
        label: "My Account",
        href: "/dashboard/myaccount",
        icon: Settings,
      },
    ],
  },
];

function isPathActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  // Do not render a pathname-dependent active state until hydration finishes.
  const activePathname = mounted ? pathname : "";

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function renderNavigation(isMobile = false) {
    return (
      <nav aria-label="Dashboard navigation" className="space-y-6">
        {navigation.map((group) => (
          <section key={group.title}>
            {!collapsed || isMobile ? (
              <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {group.title}
              </h2>
            ) : (
              <div className="mx-auto mb-3 h-px w-8 bg-slate-200" />
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isPathActive(activePathname, item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isMobile ? closeMobileMenu : undefined}
                    aria-current={active ? "page" : undefined}
                    title={collapsed && !isMobile ? item.label : undefined}
                    className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-emerald-100 bg-emerald-50 text-emerald-900"
                        : "border-transparent text-slate-600 hover:border-slate-100 hover:bg-slate-50 hover:text-slate-900"
                    } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.3 : 1.8}
                      className={`shrink-0 transition-colors ${
                        active
                          ? "text-emerald-700"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />

                    {!collapsed || isMobile ? (
                      <>
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>

                        {active && (
                          <ChevronRight
                            size={15}
                            strokeWidth={2}
                            className="shrink-0 text-emerald-700"
                          />
                        )}
                      </>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    );
  }

  function renderFooter(isMobile = false) {
    return (
      <div className="border-t border-slate-100 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          onClick={isMobile ? closeMobileMenu : undefined}
          title={collapsed && !isMobile ? "Visit public website" : undefined}
          className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-emerald-800 ${
            collapsed && !isMobile ? "justify-center px-2" : ""
          }`}
        >
          <ExternalLink
            size={17}
            className="shrink-0 text-slate-400 transition group-hover:text-emerald-700"
          />

          {!collapsed || isMobile ? (
            <>
              <span className="flex-1">Visit public website</span>
              <ExternalLink size={13} className="text-slate-300" />
            </>
          ) : null}
        </a>

        {!collapsed || isMobile ? (
          <div className="px-3 pt-4">
            <p className="text-[10px] font-medium tracking-wide text-slate-400">
              HAOR ROKKHA ANDOLAN
            </p>
            <p className="mt-1 text-[10px] text-slate-400">Management Portal</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label={
          mobileOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
        className="fixed left-4 top-4 z-[70] flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        aria-label="Mobile dashboard sidebar"
        className={`fixed inset-y-0 left-0 z-[65] flex w-[280px] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <Link href="/dashboard" onClick={closeMobileMenu} className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight text-slate-900">
              Haor Rokkha Andolan
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Management Portal
            </span>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation(true)}
        </div>

        <div className="shrink-0 px-3 pb-4">{renderFooter(true)}</div>
      </aside>

      {/* Desktop sidebar */}
      <aside
        aria-label="Dashboard sidebar"
        className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <div
          className={`flex h-[72px] shrink-0 items-center border-b border-slate-100 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          <Link
            href="/dashboard"
            title={collapsed ? "Haor Rokkha Andolan" : undefined}
            className="min-w-0"
          >
            {!collapsed ? (
              <>
                <span className="block truncate text-base font-bold tracking-tight text-slate-900">
                  Haor Rokkha Andolan
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Management Portal
                </span>
              </>
            ) : (
              <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-800 text-sm font-bold text-white">
                H
              </span>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center border-b border-slate-100 py-2">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <PanelLeftClose size={17} className="rotate-180" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation()}
        </div>

        <div className="shrink-0 px-3 pb-4">{renderFooter()}</div>
      </aside>
    </>
  );
}
