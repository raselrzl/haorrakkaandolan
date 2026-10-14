
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CirclePlus,
  ClipboardList,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  addDemandPointAction,
  createDemandAction,
  deleteDemandAction,
  deleteDemandPointAction,
  getDemandsAction,
  updateDemandAction,
  updateDemandPointAction,
} from "./demandActions";

type DemandPoint = {
  id: string;
  demandId: string;
  pointNumber: number;
  headingBn: string;
  headingEn: string;
  descriptionBn: string;
  descriptionEn: string;
  createdAt: string;
  updatedAt: string;
};

type DemandDocument = {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string | null;
  descriptionEn: string | null;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE";
  points: DemandPoint[];
};

type PointForm = {
  headingBn: string;
  headingEn: string;
  descriptionBn: string;
  descriptionEn: string;
};

type DemandForm = {
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  publishedAt: string;
  points: PointForm[];
};

const emptyPoint = (): PointForm => ({
  headingBn: "",
  headingEn: "",
  descriptionBn: "",
  descriptionEn: "",
});

const emptyDemand = (): DemandForm => ({
  titleBn: "",
  titleEn: "",
  descriptionBn: "",
  descriptionEn: "",
  publishedAt: new Date().toISOString().slice(0, 16),
  points: [emptyPoint()],
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  textarea = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  type?: string;
}) {
  const classes =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10";

  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>

      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          rows={3}
          className={`${classes} min-h-24 resize-y leading-6`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className={classes}
        />
      )}
    </label>
  );
}

function PointFields({
  point,
  onChange,
}: {
  point: PointForm;
  onChange: (point: PointForm) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field
        label="পয়েন্টের শিরোনাম (বাংলা)"
        value={point.headingBn}
        onChange={(value) => onChange({ ...point, headingBn: value })}
        placeholder="যেমন: হাওরের জীববৈচিত্র্য রক্ষা"
        required
      />
      <Field
        label="Point heading (English)"
        value={point.headingEn}
        onChange={(value) => onChange({ ...point, headingEn: value })}
        placeholder="e.g. Protect Haor Biodiversity"
        required
      />
      <Field
        label="বিস্তারিত (বাংলা)"
        value={point.descriptionBn}
        onChange={(value) => onChange({ ...point, descriptionBn: value })}
        placeholder="এই দাবির বিস্তারিত লিখুন..."
        required
        textarea
      />
      <Field
        label="Description (English)"
        value={point.descriptionEn}
        onChange={(value) => onChange({ ...point, descriptionEn: value })}
        placeholder="Describe this demand..."
        required
        textarea
      />
    </div>
  );
}

function DemandPointCard({
  point,
  onRefresh,
  notify,
}: {
  point: DemandPoint;
  onRefresh: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<PointForm>({
    headingBn: point.headingBn,
    headingEn: point.headingEn,
    descriptionBn: point.descriptionBn,
    descriptionEn: point.descriptionEn,
  });

  async function savePoint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    try {
      const result = await updateDemandPointAction({
        ...form,
        id: point.id,
        demandId: point.demandId,
      });

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      setEditing(false);
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  async function removePoint() {
    if (!window.confirm(`Delete point ${point.pointNumber}?`)) return;

    setBusy(true);

    try {
      const result = await deleteDemandPointAction(
        point.demandId,
        point.id,
      );

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-start gap-3 p-3 sm:p-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-800">
          {point.pointNumber}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            {point.headingBn}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {point.headingEn}
          </p>

          {!editing && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {point.descriptionBn}
              </p>
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {point.descriptionEn}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            disabled={busy}
            title={editing ? "Cancel editing" : "Edit point"}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-800 disabled:opacity-50"
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
          </button>

          <button
            type="button"
            onClick={removePoint}
            disabled={busy}
            title="Delete point"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={savePoint}
          className="border-t border-slate-100 bg-slate-50 p-4"
        >
          <PointFields
            point={form}
            onChange={setForm}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
            >
              {busy ? (
                <LoaderCircle className="animate-spin" size={14} />
              ) : (
                <Save size={14} />
              )}
              Save point
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function DemandCard({
  demand,
  onRefresh,
  notify,
}: {
  demand: DemandDocument;
  onRefresh: () => Promise<void>;
  notify: (message: string, error?: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [addingPoint, setAddingPoint] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    titleBn: demand.titleBn,
    titleEn: demand.titleEn,
    descriptionBn: demand.descriptionBn ?? "",
    descriptionEn: demand.descriptionEn ?? "",
    publishedAt: new Date(demand.publishedAt).toISOString().slice(0, 16),
    status: demand.status,
  });

  const [newPoint, setNewPoint] = useState<PointForm>(emptyPoint());

  async function saveDemand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    try {
      const result = await updateDemandAction({
        ...form,
        id: demand.id,
      });

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      setEditing(false);
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  async function addPoint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    try {
      const result = await addDemandPointAction(demand.id, newPoint);

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      setNewPoint(emptyPoint());
      setAddingPoint(false);
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  async function removeDemand() {
    if (
      !window.confirm(
        `Delete "${demand.titleEn}" and all ${demand.points.length} associated points? This cannot be undone.`,
      )
    ) {
      return;
    }

    setBusy(true);

    try {
      const result = await deleteDemandAction(demand.id);

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      await onRefresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
            <ClipboardList size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-base font-bold text-slate-900">
                {demand.titleBn}
              </h3>

              <span
                className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                  demand.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {demand.status === "ACTIVE" ? "PUBLISHED" : "INACTIVE"}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {demand.titleEn}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <ClipboardList size={13} />
                {demand.points.length} points
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} />
                Published: {formatDate(demand.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw size={12} />
                Updated: {formatDate(demand.updatedAt)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse demand" : "Expand demand"}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </button>
        </div>

        {(demand.descriptionBn || demand.descriptionEn) && (
          <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 md:grid-cols-2">
            {demand.descriptionBn && (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {demand.descriptionBn}
              </p>
            )}
            {demand.descriptionEn && (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {demand.descriptionEn}
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => {
              setExpanded(true);
              setEditing(!editing);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
          >
            <Pencil size={13} />
            Edit details
          </button>

          <button
            type="button"
            onClick={() => {
              setExpanded(true);
              setAddingPoint(!addingPoint);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
          >
            <Plus size={13} />
            Add point
          </button>

          <button
            type="button"
            onClick={removeDemand}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          {editing && (
            <form
              onSubmit={saveDemand}
              className="space-y-4 rounded-xl border border-slate-200 bg-white p-4"
            >
              <h4 className="text-sm font-bold text-slate-800">
                Edit demand document
              </h4>

              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="শিরোনাম (বাংলা)"
                  value={form.titleBn}
                  onChange={(value) =>
                    setForm({ ...form, titleBn: value })
                  }
                  required
                />
                <Field
                  label="Title (English)"
                  value={form.titleEn}
                  onChange={(value) =>
                    setForm({ ...form, titleEn: value })
                  }
                  required
                />
                <Field
                  label="বিবরণ (বাংলা)"
                  value={form.descriptionBn}
                  onChange={(value) =>
                    setForm({ ...form, descriptionBn: value })
                  }
                  textarea
                />
                <Field
                  label="Description (English)"
                  value={form.descriptionEn}
                  onChange={(value) =>
                    setForm({ ...form, descriptionEn: value })
                  }
                  textarea
                />
                <Field
                  label="Publication date"
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(value) =>
                    setForm({ ...form, publishedAt: value })
                  }
                  required
                />

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Publication status
                  </span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as "ACTIVE" | "INACTIVE",
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  >
                    <option value="ACTIVE">Published / Active</option>
                    <option value="INACTIVE">Inactive / Hidden</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
                >
                  {busy ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  Save changes
                </button>
              </div>
            </form>
          )}

          {addingPoint && (
            <form
              onSubmit={addPoint}
              className="space-y-4 rounded-xl border border-emerald-100 bg-white p-4"
            >
              <h4 className="text-sm font-bold text-slate-800">
                Add another demand point
              </h4>

              <PointFields
                point={newPoint}
                onChange={setNewPoint}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddingPoint(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900 disabled:opacity-60"
                >
                  {busy ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <CirclePlus size={14} />
                  )}
                  Add point
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-slate-800">
              Demand points
            </h4>
            <span className="text-xs text-slate-500">
              {demand.points.length} total
            </span>
          </div>

          {demand.points.length ? (
            <div className="space-y-3">
              {demand.points.map((point) => (
                <DemandPointCard
                  key={point.id}
                  point={point}
                  onRefresh={onRefresh}
                  notify={notify}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
              No points yet. Use “Add point” to create the first one.
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function DemandPage() {
  const [demands, setDemands] = useState<DemandDocument[]>([]);
  const [form, setForm] = useState<DemandForm>(emptyDemand);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);

  const notify = useCallback((message: string, error = false) => {
    setNotice(message);
    setNoticeError(error);
  }, []);

  const loadDemands = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getDemandsAction();

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      setDemands(result.demands as DemandDocument[]);
    } catch {
      notify("Unable to load demands. Please try again.", true);
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void loadDemands();
  }, [loadDemands]);

  async function createDemand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    try {
      const result = await createDemandAction(form);

      if (!result.success) {
        notify(result.message, true);
        return;
      }

      notify(result.message);
      setForm(emptyDemand());
      setShowCreate(false);
      await loadDemands();
    } catch {
      notify("Unable to create the demand document.", true);
    } finally {
      setSaving(false);
    }
  }

  const totalPoints = demands.reduce(
    (total, demand) => total + demand.points.length,
    0,
  );

  const activeDemands = demands.filter(
    (demand) => demand.status === "ACTIVE",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
              <ClipboardList size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Haor Rokkha Andolan
              </p>
              <h1 className="mt-0.5 text-xl font-bold tracking-tight text-slate-950">
                Demand Management
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Create, publish and manage bilingual demand documents.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadDemands()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-900"
            >
              {showCreate ? <X size={15} /> : <Plus size={15} />}
              {showCreate ? "Close form" : "Create demand"}
            </button>
          </div>
        </header>

        {/* Notification */}
        {notice && (
          <div
            role="status"
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              noticeError
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            {noticeError ? (
              <Activity size={17} className="mt-0.5 shrink-0" />
            ) : (
              <Check size={17} className="mt-0.5 shrink-0" />
            )}
            <span className="flex-1">{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Summary */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Total demand documents
              </p>
              <FileText size={17} className="text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950">
              {demands.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Active / published
              </p>
              <ShieldCheck size={17} className="text-emerald-700" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-800">
              {activeDemands}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Total demand points
              </p>
              <ClipboardList size={17} className="text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold tabular-nums text-slate-950">
              {totalPoints}
            </p>
          </div>
        </section>

        {/* Create demand */}
        {showCreate && (
          <section className="overflow-hidden rounded-xl border border-emerald-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-emerald-50/60 px-4 py-4 sm:px-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-800 text-white">
                <CirclePlus size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Create a demand document
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Add a 12-point demand, 13-point demand, or any future campaign.
                </p>
              </div>
            </div>

            <form onSubmit={createDemand} className="space-y-5 p-4 sm:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="দাবির শিরোনাম (বাংলা)"
                  value={form.titleBn}
                  onChange={(value) => setForm({ ...form, titleBn: value })}
                  placeholder="যেমন: ১২ দফা দাবি"
                  required
                />
                <Field
                  label="Demand title (English)"
                  value={form.titleEn}
                  onChange={(value) => setForm({ ...form, titleEn: value })}
                  placeholder="e.g. 12-Point Demand"
                  required
                />
                <Field
                  label="বিবরণ (বাংলা)"
                  value={form.descriptionBn}
                  onChange={(value) =>
                    setForm({ ...form, descriptionBn: value })
                  }
                  placeholder="দাবিগুলোর সংক্ষিপ্ত পরিচিতি..."
                  textarea
                />
                <Field
                  label="Description (English)"
                  value={form.descriptionEn}
                  onChange={(value) =>
                    setForm({ ...form, descriptionEn: value })
                  }
                  placeholder="A short introduction to the demands..."
                  textarea
                />
                <Field
                  label="Publication date"
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(value) =>
                    setForm({ ...form, publishedAt: value })
                  }
                  required
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Demand points
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Every point needs a heading and description in both languages.
                    </p>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    {form.points.length} points
                  </span>
                </div>

                <div className="space-y-4">
                  {form.points.map((point, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-md bg-emerald-800 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800">
                            Demand point {index + 1}
                          </h4>
                        </div>

                        {form.points.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                points: form.points.filter(
                                  (_, pointIndex) => pointIndex !== index,
                                ),
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 size={13} />
                            Remove
                          </button>
                        )}
                      </div>

                      <PointFields
                        point={point}
                        onChange={(updatedPoint) =>
                          setForm({
                            ...form,
                            points: form.points.map((existing, pointIndex) =>
                              pointIndex === index ? updatedPoint : existing,
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      points: [...form.points, emptyPoint()],
                    })
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-emerald-300 px-4 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                >
                  <Plus size={15} />
                  Add another point
                </button>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving..." : "Create demand document"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Existing demand documents */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Demand documents
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage each document and its individual points.
              </p>
            </div>

            <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500">
              {demands.length} records
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-40 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin" />
              Loading demand documents...
            </div>
          ) : demands.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <FileText size={32} className="mx-auto text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">
                No demand documents yet
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Create your first demand document to get started.
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900"
              >
                <Plus size={14} />
                Create first demand
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {demands.map((demand) => (
                <DemandCard
                  key={demand.id}
                  demand={demand}
                  onRefresh={loadDemands}
                  notify={notify}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 py-4 text-center text-[11px] text-slate-400">
          <ShieldCheck size={13} />
          Haor Rokkha Andolan · Demand Management
        </footer>
      </div>
    </main>
  );
}
