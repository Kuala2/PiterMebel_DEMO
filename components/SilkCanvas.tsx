"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

interface SilkCanvasProps {
  className?: string;
}

/**
 * «Дышащий» тёмный шёлк (по мотивам React Bits Silk, цветa — токены сайта).
 * Адаптивный: рендер в полразрешения (волны мягкие — апскейл незаметен).
 * При устойчивой тяжёлой нагрузке движок деградирует до 15fps — но не останавливается никогда.
 */
export default function SilkCanvas({ className }: SilkCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const renderer = new Renderer({
      canvas,
      alpha: false,
      antialias: false,
      dpr: 1, // рендер в полразрешения — DPR выше не даёт качества на абстракции
    });
    const gl = renderer.gl;
    gl.clearColor(0.11, 0.12, 0.14, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.12;

          // две волновые системы — интерференция даёт видимое дыхание
          float v1 = sin(uv.x * 4.0 + sin(uv.y * 3.0 + t * 1.6) + t * 1.2);
          float v2 = cos(uv.y * 3.5 - sin(uv.x * 2.8 - t * 1.1) - t * 0.9);
          float flow = v1 * v2 * 0.5 + 0.5;

          // крупный медленный дрейф пятен
          float drift = sin(uv.x * 1.8 - t * 0.7) * cos(uv.y * 1.6 + t * 0.5) * 0.5 + 0.5;

          // мягкая световая полоса, медленно проходящая по диагонали (блик лака)
          float band = smoothstep(0.32, 0.0, abs(uv.x * 0.68 + uv.y * 0.32 - fract(uTime * 0.035) * 1.7 - 0.1)) * 0.6;

          // рябь от курсора
          float md = distance(uv, uMouse);
          float ripple = smoothstep(0.55, 0.0, md) * 0.55;

          float shade = clamp(flow * 0.5 + drift * 0.3 + band + ripple * 0.5, 0.0, 1.0);

          // яркость держим ниже карточек (#282C33), чтобы они не проваливались
          vec3 base = vec3(0.070, 0.078, 0.092);
          vec3 hi   = vec3(0.135, 0.150, 0.175);
          vec3 col = mix(base, hi, shade);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0.5, 0.5) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Рендер в полразрешения: для мягких волн апскейл неотличим, цена ×0.25
    const resize = () => {
      const w = Math.max(2, Math.round(canvas.offsetWidth / 2));
      const h = Math.max(2, Math.round(canvas.offsetHeight / 2));
      renderer.setSize(w, h);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      program.uniforms.uMouse.value.set(
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height
      );
    };
    window.addEventListener("mousemove", onMove);

    // Адаптивный движок: полная скорость → 15fps при устойчивой нагрузке.
    // Прогрев 2.5с не судится (dev-компиляция рывками), полного останова нет никогда.
    let raf = 0;
    let inView = true;
    const start = performance.now();
    let last = start;
    let level = 0; // 0 = 30fps, 1 = 15fps (нижний порог)
    let minInterval = 33;
    let slowWindows = 0;
    let frames = 0;
    let acc = 0;
    let warmupUntil = start + 2500;

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!inView) return;

      if (time < warmupUntil) {
        last = time;
        return;
      }

      const interval = time - last;
      acc += interval;
      frames++;
      last = time;

      if (frames >= 90) {
        const avg = acc / frames;
        if (avg > 90) slowWindows++;
        else slowWindows = Math.max(0, slowWindows - 1);
        if (slowWindows >= 2 && level < 1) {
          level = 1;
          minInterval = 66;
        }
        acc = 0;
        frames = 0;
      }

      if (interval < minInterval) return;
      program.uniforms.uTime.value = (time - start) / 1000;
      renderer.render({ scene: mesh });
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(canvas);

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      io.disconnect();
      cancelAnimationFrame(raf);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
