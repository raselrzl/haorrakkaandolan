"use client";

import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  ImagePlus,
  KeyRound,
  LoaderCircle,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  Upload,
  X,
} from "lucide-react";

import { UploadButton } from "@/app/utils/uploadthing";

import {
  changeMyAccountPasswordAction,
  getMyAccountAction,
  updateMyAccountAction,
  updateMyProfileImageAction,
  type MyAccountData,
} from "./myaccountActions";

type Notice = {
  type: "success" | "error";
  message: string;
};

const inputClass =
  "mt-1.5 block w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-50";

const labelClass = "text-sm font-medium text-slate-700";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "A"
  );
}

function NoticeBanner({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const success = notice.type === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {success ? (
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
      ) : (
        <AlertCircle size={18} className="mt-0.5 shrink-0" />
      )}

      <p className="flex-1">{notice.message}</p>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="rounded p-0.5 opacity-70 transition hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={`block ${labelClass}`}>
      {label}

      <span className="relative block">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className={`${inputClass} pr-11`}
          required
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );
}

export default function MyAccountPage() {
  const [account, setAccount] = useState<MyAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profileNotice, setProfileNotice] = useState<Notice | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<Notice | null>(null);

  const [isSavingProfile, startProfileTransition] = useTransition();
  const [isSavingPassword, startPasswordTransition] = useTransition();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadAccount = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getMyAccountAction();

      if (!result.success || !result.account) {
        setProfileNotice({
          type: "error",
          message: result.message || "Unable to load your account.",
        });
        return;
      }

      const data = result.account;

      setAccount(data);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setDesignation(data.designation ?? "");
      setImageUrl(data.imageUrl ?? "");
      setProfileNotice(null);
    } catch {
      setProfileNotice({
        type: "error",
        message: "Unable to load your account. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileNotice(null);

    startProfileTransition(async () => {
      try {
        const result = await updateMyAccountAction({
          name,
          email,
          phone,
          designation,
          imageUrl,
        });

        setProfileNotice({
          type: result.success ? "success" : "error",
          message: result.message,
        });

        if (result.success) {
          await loadAccount();
        }
      } catch {
        setProfileNotice({
          type: "error",
          message: "Unable to save your details. Please try again.",
        });
      }
    });
  }

  async function handlePhotoUploaded(
    results: { url?: string; ufsUrl?: string }[] | undefined,
  ) {
    const uploadedUrl = results?.[0]?.ufsUrl || results?.[0]?.url;

    if (!uploadedUrl) {
      setProfileNotice({
        type: "error",
        message: "Upload finished, but no image URL was returned.",
      });
      return;
    }

    setProfileNotice(null);

    try {
      const result = await updateMyProfileImageAction(uploadedUrl);

      if (!result.success) {
        setProfileNotice({
          type: "error",
          message: result.message,
        });
        return;
      }

      setImageUrl(uploadedUrl);
      setAccount((current) =>
        current ? { ...current, imageUrl: uploadedUrl } : current,
      );

      setProfileNotice({
        type: "success",
        message: result.message,
      });
    } catch {
      setProfileNotice({
        type: "error",
        message: "The photo uploaded, but could not be saved to your account.",
      });
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordNotice(null);

    if (newPassword !== confirmPassword) {
      setPasswordNotice({
        type: "error",
        message: "The new password and confirmation do not match.",
      });
      return;
    }

    startPasswordTransition(async () => {
      try {
        const result = await changeMyAccountPasswordAction({
          currentPassword,
          newPassword,
          confirmPassword,
        });

        setPasswordNotice({
          type: result.success ? "success" : "error",
          message: result.message,
        });

        if (result.success) {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch {
        setPasswordNotice({
          type: "error",
          message: "Unable to change your password. Please try again.",
        });
      }
    });
  }

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-6xl p-4 sm:p-6">
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <LoaderCircle size={20} className="animate-spin text-emerald-700" />
            Loading account details...
          </div>
        </div>
      </main>
    );
  }

  if (!account) {
    return (
      <main className="mx-auto w-full max-w-6xl space-y-4 p-4 sm:p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertCircle size={22} />
          </div>

          <h1 className="text-xl font-semibold text-slate-900">
            Account unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your account details could not be loaded.
          </p>

          {profileNotice && (
            <div className="mt-4">
              <NoticeBanner
                notice={profileNotice}
                onDismiss={() => setProfileNotice(null)}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => void loadAccount()}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  const statusIsActive = account.status === "ACTIVE";

  return (
    <main className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
            <ShieldCheck size={15} />
            Administration
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            My Account
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your administrator profile and security settings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAccount()}
          disabled={loading || uploadingPhoto}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-60"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      {profileNotice && (
        <NoticeBanner
          notice={profileNotice}
          onDismiss={() => setProfileNotice(null)}
        />
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-1.5 bg-emerald-800" />

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-emerald-50 text-2xl font-semibold text-emerald-900">
            {account.imageUrl ? (
              <Image
                key={account.imageUrl}
                src={account.imageUrl}
                alt={`${account.name}'s profile`}
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              getInitials(account.name)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="wrap-break-words text-xl font-semibold text-slate-900">
              {account.name}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-500">
              {account.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck size={14} />
                {account.role.replaceAll("_", " ")}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                  statusIsActive
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    statusIsActive ? "bg-emerald-600" : "bg-slate-400"
                  }`}
                />
                {account.status}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:min-w-44">
            <p className="text-xs font-medium text-slate-500">Member since</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(account.createdAt)}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
              <UserRound size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Profile information
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Update your details and profile photo.
              </p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Full name <span className="text-red-500">*</span>
                <span className="relative block">
                  <UserRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    maxLength={120}
                    required
                    className={`${inputClass} pl-9`}
                    placeholder="Your full name"
                  />
                </span>
              </label>

              <label className={labelClass}>
                Email address <span className="text-red-500">*</span>
                <span className="relative block">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    maxLength={254}
                    required
                    className={`${inputClass} pl-9`}
                    placeholder="admin@example.com"
                  />
                </span>
              </label>

              <label className={labelClass}>
                Phone number <span className="text-red-500">*</span>
                <span className="relative block">
                  <Phone
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    autoComplete="tel"
                    maxLength={30}
                    required
                    className={`${inputClass} pl-9`}
                    placeholder="Your phone number"
                  />
                </span>
              </label>

              <label className={labelClass}>
                Designation
                <input
                  value={designation}
                  onChange={(event) => setDesignation(event.target.value)}
                  maxLength={120}
                  className={inputClass}
                  placeholder="e.g. Administrator"
                />
              </label>
            </div>

            {/* UploadThing profile photo upload */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200">
                  <ImagePlus size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Profile photo
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Upload an image from your device. JPG, PNG, or WebP is
                    recommended.
                  </p>

                  <div className="mt-3">
                    <UploadButton
                      endpoint="imageUploader"
                      onUploadBegin={() => {
                        setUploadingPhoto(true);
                        setProfileNotice(null);
                      }}
                      onClientUploadComplete={handlePhotoUploaded}
                      onUploadError={(error) => {
                        setUploadingPhoto(false);
                        setProfileNotice({
                          type: "error",
                          message:
                            error.message || "Profile photo upload failed.",
                        });
                      }}
                      appearance={{
                        container:
                          "flex flex-col items-center gap-1.5 text-center",
                        button:
                          "ut-ready:bg-emerald-800 ut-ready:hover:bg-emerald-900 ut-uploading:cursor-not-allowed inline-flex h-10 items-center justify-center rounded-md border border-emerald-800 bg-emerald-800 px-4 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-60",
                        allowedContent:
                          "w-full text-center text-xs text-slate-500",
                      }}
                      content={{
                        button: uploadingPhoto
                          ? "Uploading..."
                          : "Upload photo",
                      }}
                    />
                  </div>

                  {uploadingPhoto && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-emerald-800">
                      <LoaderCircle size={14} className="animate-spin" />
                      Uploading and saving your profile photo...
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    Your photo is saved to your account automatically after a
                    successful upload.
                  </p>
                </div>
              </div>
            </div>

            {/*          <label className={labelClass}>
              Or enter a profile image URL
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className={inputClass}
                placeholder="https://example.com/profile.jpg"
              />
              <span className="mt-1.5 block text-xs font-normal text-slate-500">
                If you change this URL manually, click Save profile to save it.
              </span>
            </label> */}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setName(account.name);
                  setEmail(account.email);
                  setPhone(account.phone);
                  setDesignation(account.designation ?? "");
                  setImageUrl(account.imageUrl ?? "");
                  setProfileNotice(null);
                }}
                disabled={isSavingProfile || uploadingPhoto}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <X size={16} />
                Discard changes
              </button>

              <button
                type="submit"
                disabled={isSavingProfile || uploadingPhoto}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingProfile ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSavingProfile ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-800">
                <Fingerprint size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Account details
                </h2>
                <p className="text-xs text-slate-500">
                  Your access information
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 px-5">
              <div className="flex items-start justify-between gap-3 py-3.5">
                <span className="text-sm text-slate-500">Account role</span>
                <span className="text-right text-sm font-semibold text-slate-800">
                  {account.role.replaceAll("_", " ")}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 py-3.5">
                <span className="text-sm text-slate-500">Status</span>
                <span
                  className={`text-right text-sm font-semibold ${
                    statusIsActive ? "text-emerald-700" : "text-slate-600"
                  }`}
                >
                  {account.status}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 py-3.5">
                <span className="text-sm text-slate-500">Start date</span>
                <span className="text-right text-sm font-medium text-slate-800">
                  {formatDate(account.startDate)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 py-3.5">
                <span className="text-sm text-slate-500">End date</span>
                <span className="text-right text-sm font-medium text-slate-800">
                  {formatDate(account.endDate)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3 py-3.5">
                <span className="text-sm text-slate-500">Last updated</span>
                <span className="text-right text-sm font-medium text-slate-800">
                  {formatDate(account.updatedAt)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 border-t border-slate-100 bg-slate-50 p-4">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-emerald-800"
              />
              <p className="text-xs leading-5 text-slate-600">
                Role, status, and account dates are managed separately and
                cannot be changed from this page.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                <KeyRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Change password
                </h2>
                <p className="text-xs text-slate-500">
                  Keep your administrator account secure.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 p-5">
              {passwordNotice && (
                <NoticeBanner
                  notice={passwordNotice}
                  onDismiss={() => setPasswordNotice(null)}
                />
              )}

              <PasswordField
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                autoComplete="current-password"
              />

              <PasswordField
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                autoComplete="new-password"
              />

              <p className="-mt-2 text-xs font-normal text-slate-500">
                Use at least 8 characters.
              </p>

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={isSavingPassword}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingPassword ? (
                  <LoaderCircle size={16} className="animate-spin" />
                ) : (
                  <KeyRound size={16} />
                )}
                {isSavingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>

      <footer className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <Activity size={14} />
        <span>Account created {formatDate(account.createdAt)}</span>
        <span className="text-slate-300">·</span>
        <CalendarDays size={14} />
        <span>Administrator profile</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <Upload size={13} />
          UploadThing
        </span>
      </footer>
    </main>
  );
}
