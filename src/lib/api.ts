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
