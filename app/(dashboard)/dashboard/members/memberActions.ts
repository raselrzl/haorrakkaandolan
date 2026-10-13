"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import bcrypt from "bcryptjs";

type MemberStatus = "ACTIVE" | "INACTIVE";

type MemberInput = {
  name: string;
  email: string;
  phone: string;
  password?: string;
  designation?: string | null;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
};

type UpdateMemberInput = MemberInput & {
  id: string;
};

type StatusInput = {
  id: string;
  status: MemberStatus;
};

type IdInput = {
  id: string;
};

type MemberResult = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string | null;
  imageUrl: string | null;
  status: MemberStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
};

type ActionResult<T = never> = {
  success: boolean;
  message?: string;
} & ([T] extends [never] ? { member?: never } : { member?: T });

/**
 * Verify the logged-in administrator.
 *
 * This assumes your Session model uses the "session" cookie.
 * Change the cookie name if your existing login system uses another one.
 */

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("hra_session")?.value;

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (
    session.user.status !== "ACTIVE" ||
    session.user.role !== "ADMIN"
  ) {
    throw new Error("You are not authorized to manage members.");
  }

  return session.user;
}


/**
 * Validate and normalize member input.
 */
function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;

  const text = cleanText(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error("Invalid date format.");
  }

  const date = new Date(`${text}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== text
  ) {
    throw new Error("Please enter a valid date.");
  }

  return date;
}

function validateMemberInput(input: MemberInput) {
  const name = cleanText(input.name);
  const email = cleanText(input.email).toLowerCase();
  const phone = cleanText(input.phone);
  const designation = cleanText(input.designation) || "General Member";
  const imageUrl = cleanText(input.imageUrl) || null;
  const startDate = parseOptionalDate(input.startDate);
  const endDate = parseOptionalDate(input.endDate);

  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Please enter a valid email address.");
  }

  if (phone.length < 5 || phone.length > 30) {
    throw new Error("Please enter a valid phone number.");
  }

  if (designation.length > 100) {
    throw new Error("Designation must be 100 characters or fewer.");
  }

  if (imageUrl) {
    try {
      const url = new URL(imageUrl);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error();
      }
    } catch {
      throw new Error("Please enter a valid HTTP or HTTPS image URL.");
    }
  }

  if (startDate && endDate && endDate < startDate) {
    throw new Error("End date cannot be earlier than the start date.");
  }

  return {
    name,
    email,
    phone,
    designation,
    imageUrl,
    startDate,
    endDate,
  };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (
      error.message.includes("Unique constraint") ||
      error.message.includes("P2002")
    ) {
      return "That email address or phone number is already registered.";
    }

    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

function refreshMembersPage() {
  revalidatePath("/members");
}

/**
 * GET MEMBERS
 */
export async function getMembersAction(): Promise<MemberResult[]> {
  await requireAdmin();

  return prisma.user.findMany({
    where: { role: "MEMBER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      imageUrl: true,
      status: true,
      startDate: true,
      endDate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * CREATE MEMBER
 */
export async function createMemberAction(
  input: MemberInput & { role?: string }
): Promise<ActionResult<MemberResult>> {
  try {
    await requireAdmin();

    const data = validateMemberInput(input);
    const password = cleanText(input.password);

    if (password.length < 8 || password.length > 128) {
      return {
        success: false,
        message: "Password must be between 8 and 128 characters.",
      };
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
      select: { id: true },
    });

    if (existing) {
      return {
        success: false,
        message: "That email address or phone number is already registered.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const member = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: "MEMBER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        imageUrl: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    refreshMembersPage();

    return {
      success: true,
      message: "Member created successfully.",
      member,
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
}

/**
 * UPDATE MEMBER
 */
export async function updateMemberAction(
  input: UpdateMemberInput
): Promise<ActionResult<MemberResult>> {
  try {
    await requireAdmin();

    const id = cleanText(input.id);

    if (!id) {
      return { success: false, message: "Member ID is required." };
    }

    const data = validateMemberInput(input);

    const existingMember = await prisma.user.findFirst({
      where: { id, role: "MEMBER" },
      select: { id: true },
    });

    if (!existingMember) {
      return { success: false, message: "Member not found." };
    }

    const duplicate = await prisma.user.findFirst({
      where: {
        id: { not: id },
        OR: [{ email: data.email }, { phone: data.phone }],
      },
      select: { id: true },
    });

    if (duplicate) {
      return {
        success: false,
        message: "That email address or phone number is already registered.",
      };
    }

    const member = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        imageUrl: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
      },
    });

    refreshMembersPage();

    return {
      success: true,
      message: "Member updated successfully.",
      member,
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
}

/**
 * ACTIVATE / DEACTIVATE MEMBER
 */
export async function toggleMemberStatusAction(
  input: StatusInput
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const id = cleanText(input.id);
    const status = input.status;

    if (!id) {
      return { success: false, message: "Member ID is required." };
    }

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return { success: false, message: "Invalid member status." };
    }

    const result = await prisma.user.updateMany({
      where: { id, role: "MEMBER" },
      data: { status },
    });

    if (result.count === 0) {
      return { success: false, message: "Member not found." };
    }

    refreshMembersPage();

    return {
      success: true,
      message:
        status === "ACTIVE"
          ? "Member activated successfully."
          : "Member deactivated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
}

/**
 * DELETE MEMBER
 *
 * Members with authored news cannot be deleted, preventing the
 * cascade relation from removing their news and activity records.
 */
export async function deleteMemberAction(
  input: IdInput
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const id = cleanText(input.id);

    if (!id) {
      return { success: false, message: "Member ID is required." };
    }

    const member = await prisma.user.findFirst({
      where: { id, role: "MEMBER" },
      select: {
        id: true,
        _count: {
          select: { news: true },
        },
      },
    });

    if (!member) {
      return { success: false, message: "Member not found." };
    }

    if (member._count.news > 0) {
      return {
        success: false,
        message:
          "This member has authored news or activities. Deactivate the member instead to preserve those records.",
      };
    }

    await prisma.user.delete({
      where: { id: member.id },
    });

    refreshMembersPage();

    return {
      success: true,
      message: "Member deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: errorMessage(error),
    };
  }
}