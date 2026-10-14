"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

type EditableRole = "ADMIN" | "USER" | "MEMBER" | "CHAIRMAN";
type EditableStatus = "ACTIVE" | "INACTIVE";

type UserActionResult = {
  success: boolean;
  message: string;
};

type GetUsersResult = {
  success: boolean;
  users: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: EditableRole;
    status: EditableStatus;
    designation: string | null;
    imageUrl: string | null;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  message: string;
};

/**
 * Verify that the current user is an active administrator.
 */
async function authorizeAdmin() {
  const admin = await requireAdmin();

  if (admin.status !== "ACTIVE") {
    throw new Error("Your administrator account is inactive.");
  }

  return admin;
}

/**
 * Get all users.
 * Only active administrators can access the complete user list.
 */
export async function getAllUsersAction(): Promise<GetUsersResult> {
  try {
    await authorizeAdmin();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        designation: true,
        imageUrl: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      users,
      message: "Users loaded successfully.",
    };
  } catch (error) {
    console.error("getAllUsersAction error:", error);

    return {
      success: false,
      users: [],
      message: "Unable to load users. Please verify your administrator access.",
    };
  }
}

/**
 * Update a user's role.
 * Active administrators can assign any supported role to another account.
 * Administrators cannot change their own role.
 */
export async function updateUserRoleAction(
  userId: string,
  role: EditableRole,
): Promise<UserActionResult> {
  try {
    const admin = await authorizeAdmin();

    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    const allowedRoles: EditableRole[] = [
      "ADMIN",
      "USER",
      "MEMBER",
      "CHAIRMAN",
    ];

    if (!allowedRoles.includes(role)) {
      return {
        success: false,
        message: "Invalid role. Select a valid user role.",
      };
    }

    if (admin.id === userId) {
      return {
        success: false,
        message: "You cannot change your own role.",
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (targetUser.role === role) {
      return {
        success: true,
        message: "The user already has this role.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `${targetUser.name}'s role was updated to ${role}.`,
    };
  } catch (error) {
    console.error("updateUserRoleAction error:", error);

    return {
      success: false,
      message:
        "Unable to update the user role. Please verify administrator access.",
    };
  }
}

/**
 * Activate or deactivate a user account.
 * Administrators cannot deactivate their own account.
 */
export async function updateUserStatusAction(
  userId: string,
  status: EditableStatus,
): Promise<UserActionResult> {
  try {
    const admin = await authorizeAdmin();

    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return {
        success: false,
        message: "Invalid status. Select ACTIVE or INACTIVE.",
      };
    }

    if (admin.id === userId && status === "INACTIVE") {
      return {
        success: false,
        message: "You cannot deactivate your own account.",
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!targetUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (targetUser.status === status) {
      return {
        success: true,
        message: "The user already has this account status.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message:
        status === "ACTIVE"
          ? `${targetUser.name}'s account has been activated.`
          : `${targetUser.name}'s account has been deactivated.`,
    };
  } catch (error) {
    console.error("updateUserStatusAction error:", error);

    return {
      success: false,
      message:
        "Unable to update account status. Please verify administrator access.",
    };
  }
}

/**
 * Update a user's profile image.
 */
export async function updateUserImageAction(
  userId: string,
  imageUrl: string | null,
): Promise<UserActionResult> {
  try {
    await authorizeAdmin();

    if (!userId || !imageUrl) {
      return {
        success: false,
        message: "User ID and image URL are required.",
      };
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return {
        success: false,
        message: "Please provide a valid HTTPS image URL.",
      };
    }

    if (parsedUrl.protocol !== "https:") {
      return {
        success: false,
        message: "Please provide a valid HTTPS image URL.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { imageUrl },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "Profile image updated successfully.",
    };
  } catch (error) {
    console.error("updateUserImageAction error:", error);

    return {
      success: false,
      message: "Failed to update the profile image.",
    };
  }
}
