
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

import {
  CalendarDays,
  ExternalLink,
  FileImage,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  createDocumentAction,
  deleteDocumentAction,
  deleteSelectedDocumentsAction,
  getDocumentsAction,
} from "./documentActions";

type DocumentItem = Awaited<
  ReturnType<typeof getDocumentsAction>
>[number];

type MediaKind = "PDF" | "IMAGE";

const initialForm = {
  heading: "",
  documentDate: new Date().toISOString().slice(0, 10),
  documentUrl: "",
  documentName: "",
  mediaType: "PDF" as MediaKind,
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function DocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await getDocumentsAction();

        setItems(data);
        setSelectedIds([]);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load documents.",
        );
      }
    });
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.heading.toLowerCase().includes(query) ||
        (item.documentName ?? "").toLowerCase().includes(query);

      return (
        matchesSearch &&
        (typeFilter === "ALL" || item.mediaType === typeFilter)
      );
    });
  }, [items, search, typeFilter]);

  const allSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.includes(item.id));

  const pdfCount = items.filter(
    (item) => item.mediaType === "PDF",
  ).length;

  const imageCount = items.filter(
    (item) => item.mediaType === "IMAGE",
  ).length;

  function toggleSelectAll() {
    const visibleIds = filteredItems.map((item) => item.id);

    setSelectedIds((current) =>
      allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  }

  function openCreateModal() {
    setError("");
    setNotice("");
    setForm(initialForm);
    setModalOpen(true);
  }

  function closeCreateModal() {
    if (isPending) return;

    setModalOpen(false);
    setError("");
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setNotice("");

    if (!form.documentUrl) {
      setError("Please upload a document first.");
      return;
    }

    const formData = new FormData();

    formData.set("heading", form.heading.trim());
    formData.set("documentDate", form.documentDate);
    formData.set("documentUrl", form.documentUrl);
    formData.set("documentName", form.documentName);
    formData.set("mediaType", form.mediaType);

    startTransition(async () => {
      try {
        const result = await createDocumentAction(formData);

        setNotice(result.message);
        setForm(initialForm);
        setModalOpen(false);

        const updatedItems = await getDocumentsAction();

        setItems(updatedItems);
        setSelectedIds([]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to add document.",
        );
      }
    });
  }

  function deleteOne(item: DocumentItem) {
    if (!window.confirm(`Delete "${item.heading}"?`)) return;

    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const result = await deleteDocumentAction(item.id);

        setItems((current) =>
          current.filter((record) => record.id !== item.id),
        );

        setSelectedIds((current) =>
          current.filter((id) => id !== item.id),
        );

        setNotice(result.message);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to delete.",
        );
      }
    });
  }

  function deleteSelected() {
    if (
      !selectedIds.length ||
      !window.confirm(
        `Delete ${selectedIds.length} selected documents?`,
      )
    ) {
      return;
    }

    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const idsToDelete = [...selectedIds];

        const result =
          await deleteSelectedDocumentsAction(idsToDelete);

        setItems((current) =>
          current.filter((item) => !idsToDelete.includes(item.id)),
        );

        setSelectedIds([]);
        setNotice(result.message);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete documents.",
        );
      }
    });
  }

  function handleUploadComplete(
    res: { url: string; name: string }[] | undefined,
    expectedType: MediaKind,
  ) {
    const uploadedFile = res?.[0];

    if (!uploadedFile?.url) return;

    setForm((current) => ({
      ...current,
      mediaType: expectedType,
      documentUrl: uploadedFile.url,
      documentName: uploadedFile.name ?? "",
    }));

    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="border-b border-emerald-950 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-xl font-bold">Documents</h1>
            <p className="mt-1 text-sm text-emerald-100">
              Manage official documents and records.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Plus size={17} />
            Add document
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
        {/* MESSAGES */}
        {error && !modalOpen && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
          >
            {notice}
          </p>
        )}

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "Total documents",
              value: items.length,
              icon: FileText,
            },
            {
              label: "PDF documents",
              value: pdfCount,
              icon: FileText,
            },
            {
              label: "Images",
              value: imageCount,
              icon: FileImage,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <Icon size={20} className="text-emerald-800" />
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* DOCUMENT LIST */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search documents..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={inputClass + " sm:w-40"}
            >
              <option value="ALL">All documents</option>
              <option value="PDF">PDF</option>
              <option value="IMAGE">Images</option>
            </select>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="accent-emerald-700"
              />
              Select all ({filteredItems.length})
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={loadItems}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={isPending ? "animate-spin" : ""}
                />
                Refresh
              </button>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={deleteSelected}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Delete ({selectedIds.length})
                </button>
              )}
            </div>
          </div>

          {/* RECORDS */}
          {isPending && items.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
              <LoaderCircle size={17} className="animate-spin" />
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="p-12 text-center text-sm text-slate-500">
              No documents found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() =>
                      setSelectedIds((current) =>
                        current.includes(item.id)
                          ? current.filter((id) => id !== item.id)
                          : [...current, item.id],
                      )
                    }
                    aria-label={`Select ${item.heading}`}
                    className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                  />

                  {/* FILE PREVIEW */}
                  <div className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-32">
                    {item.mediaType === "IMAGE" ? (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full items-center justify-center"
                      >
                        <img
                          src={item.documentUrl}
                          alt={item.heading}
                          loading="lazy"
                          className="h-full w-full object-contain"
                        />
                      </a>
                    ) : (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-full w-full flex-col items-center justify-center gap-1 text-red-700 hover:bg-red-50"
                      >
                        <FileText size={30} />
                        <span className="text-[10px] font-bold">
                          PDF DOCUMENT
                        </span>
                      </a>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
                          item.mediaType === "PDF"
                            ? "bg-red-50 text-red-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {item.mediaType === "PDF" ? (
                          <FileText size={11} />
                        ) : (
                          <FileImage size={11} />
                        )}
                        {item.mediaType}
                      </span>

                      {!item.status || item.status === "ACTIVE" ? (
                        <span className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          Published
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          Inactive
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm font-bold text-slate-900">
                      {item.heading}
                    </h2>

                    <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>
                        <CalendarDays
                          size={11}
                          className="mr-1 inline"
                        />
                        Document date: {formatDate(item.documentDate)}
                      </span>

                      <span>
                        Uploaded: {formatDate(item.createdAt)}
                      </span>
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3">
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                      >
                        <ExternalLink size={12} />
                        View document
                      </a>

                      <a
                        href={item.documentUrl}
                        download={item.documentName || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:underline"
                      >
                        <FileText size={12} />
                        Download
                      </a>
                    </div>
                  </div>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() => deleteOne(item)}
                    disabled={isPending}
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ADD DOCUMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-form-title"
            className="flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between bg-emerald-950 px-4 py-3 text-white">
              <h2
                id="document-form-title"
                className="text-base font-bold"
              >
                Add document
              </h2>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isPending}
                aria-label="Close"
                className="rounded p-1 hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={submitForm}
              className="space-y-4 overflow-y-auto p-4"
            >
              {/* HEADING */}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold">
                  Heading *
                </span>

                <input
                  required
                  maxLength={200}
                  value={form.heading}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      heading: event.target.value,
                    })
                  }
                  className={inputClass}
                  placeholder="Enter document heading"
                />
              </label>

              {/* DATE */}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold">
                  Document date *
                </span>

                <input
                  type="date"
                  required
                  value={form.documentDate}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      documentDate: event.target.value,
                    })
                  }
                  className={inputClass}
                />
              </label>

              {/* DOCUMENT TYPE */}
              <label className="block">
                <span className="mb-1 block text-xs font-semibold">
                  Document type *
                </span>

                <select
                  value={form.mediaType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      mediaType: event.target.value as MediaKind,
                      documentUrl: "",
                      documentName: "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="PDF">PDF Document</option>
                  <option value="IMAGE">Image</option>
                </select>
              </label>

              {/* UPLOAD */}
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Upload size={15} className="text-emerald-800" />
                  Upload {form.mediaType === "PDF" ? "PDF" : "image"}
                </div>

                {form.mediaType === "IMAGE" ? (
                  <UploadButton<OurFileRouter, "imageUploader">
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) =>
                      handleUploadComplete(res, "IMAGE")
                    }
                    onUploadError={(uploadError) => {
                      setError(uploadError.message);
                    }}
                    content={{
                      button: () => (
                        <span className="inline-flex items-center gap-2">
                          <Upload size={14} />
                          Upload image
                        </span>
                      ),
                    }}
                    appearance={{
                      container:
                        "flex w-auto flex-row items-center gap-0",
                      button:
                        "ut-ready:bg-sky-700 ut-ready:hover:bg-sky-800 ut-uploading:cursor-not-allowed inline-flex h-8 min-w-0 items-center justify-center rounded border border-sky-700 bg-sky-700 px-3 text-[11px] font-semibold text-white shadow-none transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 disabled:opacity-60",
                      allowedContent: "hidden",
                    }}
                  />
                ) : (
                  <UploadButton<OurFileRouter, "pdfUploader">
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) =>
                      handleUploadComplete(res, "PDF")
                    }
                    onUploadError={(uploadError) => {
                      setError(uploadError.message);
                    }}
                    content={{
                      button: () => (
                        <span className="inline-flex items-center gap-2">
                          <Upload size={14} />
                          Upload PDF
                        </span>
                      ),
                    }}
                    appearance={{
                      container:
                        "flex w-auto flex-row items-center gap-0",
                      button:
                        "ut-ready:bg-sky-700 ut-ready:hover:bg-sky-800 ut-uploading:cursor-not-allowed inline-flex h-8 min-w-0 items-center justify-center rounded border border-sky-700 bg-sky-700 px-3 text-[11px] font-semibold text-white shadow-none transition-colors hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-1 disabled:opacity-60",
                      allowedContent: "hidden",
                    }}
                  />
                )}

                <p className="mt-2 break-all text-xs text-slate-500">
                  {form.documentName || "No document uploaded."}
                </p>
              </div>

              {/* PREVIEW */}
              {form.documentUrl && (
                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-700">
                      Document preview
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          documentUrl: "",
                          documentName: "",
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                    >
                      <X size={13} />
                      Remove
                    </button>
                  </div>

                  {form.mediaType === "IMAGE" ? (
                    <img
                      src={form.documentUrl}
                      alt="Document preview"
                      className="max-h-64 w-full rounded-lg bg-slate-50 object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                      <FileText
                        size={32}
                        className="shrink-0 text-red-700"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {form.documentName || "PDF document"}
                        </p>
                        <a
                          href={form.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                        >
                          <ExternalLink size={12} />
                          Open PDF
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isPending}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isPending ||
                    !form.documentUrl ||
                    !form.heading.trim() ||
                    !form.documentDate
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                >
                  {isPending ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  Add document
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
