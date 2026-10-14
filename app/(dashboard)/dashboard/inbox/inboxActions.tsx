"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

export async function deleteContactMessageAction(formData: FormData) {
  try {
    await requireAdmin();

    const id = formData.get("id");

    if (typeof id !== "string" || !id.trim()) {
      return;
    }

    await prisma.contactMessage.delete({
      where: { id: id.trim() },
    });

    revalidatePath("/dashboard/inbox");
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    throw new Error("Unable to delete this message.");
  }
}