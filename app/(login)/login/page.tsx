import { getCurrentUser } from "@/app/utils/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import { loginAction } from "./loginActions";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(user.role === "ADMIN" ? "/dashboard" : "/account");
  }

  return (
    <AuthForm
      title="Welcome back"
      description="Sign in using your email address or phone number."
      submitLabel="Sign in"
      action={loginAction}
      fields={[
        {
          name: "identifier",
          label: "Email or phone number",
          placeholder: "Enter email or phone",
          autoComplete: "username",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "current-password",
        },
      ]}
      footer={
        <div className="space-y-3">
          <p>
            <Link
              href="/forgot-password"
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Forgot password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Create account
            </Link>
          </p>
        </div>
      }
    />
  );
}
