
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { getCurrentUser, requireAdmin } from "@/app/utils/auth";

type EditableRole = "USER" | "MEMBER";
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
    role: "ADMIN" | "USER" | "MEMBER" | "CHAIRMAN";
    status: "ACTIVE" | "INACTIVE";
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
 * Uses the existing authentication and hra_session cookie.
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
 * Only administrators can access the complete user list.
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
 * Only USER and MEMBER roles can be changed through this action.
 * ADMIN and CHAIRMAN roles are protected.
 */
export async function updateUserRoleAction(
  userId: string,
  role: EditableRole,
): Promise<UserActionResult> {
  try {
    await authorizeAdmin();

    if (!userId || typeof userId !== "string") {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    if (role !== "USER" && role !== "MEMBER") {
      return {
        success: false,
        message: "Invalid role. Select USER or MEMBER.",
      };
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
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

    if (targetUser.role !== "USER" && targetUser.role !== "MEMBER") {
      return {
        success: false,
        message: "ADMIN and CHAIRMAN roles cannot be changed here.",
      };
    }

    if (targetUser.role === role) {
      return {
        success: true,
        message: "The user already has this role.",
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
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
      message: "Unable to update the user role. Please verify administrator access.",
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
      where: {
        id: userId,
      },
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
      where: {
        id: userId,
      },
      data: {
        status,
      },
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
      message: "Unable to update account status. Please verify administrator access.",
    };
  }
}



export async function updateUserImageAction(
  userId: string,
  imageUrl: string,
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "ADMIN") {
      return {
        success: false,
        message: "Unauthorized. Admin access is required.",
      };
    }

    if (!userId || !imageUrl) {
      return {
        success: false,
        message: "User ID and image URL are required.",
      };
    }

    if (
      !imageUrl.startsWith("https://") ||
      !URL.canParse(imageUrl)
    ) {
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
