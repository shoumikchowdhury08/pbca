import { getCurrentAdmin } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) {
    return {
      response: jsonError(401, "UNAUTHORIZED", "Please sign in to continue."),
    } as const;
  }
  return { user } as const;
}
