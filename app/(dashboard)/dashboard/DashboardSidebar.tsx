
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Newspaper,
  FileText,
  Inbox,
  UserCircle,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const navigation: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Account Management",
    items: [
      {
        label: "All Accounts",
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
    label: "Content Management",
    items: [
      {
        label: "News & Activities",
        href: "/dashboard/newactivity",
        icon: Newspaper,
      },
      {
        label: "Constitution / গঠনতন্ত্র",
        href: "/dashboard/constitution",
        icon: FileText,
      },
      {
        label: "Demand Management",
        href: "/dashboard/demand",
        icon: ClipboardList,
      },
      {
        label: "Inbox",
        href: "/dashboard/inbox",
        icon: Inbox,
      },
    ],
  },
  {
    label: "General",
    items: [
      {
        label: "My Account",
        href: "/dashboard/myaccount",
        icon: UserCircle,
      },
    ],
  },
];

type DashboardSidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};

export default function DashboardSidebar({
  collapsed = false,
  onCollapsedChange,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "Overview",
    "Account Management",
    "Content Management",
    "General",
  ]);

  const isPathActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleGroup = (label: string) => {
    setExpandedGroups((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  };

  const renderNavigation = (isMobile = false) => (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {navigation.map((group) => {
        const expanded = expandedGroups.includes(group.label);

        return (
          <div key={group.label}>
            {!collapsed || isMobile ? (
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="mb-2 flex w-full items-center justify-between px-3 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 transition hover:text-slate-600"
              >
                <span>{group.label}</span>
                {expanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            ) : null}

            {(expanded || collapsed) && (
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isPathActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed && !isMobile ? item.label : undefined}
                      onClick={() => {
                        if (isMobile) setMobileOpen(false);
                      }}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/10"
                          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={
                          active
                            ? "shrink-0 text-white"
                            : "shrink-0 text-slate-400 transition group-hover:text-emerald-600"
                        }
                      />

                      {!collapsed || isMobile ? (
                        <span className="truncate">{item.label}</span>
                      ) : null}

                      {active && (!collapsed || isMobile) ? (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside
        className={`hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 lg:sticky lg:top-0 lg:flex ${
          collapsed ? "w-[76px]" : "w-[260px]"
        }`}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-100 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          <Link
            href="/dashboard"
            title={collapsed ? "Dashboard" : undefined}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <LayoutDashboard size={19} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-slate-900">
                  Haor Rokkha Andolan
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  ADMINISTRATION
                </p>
              </div>
            )}
          </Link>

          {!collapsed && onCollapsedChange && (
            <button
              type="button"
              onClick={() => onCollapsedChange(true)}
              aria-label="Collapse sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronRight size={17} />
            </button>
          )}

          {collapsed && onCollapsedChange && (
            <button
              type="button"
              onClick={() => onCollapsedChange(false)}
              aria-label="Expand sidebar"
              className="absolute left-[60px] top-[76px] z-20 hidden h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-emerald-600 xl:flex"
            >
              <ChevronRight size={15} />
            </button>
          )}
        </div>

        {renderNavigation()}

        <div className="shrink-0 border-t border-slate-100 p-3">
          <div
            className={`flex items-center gap-3 rounded-lg bg-slate-50 p-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <UserCircle size={19} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">
                  Administration
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  Management Panel
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex min-w-0 items-center gap-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <LayoutDashboard size={19} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    Haor Rokkha Andolan
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    ADMINISTRATION
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={19} />
              </button>
            </div>

            {renderNavigation(true)}

            <div className="shrink-0 border-t border-slate-100 p-3">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <UserCircle size={19} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700">
                    Administration
                  </p>
                  <p className="truncate text-[10px] text-slate-400">
                    Management Panel
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
