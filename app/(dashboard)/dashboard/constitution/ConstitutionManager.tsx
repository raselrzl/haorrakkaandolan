"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import {
  UploadButton,
} from "@/app/utils/uploadthing";

import {
  createConstitutionAction,
  deleteConstitutionAction,
  getConstitutionsAction,
  updateConstitutionAction,
  updateConstitutionStatusAction,
} from "./constitutionActions";


import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Status } from "@/app/generated/prisma/enums";

type ConstitutionRecord = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string | null;
  descriptionEn: string | null;
  pdfUrlBn: string | null;
  pdfUrlEn: string | null;
  publishedAt: string;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
};

type FormState = {
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  pdfUrlBn: string;
  pdfUrlEn: string;
  publishedAt: string;
  status: "ACTIVE" | "INACTIVE";
};

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
};

const emptyForm = (): FormState => ({
  titleBn: "গঠনতন্ত্র",
  titleEn: "Constitution",
  descriptionBn: "",
  descriptionEn: "",
  pdfUrlBn: "",
  pdfUrlEn: "",
  publishedAt: today(),
  status: "ACTIVE",
});

function formatDate(value: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function ConstitutionManager() {
  const [records, setRecords] = useState<ConstitutionRecord[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getConstitutionsAction();
      setRecords(result as ConstitutionRecord[]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  function setField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(record: ConstitutionRecord) {
    setEditingId(record.id);
    setForm({
      titleBn: record.titleBn,
      titleEn: record.titleEn,
      descriptionBn: record.descriptionBn ?? "",
      descriptionEn: record.descriptionEn ?? "",
      pdfUrlBn: record.pdfUrlBn ?? "",
      pdfUrlEn: record.pdfUrlEn ?? "",
      publishedAt: record.publishedAt.slice(0, 10),
      status: record.status,
    });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!form.pdfUrlBn && !form.pdfUrlEn) {
      setError("Upload at least one PDF before saving.");
      return;
    }

    startSaving(async () => {
      try {
        const payload = {
          ...form,
          id: editingId ?? undefined,
        };

        if (editingId) {
          await updateConstitutionAction(payload);
          setNotice("Constitution updated successfully.");
        } else {
          await createConstitutionAction(payload);
          setNotice("Constitution created successfully.");
        }

        setFormOpen(false);
        setEditingId(null);
        await loadRecords();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    });
  }

  async function handleStatus(record: ConstitutionRecord) {
    setError("");
    setNotice("");
    setBusyId(record.id);

    try {
      const nextStatus =
        record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      await updateConstitutionStatusAction(record.id, nextStatus);
      setNotice(
        nextStatus === "ACTIVE"
          ? "Constitution activated."
          : "Constitution deactivated.",
      );

      await loadRecords();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(record: ConstitutionRecord) {
    const confirmed = window.confirm(
      `Delete "${record.titleEn}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");
    setBusyId(record.id);

    try {
      await deleteConstitutionAction(record.id);
      setNotice("Constitution deleted successfully.");
      await loadRecords();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const activeCount = records.filter(
    (record) => record.status === "ACTIVE",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50/80 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-sm">
              <BookOpen size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                গঠনতন্ত্র / Constitution
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage Bangla and English constitution documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadRecords()}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-sm font-semibold text-white transition hover:bg-emerald-900"
            >
              <Plus size={17} />
              Add document
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={<FileText size={18} />}
            label="Total documents"
            value={records.length}
          />
          <SummaryCard
            icon={<CheckCircle2 size={18} />}
            label="Active documents"
            value={activeCount}
          />
          <SummaryCard
            icon={<CalendarDays size={18} />}
            label="Current date"
            value={formatDate(today())}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Create/edit form */}
        {formOpen && (
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {editingId ? "Edit constitution" : "Add constitution"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Fill in both languages and upload one or both PDFs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
                className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-2">
                {/* Bangla */}
                <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                  <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
                    <span className="rounded-md bg-emerald-800 px-2 py-1 text-xs font-bold text-white">
                      বাংলা
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Bangla document
                    </h3>
                  </div>

                  <Field label="Title (Bangla)" required>
                    <input
                      required
                      value={form.titleBn}
                      onChange={(e) => setField("titleBn", e.target.value)}
                      className={inputClass}
                      placeholder="গঠনতন্ত্র"
                    />
                  </Field>

                  <Field label="Description (Bangla)">
                    <textarea
                      value={form.descriptionBn}
                      onChange={(e) =>
                        setField("descriptionBn", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                      placeholder="গঠনতন্ত্র সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                    />
                  </Field>

                  <PdfUpload
                    label="Bangla PDF"
                    url={form.pdfUrlBn}
                    onUploaded={(url) => setField("pdfUrlBn", url)}
                    onRemove={() => setField("pdfUrlBn", "")}
                  />
                </div>

                {/* English */}
                <div className="space-y-4 rounded-xl border border-sky-100 bg-sky-50/30 p-4">
                  <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
                    <span className="rounded-md bg-sky-800 px-2 py-1 text-xs font-bold text-white">
                      EN
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800">
                      English document
                    </h3>
                  </div>

                  <Field label="Title (English)" required>
                    <input
                      required
                      value={form.titleEn}
                      onChange={(e) => setField("titleEn", e.target.value)}
                      className={inputClass}
                      placeholder="Constitution"
                    />
                  </Field>

                  <Field label="Description (English)">
                    <textarea
                      value={form.descriptionEn}
                      onChange={(e) =>
                        setField("descriptionEn", e.target.value)
                      }
                      rows={3}
                      className={inputClass}
                      placeholder="A brief description of the constitution..."
                    />
                  </Field>

                  <PdfUpload
                    label="English PDF"
                    url={form.pdfUrlEn}
                    onUploaded={(url) => setField("pdfUrlEn", url)}
                    onRemove={() => setField("pdfUrlEn", "")}
                  />
                </div>
              </div>

              {/* Dates and status */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Publication date" required>
                  <input
                    type="date"
                    required
                    value={form.publishedAt}
                    onChange={(e) => setField("publishedAt", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Last updated">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
                    <CalendarDays size={16} className="text-slate-400" />
                    {editingId
                      ? "Automatically updated on save"
                      : "Set automatically on creation"}
                  </div>
                </Field>

                <Field label="Publication status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setField(
                        "status",
                        e.target.value as FormState["status"],
                      )
                    }
                    className={inputClass}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </Field>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || (!form.pdfUrlBn && !form.pdfUrlEn)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Saving..." : editingId ? "Save changes" : "Create document"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Documents table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Constitution documents
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage uploaded PDFs and publication status.
              </p>
            </div>
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {records.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading documents...
            </div>
          ) : records.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <FileText size={23} />
              </div>
              <p className="font-semibold text-slate-800">
                No constitution uploaded
              </p>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Add the Bangla or English constitution PDF to get started.
              </p>
              <button
                type="button"
                onClick={openCreateForm}
                className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-800 px-3 text-sm font-semibold text-white hover:bg-emerald-900"
              >
                <Plus size={15} />
                Add document
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Document</th>
                    <th className="px-4 py-3 font-semibold">PDF files</th>
                    <th className="px-4 py-3 font-semibold">Published</th>
                    <th className="px-4 py-3 font-semibold">Last updated</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr key={record.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {record.titleBn}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {record.titleEn}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {record.pdfUrlBn ? (
                            <PdfLink url={record.pdfUrlBn} label="বাংলা PDF" />
                          ) : (
                            <span className="text-xs text-slate-400">
                              Bangla PDF not uploaded
                            </span>
                          )}
                          {record.pdfUrlEn ? (
                            <PdfLink url={record.pdfUrlEn} label="English PDF" />
                          ) : (
                            <span className="text-xs text-slate-400">
                              English PDF not uploaded
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(record.publishedAt)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(record.lastUpdatedAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                            record.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {record.status === "ACTIVE" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditForm(record)}
                            title="Edit document"
                            aria-label="Edit document"
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            type="button"
                            disabled={busyId === record.id}
                            onClick={() => void handleStatus(record)}
                            title={
                              record.status === "ACTIVE"
                                ? "Deactivate document"
                                : "Activate document"
                            }
                            aria-label={
                              record.status === "ACTIVE"
                                ? "Deactivate document"
                                : "Activate document"
                            }
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50"
                          >
                            {busyId === record.id ? (
                              <LoaderCircle size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                          </button>

                          <button
                            type="button"
                            disabled={busyId === record.id}
                            onClick={() => void handleDelete(record)}
                            title="Delete document"
                            aria-label="Delete document"
                            className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 truncate text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function PdfLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 hover:underline"
    >
      <FileText size={14} />
      {label}
      <ExternalLink size={11} />
    </a>
  );
}

function PdfUpload({
  label,
  url,
  onUploaded,
  onRemove,
}: {
  label: string;
  url: string;
  onUploaded: (url: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-700">{label}</p>

      {url ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-white p-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                PDF uploaded
              </p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:underline"
              >
                View document
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <Upload size={15} />
            PDF only
          </div>

          <UploadButton
            endpoint="pdfUploader"
            onClientUploadComplete={(files) => {
              const uploaded = files?.[0];
              const url = uploaded?.ufsUrl ?? uploaded?.url;

              if (url) onUploaded(url);
            }}
            onUploadError={(err) => {
              window.alert(`PDF upload failed: ${err.message}`);
            }}
            appearance={{
              button:
                "h-9 rounded-lg bg-emerald-800 px-3 text-xs font-semibold text-white hover:bg-emerald-900",
              allowedContent: "mt-2 text-[11px] text-slate-400",
            }}
            content={{
              button: "Upload PDF",
              allowedContent: "PDF document",
            }}
          />
        </div>
      )}
    </div>
  );
}