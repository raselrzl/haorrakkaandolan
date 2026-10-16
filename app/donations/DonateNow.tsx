
"use client";

import { useState, type FormEvent } from "react";
import { Heart, LoaderCircle, X } from "lucide-react";

type DonateNowProps = {
  language?: "en" | "bn";
};

type CheckoutResponse = {
  checkoutUrl?: string;
  url?: string;
  gatewayUrl?: string;
  gatewayPageURL?: string;
  GatewayPageURL?: string;
  error?: string;
  message?: string;
};

export default function DonateNow({
  language = "en",
}: DonateNowProps) {
  const bn = language === "bn";

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const donationAmount = Number(
    amount === "custom" ? customAmount : amount,
  );

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    setError("");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !Number.isFinite(donationAmount) ||
      donationAmount < 10 ||
      donationAmount > 500000
    ) {
      setError(
        bn
          ? "অনুদানের পরিমাণ ১০ থেকে ৫,০০,০০০ টাকার মধ্যে হতে হবে।"
          : "Donation must be between BDT 10 and BDT 500,000.",
      );
      return;
    }

    if (!Number.isInteger(donationAmount)) {
      setError(
        bn
          ? "অনুদানের পরিমাণ পূর্ণ সংখ্যায় লিখুন।"
          : "Please enter a whole-number donation amount.",
      );
      return;
    }

    if (
      name.trim().length < 2 ||
      !email.trim() ||
      !phone.trim()
    ) {
      setError(
        bn
          ? "সঠিক নাম, ইমেইল এবং ফোন নম্বর পূরণ করুন।"
          : "Please enter a valid name, email, and phone number.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: donationAmount,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            (bn
              ? "পেমেন্ট শুরু করা যায়নি। আবার চেষ্টা করুন।"
              : "Could not start payment. Please try again."),
        );
      }

      // The checkout API returns { checkoutUrl: "https://..." }.
      const gatewayUrl =
        data.checkoutUrl ||
        data.GatewayPageURL ||
        data.gatewayPageURL ||
        data.gatewayUrl ||
        data.url;

      if (typeof gatewayUrl !== "string" || !gatewayUrl.trim()) {
        console.error("Checkout API did not return a gateway URL:", data);

        throw new Error(
          bn
            ? "পেমেন্ট গেটওয়ের ঠিকানা পাওয়া যায়নি। আবার চেষ্টা করুন।"
            : "The payment gateway URL was not returned. Please check the checkout API configuration.",
        );
      }

      // Validate the URL before navigating away from the donation page.
      let parsedUrl: URL;

      try {
        parsedUrl = new URL(gatewayUrl);
      } catch {
        throw new Error(
          bn
            ? "পেমেন্ট গেটওয়ের ঠিকানা সঠিক নয়।"
            : "The payment gateway URL is invalid.",
        );
      }

      const allowedHosts = [
        "sandbox.sslcommerz.com",
        "securepay.sslcommerz.com",
      ];

      if (
        parsedUrl.protocol !== "https:" ||
        !allowedHosts.includes(parsedUrl.hostname)
      ) {
        console.error("Unexpected SSLCommerz gateway URL:", {
          hostname: parsedUrl.hostname,
          protocol: parsedUrl.protocol,
        });

        throw new Error(
          bn
            ? "পেমেন্ট গেটওয়ের ঠিকানা যাচাই করা যায়নি।"
            : "The payment gateway URL could not be verified.",
        );
      }

      // Keep the loading state active while navigating to the gateway.
      window.location.assign(parsedUrl.href);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : bn
            ? "একটি অপ্রত্যাশিত সমস্যা হয়েছে।"
            : "An unexpected error occurred.",
      );

      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-900"
      >
        <Heart size={17} />
        {bn ? "এখনই অনুদান দিন" : "Donate Now"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-dialog-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 bg-emerald-950 px-5 py-4 text-white">
              <div>
                <h2
                  id="donation-dialog-title"
                  className="text-lg font-bold"
                >
                  {bn ? "অনুদান প্রদান করুন" : "Make a Donation"}
                </h2>

                <p className="mt-1 text-xs text-emerald-100">
                  {bn
                    ? "হাওর ও পরিবেশ রক্ষায় আপনার অবদান রাখুন"
                    : "Support the protection of haors and the environment"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                aria-label={bn ? "বন্ধ করুন" : "Close"}
                className="rounded-lg p-2 transition hover:bg-white/10 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  {bn ? "অনুদানের পরিমাণ (টাকা)" : "Donation Amount (BDT)"}
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["100", "500", "1000", "2000"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      disabled={loading}
                      onClick={() => setAmount(value)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        amount === value
                          ? "border-emerald-800 bg-emerald-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      ৳{Number(value).toLocaleString("en-BD")}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAmount("custom")}
                  className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    amount === "custom"
                      ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 text-slate-600 hover:border-emerald-700"
                  }`}
                >
                  {bn ? "নিজের পরিমাণ লিখুন" : "Enter a custom amount"}
                </button>

                {amount === "custom" && (
                  <input
                    type="number"
                    min="10"
                    max="500000"
                    step="1"
                    required
                    disabled={loading}
                    value={customAmount}
                    onChange={(event) =>
                      setCustomAmount(event.target.value)
                    }
                    placeholder={
                      bn ? "পরিমাণ লিখুন" : "Enter amount in BDT"
                    }
                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="donor-name"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    {bn ? "আপনার নাম" : "Full Name"}
                  </label>

                  <input
                    id="donor-name"
                    autoComplete="name"
                    maxLength={100}
                    minLength={2}
                    required
                    disabled={loading}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={bn ? "আপনার নাম লিখুন" : "Enter your name"}
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="donor-email"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    {bn ? "ইমেইল" : "Email"}
                  </label>

                  <input
                    id="donor-email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    disabled={loading}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="donor-phone"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    {bn ? "ফোন নম্বর" : "Phone Number"}
                  </label>

                  <input
                    id="donor-phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    required
                    disabled={loading}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={
                      bn ? "ফোন নম্বর লিখুন" : "Enter phone number"
                    }
                    className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="donor-message"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  {bn ? "বার্তা (ঐচ্ছিক)" : "Message (Optional)"}
                </label>

                <textarea
                  id="donor-message"
                  rows={2}
                  maxLength={500}
                  disabled={loading}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={bn ? "আপনার বার্তা লিখুন" : "Leave a message"}
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="wrap-break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <span>{bn ? "মোট অনুদান" : "Donation Total"}</span>

                  <strong className="text-lg text-emerald-900">
                    ৳
                    {Number.isFinite(donationAmount) &&
                    donationAmount >= 0
                      ? donationAmount.toLocaleString("en-BD")
                      : "0"}
                  </strong>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {bn
                    ? "পরবর্তী ধাপে SSLCommerz পেমেন্ট পেজ খুলবে।"
                    : "You will be redirected to the SSLCommerz payment page."}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    {bn ? "পেমেন্ট প্রস্তুত হচ্ছে..." : "Preparing Payment..."}
                  </>
                ) : (
                  <>
                    <Heart size={17} />
                    {bn ? "নিরাপদে অনুদান দিন" : "Continue to Secure Payment"}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                {bn
                  ? "আপনার পেমেন্ট সার্ভারের মাধ্যমে যাচাই করা হবে।"
                  : "Payment confirmation must be verified by the server."}
              </p>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
