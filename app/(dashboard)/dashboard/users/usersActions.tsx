"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

export type EditableRole = "ADMIN" | "USER";
export type EditableStatus = "ACTIVE" | "INACTIVE";

type ActionResult = {
  success: boolean;
  message: string;
};

async function authorizeAdmin() {
  const admin = await requireAdmin();

  if (!admin || admin.status !== "ACTIVE") {
    throw new Error("An active administrator account is required.");
  }

  return admin;
}

function isEditableRole(role: string): role is EditableRole {
  return role === "ADMIN" || role === "USER";
}

function isEditableStatus(status: string): status is EditableStatus {
  return status === "ACTIVE" || status === "INACTIVE";
}

export async function getAllUsersAction() {
  await authorizeAdmin();

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "USER"],
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      designation: true,
      imageUrl: true,
      startDate: true,
      endDate: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map((user) => ({
    ...user,
    role: user.role as EditableRole,
    designation: user.designation as string | null,
    status: user.status as EditableStatus,
  }));
}

export async function updateUserRoleAction(
  userId: string,
  role: EditableRole,
): Promise<ActionResult> {
  const admin = await authorizeAdmin();

  if (!userId?.trim()) {
    return { success: false, message: "User ID is required." };
  }

  if (!isEditableRole(role)) {
    return { success: false, message: "Invalid role selected." };
  }

  if (admin.id === userId) {
    return {
      success: false,
      message: "You cannot change your own role.",
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) {
    return { success: false, message: "User not found." };
  }

  if (!isEditableRole(targetUser.role)) {
    return {
      success: false,
      message: "Only Admin and User accounts can be managed here.",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/dashboard/users");

  return { success: true, message: "User role updated successfully." };
}

export async function updateUserStatusAction(
  userId: string,
  status: EditableStatus,
): Promise<ActionResult> {
  const admin = await authorizeAdmin();

  if (!userId?.trim()) {
    return { success: false, message: "User ID is required." };
  }

  if (!isEditableStatus(status)) {
    return { success: false, message: "Invalid account status." };
  }

  if (admin.id === userId && status !== "ACTIVE") {
    return {
      success: false,
      message: "You cannot deactivate your own account.",
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) {
    return { success: false, message: "User not found." };
  }

  if (!isEditableRole(targetUser.role)) {
    return {
      success: false,
      message: "Only Admin and User accounts can be managed here.",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  revalidatePath("/dashboard/users");

  return { success: true, message: "Account status updated successfully." };
}

export async function updateUserImageAction(
  userId: string,
  imageUrl: string | null,
): Promise<ActionResult> {
  const admin = await authorizeAdmin();

  if (!userId?.trim()) {
    return { success: false, message: "User ID is required." };
  }

  if (admin.id === userId) {
    // Profile image changes are allowed for the current admin.
    // This check intentionally does not prevent editing the admin's image.
  }

  if (imageUrl !== null) {
    try {
      const parsedUrl = new URL(imageUrl);

      if (parsedUrl.protocol !== "https:") {
        return {
          success: false,
          message: "Profile image URL must use HTTPS.",
        };
      }
    } catch {
      return {
        success: false,
        message: "Please provide a valid profile image URL.",
      };
    }
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!targetUser) {
    return { success: false, message: "User not found." };
  }

  if (!isEditableRole(targetUser.role)) {
    return {
      success: false,
      message: "Only Admin and User accounts can be managed here.",
    };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { imageUrl },
  });

  revalidatePath("/dashboard/users");

  return {
    success: true,
    message:
      imageUrl === null
        ? "Profile image removed successfully."
        : "Profile image updated successfully.",
  };
}