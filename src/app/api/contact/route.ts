import { NextResponse } from "next/server";
import { jsonError, validationError } from "@/lib/api";
import { isMailerConfigured, sendContactEmails } from "@/lib/mailer";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError(parsed.error);

  const { name, email, message } = parsed.data;

  if (!isMailerConfigured()) {
    console.error(
      "Contact form unavailable: set EMAIL_USER and EMAIL_PASS to enable sending.",
    );
    return jsonError(
      503,
      "MAIL_NOT_CONFIGURED",
      "The contact form is unavailable right now. Please email us directly at reachuspbcablr@gmail.com.",
    );
  }

  // Sends the confirmation to the visitor and the self-mail with the form
  // details. The UI always confirms the submission, so delivery problems are
  // logged here rather than shown to the visitor.
  try {
    const result = await sendContactEmails({ name, email, message });

    return NextResponse.json({
      data: { success: true, message: result.message },
    });
  } catch (error) {
    console.error("Failed to send contact form emails", { email, error });
    return jsonError(502, "MAIL_SEND_FAILED", "Failed to send email.");
  }
}
