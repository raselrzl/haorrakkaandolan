"use server";

import "server-only";

import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/app/utils/db";
import { createSession, destroySession } from "@/app/utils/auth";
import { sendPasswordResetEmail } from "@/app/utils/mail";

export type AuthState = {
  error?: string;
  success?: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value: string) {
  return /^[+()\d\s-]{7,20}$/.test(value);
}

function passwordIsValid(password: string) {
  return password.length >= 8 && password.length <= 128;
}

function isAccountActive(user: {
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}) {
  const now = new Date();

  return (
    user.status === "ACTIVE" &&
    (!user.startDate || user.startDate <= now) &&
    (!user.endDate || user.endDate >= now)
  );
}

export async function loginAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const identifier = String(formData.get("identifier") ?? "").trim();

  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Enter your email or phone number and password." };
  }

  const normalizedIdentifier = identifier.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedIdentifier }, { phone: identifier }],
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid login credentials." };
  }

  if (!isAccountActive(user)) {
    return {
      error: "Your account is inactive or outside its authorized dates.",
    };
  }

  await createSession(user.id);

  if (user.role === "ADMIN") {
    redirect("/dashboard");
  }

  redirect("/account");
}

export async function registerAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const rawEmail = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const email = normalizeEmail(rawEmail);

  if (name.length < 2 || name.length > 100) {
    return {
      error: "Enter a name between 2 and 100 characters.",
    };
  }

  if (!email || !phone) {
    return {
      error: "Email address and phone number are both required.",
    };
  }

  if (!validEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (!validPhone(phone)) {
    return { error: "Enter a valid phone number." };
  }

  if (!passwordIsValid(password)) {
    return {
      error: "Password must be between 8 and 128 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const duplicate = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
    select: { id: true },
  });

  if (duplicate) {
    return {
      error: "That email address or phone number is already registered.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  let user;

  try {
    user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "USER",
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        error: "That email address or phone number is already registered.",
      };
    }

    throw error;
  }

  await createSession(user.id);
  redirect("/account");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function forgotPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!validEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  // Return the same message regardless of whether the email exists.
  const genericMessage =
    "If an account with that email exists, a password reset link will be sent.";

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !isAccountActive(user)) {
    return { success: genericMessage };
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  // Replace previous reset links for this user.
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  const baseUrl = process.env.APP_URL;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured.");
  }

  const resetUrl = new URL("/reset-password", baseUrl);
  resetUrl.searchParams.set("token", rawToken);

  try {
    await sendPasswordResetEmail(email, resetUrl.toString());
  } catch {
    // Avoid leaving a usable token behind if email delivery fails.
    await prisma.passwordResetToken.deleteMany({
      where: { tokenHash },
    });

    return {
      error: "The recovery email could not be sent. Please try again later.",
    };
  }

  return { success: genericMessage };
}

export async function resetPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!/^[a-f0-9]{64}$/.test(token)) {
    return { error: "This reset link is invalid or has expired." };
  }

  if (!passwordIsValid(password)) {
    return { error: "Password must be between 8 and 128 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const tokenHash = hashToken(token);

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!resetRecord || resetRecord.expiresAt <= new Date()) {
    if (resetRecord) {
      await prisma.passwordResetToken.deleteMany({
        where: { id: resetRecord.id },
      });
    }

    return { error: "This reset link is invalid or has expired." };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma
    .$transaction(async (tx) => {
      // Recheck the token inside the transaction before changing credentials.
      const currentToken = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });

      if (!currentToken || currentToken.expiresAt <= new Date()) {
        throw new Error("RESET_TOKEN_EXPIRED");
      }

      await tx.user.update({
        where: { id: currentToken.userId },
        data: { password: hashedPassword },
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId: currentToken.userId },
      });

      // Invalidate every active session after a password reset.
      await tx.session.deleteMany({
        where: { userId: currentToken.userId },
      });
    })
    .catch((error: unknown) => {
      if (error instanceof Error && error.message === "RESET_TOKEN_EXPIRED") {
        return;
      }

      throw error;
    });

  // If the token expired during the transaction, the update did not happen.
  const stillExists = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (stillExists) {
    return { error: "This reset link is invalid or has expired." };
  }

  // Avoid leaving the browser logged in after a credential change.
  await destroySession();

  redirect("/login?reset=success");
}
