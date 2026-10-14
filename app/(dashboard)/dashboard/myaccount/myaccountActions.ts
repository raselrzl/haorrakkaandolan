"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

export type MyAccountData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  designation: string | null;
  imageUrl: string | null;
  role: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
};

type ActionResult = {
  success: boolean;
  message: string;
};

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
}

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function getMyAccountAction(): Promise<
  ActionResult & { account?: MyAccountData }
> {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        imageUrl: true,
        role: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Your account could not be found.",
      };
    }

    return {
      success: true,
      message: "Account loaded successfully.",
      account: {
        ...user,
        startDate: user.startDate?.toISOString() ?? null,
        endDate: user.endDate?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to load admin account:", error);

    return {
      success: false,
      message: "Unable to load your account. Please try again.",
    };
  }
}

export async function updateMyAccountAction(input: {
  name: string;
  email: string;
  phone: string;
  designation: string;
  imageUrl: string;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const phone = input.phone?.trim();
    const designation = input.designation?.trim() || null;
    const imageUrl = input.imageUrl?.trim() || null;

    if (!name || !email || !phone) {
      return {
        success: false,
        message: "Name, email, and phone number are required.",
      };
    }

    if (name.length > 120) {
      return {
        success: false,
        message: "Name must be 120 characters or fewer.",
      };
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return {
        success: false,
        message: "Enter a valid email address.",
      };
    }

    if (phone.length > 30) {
      return {
        success: false,
        message: "Phone number must be 30 characters or fewer.",
      };
    }

    if (designation && designation.length > 120) {
      return {
        success: false,
        message: "Designation must be 120 characters or fewer.",
      };
    }

    if (imageUrl && (imageUrl.length > 2048 || !isValidImageUrl(imageUrl))) {
      return {
        success: false,
        message: "Enter a valid HTTP or HTTPS profile image URL.",
      };
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: {
        name,
        email,
        phone,
        designation,
        imageUrl,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/myaccount");

    return {
      success: true,
      message: "Your account details have been updated.",
    };
  } catch (error) {
    if (getErrorCode(error) === "P2002") {
      return {
        success: false,
        message: "That email address or phone number is already in use.",
      };
    }

    console.error("Failed to update admin account:", error);

    return {
      success: false,
      message: "Unable to update your account. Please try again.",
    };
  }
}

/**
 * Save the URL returned by UploadThing.
 * The URL is accepted only from an authenticated administrator action.
 */
export async function updateMyProfileImageAction(
  imageUrl: string,
): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    const url = imageUrl?.trim();

    if (!url || url.length > 2048 || !isValidImageUrl(url)) {
      return {
        success: false,
        message: "The uploaded image URL is invalid.",
      };
    }

    await prisma.user.update({
      where: { id: admin.id },
      data: { imageUrl: url },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/myaccount");

    return {
      success: true,
      message: "Profile photo uploaded and saved successfully.",
    };
  } catch (error) {
    console.error("Failed to save profile image:", error);

    return {
      success: false,
      message: "The photo uploaded, but saving it to your account failed.",
    };
  }
}

export async function changeMyAccountPasswordAction(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();

    const currentPassword = input.currentPassword ?? "";
    const newPassword = input.newPassword ?? "";
    const confirmPassword = input.confirmPassword ?? "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        message: "Complete all password fields.",
      };
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      return {
        success: false,
        message: "Your new password must be between 8 and 128 characters.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: "The new password and confirmation do not match.",
      };
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        message: "Choose a new password different from your current one.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: admin.id },
      select: { id: true, password: true },
    });

    if (!user) {
      return {
        success: false,
        message: "Your account could not be found.",
      };
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return {
        success: false,
        message: "Your current password is incorrect.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    revalidatePath("/dashboard/myaccount");

    return {
      success: true,
      message: "Your password has been changed successfully.",
    };
  } catch (error) {
    console.error("Failed to change admin password:", error);

    return {
      success: false,
      message: "Unable to change your password. Please try again.",
    };
  }
}
