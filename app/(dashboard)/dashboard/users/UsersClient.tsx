"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  Search,
  Users,
  ShieldCheck,
  UserRound,
  Crown,
  Pencil,
  X,
  Check,
  LoaderCircle,
  ImagePlus,
  RefreshCw,
} from "lucide-react";
import {
  updateUserImageAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from "./usersActions";
import { UploadButton } from "@/app/utils/uploadthing";

type UserRole = "ADMIN" | "USER" | "MEMBER" | "CHAIRMAN";
type UserStatus = "ACTIVE" | "INACTIVE";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  designation: string | null;
  imageUrl: string | null;
  createdAt: Date | string;
};

type UsersClientProps = {
  initialUsers: UserItem[];
};

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "CHAIRMAN", label: "Chairman" },
  { value: "MEMBER", label: "Member" },
  { value: "USER", label: "User" },
];

const roleStyles: Record<UserRole, string> = {
  ADMIN: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  CHAIRMAN: "bg-amber-50 text-amber-700 ring-amber-200",
  MEMBER: "bg-sky-50 text-sky-700 ring-sky-200",
  USER: "bg-slate-100 text-slate-600 ring-slate-200",
};

function formatDate(date: Date | string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U"
  );
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selected, setSelected] = useState<UserItem | null>(null);
  const [role, setRole] = useState<UserRole>("USER");
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        (user.designation ?? "").toLowerCase().includes(term);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "ADMIN").length,
      chairmen: users.filter((user) => user.role === "CHAIRMAN").length,
      active: users.filter((user) => user.status === "ACTIVE").length,
    }),
    [users],
  );

  function openEditor(user: UserItem) {
    setSelected(user);
    setRole(user.role);
    setStatus(user.status);
    setImageUrl(user.imageUrl ?? "");
    setMessage("");
    setError("");
  }

  function closeEditor() {
    if (isPending) return;

    setSelected(null);
    setMessage("");
    setError("");
  }

  function updateLocalUser(userId: string, updates: Partial<UserItem>) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    );

    setSelected((current) =>
      current?.id === userId ? { ...current, ...updates } : current,
    );
  }

  function saveChanges() {
    if (!selected || isPending) return;

    const selectedUser = selected;
    const nextRole = role;
    const nextStatus = status;
    const nextImageUrl = imageUrl.trim() || null;

    setMessage("");
    setError("");

    startTransition(async () => {
      try {
        if (nextRole !== selectedUser.role) {
          const result = await updateUserRoleAction(selectedUser.id, nextRole);

          if (!result?.success) {
            setError(result?.message || "Failed to update user role.");
            return;
          }

          updateLocalUser(selectedUser.id, {
            role: nextRole,
          });
        }

        if (nextStatus !== selectedUser.status) {
          const result = await updateUserStatusAction(
            selectedUser.id,
            nextStatus,
          );

          if (!result?.success) {
            setError(result?.message || "Failed to update user status.");
            return;
          }

          updateLocalUser(selectedUser.id, {
            status: nextStatus,
          });
        }

        if (nextImageUrl !== (selectedUser.imageUrl || null)) {
          const result = await updateUserImageAction(
            selectedUser.id,
            nextImageUrl,
          );

          if (!result?.success) {
            setError(result?.message || "Failed to update profile image.");
            return;
          }

          updateLocalUser(selectedUser.id, {
            imageUrl: nextImageUrl,
          });
        }

        setMessage("User updated successfully.");
      } catch (saveError) {
        console.error("saveChanges error:", saveError);
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function refreshUsers() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800">
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Users size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                User Management
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Manage accounts, roles, and access status.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refreshUsers}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-sky-300 hover:text-sky-700"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Total Users"
            value={stats.total}
            icon={<Users size={19} />}
            color="sky"
          />
          <StatCard
            label="Administrators"
            value={stats.admins}
            icon={<ShieldCheck size={19} />}
            color="indigo"
          />
          <StatCard
            label="Chairmen"
            value={stats.chairmen}
            icon={<Crown size={19} />}
            color="amber"
          />
          <StatCard
            label="Active Accounts"
            value={stats.active}
            icon={<UserRound size={19} />}
            color="emerald"
          />
        </div>

        {/* Search and filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_160px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone..."
                aria-label="Search users"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="ALL">All roles</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>
              Showing{" "}
              <strong className="font-semibold text-slate-700">
                {filteredUsers.length}
              </strong>{" "}
              of {users.length} users
            </span>

            {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="font-medium text-sky-700 hover:text-sky-900"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* User table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Registered Users
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {filteredUsers.length} records
            </span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search size={21} />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                No users found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-2012.5 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition hover:bg-sky-50/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={user.name}
                            imageUrl={user.imageUrl}
                          />

                          <div className="min-w-0">
                            <p className="max-w-55 truncate font-semibold text-slate-800">
                              {user.name}
                            </p>
                            {user.designation && (
                              <p className="mt-0.5 max-w-55 truncate text-xs text-slate-500">
                                {user.designation}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-slate-700">{user.email}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {user.phone}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${roleStyles[user.role]}`}
                        >
                          {user.role === "CHAIRMAN" && (
                            <Crown size={12} className="mr-1" />
                          )}
                          {roleOptions.find(
                            (option) => option.value === user.role,
                          )?.label ?? user.role}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {user.status === "ACTIVE" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEditor(user)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit user modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditor();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2
                  id="edit-user-title"
                  className="text-base font-bold text-slate-900"
                >
                  Edit User
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update role, status, or profile image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                aria-label="Close"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Profile */}
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={selected.name}
                  imageUrl={imageUrl.trim() || null}
                  size="large"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {selected.name}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {selected.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {selected.phone}
                  </p>
                </div>
              </div>

              {/* Profile image upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile Image
                </label>

                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ImagePlus size={16} />
                      Upload a new profile image
                    </div>

                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        const uploadedUrl = res?.[0]?.ufsUrl;

                        if (uploadedUrl) {
                          setImageUrl(uploadedUrl);
                          setMessage("");
                          setError("");
                        } else {
                          setError("Could not get the uploaded image URL.");
                        }
                      }}
                      onUploadError={(uploadError) => {
                        setError(uploadError.message);
                      }}
                      appearance={{
                        button:
                          "h-9 rounded-lg bg-sky-600 px-3 text-xs font-semibold text-white after:bg-sky-700",
                        allowedContent: "text-[10px] text-slate-500",
                      }}
                    />
                  </div>

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setMessage("");
                        setError("");
                      }}
                      className="mt-2 text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove profile image
                    </button>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  User Role
                </label>

                <select
                  id="user-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <p className="mt-1.5 text-xs text-slate-500">
                  Admins can promote existing users to Admin or Chairman.
                </p>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="user-status"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Account Status
                </label>

                <select
                  id="user-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as UserStatus)
                  }
                  disabled={isPending}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700"
                >
                  <Check size={16} />
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={saveChanges}
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserAvatar({
  name,
  imageUrl,
  size = "normal",
}: {
  name: string;
  imageUrl: string | null;
  size?: "normal" | "large";
}) {
  const dimensions =
    size === "large" ? "h-14 w-14 text-base" : "h-10 w-10 text-xs";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 font-bold text-sky-700 ${dimensions}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes={size === "large" ? "56px" : "40px"}
          className="object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: "sky" | "indigo" | "amber" | "emerald";
}) {
  const colors = {
    sky: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
