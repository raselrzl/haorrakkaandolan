import Link from "next/link";
import AuthForm from "../AuthForm";
import { forgotPasswordAction } from "../loginActions";

export default function ForgotPasswordPage() {
  return (
    <AuthForm
      title="Recover your account"
      description="Enter the email address registered to your account. We'll send a password reset link if it matches an account."
      submitLabel="Send recovery link"
      action={forgotPasswordAction}
      fields={[
        {
          name: "email",
          label: "Registered email address",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
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
