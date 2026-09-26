"use client";

import { useEffect, useRef } from "react";

const VK_CLIP_URL = "https://vk.ru/clip-215942650_456239099";

export default function BoostVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <div className="boost-video-card" data-sticky-cta-suppress>
      <div className="boost-video-frame">
        <video
          ref={videoRef}
          className="boost-video-el"
          src="/video/studio-apartment-720p.mp4"
          poster="/video/studio-apartment-poster.jpg"
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          Ваш браузер не поддерживает встроенное видео.{" "}
          <a href={VK_CLIP_URL} target="_blank" rel="noopener noreferrer">
            Смотреть клип ВКонтакте
          </a>
        </video>
      </div>
    </div>
  );
}
