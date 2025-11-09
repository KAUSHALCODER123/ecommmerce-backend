import nodemailer from "nodemailer";
import logger from "../config/logger";

interface MailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
/* await sendMail({
  to: user.email,
  subject: "Verify your account",
  html: `<h1>Welcome!</h1><p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
});
 */
/**
 * Sends an email using SMTP (configured via environment variables)
 */
export const sendMail = async ({ to, subject, text, html }: MailData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    logger.info(`📧 Email sent successfully to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    logger.error(`❌ Error sending email to ${to}: ${error instanceof Error ? error.message : error}`);
    throw new Error("Failed to send email");
  }
};
