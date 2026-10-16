// app/api/donations/ipn/route.ts

import { NextResponse } from "next/server";
import { markDonationFailed, processValidatedPayment } from "../../_lib/sslcommerz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const tranId = String(form.get("tran_id") ?? "");
    const valId = String(form.get("val_id") ?? "");
    const status = String(form.get("status") ?? "").toUpperCase();

    if (!tranId) {
      return NextResponse.json(
        { error: "Missing transaction ID." },
        { status: 400 },
      );
    }

    if (status === "VALID" || status === "VALIDATED") {
      if (!valId) {
        return NextResponse.json(
          { error: "Missing validation ID." },
          { status: 400 },
        );
      }

      await processValidatedPayment(valId, tranId);

      return NextResponse.json({ received: true });
    }

    if (status === "FAILED") {
      await markDonationFailed(tranId, "FAILED");
      return NextResponse.json({ received: true });
    }

    if (status === "CANCELLED") {
      await markDonationFailed(tranId, "CANCELLED");
      return NextResponse.json({ received: true });
    }

    // Do not treat pending, expired or unattempted payments as successful.
    return NextResponse.json({
      received: true,
      status: "not-final",
    });
  } catch (error) {
    console.error("SSLCOMMERZ IPN processing error:", error);

    // A non-2xx response allows the gateway to retry if appropriate.
    return NextResponse.json(
      { error: "IPN processing failed." },
      { status: 500 },
    );
  }
}