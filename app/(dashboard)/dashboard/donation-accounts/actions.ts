
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";

const ADMIN_PATH = "/admin/donation-accounts";
const PUBLIC_PATH = "/donations";

function getFields(formData: FormData) {
  return {
    accountName: String(formData.get("accountName") ?? "").trim(),
    providerName: String(formData.get("providerName") ?? "").trim(),
    accountNumber: String(formData.get("accountNumber") ?? "").trim(),
    bankAddress: String(formData.get("bankAddress") ?? "").trim(),
  };
}

function validateFields(fields: ReturnType<typeof getFields>) {
  if (!fields.accountName || !fields.providerName || !fields.accountNumber) {
    throw new Error(
      "Account name, provider name, and account number are required."
    );
  }

  if (
    fields.accountName.length > 150 ||
    fields.providerName.length > 150 ||
    fields.accountNumber.length > 100 ||
    fields.bankAddress.length > 500
  ) {
    throw new Error("One or more fields exceed the permitted length.");
  }
}

function refreshDonationPages() {
  revalidatePath(ADMIN_PATH);
  revalidatePath(PUBLIC_PATH);
}

export async function createDonationAccount(formData: FormData) {
  await requireAdmin();

  const fields = getFields(formData);
  validateFields(fields);

  await prisma.donationAccount.create({
    data: {
      ...fields,
      bankAddress: fields.bankAddress || null,
    },
  });

  refreshDonationPages();
}

export async function updateDonationAccount(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Donation account ID is required.");
  }

  const fields = getFields(formData);
  validateFields(fields);

  await prisma.donationAccount.update({
    where: { id },
    data: {
      ...fields,
      bankAddress: fields.bankAddress || null,
    },
  });

  refreshDonationPages();
}

export async function deleteDonationAccount(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("Donation account ID is required.");
  }

  await prisma.donationAccount.delete({
    where: { id },
  });

  refreshDonationPages();
}
