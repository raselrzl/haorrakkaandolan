import Link from "next/link";
import AuthForm from "../AuthForm";
import { resetPasswordAction } from "../loginActions";

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return (
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl">
        <h1 className="text-xl font-bold text-slate-900">
          Invalid recovery link
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          This link is invalid. Request a new password recovery email.
        </p>
        <Link
          href="/forgot-password"
          className="mt-5 inline-block font-semibold text-emerald-700"
        >
          Request another link
        </Link>
      </section>
    );
  }

  return (
    <AuthForm
      title="Set a new password"
      description="Choose a new password for your account."
      submitLabel="Update password"
      action={resetPasswordAction}
      hiddenFields={{ token }}
      fields={[
        {
          name: "password",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
        },
        {
          name: "confirmPassword",
          label: "Confirm new password",
          type: "password",
          autoComplete: "new-password",
        },
      ]}
      footer={
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-900"
        >
          Back to login
        </Link>
      }
    />
  );
}
