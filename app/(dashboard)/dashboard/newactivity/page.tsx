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
  Activity,
  CalendarDays,
  ExternalLink,
  FileText,
  ImagePlus,
  LoaderCircle,
  Newspaper,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";

import {
  createNewsAction,
  deleteNewsAction,
  deleteSelectedNewsAction,
  getNewsAction,
} from "./activityActions";

type NewsItem = Awaited<ReturnType<typeof getNewsAction>>[number];
type MediaKind = "IMAGE" | "VIDEO";

const initialForm = {
  heading: "",
  details: "",
  riverOrHaor: "HAOR",
  type: "NEWS",
  mediaUrl: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?(#.*)?$/i.test(url);
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "youtu.be" || hostname.endsWith(".youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];

      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (hostname === "youtube.com" || hostname.endsWith(".youtube.com")) {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");

        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2];

        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }

    if (hostname === "vimeo.com" || hostname.endsWith(".vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();

      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

function inferMediaKind(url: string): MediaKind {
  if (!url.trim()) return "IMAGE";

  if (isDirectVideoUrl(url) || /youtube\.com|youtu\.be|vimeo\.com/i.test(url)) {
    return "VIDEO";
  }

  return "IMAGE";
}

function MediaPreview({
  url,
  kind,
  compact = false,
}: {
  url: string;
  kind: MediaKind;
  compact?: boolean;
}) {
  if (!url) return null;

  const embed = getEmbedUrl(url);

  if (kind === "VIDEO") {
    // YouTube and Vimeo need their embedded players.
    if (embed) {
      return (
        <div
          className={`w-full overflow-hidden rounded-lg bg-black ${
            compact ? "max-h-36" : ""
          }`}
        >
          <iframe
            src={embed}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-video w-full"
            loading="lazy"
          />
        </div>
      );
    }

    // Try to play direct and uploaded video URLs, even without a file extension.
    return (
      <div className="w-full min-w-0">
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className={`w-full rounded-lg bg-black ${
            compact ? "h-36 object-contain" : "max-h-120"
          }`}
        >
          Your browser does not support video playback.
        </video>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-emerald-800 hover:underline"
        >
          <ExternalLink size={12} />
          Open video separately
        </a>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="News media"
      loading="lazy"
      className={`w-full rounded-lg bg-slate-50 object-contain ${
        compact ? "h-36" : "max-h-80"
      }`}
    />
  );
}

export default function NewsActivitiesPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [form, setForm] = useState(initialForm);
  const [mediaKind, setMediaKind] = useState<MediaKind>("IMAGE");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [waterFilter, setWaterFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await getNewsAction();

        setItems(data);
        setSelectedIds([]);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load records.",
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
        item.details.toLowerCase().includes(query) ||
        item.user.name.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (typeFilter === "ALL" || item.type === typeFilter) &&
        (waterFilter === "ALL" || item.riverOrHaor === waterFilter)
      );
    });
  }, [items, search, typeFilter, waterFilter]);

  const allSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.includes(item.id));

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
    setMediaKind("IMAGE");
    setModalOpen(true);
  }

  function closeCreateModal() {
    if (isPending) return;

    setModalOpen(false);
    setError("");
  }

  function handleMediaUrlChange(url: string) {
    setForm((current) => ({ ...current, mediaUrl: url }));
    setMediaKind(inferMediaKind(url));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const mediaUrl = form.mediaUrl.trim();
    const detectedMediaKind = inferMediaKind(mediaUrl);

    // Detect media type automatically before saving.
    const finalMediaKind = mediaUrl
      ? mediaKind === "VIDEO" || detectedMediaKind === "VIDEO"
        ? "VIDEO"
        : "IMAGE"
      : "";

    const formData = new FormData();

    formData.set("heading", form.heading.trim());
    formData.set("details", form.details.trim());
    formData.set("riverOrHaor", form.riverOrHaor);
    formData.set("type", form.type);
    formData.set("mediaUrl", mediaUrl);
    formData.set("mediaType", finalMediaKind);

    startTransition(async () => {
      try {
        const result = await createNewsAction(formData);

        setNotice(result.message);
        setForm(initialForm);
        setMediaKind("IMAGE");
        setModalOpen(false);

        const updatedItems = await getNewsAction();

        setItems(updatedItems);
        setSelectedIds([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to publish.");
      }
    });
  }

  function deleteOne(item: NewsItem) {
    if (!window.confirm(`Delete "${item.heading}"?`)) return;

    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const result = await deleteNewsAction(item.id);

        setItems((current) =>
          current.filter((record) => record.id !== item.id),
        );

        setSelectedIds((current) => current.filter((id) => id !== item.id));

        setNotice(result.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete.");
      }
    });
  }

  function deleteSelected() {
    if (
      !selectedIds.length ||
      !window.confirm(`Delete ${selectedIds.length} selected records?`)
    ) {
      return;
    }

    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        const idsToDelete = [...selectedIds];
        const result = await deleteSelectedNewsAction(idsToDelete);

        setItems((current) =>
          current.filter((item) => !idsToDelete.includes(item.id)),
        );

        setSelectedIds([]);
        setNotice(result.message);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete selected records.",
        );
      }
    });
  }

  const newsCount = items.filter((item) => item.type === "NEWS").length;

  const activityCount = items.filter((item) => item.type === "ACTIVITY").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-emerald-950 bg-emerald-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-xl font-bold">News & Activities</h1>
            <p className="mt-1 text-sm text-emerald-100">
              Manage river and haor news and activities.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Plus size={17} />
            Add new
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6">
        {error && (
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: "Total records", value: items.length, icon: FileText },
            { label: "News", value: newsCount, icon: Newspaper },
            { label: "Activities", value: activityCount, icon: Activity },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
            >
              <Icon size={20} className="text-emerald-800" />
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-bold text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

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
                placeholder="Search news and activities..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className={inputClass}
              >
                <option value="ALL">All types</option>
                <option value="NEWS">News</option>
                <option value="ACTIVITY">Activity</option>
              </select>

              <select
                value={waterFilter}
                onChange={(event) => setWaterFilter(event.target.value)}
                className={inputClass}
              >
                <option value="ALL">River & Haor</option>
                <option value="RIVER">River</option>
                <option value="HAOR">Haor</option>
              </select>
            </div>
          </div>

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

          {isPending && items.length === 0 ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500">
              <LoaderCircle size={17} className="animate-spin" />
              Loading...
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="p-12 text-center text-sm text-slate-500">
              No records found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                // Prefer the saved type; infer it for older records.
                const itemMediaKind: MediaKind =
                  item.mediaType === "VIDEO" || item.mediaType === "IMAGE"
                    ? item.mediaType
                    : inferMediaKind(item.mediaUrl ?? "");

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start"
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

                    {item.mediaUrl && itemMediaKind === "VIDEO" ? (
                      <div className="w-full shrink-0 sm:w-64 lg:w-80">
                        <MediaPreview url={item.mediaUrl} kind="VIDEO" />
                      </div>
                    ) : item.mediaUrl ? (
                      <div className="w-full shrink-0 sm:w-44">
                        <MediaPreview
                          url={item.mediaUrl}
                          kind="IMAGE"
                          compact
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:w-24">
                        <ImagePlus size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded px-2 py-1 text-[10px] font-bold ${
                            item.type === "NEWS"
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-sky-50 text-sky-800"
                          }`}
                        >
                          {item.type}
                        </span>

                        <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                          {item.riverOrHaor === "RIVER" ? "River" : "Haor"}
                        </span>

                        {item.mediaUrl && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                            {itemMediaKind === "VIDEO" ? (
                              <Video size={11} />
                            ) : (
                              <ImagePlus size={11} />
                            )}
                            {itemMediaKind === "VIDEO" ? "Video" : "Image"}
                          </span>
                        )}
                      </div>

                      <h2 className="text-sm font-bold text-slate-900">
                        {item.heading}
                      </h2>

                      <p className="mt-1 whitespace-pre-wrap wrap-break-words text-sm text-slate-600">
                        {item.details}
                      </p>

                      {item.mediaUrl && (
                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-800 hover:underline"
                        >
                          <ExternalLink size={12} />
                          Open {itemMediaKind === "VIDEO" ? "video" : "image"}
                        </a>
                      )}

                      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span>
                          <CalendarDays size={11} className="mr-1 inline" />
                          Created: {formatDate(item.createdAt)}
                        </span>

                        <span>Updated: {formatDate(item.updatedAt)}</span>
                        <span>By {item.user.name}</span>
                      </p>
                    </div>

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
                );
              })}
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="flex items-center justify-between bg-emerald-950 px-4 py-3 text-white">
              <h2 id="form-title" className="text-base font-bold">
                Add news / activity
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
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold">
                    Type *
                  </span>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm({ ...form, type: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="NEWS">News</option>
                    <option value="ACTIVITY">Activity</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold">
                    River or Haor *
                  </span>

                  <select
                    value={form.riverOrHaor}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        riverOrHaor: event.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="HAOR">Haor</option>
                    <option value="RIVER">River</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold">
                  Heading *
                </span>

                <input
                  required
                  maxLength={200}
                  value={form.heading}
                  onChange={(event) =>
                    setForm({ ...form, heading: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Enter heading"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold">
                  Details *
                </span>

                <textarea
                  required
                  rows={5}
                  value={form.details}
                  onChange={(event) =>
                    setForm({ ...form, details: event.target.value })
                  }
                  className={inputClass}
                  placeholder="Write details..."
                />
              </label>

              <div className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Upload size={15} className="text-emerald-800" />
                  Upload image or video
                </div>

                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const uploadedFile = res?.[0];

                    if (!uploadedFile?.url) return;

                    const fileInfo = uploadedFile as typeof uploadedFile & {
                      type?: string;
                      name?: string;
                    };

                    const name = fileInfo.name ?? "";
                    const mimeType = fileInfo.type ?? "";

                    const isVideo =
                      mimeType.startsWith("video/") ||
                      /\.(mp4|webm|ogg|mov|m4v)$/i.test(name);

                    const detectedKind: MediaKind = isVideo ? "VIDEO" : "IMAGE";

                    setMediaKind(detectedKind);

                    setForm((current) => ({
                      ...current,
                      mediaUrl: uploadedFile.url,
                    }));

                    setError("");
                  }}
                  onUploadError={(uploadError) => {
                    setError(uploadError.message);
                  }}
                  content={{
                    button: () => (
                      <span className="inline-flex items-center gap-2">
                        <Upload size={14} />
                        Upload image or video
                      </span>
                    ),
                  }}
                  appearance={{
                    container: "flex flex-col items-center gap-1.5 text-center",
                    button:
                      "ut-ready:bg-emerald-800 ut-ready:hover:bg-emerald-900 ut-uploading:cursor-not-allowed inline-flex h-10 items-center justify-center rounded-md border border-emerald-800 bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-60",
                    allowedContent: "w-full text-center text-xs text-slate-500",
                  }}
                />

                <p className="mt-2 text-[11px] text-slate-500">
                  Select an image or video file from your device. File size
                  limits depend on your UploadThing configuration and plan.
                </p>
              </div>

              {form.mediaUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-600">
                      Media preview
                    </p>

                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                      {mediaKind === "VIDEO" ? (
                        <Video size={12} />
                      ) : (
                        <ImagePlus size={12} />
                      )}

                      {mediaKind === "VIDEO" ? "Video" : "Image"}
                    </span>
                  </div>

                  <MediaPreview url={form.mediaUrl} kind={mediaKind} />

                  <button
                    type="button"
                    onClick={() => {
                      setForm((current) => ({
                        ...current,
                        mediaUrl: "",
                      }));

                      setMediaKind("IMAGE");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                  >
                    <X size={13} />
                    Remove media
                  </button>
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
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 disabled:opacity-50"
                >
                  {isPending ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Plus size={15} />
                  )}
                  Publish
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
