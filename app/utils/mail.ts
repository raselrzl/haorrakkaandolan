import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 465);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (!host || !user || !pass) {
  throw new Error("SMTP environment variables are not configured.");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
) {
  await transporter.sendMail({
    from: `"Haor Rokkha Andolan" <${user}>`,
    to: email,
    subject: "Reset your password",
    text: [
      "We received a request to reset your password.",
      "",
      `Reset your password using this link: ${resetUrl}`,
      "",
      "This link expires in 30 minutes.",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0f172a">
        <h2 style="color:#047857">Reset your password</h2>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#047857;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px">
            Reset password
          </a>
        </p>
        <p>This link expires in 30 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}