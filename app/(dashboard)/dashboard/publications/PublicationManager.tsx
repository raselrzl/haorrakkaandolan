"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Filter,
  ImagePlus,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  createPublicationAction,
  deletePublicationAction,
  getAdminPublicationsAction,
  updatePublicationAction,
} from "./pubLicationsActions";

type PublicationRow = Awaited<
  ReturnType<typeof getAdminPublicationsAction>
>[number];

type PublicationKind = "RESEARCH" | "PUBLICATION";
type PublicationStatus = "ACTIVE" | "INACTIVE";

type PublicationForm = {
  title: string;
  subtitle: string;
  type: PublicationKind;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  documentUrl: string;
  documentName: string;
  authorName: string;
  authorDesignation: string;
  authorImageUrl: string;
  authorBio: string;
  publishedAt: string;
  status: PublicationStatus;
};

function dhakaToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const emptyForm = (): PublicationForm => ({
  title: "",
  subtitle: "",
  type: "PUBLICATION",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  documentUrl: "",
  documentName: "",
  authorName: "",
  authorDesignation: "",
  authorImageUrl: "",
  authorBio: "",
  publishedAt: dhakaToday(),
  status: "ACTIVE",
});

const inputClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function Field({
  label,
  children,
  required = false,
  hint,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>

      {children}

      {hint && (
        <span className="mt-1.5 block text-[11px] leading-5 text-slate-500">
          {hint}
        </span>
      )}
    </label>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function TypeBadge({ type }: { type: PublicationKind }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
        type === "RESEARCH"
          ? "bg-sky-50 text-sky-800"
          : "bg-emerald-50 text-emerald-800"
      }`}
    >
      {type === "RESEARCH" ? <FileText size={11} /> : <BookOpen size={11} />}

      {type === "RESEARCH" ? "Research" : "Publication"}
    </span>
  );
}

function StatusBadge({ status }: { status: PublicationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
        status === "ACTIVE"
          ? "bg-emerald-50 text-emerald-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {status === "ACTIVE" ? <CheckCircle2 size={11} /> : <Clock3 size={11} />}

      {status === "ACTIVE" ? "Active" : "Inactive"}
    </span>
  );
}

export default function PublicationManager() {
  const [items, setItems] = useState<PublicationRow[]>([]);
  const [form, setForm] = useState<PublicationForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAuthor, setUploadingAuthor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(async () => {
    try {
      const records = await getAdminPublicationsAction();

      setItems(records);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load publications.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        [
          item.title,
          item.subtitle ?? "",
          item.authorName,
          item.authorDesignation ?? "",
          item.excerpt ?? "",
          item.content,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesType = typeFilter === "ALL" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, search, typeFilter, statusFilter]);

  function updateForm<K extends keyof PublicationForm>(
    key: K,
    value: PublicationForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setForm(emptyForm());
    setEditingId(null);
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function startEdit(item: PublicationRow) {
    setForm({
      title: item.title,
      subtitle: item.subtitle ?? "",
      type: item.type,
      excerpt: item.excerpt ?? "",
      content: item.content,
      coverImageUrl: item.coverImageUrl ?? "",
      documentUrl: item.documentUrl ?? "",
      documentName: item.documentName ?? "",
      authorName: item.authorName,
      authorDesignation: item.authorDesignation ?? "",
      authorImageUrl: item.authorImageUrl ?? "",
      authorBio: item.authorBio ?? "",
      publishedAt: item.publishedAt.slice(0, 10),
      status: item.status,
    });

    setEditingId(item.id);
    setError("");
    setNotice("");
    setFormOpen(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    if (isPending || uploadingCover || uploadingAuthor) return;

    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    setError("");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (uploadingCover || uploadingAuthor) {
      setError("Please wait until both image uploads have finished.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    if (editingId) {
      formData.set("id", editingId);
    }

    startTransition(async () => {
      try {
        const result = editingId
          ? await updatePublicationAction(formData)
          : await createPublicationAction(formData);

        setNotice(result.message);
        setForm(emptyForm());
        setEditingId(null);
        setFormOpen(false);
        setLoading(true);

        await refresh();
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to save the publication.",
        );
      }
    });
  }

  function removePublication(item: PublicationRow) {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const result = await deletePublicationAction(item.id);

        setNotice(result.message);
        setLoading(true);

        await refresh();
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to delete the publication.",
        );
      }
    });
  }

  function setImage(kind: "cover" | "author", url: string) {
    if (kind === "cover") {
      updateForm("coverImageUrl", url);
    } else {
      updateForm("authorImageUrl", url);
    }
  }

  function renderImageUpload(kind: "cover" | "author") {
    const isCover = kind === "cover";
    const url = isCover ? form.coverImageUrl : form.authorImageUrl;
    const uploading = isCover ? uploadingCover : uploadingAuthor;
    const setUploading = isCover ? setUploadingCover : setUploadingAuthor;

    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">
        {url ? (
          <div className="flex items-start gap-3">
            <img
              src={url}
              alt={isCover ? "Publication cover" : "Author photograph"}
              className={`shrink-0 border border-slate-200 bg-white object-cover ${
                isCover ? "h-24 w-36 rounded" : "h-20 w-20 rounded-full"
              }`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={14} />
                Image uploaded
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
              >
                View image
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                disabled={isPending || uploading}
                onClick={() => setImage(kind, "")}
                className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <X size={13} />
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-800">
                {isCover ? <ImagePlus size={18} /> : <UserRound size={18} />}
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  {isCover ? "Publication artwork" : "Author profile image"}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  {isCover
                    ? "Choose a cover image for your publication."
                    : "Upload a photograph of the author."}
                </p>
              </div>
            </div>

            <UploadButton<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              onUploadBegin={() => {
                setUploading(true);
                setError("");
              }}
              onClientUploadComplete={(files) => {
                const file = files?.[0];

                if (file?.url) {
                  setImage(kind, file.url);
                }

                setUploading(false);
              }}
              onUploadError={(uploadError) => {
                setUploading(false);
                setError(uploadError.message || "Image upload failed.");
              }}
              content={{
                button: () => (
                  <span className="inline-flex items-center gap-2">
                    <ImagePlus size={13} />
                    Upload {isCover ? "Cover Image" : "Author Photo"}
                  </span>
                ),
              }}
              appearance={{
                container: "flex w-auto flex-row items-center gap-0",
                button:
                  "ut-ready:bg-emerald-800 ut-ready:hover:bg-emerald-900 ut-uploading:cursor-not-allowed inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-lg border border-emerald-800 bg-emerald-800 px-3 text-xs font-semibold text-white shadow-none transition-colors hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1 disabled:opacity-60",
                allowedContent: "hidden",
              }}
            />
          </div>
        )}

        {uploading && (
          <p
            role="status"
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-800"
          >
            <LoaderCircle size={14} className="animate-spin" />
            Uploading image. Please wait…
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Page header — matches News & Activities */}
      <header className="border-b border-emerald-950 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-200">
              <BookOpen size={15} />
              Content Management
            </div>

            <h1 className="text-xl font-bold">Research & Publications</h1>

            <p className="mt-1 text-sm text-emerald-100">
              Manage research, publications, authors and supporting documents.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-950"
          >
            <Plus size={17} />
            Add new
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              {notice}
            </div>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Create / edit form */}
        {formOpen && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-emerald-100 bg-emerald-50/70 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
                  {editingId ? <Pencil size={17} /> : <Plus size={19} />}
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900">
                    {editingId ? "Edit publication" : "Add news / publication"}
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Enter the publication and author information.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={isPending || uploadingCover || uploadingAuthor}
                aria-label="Close form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={submitForm} className="space-y-5 p-4 sm:p-5">
              {/* Publication details */}
              <section>
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText size={16} className="text-emerald-800" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Publication details
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" required>
                    <input
                      name="title"
                      required
                      maxLength={250}
                      value={form.title}
                      onChange={(event) =>
                        updateForm("title", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Enter publication title"
                    />
                  </Field>

                  <Field label="Subtitle">
                    <input
                      name="subtitle"
                      value={form.subtitle}
                      onChange={(event) =>
                        updateForm("subtitle", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Optional subtitle"
                    />
                  </Field>

                  <Field label="Content type" required>
                    <select
                      name="type"
                      value={form.type}
                      onChange={(event) =>
                        updateForm(
                          "type",
                          event.target.value as PublicationKind,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="RESEARCH">Research</option>
                      <option value="PUBLICATION">Publication</option>
                    </select>
                  </Field>

                  <Field label="Publication date" required>
                    <input
                      type="date"
                      name="publishedAt"
                      required
                      value={form.publishedAt}
                      onChange={(event) =>
                        updateForm("publishedAt", event.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Short summary">
                    <textarea
                      name="excerpt"
                      rows={3}
                      value={form.excerpt}
                      onChange={(event) =>
                        updateForm("excerpt", event.target.value)
                      }
                      className={inputClass}
                      placeholder="A short introduction shown on the publication card"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Full content" required>
                    <textarea
                      name="content"
                      required
                      rows={8}
                      value={form.content}
                      onChange={(event) =>
                        updateForm("content", event.target.value)
                      }
                      className={`${inputClass} leading-6`}
                      placeholder="Write the full research or publication content…"
                    />
                  </Field>
                </div>
              </section>

              {/* Author */}
              <section>
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <UserRound size={16} className="text-emerald-800" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Author information
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Author name" required>
                    <input
                      name="authorName"
                      required
                      value={form.authorName}
                      onChange={(event) =>
                        updateForm("authorName", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Author's full name"
                    />
                  </Field>

                  <Field label="Designation">
                    <input
                      name="authorDesignation"
                      value={form.authorDesignation}
                      onChange={(event) =>
                        updateForm("authorDesignation", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Researcher, writer, scientist…"
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Author biography">
                    <textarea
                      name="authorBio"
                      rows={3}
                      value={form.authorBio}
                      onChange={(event) =>
                        updateForm("authorBio", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Optional background about the author"
                    />
                  </Field>
                </div>
              </section>

              {/* Images */}
              <section>
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ImagePlus size={16} className="text-emerald-800" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Images and artwork
                  </h3>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Field label="Cover image">
                    {renderImageUpload("cover")}

                    <input
                      type="hidden"
                      name="coverImageUrl"
                      value={form.coverImageUrl}
                    />
                  </Field>

                  <Field label="Author photograph">
                    {renderImageUpload("author")}

                    <input
                      type="hidden"
                      name="authorImageUrl"
                      value={form.authorImageUrl}
                    />
                  </Field>
                </div>
              </section>

              {/* Documents and status */}
              <section>
                <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <ArrowDownToLine size={16} className="text-emerald-800" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Documents and publishing
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Publication status" required>
                    <select
                      name="status"
                      value={form.status}
                      onChange={(event) =>
                        updateForm(
                          "status",
                          event.target.value as PublicationStatus,
                        )
                      }
                      className={inputClass}
                    >
                      <option value="ACTIVE">Active — publicly visible</option>
                      <option value="INACTIVE">Inactive — Draft</option>
                    </select>
                  </Field>
                </div>
              </section>

              {/* Form actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-slate-500">
                  Fields marked{" "}
                  <span className="font-bold text-red-600">*</span> are
                  required.
                </p>

                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={isPending || uploadingCover || uploadingAuthor}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending || uploadingCover || uploadingAuthor}
                    className={primaryButton}
                  >
                    {isPending || uploadingCover || uploadingAuthor ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}

                    {uploadingCover || uploadingAuthor
                      ? "Uploading image…"
                      : isPending
                        ? "Saving…"
                        : editingId
                          ? "Save changes"
                          : "Publish"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Publication list — no statistics summary */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Research & Publications
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Browse and manage your publication records.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void refresh();
              }}
              disabled={isPending || loading}
              className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Search title, author or content..."
                aria-label="Search publications"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:w-80">
              <div className="relative min-w-0">
                <Filter
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className={`${inputClass} pl-8`}
                  aria-label="Filter by type"
                >
                  <option value="ALL">All types</option>
                  <option value="RESEARCH">Research</option>
                  <option value="PUBLICATION">Publication</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={inputClass}
                aria-label="Filter by status"
              >
                <option value="ALL">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {filteredItems.length}
              </span>{" "}
              of {items.length} records
            </p>

            {(search || typeFilter !== "ALL" || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="text-xs font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {loading && items.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
              <LoaderCircle
                size={17}
                className="animate-spin text-emerald-700"
              />
              Loading publications...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-800">
                {items.length === 0
                  ? "No publications yet"
                  : "No matching publications"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {items.length === 0
                  ? "Add your first research paper or publication to get started."
                  : "Try another search term or adjust the filters."}
              </p>

              {items.length === 0 && (
                <button
                  type="button"
                  onClick={startCreate}
                  className={`${primaryButton} mt-4`}
                >
                  <Plus size={15} />
                  Add new
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 p-3 transition-colors hover:bg-emerald-50/30 sm:flex-row sm:items-start sm:p-4"
                >
                  {/* Cover image */}
                  {item.coverImageUrl ? (
                    <a
                      href={item.coverImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-40 lg:w-48"
                      aria-label={`View cover image for ${item.title}`}
                    >
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="h-36 w-full object-cover transition duration-300 hover:scale-[1.02] sm:h-32"
                      />
                    </a>
                  ) : (
                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-emerald-50 text-emerald-700 sm:h-32 sm:w-40 lg:w-48">
                      <BookOpen size={28} strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Publication details */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <TypeBadge type={item.type} />
                      <StatusBadge status={item.status} />
                    </div>

                    <h3 className="text-sm font-bold leading-5 text-slate-900">
                      {item.title}
                    </h3>

                    {item.subtitle && (
                      <p className="mt-1 text-xs font-medium text-slate-600">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-5 text-slate-600">
                      {item.excerpt || item.content}
                    </p>

                    {/* Author information */}
                    <div className="mt-3 flex items-center gap-2.5">
                      {item.authorImageUrl ? (
                        <img
                          src={item.authorImageUrl}
                          alt={item.authorName}
                          className="h-9 w-9 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
                          <UserRound size={17} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-800">
                          {item.authorName}
                        </p>

                        <p className="truncate text-[11px] text-slate-500">
                          {item.authorDesignation || "Author"}
                        </p>
                      </div>

                      <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] text-slate-500">
                        <CalendarDays size={12} />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    {item.documentUrl && (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 transition hover:text-emerald-950 hover:underline"
                      >
                        <FileText size={13} />
                        {item.documentName || "Supporting document"}
                        <ExternalLink size={11} />
                      </a>
                    )}

                    <p className="mt-2 text-[10px] text-slate-400">
                      Created {formatDate(item.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2 sm:flex-col">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      disabled={isPending}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50 sm:flex-none"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => removePublication(item)}
                      disabled={isPending}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-50 sm:flex-none"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>

                    <a
                      href={`/publications/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Preview public page"
                      className="inline-flex h-8 w-9 shrink-0 items-center justify-center self-center rounded-lg border border-emerald-200 bg-white text-emerald-800 transition hover:bg-emerald-50 hover:text-emerald-950"
                    >
                      <ArrowUpRight size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
