import axios from "axios";
import type { ApiErrorDto, ApiResponse } from "@/types/types";

/**
 * Message to show for a failed request.
 *
 * Axios rejects on any non-2xx status (unlike `fetch`), so routes that answer
 * with the `{ error: { message } }` envelope from `@/lib/api` would otherwise
 * surface axios' generic "Request failed with status code 400" in the UI.
 */
function apiErrorMessage(cause: unknown, fallback: string): string {
  if (axios.isAxiosError(cause)) {
    const body = cause.response?.data as Partial<ApiErrorDto> | undefined;
    const message = body?.error?.message;
    if (typeof message === "string" && message.length > 0) return message;
    if (!cause.response) return fallback;
    return `${fallback} (HTTP ${cause.response.status})`;
  }

  return cause instanceof Error && cause.message ? cause.message : fallback;
}

/**
 * Resolves the `data` field of the `{ data }` / `{ error }` envelope every
 * `/api/*` route answers with and re-throws failures as `Error` instances, so
 * call sites keep using `cause instanceof Error ? cause.message : fallback`.
 */
export async function readApiData<T>(
  request: Promise<{ data: unknown }>,
  fallback = "Something went wrong.",
): Promise<T> {
  try {
    const response = await request;
    return (response.data as ApiResponse<T>).data;
  } catch (cause) {
    // Aborted requests are re-thrown untouched so `axios.isCancel` still works
    // in the effects that abort on unmount.
    if (axios.isCancel(cause)) throw cause;
    throw new Error(apiErrorMessage(cause, fallback));
  }
}