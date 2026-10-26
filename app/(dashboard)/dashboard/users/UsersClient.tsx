
"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import {
  Search,
  Users,
  ShieldCheck,
  UserRound,
  Pencil,
  X,
  Check,
  LoaderCircle,
  ImagePlus,
  RefreshCw,
} from "lucide-react";
import { UploadButton } from "@/app/utils/uploadthing";

import {
  updateUserImageAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from "./usersActions";

type UserRole = "ADMIN" | "USER";
type UserStatus = "ACTIVE" | "INACTIVE";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string | null;
  imageUrl: string | null;
  status: UserStatus;
  createdAt: string;
};

type UsersClientProps = {
  initialUsers: UserItem[];
};

type RoleFilter = "ALL" | UserRole;
type StatusFilter = "ALL" | UserStatus;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

const roleStyles: Record<UserRole, string> = {
  ADMIN: "border-indigo-200 bg-indigo-50 text-indigo-700",
  USER: "border-sky-200 bg-sky-50 text-sky-700",
};

const statusStyles: Record<UserStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  INACTIVE: "border-slate-200 bg-slate-100 text-slate-600",
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="group flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} transition-transform duration-200 group-hover:scale-105`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">
          {title}
        </p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function UsersClient({
  initialUsers,
}: UsersClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("ACTIVE");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "ADMIN").length,
      regularUsers: users.filter((user) => user.role === "USER").length,
      active: users.filter((user) => user.status === "ACTIVE").length,
    }),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function openEditor(user: UserItem) {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setSelectedStatus(user.status);
    setSelectedImage(user.imageUrl);
    setNotice(null);
  }

  function closeEditor() {
    if (isPending) return;

    setSelectedUser(null);
    setSelectedImage(null);
    setNotice(null);
  }

  function showNotice(
    type: "success" | "error",
    message: string,
  ) {
    setNotice({ type, message });
  }

  function saveChanges() {
    if (!selectedUser) return;

    const userId = selectedUser.id;
    const changesRole = selectedRole !== selectedUser.role;
    const changesStatus = selectedStatus !== selectedUser.status;
    const changesImage = selectedImage !== selectedUser.imageUrl;

    if (!changesRole && !changesStatus && !changesImage) {
      showNotice("error", "There are no changes to save.");
      return;
    }

    startTransition(async () => {
      try {
        if (changesRole) {
          const result = await updateUserRoleAction(
            userId,
            selectedRole,
          );

          if (!result.success) {
            showNotice("error", result.message);
            return;
          }
        }

        if (changesStatus) {
          const result = await updateUserStatusAction(
            userId,
            selectedStatus,
          );

          if (!result.success) {
            showNotice("error", result.message);
            return;
          }
        }

        if (changesImage) {
          const result = await updateUserImageAction(
            userId,
            selectedImage,
          );

          if (!result.success) {
            showNotice("error", result.message);
            return;
          }
        }

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  role: selectedRole,
                  status: selectedStatus,
                  imageUrl: selectedImage,
                }
              : user,
          ),
        );

        setSelectedUser((current) =>
          current
            ? {
                ...current,
                role: selectedRole,
                status: selectedStatus,
                imageUrl: selectedImage,
              }
            : null,
        );

        showNotice("success", "User details updated successfully.");
      } catch (error) {
        console.error("Failed to update user:", error);
        showNotice("error", "Something went wrong while saving changes.");
      }
    });
  }

  function removeProfileImage() {
    setSelectedImage(null);
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Users size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage administrator and regular user accounts.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-xs font-semibold text-sky-800">
          <ShieldCheck size={15} />
          Admin &amp; User accounts only
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={<Users size={20} />}
          color="bg-sky-100 text-sky-700"
        />

        <StatCard
          title="Administrators"
          value={stats.admins}
          icon={<ShieldCheck size={20} />}
          color="bg-indigo-100 text-indigo-700"
        />

        <StatCard
          title="Regular Users"
          value={stats.regularUsers}
          icon={<UserRound size={20} />}
          color="bg-amber-100 text-amber-700"
        />

        <StatCard
          title="Active Accounts"
          value={stats.active}
          icon={<Check size={20} />}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, phone or ID..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as RoleFilter)
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            aria-label="Filter by role"
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="h-11 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            aria-label="Filter by status"
          >
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong className="text-slate-800">
              {filteredUsers.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-800">{users.length}</strong>{" "}
            accounts
          </span>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-sky-700 transition hover:bg-sky-50 hover:text-sky-900"
          >
            <RefreshCw size={13} />
            Reset filters
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3.5">
                  User
                </th>
                <th className="border-b border-slate-200 px-4 py-3.5">
                  Contact
                </th>
                <th className="border-b border-slate-200 px-4 py-3.5">
                  Role
                </th>
                <th className="border-b border-slate-200 px-4 py-3.5">
                  Status
                </th>
                <th className="border-b border-slate-200 px-4 py-3.5">
                  Created
                </th>
                <th className="border-b border-slate-200 px-4 py-3.5 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-sky-50/50"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-xs font-bold text-sky-800 ring-2 ring-white">
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="mt-0.5 max-w-52 truncate font-mono text-[10px] text-slate-400">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="max-w-56 truncate text-xs text-slate-700">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {user.phone || "No phone"}
                    </p>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${roleStyles[user.role]}`}
                    >
                      {user.role === "ADMIN" ? "Admin" : "User"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[user.status]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {user.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => openEditor(user)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800"
                    >
                      <Pencil size={13} />
                      Manage
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search size={20} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      No matching users found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your search or filter options.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditor();
            }
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-slate-950/20">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Manage User
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Update account role, status and profile image.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 disabled:opacity-50"
                aria-label="Close editor"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Selected user details */}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sm font-bold text-sky-800 ring-2 ring-white">
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt={selectedUser.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    getInitials(selectedUser.name)
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {selectedUser.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {selectedUser.email}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">
                    {selectedUser.id}
                  </p>
                </div>
              </div>

              {/* Profile image */}
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
                  Profile Image
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const uploadedImage = res?.[0]?.url;

                      if (!uploadedImage) {
                        showNotice(
                          "error",
                          "Upload completed, but no image URL was returned.",
                        );
                        return;
                      }

                      setSelectedImage(uploadedImage);
                      showNotice(
                        "success",
                        "Image uploaded. Save changes to apply it.",
                      );
                    }}
                    onUploadError={(error: Error) => {
                      showNotice("error", error.message);
                    }}
                    appearance={{
                      button:
                        "ut-ready:bg-sky-700 ut-ready:text-white ut-ready:hover:bg-sky-800 ut-uploading:cursor-not-allowed rounded-xl bg-sky-700 px-4 py-2.5 text-xs font-semibold",
                      allowedContent: "text-[10px] text-slate-500",
                    }}
                    content={{
                      button: (
                        <span className="inline-flex items-center gap-1.5">
                          <ImagePlus size={14} />
                          Upload Image
                        </span>
                      ),
                    }}
                  />

                  {selectedImage && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      disabled={isPending}
                      className="rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[11px] leading-5 text-slate-500">
                  Upload an image or remove the current profile image.
                  Uploading alone does not save the account changes.
                </p>
              </section>

              {/* Role */}
              <section>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Account Role
                </label>

                <select
                  id="user-role"
                  value={selectedRole}
                  onChange={(event) =>
                    setSelectedRole(event.target.value as UserRole)
                  }
                  disabled={isPending}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <p className="mt-1.5 text-[11px] text-slate-500">
                  Choose whether this account is an administrator or a
                  regular user.
                </p>
              </section>

              {/* Status */}
              <section>
                <label
                  htmlFor="user-status"
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-700"
                >
                  Account Status
                </label>

                <select
                  id="user-status"
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as UserStatus)
                  }
                  disabled={isPending}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </section>

              {/* Feedback */}
              {notice && (
                <div
                  role="status"
                  className={`flex items-start gap-2 rounded-xl border p-3.5 text-xs ${
                    notice.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  {notice.type === "success" ? (
                    <Check size={15} className="mt-0.5 shrink-0" />
                  ) : (
                    <X size={15} className="mt-0.5 shrink-0" />
                  )}
                  <span>{notice.message}</span>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isPending}
                className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={saveChanges}
                disabled={isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-sky-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={15} />
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
