"use client";

import { useEffect, useRef } from "react";

/** Глобальный софтбокс: слабый студийный свет следует за курсором по всему окну.
 *  При prefers-reduced-motion — полностью скрывается (не висит статичной лампой). */
export default function GlobalSoftbox() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      // пишем стиль только когда цель реально сместилась — иначе ноль работы
      if (Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) return;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      if (ref.current) {
        ref.current.style.setProperty("--sx", `${x}px`);
        ref.current.style.setProperty("--sy", `${y}px`);
      }
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="global-softbox" aria-hidden="true" />;
}
