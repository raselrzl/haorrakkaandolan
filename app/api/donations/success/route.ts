// app/api/donations/success/route.ts

import { NextResponse } from "next/server";
import { processValidatedPayment } from "../../_lib/sslcommerz";


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
    const valId = String(form.get("val_id") ?? "");

    if (!tranId || !valId) {
      destination.searchParams.set("payment", "failed");
      return NextResponse.redirect(destination, 303);
    }

    const result = await processValidatedPayment(valId, tranId);

    destination.searchParams.set(
      "payment",
      result === "SUCCESS"
        ? "success"
        : result === "REVIEW"
          ? "review"
          : "failed",
    );
  } catch (error) {
    console.error("Donation success callback error:", error);
    destination.searchParams.set("payment", "pending");
  }

  return NextResponse.redirect(destination, 303);
}