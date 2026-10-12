
import "server-only";
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
  auth: {
    user,
    pass,
  },
});

export async function sendPasswordResetCodeEmail(
  email: string,
  code: string,
) {
  await transporter.sendMail({
    from: `"Haor Rokkha Andolan" <${user}>`,
    to: email,
    subject: "Your password recovery verification code",
    text: [
      "We received a request to reset your Haor Rokkha Andolan password.",
      "",
      `Your six-digit verification code is: ${code}`,
      "",
      "This code expires in 10 minutes and can only be used once.",
      "Do not share this code with anyone.",
      "",
      "If you did not request a password reset, you can ignore this email.",
    ].join("\n"),
    html: `
      <!doctype html>
      <html lang="en">
        <body style="margin:0;background:#f8fafc;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
          <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
            <div style="background:#064e3b;padding:24px 28px;color:#ffffff">
              <p style="margin:0;font-size:12px;letter-spacing:1.5px;color:#a7f3d0">
                HAOR ROKKHA ANDOLAN
              </p>
              <h1 style="margin:12px 0 0;font-size:23px">
                Password recovery
              </h1>
            </div>

            <div style="padding:28px">
              <p style="font-size:15px;line-height:1.7">
                We received a request to reset your account password.
                Enter the verification code below to continue.
              </p>

              <div style="margin:24px 0;padding:22px 12px;text-align:center;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px">
                <p style="margin:0 0 10px;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#047857">
                  YOUR VERIFICATION CODE
                </p>
                <div style="font-size:34px;font-weight:bold;letter-spacing:9px;color:#065f46">
                  ${code}
                </div>
              </div>

              <p style="font-size:13px;line-height:1.7;color:#475569">
                This code expires in <strong>10 minutes</strong> and can
                only be used once.
              </p>

              <p style="font-size:13px;line-height:1.7;color:#475569">
                For your security, never share this code with anyone.
              </p>

              <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0" />

              <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b">
                If you did not request a password reset, you can safely
                ignore this email. Your password will not change unless
                the code is verified.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
