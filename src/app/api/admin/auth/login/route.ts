import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { jsonError, validationError } from "@/lib/api";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const user = await prisma.adminUser.findFirst({
    where: { email: parsed.data.email.toLowerCase(), active: true },
  });
  const valid = user
    ? await bcrypt.compare(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !valid) {
    return jsonError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect.",
    );
  }

  await createSession(user.id);
  return NextResponse.json({
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
