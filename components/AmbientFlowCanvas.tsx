"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

interface AmbientFlowCanvasProps {
  className?: string;
}

/**
 * Фоновое «течение света»: бесформенная светотень, очень медленно плывущая
 * как облака. Никаких форм, колец, капель и никакой привязки к курсору —
 * только плавный перелив яркости вокруг фонового тона #22252A.
 * Адаптивный: рендер в полразрешения (тени мягкие — апскейл незаметен).
 * При устойчивой тяжёлой нагрузке движок деградирует до 15fps — но не останавливается никогда.
 */
export default function AmbientFlowCanvas({ className }: AmbientFlowCanvasProps) {
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
    gl.clearColor(0.133, 0.145, 0.165, 1);

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
        uniform vec2 uResolution;
        varying vec2 vUv;

        float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.55;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p = p * 2.1 + vec2(11.3, 7.7);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float aspect = uResolution.x / max(uResolution.y, 1.0);
          vec2 p = vec2(uv.x * aspect, uv.y) * 2.0;
          float t = uTime * 0.015;

          // доменное искажение: свет именно течёт, а не пульсирует формами
          vec2 q = vec2(fbm(p + vec2(0.0, t * 2.0)), fbm(p + vec2(5.2, t * 2.6)));
          float n = fbm(p + 1.7 * q + vec2(t * 0.9, -t * 0.55));

          // мягкая ремап: фон держится большую часть времени, редкие пики чуть светлее
          float lit = smoothstep(0.42, 0.88, n);
          float dark = smoothstep(0.50, 0.16, n) * 0.5;

          vec3 base = vec3(0.133, 0.145, 0.165); // #22252A
          vec3 up   = vec3(0.163, 0.176, 0.200); // мягкий свет #2A2D33
          vec3 dn   = vec3(0.112, 0.122, 0.142); // лёгкая тень #1D1F24
          vec3 col = mix(base, up, lit);
          col = mix(col, dn, dark);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1280, 720] },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // При reduced-motion свечение замирает одним кадром — не анимируется
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      program.uniforms.uTime.value = 21;
      renderer.render({ scene: mesh });
      return () => {
        /* контекст не уничтожаем: canvas переживает remount в StrictMode */
      };
    }

    // Рендер в полразрешения: тени мягкие, апскейл неотличим, цена ×0.25.
    // ResizeObserver нужен: в момент монтирования CSS ещё не применён и
    // offsetWidth равен дефолтным 300px — без обсервера буфер навсегда 150×75.
    const resize = () => {
      const w = Math.max(2, Math.round(canvas.offsetWidth / 2));
      const h = Math.max(2, Math.round(canvas.offsetHeight / 2));
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);

    // Адаптивный движок: полная скорость → 15fps при устойчивой нагрузке.
    // Гейт кадров считает от последней РЕАЛЬНОЙ отрисовки (метка «last»
    // обновляется каждый кадр rAF — по ней на 60Hz не отрисовалось бы ничего).
    let raf = 0;
    let inView = true;
    const start = performance.now();
    let last = start;
    let lastRender = 0;
    let level = 0; // 0 = 30fps, 1 = 15fps (нижний порог)
    let minInterval = 33;
    let slowWindows = 0;
    let frames = 0;
    let acc = 0;
    let warmupUntil = start + 2500;

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (!inView) return;

      // Темп rAF — метрика нагрузки машины
      const interval = time - last;
      last = time;
      if (time >= warmupUntil) {
        acc += interval;
        frames++;
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
      }

      if (time - lastRender < minInterval) return;
      lastRender = time;
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
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      // WEBGL_lose_context не зовём: в StrictMode-remount тот же canvas
      // получил бы потерянный контекст и рендерил чёрное
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
