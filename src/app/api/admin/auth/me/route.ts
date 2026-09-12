import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function GET() {
  const user = await getCurrentAdmin();
  if (!user)
    return jsonError(401, "UNAUTHORIZED", "Please sign in to continue.");
  return NextResponse.json({ data: user });
}
