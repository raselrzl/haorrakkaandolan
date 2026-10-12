"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { AuthState } from "./loginActions";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

type AuthFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  fields: Field[];
  action: (previousState: AuthState, formData: FormData) => Promise<AuthState>;
  footer?: ReactNode;
  hiddenFields?: Record<string, string>;
  initialState?: AuthState;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait..." : label}
    </button>
  );
}

export default function AuthForm({
  title,
  description,
  submitLabel,
  fields,
  action,
  footer,
  hiddenFields,
  initialState,
}: AuthFormProps) {
  const [state, formAction] = useActionState<AuthState, FormData>(
    action,
    initialState ?? {},
  );

  return (
    <section className="w-full max-w-md">
      <div className="mb-7 text-center">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 font-bold text-emerald-800"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-lg text-white">
            H
          </span>
          <span>Haor Rokkha Andolan</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <form
        action={formAction}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-emerald-950/5 sm:p-7"
      >
        {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}

        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              {field.label}
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              required={field.required ?? true}
              maxLength={field.type === "password" ? 128 : undefined}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </div>
        ))}

        {state.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        {state.success && (
          <p
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800"
          >
            {state.success}
          </p>
        )}

        <SubmitButton label={submitLabel} />

        {footer && (
          <div className="pt-1 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </form>

      <p className="mt-5 text-center text-xs text-slate-500">
        Secure account access
      </p>
    </section>
  );
}
