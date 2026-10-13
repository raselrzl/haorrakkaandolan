
"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { UploadButton } from "@/app/utils/uploadthing";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  Users,
  UserCheck,
  UserX,
  CalendarDays,
  CalendarRange,
  X,
  ImagePlus,
  Filter,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  ExternalLink,
} from "lucide-react";

import {
  createMemberAction,
  updateMemberAction,
  toggleMemberStatusAction,
  deleteMemberAction,
} from "./memberActions";

type MemberStatus = "ACTIVE" | "INACTIVE";

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string | null;
  imageUrl: string | null;
  status: MemberStatus;
  startDate: Date | string | null;
  endDate: Date | string | null;
  createdAt: Date | string;
};

type Props = {
  initialMembers: Member[];
};

type MemberForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  designation: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
};

const designations = [
  "Chairperson",
  "Vice Chairperson",
  "General Secretary",
  "Joint Secretary",
  "Organizing Secretary",
  "Treasurer",
  "Executive Member",
  "General Member",
];

const emptyForm: MemberForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  designation: "General Member",
  imageUrl: "",
  startDate: "",
  endDate: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function formatDate(value: Date | string | null): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function dateInputValue(value: Date | string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export default function MembersPageClient({ initialMembers }: Props) {
  const [members, setMembers] = useState<Member[]>(
    Array.isArray(initialMembers) ? initialMembers : []
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [designationFilter, setDesignationFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [form, setForm] = useState<MemberForm>({ ...emptyForm });
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const activeCount = members.filter(
    (member) => member.status === "ACTIVE"
  ).length;

  const inactiveCount = members.filter(
    (member) => member.status === "INACTIVE"
  ).length;

  const designationCount = new Set(
    members.map((member) => member.designation || "General Member")
  ).size;

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.phone.toLowerCase().includes(term) ||
        (member.designation ?? "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "ALL" || member.status === statusFilter;

      const matchesDesignation =
        designationFilter === "ALL" ||
        (member.designation || "General Member") === designationFilter;

      return matchesSearch && matchesStatus && matchesDesignation;
    });
  }, [members, search, statusFilter, designationFilter]);

  function updateField<K extends keyof MemberForm>(
    key: K,
    value: MemberForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreate() {
    setSelectedMember(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEdit(member: Member) {
    setSelectedMember(member);

    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      password: "",
      designation: member.designation || "General Member",
      imageUrl: member.imageUrl || "",
      startDate: dateInputValue(member.startDate),
      endDate: dateInputValue(member.endDate),
    });

    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function closeModal() {
    if (busy || uploadingImage) return;

    setModalOpen(false);
    setSelectedMember(null);
    setForm({ ...emptyForm });
    setError("");
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (uploadingImage) {
      setError("Please wait until the image upload finishes.");
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setError("End date cannot be earlier than the start date.");
      return;
    }

    if (!selectedMember && form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setBusy(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        designation: form.designation,
        imageUrl: form.imageUrl.trim() || null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
      };

      if (selectedMember) {
        const result = await updateMemberAction({
          id: selectedMember.id,
          ...payload,
        });

        if (!result.success || !result.member) {
          setError(result.message || "Unable to update member.");
          return;
        }

        setMembers((current) =>
          current.map((member) =>
            member.id === selectedMember.id
              ? (result.member as Member)
              : member
          )
        );

        setNotice("Member updated successfully.");
      } else {
        const result = await createMemberAction({
          ...payload,
          password: form.password,
          role: "MEMBER",
        });

        if (!result.success || !result.member) {
          setError(result.message || "Unable to create member.");
          return;
        }

        setMembers((current) => [result.member as Member, ...current]);
        setNotice("Member created successfully.");
      }

      setModalOpen(false);
      setSelectedMember(null);
      setForm({ ...emptyForm });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function changeStatus(member: Member) {
    const nextStatus: MemberStatus =
      member.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      `${nextStatus === "ACTIVE" ? "Activate" : "Deactivate"} ${member.name}?`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const result = await toggleMemberStatusAction({
        id: member.id,
        status: nextStatus,
      });

      if (!result.success) {
        setError(result.message || "Unable to change member status.");
        return;
      }

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id ? { ...item, status: nextStatus } : item
        )
      );

      setViewMember((current) =>
        current?.id === member.id
          ? { ...current, status: nextStatus }
          : current
      );

      setNotice(
        nextStatus === "ACTIVE"
          ? `${member.name} has been activated.`
          : `${member.name} has been deactivated.`
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(member: Member) {
    const confirmed = window.confirm(
      `Permanently delete ${member.name}?\n\nMembers who have authored news or activities may not be deletable. Deactivate them instead to preserve their records.`
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const result = await deleteMemberAction({ id: member.id });

      if (!result.success) {
        setError(result.message || "Unable to delete member.");
        return;
      }

      setMembers((current) =>
        current.filter((item) => item.id !== member.id)
      );

      setViewMember((current) =>
        current?.id === member.id ? null : current
      );

      setNotice("Member deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setDesignationFilter("ALL");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-[1600px] space-y-5 p-4 sm:p-6">
        <header className="overflow-hidden rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10">
                <Users size={24} />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  Haor Rokkha Andolan
                </p>
                <h1 className="mt-1 text-xl font-bold sm:text-2xl">
                  Member Management
                </h1>
                <p className="mt-1 text-xs text-emerald-100/80 sm:text-sm">
                  Membership, designations and status management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300"
            >
              <Plus size={17} />
              Add member
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="rounded p-1 hover:bg-emerald-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && !modalOpen && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total members"
            value={members.length}
            icon={<Users size={20} />}
            tone="emerald"
          />
          <StatCard
            title="Active members"
            value={activeCount}
            icon={<UserCheck size={20} />}
            tone="green"
          />
          <StatCard
            title="Inactive members"
            value={inactiveCount}
            icon={<UserX size={20} />}
            tone="slate"
          />
          <StatCard
            title="Designations represented"
            value={designationCount}
            icon={<ShieldCheck size={20} />}
            tone="amber"
          />
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, phone or designation..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 xl:flex">
                <div className="relative">
                  <Filter
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-7 text-sm outline-none focus:border-emerald-600 sm:w-40"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <select
                  value={designationFilter}
                  onChange={(event) =>
                    setDesignationFilter(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 sm:w-52"
                >
                  <option value="ALL">All designations</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <RefreshCw size={14} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredMembers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {members.length}
              </span>{" "}
              members
            </p>
            <p className="text-xs text-slate-400">
              Only accounts with MEMBER role
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Designation</th>
                  <th className="px-4 py-3 font-semibold">
                    Membership period
                  </th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="transition hover:bg-emerald-50/40"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <MemberAvatar member={member} />
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-semibold text-slate-900">
                            {member.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Joined {formatDate(member.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone size={13} className="shrink-0 text-slate-400" />
                        {member.phone}
                      </div>
                      <div className="mt-1 flex max-w-[230px] items-center gap-2">
                        <Mail size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate text-xs text-slate-500">
                          {member.email}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex max-w-[180px] rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {member.designation || "General Member"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CalendarDays
                          size={13}
                          className="shrink-0 text-slate-400"
                        />
                        {formatDate(member.startDate)}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarRange size={13} className="shrink-0" />
                        To {formatDate(member.endDate)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={member.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <ActionButton
                          title="View member"
                          onClick={() => setViewMember(member)}
                        >
                          <Eye size={15} />
                        </ActionButton>
                        <ActionButton
                          title="Edit member"
                          onClick={() => openEdit(member)}
                        >
                          <Pencil size={15} />
                        </ActionButton>
                        <ActionButton
                          title={
                            member.status === "ACTIVE"
                              ? "Deactivate member"
                              : "Activate member"
                          }
                          onClick={() => void changeStatus(member)}
                          disabled={busy}
                        >
                          <Power size={15} />
                        </ActionButton>
                        <ActionButton
                          title="Delete member"
                          danger
                          onClick={() => void removeMember(member)}
                          disabled={busy}
                        >
                          <Trash2 size={15} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                        <Users size={24} />
                      </div>
                      <p className="mt-3 font-semibold text-slate-700">
                        No members found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Change your filters or add a new member.
                      </p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-sm font-semibold text-emerald-800 hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm">
            <section className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedMember ? "Edit member" : "Add new member"}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Member profile and membership details
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={busy || uploadingImage}
                  aria-label="Close modal"
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={19} />
                </button>
              </div>

              <form onSubmit={saveMember} className="space-y-5 p-5">
                {/* Profile image upload and live preview */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <MemberImagePreview
                        imageUrl={form.imageUrl}
                        name={form.name}
                      />
                      <span className="text-[11px] font-medium text-slate-500">
                        Live preview
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Profile photograph
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Upload a member photo. The preview updates after the
                          upload completes.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <UploadButton
                          endpoint="imageUploader"
                          onUploadBegin={() => {
                            setUploadingImage(true);
                            setError("");
                            setNotice("");
                          }}
                          onClientUploadComplete={(files) => {
                            setUploadingImage(false);

                            const uploadedUrl = files[0]?.url;

                            if (uploadedUrl) {
                              updateField("imageUrl", uploadedUrl);
                              setError("");
                              setNotice(
                                "Image uploaded. Save the member form to keep the photo."
                              );
                            } else {
                              setError(
                                "The uploaded image URL was not returned."
                              );
                            }
                          }}
                          onUploadError={(uploadError) => {
                            setUploadingImage(false);
                            setError(
                              uploadError.message || "Image upload failed."
                            );
                          }}
                          appearance={{
                            button:
                              "h-10 rounded-lg bg-emerald-800 px-4 text-xs font-semibold text-white transition hover:bg-emerald-900 ut-uploading:cursor-not-allowed ut-uploading:opacity-60",
                            allowedContent:
                              "mt-1 text-[11px] text-slate-500",
                            container: "items-start gap-1",
                          }}
                          content={{
                            button: (
                              <span className="inline-flex items-center gap-2">
                                <Upload size={14} />
                                Upload image
                              </span>
                            ),
                          }}
                        />

                        {form.imageUrl && (
                          <button
                            type="button"
                            onClick={() => updateField("imageUrl", "")}
                            disabled={uploadingImage || busy}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                          >
                            <X size={14} />
                            Remove photo
                          </button>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="member-image-url"
                          className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                          Or paste an image URL
                        </label>
                        <input
                          id="member-image-url"
                          type="url"
                          value={form.imageUrl}
                          onChange={(event) =>
                            updateField("imageUrl", event.target.value)
                          }
                          placeholder="https://example.com/photo.jpg"
                          className={inputClass}
                        />
                      </div>

                      {form.imageUrl && (
                        <a
                          href={form.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:underline"
                        >
                          <ExternalLink size={13} />
                          Open image
                        </a>
                      )}

                      <p className="text-[11px] leading-5 text-slate-500">
                        Supported file types and size limits are determined by
                        your UploadThing imageUploader endpoint. Save the form
                        after uploading to associate the image with this member.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Full name" required>
                    <input
                      required
                      minLength={2}
                      maxLength={120}
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter full name"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Designation" required>
                    <select
                      required
                      value={form.designation}
                      onChange={(event) =>
                        updateField("designation", event.target.value)
                      }
                      className={inputClass}
                    >
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Email address" required>
                    <input
                      required
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="member@example.com"
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Phone number" required>
                    <input
                      required
                      minLength={5}
                      maxLength={30}
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Enter phone number"
                      className={inputClass}
                    />
                  </FormField>

                  {!selectedMember && (
                    <FormField label="Initial password" required>
                      <input
                        required
                        type="password"
                        minLength={8}
                        maxLength={128}
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="At least 8 characters"
                        className={inputClass}
                      />
                    </FormField>
                  )}

                  <FormField label="Membership start date">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        updateField("startDate", event.target.value)
                      }
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="Membership end date">
                    <input
                      type="date"
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(event) =>
                        updateField("endDate", event.target.value)
                      }
                      className={inputClass}
                    />
                  </FormField>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={busy || uploadingImage}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy || uploadingImage}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy || uploadingImage ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : null}
                    {uploadingImage
                      ? "Uploading image..."
                      : busy
                        ? "Saving..."
                        : selectedMember
                          ? "Save changes"
                          : "Create member"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {viewMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm">
            <section className="my-auto w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between bg-emerald-950 px-5 py-4 text-white">
                <div>
                  <h2 className="font-bold">Member details</h2>
                  <p className="mt-0.5 text-xs text-emerald-100/70">
                    Membership profile
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMember(null)}
                  aria-label="Close member details"
                  className="rounded-lg p-1.5 transition hover:bg-white/10"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-col items-center border-b border-slate-100 pb-5 text-center">
                  <MemberAvatar member={viewMember} large />
                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {viewMember.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-emerald-800">
                    {viewMember.designation || "General Member"}
                  </p>
                  <div className="mt-3">
                    <StatusBadge status={viewMember.status} />
                  </div>
                </div>

                <dl className="mt-4 space-y-3">
                  <DetailRow label="Email" value={viewMember.email} />
                  <DetailRow label="Phone" value={viewMember.phone} />
                  <DetailRow
                    label="Start date"
                    value={formatDate(viewMember.startDate)}
                  />
                  <DetailRow
                    label="End date"
                    value={formatDate(viewMember.endDate)}
                  />
                  <DetailRow
                    label="Account created"
                    value={formatDate(viewMember.createdAt)}
                  />
                </dl>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const member = viewMember;
                      setViewMember(null);
                      openEdit(member);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900"
                  >
                    <Pencil size={15} />
                    Edit member
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMember(null)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: ReactNode;
  tone: "emerald" | "green" | "slate" | "amber";
}) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-800",
    green: "bg-green-50 text-green-800",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-800",
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${styles[tone]}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function MemberAvatar({
  member,
  large = false,
}: {
  member: Member;
  large?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const dimension = large ? 112 : 44;

  if (member.imageUrl && !imageFailed) {
    return (
      <Image
        src={member.imageUrl}
        alt={member.name}
        width={dimension}
        height={dimension}
        unoptimized
        onError={() => setImageFailed(true)}
        className={`shrink-0 rounded-xl border border-slate-200 bg-white object-cover ${
          large ? "h-28 w-28" : "h-11 w-11"
        }`}
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-900 ${
        large ? "h-28 w-28 text-3xl" : "h-11 w-11 text-sm"
      }`}
    >
      {member.name.trim().charAt(0).toUpperCase() || "M"}
    </div>
  );
}

function MemberImagePreview({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <Image
        key={imageUrl}
        src={imageUrl}
        alt={name || "Member image preview"}
        width={112}
        height={112}
        unoptimized
        onError={() => setImageFailed(true)}
        className="h-28 w-28 shrink-0 rounded-xl border border-slate-200 bg-white object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-100 text-emerald-800">
      <div className="flex flex-col items-center gap-1">
        <ImagePlus size={30} />
        <span className="text-[10px] font-medium">No photo</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: MemberStatus }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-600" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  disabled = false,
  danger = false,
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border p-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? "border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="break-all text-right font-medium text-slate-800">
        {value}
      </dd>
    </div>
  );
}
