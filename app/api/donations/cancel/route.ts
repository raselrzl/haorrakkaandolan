// app/api/donations/cancel/route.ts

import { NextResponse } from "next/server";
import { markDonationFailed } from "../../_lib/sslcommerz";

export async function POST(request: Request) {
  const baseUrl = process.env.SITE_URL?.replace(/\/+$/, "");

  if (!baseUrl) {
    return new Response("SITE_URL is not configured.", {
      status: 500,
    });
  }

  const destination = new URL("/donations", baseUrl);

  try {
    const form = await request.formData();
    const tranId = String(form.get("tran_id") ?? "");

    if (tranId) {
      await markDonationFailed(tranId, "CANCELLED");
    }
  } catch (error) {
    console.error("Donation cancellation callback error:", error);
  }

  destination.searchParams.set("payment", "cancelled");

  return NextResponse.redirect(destination, 303);
}