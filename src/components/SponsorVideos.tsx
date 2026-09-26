"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Film, Play, Radio } from "lucide-react";
import { readApiData } from "@/lib/http";
import type { SponsorVideoDto } from "@/types/types";

/**
 * Poster for a video card: YouTube embeds hand us a thumbnail via the video id;
 * anything else (Vimeo, other platforms) falls back to a styled placeholder.
 */
function VideoThumbnail({ video }: { video: SponsorVideoDto }) {
  const poster = video.embedSrc?.includes("youtube")
    ? video.embedSrc.match(/embed\/([^?]+)/)?.[1]
    : null;
  if (poster) {
    return (
      <Image
        className="sponsor-video-thumb-media"
        src={`https://i.ytimg.com/vi/${poster}/mqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <span className="sponsor-video-thumb-placeholder" aria-hidden="true">
      <Film size={22} />
    </span>
  );
}

export default function SponsorVideos() {
  const [videos, setVideos] = useState<SponsorVideoDto[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [embedPlaying, setEmbedPlaying] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    readApiData<SponsorVideoDto[]>(
      axios.get("/api/sponsor-videos", { signal: controller.signal }),
      "Unable to load sponsor videos.",
    )
      .then((data) => {
        setVideos(data);
        setActiveId((current) => current ?? data[0]?.id ?? null);
      })
      .catch((error: unknown) => {
        if (!axios.isCancel(error)) console.error(error);
      });

    return () => controller.abort();
  }, []);

  const active = useMemo(
    () => videos.find((video) => video.id === activeId) ?? videos[0] ?? null,
    [videos, activeId],
  );

  function selectVideo(id: string) {
    setActiveId(id);
    setEmbedPlaying(false);
  }

  if (!videos.length) return null;

  return (
    <section className="sponsor-videos section-wrap" id="sponsor-videos">
      <div className="section-kicker">ON SCREEN</div>
      <div className="sponsor-videos-heading">
        <div>
          <Radio size={25} />
          <h2>
            Celebrating
            <br />
            <span>Our Partners</span>
          </h2>
        </div>
        <p>
          Watch the films, heartfelt messages, and behind‑the‑scenes moments
          shared by our sponsors. Whether the links come from YouTube, Vimeo, or
          other streaming platforms, they all play seamlessly right here -
          keeping you immersed in the celebration without ever leaving the page.
        </p>
      </div>

      <div className="sponsor-videos-layout">
        <motion.div
          className="sponsor-videos-stage"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.2, 0.65, 0.3, 1] }}
        >
          {active && (
            <>
              <div className="sponsor-video-frame">
                {active.source === "UPLOAD" &&
                active.fileUrl &&
                embedPlaying ? (
                  <video
                    key={active.id}
                    className="sponsor-video-player"
                    src={active.fileUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                ) : active.source === "EMBED" &&
                  active.embedSrc &&
                  embedPlaying ? (
                  <iframe
                    key={active.id}
                    className="sponsor-video-player"
                    src={`${active.embedSrc}${active.embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
                    title={active.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                ) : (
                  <button
                    type="button"
                    className="sponsor-video-poster"
                    onClick={() => setEmbedPlaying(true)}
                    aria-label={`Play ${active.title}`}
                  >
                    <VideoThumbnail video={active} />
                    <span className="sponsor-video-poster-scrim" />
                    <span className="sponsor-video-poster-play">
                      <Play size={26} />
                    </span>
                  </button>
                )}
              </div>
              <div className="sponsor-video-caption">
                <p className="eyebrow">
                  {active.featured ? "Featured" : "Streaming"}
                </p>
                <h3>{active.title}</h3>
                {active.description && <p>{active.description}</p>}
              </div>
            </>
          )}
        </motion.div>

        <motion.ul
          className="sponsor-videos-playlist"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            delay: 0.12,
            ease: [0.2, 0.65, 0.3, 1],
          }}
        >
          {videos.map((video) => (
            <li key={video.id}>
              <button
                type="button"
                className={`sponsor-video-item${
                  video.id === active?.id ? " is-active" : ""
                }`}
                onClick={() => selectVideo(video.id)}
                aria-current={video.id === active?.id}
              >
                <span className="sponsor-video-item-thumb">
                  <VideoThumbnail video={video} />
                  <span className="sponsor-video-item-play">
                    <Play size={14} />
                  </span>
                </span>
                <span className="sponsor-video-item-copy">
                  <strong>{video.title}</strong>
                  <small>
                    {video.source === "UPLOAD"
                      ? "Uploaded video"
                      : "Streaming link"}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
