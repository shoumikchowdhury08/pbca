import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import type { ApiErrorDto } from "@/types/types";

export function jsonError(
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string[]>,
) {
  const body: ApiErrorDto = {
    error: { code, message, ...(fields ? { fields } : {}) },
  };
  return NextResponse.json(body, { status });
}

export function validationError(error: ZodError) {
  return jsonError(
    400,
    "VALIDATION_ERROR",
    "Please correct the highlighted fields.",
    error.flatten().fieldErrors,
  );
}

/**
 * Reads a JSON object body. Returns null for malformed or non-object payloads
 * so routes can answer with a 400 instead of throwing.
 */
export async function readJsonBody(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function jsonText(body: Record<string, unknown>, name: string) {
  const value = body[name];
  return typeof value === "string" ? value.trim() : "";
}

export function jsonNumber(
  body: Record<string, unknown>,
  name: string,
  fallback = 0,
) {
  const value = body[name];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function jsonBoolean(
  body: Record<string, unknown>,
  name: string,
  fallback = false,
) {
  const value = body[name];
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}
