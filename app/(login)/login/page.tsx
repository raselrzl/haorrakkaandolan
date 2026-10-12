
import { Suspense } from "react";
import { getCurrentUser } from "@/app/utils/auth";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import {
  loginAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordAction,
} from "./loginActions";

type Mode = "login" | "register" | "forgot" | "reset";

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    token?: string;
  }>;
};

const allowedModes: Mode[] = ["login", "register", "forgot", "reset"];

function isMode(value: string): value is Mode {
  return allowedModes.includes(value as Mode);
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md animate-pulse rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-6 h-12 w-12 rounded-xl bg-slate-200" />
        <div className="mx-auto mb-3 h-6 w-48 rounded bg-slate-200" />
        <div className="mx-auto mb-8 h-4 w-64 max-w-full rounded bg-slate-100" />
        <div className="mb-4 h-11 rounded-lg bg-slate-100" />
        <div className="mb-6 h-11 rounded-lg bg-slate-100" />
        <div className="h-11 rounded-lg bg-emerald-100" />
        <p className="mt-5 text-center text-xs text-slate-400">
          Loading secure account access...
        </p>
      </div>
    </main>
  );
}

async function LoginContent({ searchParams }: LoginPageProps) {
  const [user, params] = await Promise.all([
    getCurrentUser(),
    searchParams,
  ]);

  if (user) {
    redirect(user.role === "ADMIN" ? "/dashboard" : "/account");
  }

  const token = params.token ?? "";
  const requestedMode = token ? "reset" : params.mode ?? "login";

  const initialMode: Mode = isMode(requestedMode)
    ? requestedMode
    : "login";

  return (
    <AuthForm
      initialMode={initialMode}
      token={token}
      actions={{
        login: loginAction,
        register: registerAction,
        forgot: forgotPasswordAction,
        reset: resetPasswordAction,
      }}
    />
  );
}

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent searchParams={props.searchParams} />
    </Suspense>
  );
}
