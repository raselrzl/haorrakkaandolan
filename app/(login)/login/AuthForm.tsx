
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

type Mode = "login" | "register" | "forgot" | "reset";

type AuthAction = (
  previousState: AuthState,
  formData: FormData
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
  login: "Welcome back",
  register: "Create your account",
  forgot: "Forgot your password?",
  reset: "Verify your email",
};

const modeDescriptions: Record<Mode, string> = {
  login: "Sign in to access your account.",
  register: "Enter your details to get started.",
  forgot: "Enter your registered email to receive a verification code.",
  reset: "Enter your six-digit code and choose a new password.",
};

const fieldClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10";

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
      <span className="text-sm font-semibold text-slate-700">
        {label}
      </span>

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
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
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
    {}
  );

  useEffect(() => {
    if (mode === "forgot" && state.success && state.email) {
      onRecoverySent(state.email, state.success);
    }
  }, [mode, state.success, state.email, onRecoverySent]);

  return (
    <form action={formAction} className="space-y-4">
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
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-900">
              <p className="font-semibold">Verification code sent to</p>
              <p className="mt-1 break-all">{recoveryEmail}</p>
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
            placeholder="Enter the code from your email"
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
          className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      {state.success && mode !== "forgot" && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800"
        >
          {state.success}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-700/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : (
          <>
            {{
              login: "Sign in",
              register: "Create account",
              forgot: "Send verification code",
              reset: "Verify code and update password",
            }[mode]}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AuthForm({
  initialMode,
  actions,
}: AuthFormProps) {
  const [mode, setMode] = useState<Mode>(
    initialMode === "reset" ? "forgot" : initialMode
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

  const handleRecoverySent = useCallback(
    (email: string, message: string) => {
      setRecoveryEmail(email);
      setRecoveryNotice(message);
      setMode("reset");
    },
    []
  );

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setRecoveryNotice("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.09),_transparent_55%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-lg shadow-emerald-900/15">
              <KeyRound className="h-6 w-6" />
            </span>

            <span className="text-left">
              <span className="block text-xl font-bold tracking-tight text-slate-900">
                Haor Rokkha Andolan
              </span>

              <span className="mt-0.5 block text-xs font-medium tracking-wide text-slate-500">
                ACCOUNT ACCESS
              </span>
            </span>
          </Link>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.06]">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {modeTitles[mode]}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {modeDescriptions[mode]}
            </p>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-7">
            {mode === "reset" && recoveryNotice && (
              <div
                role="status"
                className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800"
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

            <div className="mt-5 space-y-4 text-center text-sm">
              {mode === "login" && (
                <>
                  <button
                    type="button"
                    onClick={() => changeMode("forgot")}
                    className="font-semibold text-emerald-800 transition hover:text-emerald-950"
                  >
                    Forgot your password?
                  </button>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-slate-600">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => changeMode("register")}
                        className="font-semibold text-emerald-800 hover:text-emerald-950"
                      >
                        Create account
                      </button>
                    </p>
                  </div>
                </>
              )}

              {mode === "register" && (
                <p className="text-slate-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className="font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className="inline-flex items-center gap-2 font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </button>
              )}

              {mode === "reset" && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => changeMode("forgot")}
                    className="font-semibold text-emerald-800 hover:text-emerald-950"
                  >
                    Send another code
                  </button>

                  <div>
                    <button
                      type="button"
                      onClick={() => changeMode("login")}
                      className="inline-flex items-center gap-2 font-semibold text-slate-500 hover:text-slate-800"
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

        <footer className="mt-6 space-y-2 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            Secure account access
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Haor Rokkha Andolan
          </p>
        </footer>
      </div>
    </main>
  );
}
