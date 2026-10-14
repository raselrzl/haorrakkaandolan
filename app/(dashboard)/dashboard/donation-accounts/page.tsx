import { prisma } from "@/app/utils/db";
import { requireAdmin } from "@/app/utils/auth";
import DonationAccountsClient from "./DonationAccountsClient";

export const instant = false;

export default async function DonationAccountsPage() {
  await requireAdmin();

  const accounts = await prisma.donationAccount.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      accountName: true,
      providerName: true,
      accountNumber: true,
      bankAddress: true,
      createdAt: true,
    },
  });

  const serializedAccounts = accounts.map((account) => ({
    ...account,
    createdAt: account.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 sm:py-8">
      <DonationAccountsClient accounts={serializedAccounts} />
    </main>
  );
}