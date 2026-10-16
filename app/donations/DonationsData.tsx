import { prisma } from "@/app/utils/db";
import DonationsContent from "./DonationsContent";

export default async function DonationsData() {
  const accounts = await prisma.donationAccount.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      accountName: true,
      providerName: true,
      accountNumber: true,
      bankAddress: true,
    },
  });

  return <DonationsContent accounts={accounts} />;
}