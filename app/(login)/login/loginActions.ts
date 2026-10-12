
"use server";

import "server-only";

import bcrypt from "bcryptjs";
import { createHash, randomInt } from "node:crypto";
import { redirect } from "next/navigation";

import { prisma } from "@/app/utils/db";
import { createSession, destroySession } from "@/app/utils/auth";
import { sendPasswordResetCodeEmail } from "@/app/utils/mail";

export type AuthState = {
  error?: string;
  success?: string;
  email?: string;
};

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
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

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

// -----------------------------------------------------------------------------
// LOGIN
// -----------------------------------------------------------------------------

export async function loginAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return {
      error: "Enter your email or phone number and password.",
    };
  }

  const normalizedIdentifier = identifier.toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedIdentifier },
        { phone: identifier },
      ],
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

// -----------------------------------------------------------------------------
// REGISTRATION
// -----------------------------------------------------------------------------

export async function registerAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

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
    if (isPrismaUniqueError(error)) {
      return {
        error: "That email address or phone number is already registered.",
      };
    }

    throw error;
  }

  await createSession(user.id);

  redirect("/account");
}

// -----------------------------------------------------------------------------
// LOGOUT
// -----------------------------------------------------------------------------

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

// -----------------------------------------------------------------------------
// REQUEST A PASSWORD RESET CODE
// -----------------------------------------------------------------------------

export async function forgotPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!validEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  // Do not reveal whether an account exists.
  const genericMessage =
    "If an active account uses this email, a verification code has been sent. Check your inbox.";

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !isAccountActive(user)) {
    return {
      success: genericMessage,
      email,
    };
  }

  // Generate a cryptographically secure six-digit code.
  const code = randomInt(0, 1_000_000)
    .toString()
    .padStart(6, "0");

  // Bind the code to this email and store only its hash.
  const tokenHash = hashToken(`${email}:${code}`);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  // Invalidate previously issued recovery codes.
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

  try {
    await sendPasswordResetCodeEmail(email, code);
  } catch {
    // Remove the code if email delivery fails.
    await prisma.passwordResetToken.deleteMany({
      where: { tokenHash },
    });

    return {
      error: "The recovery email could not be sent. Please try again later.",
    };
  }

  return {
    success: genericMessage,
    email,
  };
}

// -----------------------------------------------------------------------------
// VERIFY CODE AND UPDATE PASSWORD
// -----------------------------------------------------------------------------

export async function resetPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const code = String(formData.get("code") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

  if (!validEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      error: "Enter the six-digit verification code from your email.",
    };
  }

  if (!passwordIsValid(password)) {
    return {
      error: "Password must be between 8 and 128 characters.",
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const tokenHash = hashToken(`${email}:${code}`);

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetRecord || resetRecord.expiresAt <= new Date()) {
    if (resetRecord) {
      await prisma.passwordResetToken.deleteMany({
        where: { id: resetRecord.id },
      });
    }

    return {
      error: "The verification code is invalid or has expired. Request a new code.",
    };
  }

  if (
    resetRecord.user.email.toLowerCase() !== email ||
    !isAccountActive(resetRecord.user)
  ) {
    return {
      error: "The verification code is invalid or has expired. Request a new code.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Atomically consume the code, change the password, and invalidate sessions.
  const updated = await prisma.$transaction(async (tx) => {
    const consumed = await tx.passwordResetToken.deleteMany({
      where: {
        id: resetRecord.id,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (consumed.count !== 1) {
      return false;
    }

    await tx.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    await tx.passwordResetToken.deleteMany({
      where: { userId: resetRecord.userId },
    });

    await tx.session.deleteMany({
      where: { userId: resetRecord.userId },
    });

    return true;
  });

  if (!updated) {
    return {
      error: "The verification code is invalid or has expired. Request a new code.",
    };
  }

  // Clear the current browser session cookie too.
  await destroySession();

  redirect("/login?reset=success");
}
