import nodemailer, { type Transporter } from "nodemailer";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

/**
 * The Gmail account used for the contact form. It acts as the sender, the SMTP
 * login, and the self-mail inbox that receives every submission.
 */
export function mailAccount() {
  return process.env.EMAIL_USER?.trim() ?? "";
}

/** True when the Gmail credentials needed to send mail are present. */
export function isMailerConfigured() {
  return Boolean(mailAccount() && process.env.EMAIL_PASS?.trim());
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailAccount(),
        pass: process.env.EMAIL_PASS?.trim(),
      },
    });
  }

  return transporter;
}

/**
 * Confirmation mail sent back to the address submitted in the form.
 */
export function contactConfirmationMail({ email }: ContactMessage) {
  return {
    from: mailAccount(),
    to: email,
    subject: "Contact Form Response",
    text: "Thank you for contacting us! We will reach to you soon.",
  };
}

/**
 * Self-mail carrying the details captured in the contact us form.
 */
export function contactNotificationMail({
  name,
  email,
  message,
}: ContactMessage) {
  return {
    from: mailAccount(),
    to: mailAccount(),
    subject: "New Contact Form Submission",
    text: `Name:- ${name}\nEmail:- ${email}\n\n${message}`,
  };
}

/**
 * Sends both contact form emails: the confirmation to the visitor first, then
 * the submission details to the site inbox.
 */
export async function sendContactEmails(contact: ContactMessage) {
  const mailer = getTransporter();

  await mailer.sendMail(contactConfirmationMail(contact));
  await mailer.sendMail(contactNotificationMail(contact));

  return { message: "Email sent successfully!" };
}
