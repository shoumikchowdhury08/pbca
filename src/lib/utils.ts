import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The calendar year PBCA held its first Durga Puja celebration. */
export const PBCA_FOUNDING_YEAR = 2004;

/**
 * Returns the current edition/year count of PBCA's Durga Puja celebrations,
 * counting the founding year as edition 1. This automatically increments
 * every new calendar year (e.g. 23 in 2026, 24 in 2027, ...).
 */
export function getPujaEdition(foundingYear: number = PBCA_FOUNDING_YEAR): number {
  return new Date().getFullYear() - foundingYear + 1;
}

/** Returns the English ordinal suffix ("st", "nd", "rd", "th") for a number. */
export function ordinalSuffix(n: number): string {
  const remainder100 = n % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/** Formats a number with its ordinal suffix, e.g. 23 -> "23rd". */
export function formatOrdinal(n: number): string {
  return `${n}${ordinalSuffix(n)}`;
}
