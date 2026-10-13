"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { AuthState } from "./loginActions";
import Image from "next/image";

type Mode = "login" | "register" | "forgot" | "reset";

type AuthAction = (
  previousState: AuthState,
  formData: FormData,
) => Promise<AuthState>;

type AuthFormProps = {
  initialMode: Mode;
  token?: string;
  actions: {
    login: AuthAction;
    register: AuthAction;
    forgot: AuthAction;
    reset: AuthAction;
  };
};

const modeTitles: Record<Mode, string> = {
  login: "হাওর রক্ষা আন্দোলন",
  register: "Create your account",
  forgot: "Reset your password",
  reset: "Verify your email",
};

const modeDescriptions: Record<Mode, string> = {
  login: "Sign in to continue your work with Haor Rokkha Andolan.",
  register: "Create an account to become part of our community.",
  forgot: "Enter your registered email to receive a verification code.",
  reset: "Enter your verification code and choose a new password.",
};

const fieldClass =
  "block w-full rounded-lg border border-slate-200 bg-white px-1.5 py-2 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-800/[0.07]";

function Field({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
  required = true,
  defaultValue,
  maxLength,
  inputMode,
  pattern,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  icon?: typeof UserRound;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "email" | "tel";
  pattern?: string;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold text-slate-700">{label}</span>

      <span className="relative block">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          className={`${fieldClass} ${Icon ? "pl-10" : ""} ${
            isPassword ? "pr-11" : ""
          }`}
          name={name}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          defaultValue={defaultValue}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </span>
    </label>
  );
}

function AuthPanel({
  mode,
  action,
  recoveryEmail,
  onRecoverySent,
}: {
  mode: Mode;
  action: AuthAction;
  recoveryEmail: string;
  onRecoverySent: (email: string, message: string) => void;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  useEffect(() => {
    if (mode === "forgot" && state.success && state.email) {
      onRecoverySent(state.email, state.success);
    }
  }, [mode, state.success, state.email, onRecoverySent]);

  return (
    <form action={formAction} className="space-y-2">
      {mode === "login" && (
        <>
          <Field
            name="identifier"
            label="Email or phone number"
            placeholder="Enter your email or phone"
            autoComplete="username"
            icon={Mail}
          />

          <Field
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            icon={LockKeyhole}
          />
        </>
      )}

      {mode === "register" && (
        <>
          <Field
            name="name"
            label="Full name"
            placeholder="Enter your full name"
            autoComplete="name"
            icon={UserRound}
          />

          <Field
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={Mail}
          />

          <Field
            name="phone"
            label="Phone number"
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            icon={UserRound}
          />

          <Field
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            icon={LockKeyhole}
          />

          <Field
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            icon={ShieldCheck}
          />
        </>
      )}

      {mode === "forgot" && (
        <Field
          name="email"
          label="Registered email address"
          type="email"
          placeholder="Enter your registered email"
          autoComplete="email"
          icon={Mail}
        />
      )}

      {mode === "reset" && (
        <>
          {recoveryEmail && (
            <div className="flex gap-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-800 ring-1 ring-emerald-100">
                <Mail className="h-4 w-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-emerald-950">
                  Verification email sent to
                </p>
                <p className="mt-1 break-all text-sm text-emerald-800">
                  {recoveryEmail}
                </p>
              </div>
            </div>
          )}

          <Field
            name="email"
            label="Email address"
            type="email"
            placeholder="Enter your registered email"
            autoComplete="email"
            icon={Mail}
            defaultValue={recoveryEmail}
          />

          <Field
            name="code"
            label="Six-digit verification code"
            placeholder="000000"
            autoComplete="one-time-code"
            icon={ShieldCheck}
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
          />

          <Field
            name="password"
            label="New password"
            type="password"
            placeholder="Enter a new password"
            autoComplete="new-password"
            icon={LockKeyhole}
          />

          <Field
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            icon={ShieldCheck}
          />
        </>
      )}

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-2 py-3 text-sm leading-5 text-red-700"
        >
          {state.error}
        </div>
      )}

      {state.success && mode !== "forgot" && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800"
        >
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-900/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          <>
            {
              {
                login: "Sign in to your account",
                register: "Create account",
                forgot: "Send verification code",
                reset: "Verify and update password",
              }[mode]
            }

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AuthForm({ initialMode, actions }: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(
    initialMode === "reset" ? "forgot" : initialMode,
  );

  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryNotice, setRecoveryNotice] = useState("");

  const activeAction =
    mode === "register"
      ? actions.register
      : mode === "forgot"
        ? actions.forgot
        : mode === "reset"
          ? actions.reset
          : actions.login;

  const handleRecoverySent = useCallback((email: string, message: string) => {
    setRecoveryEmail(email);
    setRecoveryNotice(message);
    setMode("reset");
  }, []);

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setRecoveryNotice("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-160">
        {/* Authentication card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_40px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-10 sm:py-7 text-center">
            {/*       <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
              {mode === "login" && <LockKeyhole className="h-5 w-5" />}
              {mode === "register" && <UserRound className="h-5 w-5" />}
              {mode === "forgot" && <Mail className="h-5 w-5" />}
              {mode === "reset" && <ShieldCheck className="h-5 w-5" />}
            </div> */}

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center overflow-hidden">
              <Image
                src="/ha2.png"
                alt="Haor Rokkha Andolan logo"
                width={48}
                height={48}
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <h1 className="text-[25px] font-bold tracking-tight text-slate-950 sm:text-2xl">
              {modeTitles[mode]}
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
              {modeDescriptions[mode]}
            </p>
          </div>

          <div className="px-6 py-6 sm:px-10 sm:py-8">
            {mode === "reset" && recoveryNotice && (
              <div
                role="status"
                className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-3 text-sm leading-5 text-emerald-800"
              >
                {recoveryNotice}
              </div>
            )}

            <AuthPanel
              key={mode}
              mode={mode}
              action={activeAction}
              recoveryEmail={recoveryEmail}
              onRecoverySent={handleRecoverySent}
            />

            <div className="mt-6 text-center text-sm">
              {mode === "login" && (
                <div className="space-y-5">
                  <button
                    type="button"
                    onClick={() => changeMode("forgot")}
                    className="font-medium text-emerald-900 transition hover:text-emerald-700"
                  >
                    Forgot your password?
                  </button>

                  <div className="relative flex items-center">
                    <div className="flex-1 border-t border-slate-100" />
                    <span className="px-3 text-xs text-slate-400">
                      New to our community?
                    </span>
                    <div className="flex-1 border-t border-slate-100" />
                  </div>

                  <button
                    type="button"
                    onClick={() => changeMode("register")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-emerald-800 hover:bg-emerald-50/50 hover:text-emerald-900"
                  >
                    Create an account
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {mode === "register" && (
                <p className="text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className="font-semibold text-emerald-900 hover:text-emerald-700"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className="inline-flex items-center gap-2 font-medium text-slate-500 transition hover:text-emerald-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </button>
              )}

              {mode === "reset" && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => changeMode("forgot")}
                    className="font-semibold text-emerald-900 hover:text-emerald-700"
                  >
                    Send another code
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick={() => changeMode("login")}
                      className="inline-flex items-center gap-2 font-medium text-slate-500 hover:text-slate-800"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to sign in
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 space-y-3 text-center">
          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-800" />
            Secure account access
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Link href="/" className="transition hover:text-emerald-900">
              Home
            </Link>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Haor Rokkha Andolan</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
