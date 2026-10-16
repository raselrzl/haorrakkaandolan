// app/api/donations/_lib/sslcommerz.ts

import { randomUUID } from "node:crypto";
import { prisma } from "@/app/utils/db";
import { DonationPaymentStatus } from "@/app/generated/prisma/client";

const sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === "true";

const API_BASE = sandbox
  ? "https://sandbox.sslcommerz.com"
  : "https://securepay.sslcommerz.com";

function getCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const siteUrl = process.env.SITE_URL?.replace(/\/+$/, "");

  if (!storeId || !storePassword || !siteUrl) {
    throw new Error("SSLCOMMERZ environment variables are missing.");
  }

  const parsedUrl = new URL(siteUrl);

  if (
    process.env.NODE_ENV === "production" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new Error("SITE_URL must use HTTPS in production.");
  }

  return { storeId, storePassword, siteUrl };
}

export function makeTransactionId() {
  return `DON${Date.now()}${randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

export type ValidatedPayment = {
  status?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  currency?: string;
  bank_tran_id?: string;
  card_type?: string;
  risk_level?: string | number;
  [key: string]: unknown;
};

export async function validatePayment(
  valId: string,
  expectedTranId: string,
) {
  const { storeId, storePassword } = getCredentials();

  const params = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });

  const response = await fetch(
    `${API_BASE}/validator/api/validationserverAPI.php?${params}`,
    {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );

  if (!response.ok) {
    throw new Error("SSLCOMMERZ validation request failed.");
  }

  const data = (await response.json()) as ValidatedPayment;

  if (
    !["VALID", "VALIDATED"].includes(
      String(data.status ?? "").toUpperCase(),
    )
  ) {
    throw new Error("SSLCOMMERZ has not validated this payment.");
  }

  if (data.tran_id !== expectedTranId) {
    throw new Error("Transaction ID does not match.");
  }

  if (!data.amount || !data.currency || !data.val_id) {
    throw new Error("Incomplete payment validation response.");
  }

  if (data.val_id !== valId) {
    throw new Error("Validation ID does not match.");
  }

  if (data.currency.toUpperCase() !== "BDT") {
    throw new Error("Unexpected payment currency.");
  }

  const donation = await prisma.donation.findUnique({
    where: { tranId: expectedTranId },
  });

  if (!donation) {
    throw new Error("Donation record was not found.");
  }

  // Compare monetary values in integer paisa to avoid floating-point errors.
  const expectedPaisa = Math.round(Number(donation.amount) * 100);
  const actualPaisa = Math.round(Number(data.amount) * 100);

  if (
    !Number.isFinite(actualPaisa) ||
    actualPaisa !== expectedPaisa
  ) {
    throw new Error("Payment amount does not match the donation.");
  }

  return { donation, data };
}

export async function processValidatedPayment(
  valId: string,
  tranId: string,
) {
  const { donation, data } = await validatePayment(valId, tranId);

  // Never overwrite an already confirmed payment with a later callback.
  if (donation.status === DonationPaymentStatus.SUCCESS) {
    return "SUCCESS" as const;
  }

  const riskLevel = Number(data.risk_level ?? 0);

  // Per SSLCOMMERZ guidance, risky transactions need manual review.
  const newStatus =
    riskLevel === 1
      ? DonationPaymentStatus.REVIEW
      : DonationPaymentStatus.SUCCESS;

  await prisma.donation.update({
    where: { tranId },
    data: {
      status: newStatus,
      valId: data.val_id,
      bankTranId: data.bank_tran_id ?? undefined,
      cardType: data.card_type ?? undefined,
      riskLevel,
      validationResponse: JSON.parse(JSON.stringify(data)),
      paidAt:
        newStatus === DonationPaymentStatus.SUCCESS
          ? new Date()
          : null,
    },
  });

  return newStatus;
}

export async function markDonationFailed(
  tranId: string,
  status: "FAILED" | "CANCELLED",
) {
  const newStatus =
    status === "FAILED"
      ? DonationPaymentStatus.FAILED
      : DonationPaymentStatus.CANCELLED;

  await prisma.donation.updateMany({
    where: {
      tranId,
      status: DonationPaymentStatus.PENDING,
    },
    data: { status: newStatus },
  });
}


export async function createCheckoutSession(input: {
  tranId: string;
  amount: string;
  name: string;
  email: string;
  phone: string;
}) {
  const { storeId, storePassword, siteUrl } = getCredentials();

  const form = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: input.amount,
    currency: "BDT",
    tran_id: input.tranId,
    product_category: "donation",
    product_name: "Haor Rokkha Andolan Donation",
    product_profile: "non-physical-goods",
    success_url: `${siteUrl}/api/donations/success`,
    fail_url: `${siteUrl}/api/donations/fail`,
    cancel_url: `${siteUrl}/api/donations/cancel`,
    ipn_url: `${siteUrl}/api/donations/ipn`,
    cus_name: input.name,
    cus_email: input.email,
    cus_phone: input.phone,
    cus_add1: "Bangladesh",
    cus_city: "Sunamganj",
    cus_postcode: "3000",
    cus_country: "Bangladesh",
    shipping_method: "NO",
  });

  const endpoint = `${API_BASE}/gwprocess/v4/api.php`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
  } catch (error) {
    console.error(
      "SSLCOMMERZ network request failed:",
      error instanceof Error ? error.message : "Unknown network error",
    );
    throw new Error("Unable to connect to SSLCOMMERZ.");
  }

  const responseText = await response.text();

  let result: {
    status?: string;
    failedreason?: string;
    GatewayPageURL?: string;
  };

  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("SSLCOMMERZ returned a non-JSON response:", {
      httpStatus: response.status,
      responsePreview: responseText.slice(0, 500),
    });

    throw new Error("SSLCOMMERZ returned an unexpected response.");
  }

  if (!response.ok) {
    console.error("SSLCOMMERZ HTTP error:", {
      httpStatus: response.status,
      status: result.status,
      reason: result.failedreason,
    });

    throw new Error("SSLCOMMERZ rejected the checkout request.");
  }

  if (
    String(result.status ?? "").toUpperCase() !== "SUCCESS" ||
    !result.GatewayPageURL
  ) {
    // Never log the submitted form: it contains the merchant password.
    console.error("SSLCOMMERZ did not create a checkout session:", {
      status: result.status,
      reason: result.failedreason,
      hasGatewayUrl: Boolean(result.GatewayPageURL),
    });

    throw new Error(
      result.failedreason || "SSLCOMMERZ did not return a gateway URL.",
    );
  }

  let gatewayUrl: URL;

  try {
    gatewayUrl = new URL(result.GatewayPageURL);
  } catch {
    throw new Error("SSLCOMMERZ returned an invalid gateway URL.");
  }

  const allowedHosts = sandbox
    ? ["sandbox.sslcommerz.com"]
    : ["securepay.sslcommerz.com"];

  if (
    gatewayUrl.protocol !== "https:" ||
    !allowedHosts.includes(gatewayUrl.hostname)
  ) {
    console.error("SSLCOMMERZ returned an unexpected gateway host:", {
      hostname: gatewayUrl.hostname,
      sandbox,
    });

    throw new Error("Unexpected SSLCOMMERZ checkout URL.");
  }

  return gatewayUrl.toString();
}
