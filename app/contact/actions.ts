"use server";

import { prisma } from "../utils/db";


export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    reason?: string;
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };
};

export async function submitContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const reason = String(formData.get("reason") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  const errors: NonNullable<ContactFormState["errors"]> = {};

  const validReasons = [
    "Haor Protection",
    "River and Wetland Conservation",
    "Environmental Concern",
    "Volunteer",
    "Partnership",
    "Media and Press",
    "General Inquiry",
    "Other",
  ];

  if (!validReasons.includes(reason)) {
    errors.reason = "Please select a valid reason for contacting us.";
  }

  if (name.length < 2 || name.length > 100) {
    errors.name = "Enter your name (2–100 characters).";
  }

  if (!/^[+()\d\s.-]{7,25}$/.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (message.length < 10 || message.length > 5000) {
    errors.message = "Your message must be between 10 and 5,000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        reason,
        name,
        phone,
        email,
        message,
      },
    });

    return {
      success: true,
      message:
        "Thank you for contacting Haor Rokkha Andolan. Your message has been submitted successfully.",
    };
  } catch (error) {
    console.error("Contact form submission failed:", error);

    return {
      success: false,
      message:
        "We couldn't submit your message right now. Please try again later.",
    };
  }
}