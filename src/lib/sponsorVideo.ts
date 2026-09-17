import type { SponsorVideo } from "@prisma/client";
import type { SponsorVideoDto } from "@/types/types";

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtu.be") return url.pathname.slice(1) || null;
  if (host !== "youtube.com" && host !== "m.youtube.com") return null;
  if (url.pathname === "/watch") return url.searchParams.get("v");
  const match = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)/);
  return match?.[1] ?? null;
}

function vimeoId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
  return match?.[1] ?? null;
}

export type SponsorVideoEmbed = {
  /** URL to place in an iframe `src`. */
  src: string;
  /** Optional poster image so the section can render before the iframe loads. */
  posterUrl: string | null;
};

/**
 * Turns whatever an admin pastes in (YouTube watch link, share link, Vimeo
 * page, or a ready-made player URL from any streaming platform) into an
 * embeddable source. Unknown platforms are passed through untouched so any
 * streaming provider can be used.
 */
export function resolveSponsorVideoEmbed(
  embedUrl: string | null | undefined,
): SponsorVideoEmbed | null {
  if (!embedUrl) return null;

  let url: URL;
  try {
    url = new URL(embedUrl.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const youtube = youtubeId(url);
  if (youtube) {
    return {
      src: `https://www.youtube-nocookie.com/embed/${youtube}?rel=0&modestbranding=1`,
      posterUrl: `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg`,
    };
  }

  const vimeo = vimeoId(url);
  if (vimeo) {
    return { src: `https://player.vimeo.com/video/${vimeo}`, posterUrl: null };
  }

  return { src: url.toString(), posterUrl: null };
}

export function toSponsorVideoDto(video: SponsorVideo): SponsorVideoDto {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    embedUrl: video.embedUrl,
    embedSrc: resolveSponsorVideoEmbed(video.embedUrl)?.src ?? null,
    sortOrder: video.sortOrder,
    featured: video.featured,
    published: video.published,
  };
}
