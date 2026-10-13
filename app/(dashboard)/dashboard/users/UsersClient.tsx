"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Search,
  Users,
  UserRound,
  ShieldCheck,
  UserCog,
  Pencil,
  X,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
} from "lucide-react";

import {
  updateUserImageAction,
  updateUserRoleAction,
  updateUserStatusAction,
} from "./usersActions";
import { UploadButton } from "@/app/utils/uploadthing";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "USER" | "MEMBER" | "CHAIRMAN";
  status: "ACTIVE" | "INACTIVE";
  designation: string | null;
  imageUrl: string | null;
  createdAt: Date | string;
};

type Props = {
  initialUsers: UserItem[];
};

type UploadedImageFile = {
  url: string;
  name: string;
};

type UploadErrorInfo = {
  message: string;
};

export default function UsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<UserItem | null>(null);
  const [role, setRole] = useState<"USER" | "MEMBER">("USER");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isPending, startTransition] = useTransition();

  const busy = isPending || uploadingImage;

  const stats = useMemo(
    () => ({
      total: users.length,
      members: users.filter((user) => user.role === "MEMBER").length,
      regular: users.filter((user) => user.role === "USER").length,
      active: users.filter((user) => user.status === "ACTIVE").length,
    }),
    [users],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.name, user.email, user.phone, user.designation ?? ""].some(
          (value) => value.toLowerCase().includes(query),
        );

      return (
        matchesSearch &&
        (roleFilter === "ALL" || user.role === roleFilter) &&
        (statusFilter === "ALL" || user.status === statusFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  function openEditor(user: UserItem) {
    setSelected(user);
    setRole(user.role === "MEMBER" ? "MEMBER" : "USER");
    setStatus(user.status);
    setMessage("");
    setError("");
  }

  function saveChanges() {
    if (!selected || busy) return;

    const editingUser = selected;

    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        if (editingUser.role === "USER" || editingUser.role === "MEMBER") {
          if (editingUser.role !== role) {
            const result = await updateUserRoleAction(editingUser.id, role);

            if (!result.success) {
              setError(result.message ?? "Unable to update role.");
              return;
            }
          }
        }

        if (editingUser.status !== status) {
          const result = await updateUserStatusAction(editingUser.id, status);

          if (!result.success) {
            setError(result.message ?? "Unable to update status.");
            return;
          }
        }

        setUsers((current) =>
          current.map((user) =>
            user.id === editingUser.id
              ? {
                  ...user,
                  role:
                    user.role === "USER" || user.role === "MEMBER"
                      ? role
                      : user.role,
                  status,
                }
              : user,
          ),
        );

        setSelected((current) =>
          current?.id === editingUser.id
            ? {
                ...current,
                role:
                  current.role === "USER" || current.role === "MEMBER"
                    ? role
                    : current.role,
                status,
              }
            : current,
        );

        setMessage("Changes saved successfully.");
        setSelected(null);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  function handleImageUpload(imageUrl: string, userId: string) {
    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        const result = await updateUserImageAction(userId, imageUrl);

        if (!result.success) {
          setError(result.message ?? "Unable to save profile image.");
          return;
        }

        setUsers((current) =>
          current.map((user) =>
            user.id === userId ? { ...user, imageUrl } : user,
          ),
        );

        setSelected((current) =>
          current?.id === userId ? { ...current, imageUrl } : current,
        );

        setMessage("Profile image updated successfully.");
      } catch {
        setError("Unable to save the profile image. Please try again.");
      }
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-3 text-slate-800 sm:p-5">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <header className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage user profiles, roles and account status.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3">
            <Users className="size-5 text-emerald-700" />
            <div>
              <p className="text-xs text-slate-500">Total users</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "All Users",
              value: stats.total,
              icon: Users,
              color: "bg-slate-100 text-slate-700",
            },
            {
              label: "Members",
              value: stats.members,
              icon: ShieldCheck,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Regular Users",
              value: stats.regular,
              icon: UserRound,
              color: "bg-sky-50 text-sky-700",
            },
            {
              label: "Active Accounts",
              value: stats.active,
              icon: CheckCircle2,
              color: "bg-green-50 text-green-700",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className={`rounded-lg p-2 ${item.color}`}>
                    <Icon className="size-4" />
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        {message && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <CheckCircle2 className="size-4 shrink-0" />
            {message}
          </p>
        )}

        {error && !selected && (
          <p className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or phone..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600"
              aria-label="Filter by role"
            >
              <option value="ALL">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="CHAIRMAN">Chairman</option>
              <option value="USER">User</option>
              <option value="MEMBER">Member</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-600"
              aria-label="Filter by status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-emerald-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt={`${user.name}'s profile`}
                            className="size-10 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-800">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.designation || "No designation"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p>{user.email}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {user.phone}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                          user.role === "MEMBER"
                            ? "bg-emerald-100 text-emerald-800"
                            : user.role === "ADMIN"
                              ? "bg-violet-100 text-violet-800"
                              : user.role === "CHAIRMAN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            user.status === "ACTIVE"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEditor(user)}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center text-slate-500"
                    >
                      <Users className="mx-auto mb-3 size-8 text-slate-300" />
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
            className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-center justify-between bg-emerald-950 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-white/10 p-2">
                  <UserCog className="size-5" />
                </span>
                <div>
                  <h2 id="edit-user-title" className="font-semibold">
                    Update User
                  </h2>
                  <p className="text-xs text-emerald-100">
                    Profile, role and account status
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                disabled={busy}
                aria-label="Close popup"
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </header>

            <div className="space-y-5 p-5">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {selected.imageUrl ? (
                  <img
                    src={selected.imageUrl}
                    alt={`${selected.name}'s profile`}
                    className="size-12 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-800">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {selected.name}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {selected.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Current role: {selected.role}
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2">
                  <ImagePlus className="size-4 text-emerald-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Profile Image
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Image only · Maximum 4 MB
                    </p>
                  </div>
                </div>

                <UploadButton
                  endpoint="imageUploader"
                  appearance={{
                    button:
                      "h-10 rounded-lg border-0 bg-green-400 px-4 text-sm font-semibold text-emerald-950 shadow-sm transition hover:bg-green-500 ut-ready:bg-green-400 ut-uploading:cursor-not-allowed ut-uploading:bg-green-300",
                    allowedContent: "text-xs text-slate-500",
                  }}
                  onUploadBegin={() => {
                    setUploadingImage(true);
                    setError("");
                    setMessage("");
                  }}
                  onClientUploadComplete={(files: UploadedImageFile[]) => {
                    setUploadingImage(false);

                    const imageUrl = files[0]?.url;

                    if (!imageUrl || !selected) {
                      setError("The uploaded image URL was not returned.");
                      return;
                    }

                    handleImageUpload(imageUrl, selected.id);
                  }}
                  onUploadError={(uploadError: UploadErrorInfo) => {
                    setUploadingImage(false);
                    setError(uploadError.message || "Image upload failed.");
                  }}
                />

                {uploadingImage && (
                  <p className="flex items-center gap-2 text-xs font-medium text-emerald-800">
                    <LoaderCircle className="size-3.5 animate-spin" />
                    Uploading image...
                  </p>
                )}

                <p className="text-xs leading-5 text-slate-500">
                  Your profile photo will be saved automatically after the
                  upload completes.
                </p>
              </div>

              <div>
                <label
                  htmlFor="user-role"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  User Role
                </label>

                {selected.role === "USER" || selected.role === "MEMBER" ? (
                  <select
                    id="user-role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as "USER" | "MEMBER")
                    }
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="USER">USER — Regular user</option>
                    <option value="MEMBER">MEMBER — Organization member</option>
                  </select>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    {selected.role} role is protected on this page.
                  </div>
                )}
              </div>

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
                    setStatus(event.target.value as "ACTIVE" | "INACTIVE")
                  }
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="ACTIVE">ACTIVE — Account enabled</option>
                  <option value="INACTIVE">INACTIVE — Account disabled</option>
                </select>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-slate-500" />
                Changing a user's status may prevent them from signing in.
              </div>

              {error && (
                <p className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  {error}
                </p>
              )}

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  disabled={busy}
                  className="h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveChanges}
                  disabled={busy}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
