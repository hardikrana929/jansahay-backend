const nodemailer = require("nodemailer");

// Creates a reusable transporter using SMTP credentials from .env
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, // true for port 465, false for 587 (STARTTLS)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Sends the OTP email for password reset
const sendOTPEmail = async (toEmail, otp, userName = "") => {
    const transporter = createTransporter();

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(to right, #2563eb, #16a34a); padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px;">JanSahay</h1>
      </div>
      <div style="padding: 24px; color: #1f2937;">
        <p>Hi ${userName || "there"},</p>
        <p>We received a request to reset your JanSahay account password. Use the OTP below to continue:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; letter-spacing: 6px; font-size: 28px; font-weight: bold; background: #eff6ff; color: #2563eb; padding: 12px 24px; border-radius: 10px;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
        from: `"JanSahay" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your JanSahay Password Reset OTP",
        html,
    });
};

module.exports = { sendOTPEmail };