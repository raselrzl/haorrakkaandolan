// app/api/donations/checkout/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { createCheckoutSession, makeTransactionId } from "../../_lib/sslcommerz";
import { DonationPaymentStatus } from "@/app/generated/prisma/enums";


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const phone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";
    const amount = Number(body.amount);

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Enter a valid donor name." },
        { status: 400 },
      );
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      return NextResponse.json(
        { error: "Enter a valid phone number." },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(amount) ||
      !Number.isInteger(amount * 100) ||
      amount < 10 ||
      amount > 500000
    ) {
      return NextResponse.json(
        { error: "Donation must be between BDT 10 and BDT 500,000." },
        { status: 400 },
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message must be 1,000 characters or fewer." },
        { status: 400 },
      );
    }

    const tranId = makeTransactionId();
    const amountString = amount.toFixed(2);

    const donation = await prisma.donation.create({
      data: {
        tranId,
        donorName: name,
        donorEmail: email,
        donorPhone: phone,
        amount: amountString,
        currency: "BDT",
        message: message || null,
        status: DonationPaymentStatus.PENDING,
      },
    });

    try {
      const checkoutUrl = await createCheckoutSession({
        tranId: donation.tranId,
        amount: amountString,
        name,
        email,
        phone,
      });

      return NextResponse.json({ checkoutUrl });
    } catch (error) {
      console.error("SSLCOMMERZ session creation failed:", error);

      return NextResponse.json(
        {
          error:
            "Could not start payment. Please try again later.",
        },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Donation checkout error:", error);

    return NextResponse.json(
      { error: "Unable to start the donation payment." },
      { status: 500 },
    );
  }
}