const publicMediaBaseUrl = (
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "/api/r2"
).replace(/\/+$/, "");

export function r2PublicUrl(storageKey: string) {
  const key = storageKey.split("/").map(encodeURIComponent).join("/");
  return `${publicMediaBaseUrl}/${key}`;
}