import { useEffect, useRef } from 'react';

const distortionShader = `
precision highp float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform float scroll;
uniform sampler2D src;

float inside(vec2 uv) {
  return step(abs(uv.x - 0.5), 0.5) * step(abs(uv.y - 0.5), 0.5);
}

vec4 readTex(vec2 uv) {
  return texture2D(src, uv) * inside(uv);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= resolution.x / resolution.y;
  float l = length(p);
  float dist = smoothstep(0.0, 1.0, pow(l, 2.0) * 0.3) * 2.0;
  float a = atan(p.y, p.x) + time * 0.2;
  vec2 dir = vec2(cos(a), sin(a));
  vec2 uv2 = uv + dir * dist * 0.1;
  gl_FragColor = readTex(uv2);
}
`;

export function useTextDistortion(enabled: boolean = true) {
  const vfxRef = useRef<any[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function init() {
      try {
        const { VFX } = await import('@vfx-js/core');
        if (cancelled) return;

        await document.fonts.ready;
        if (cancelled) return;

        const elements = document.querySelectorAll('[data-text-distortion]');
        if (!elements.length) return;

        elements.forEach((el) => {
          if (cancelled) return;

          const speed = parseFloat((el as HTMLElement).dataset.speed || '1');
          const vfx = new VFX();
          vfxRef.current.push(vfx);

          const uniforms = { time: 0 };

          vfx.add(el as HTMLElement, {
            shader: distortionShader,
            overflow: 500,
            uniforms,
          });

          function loop() {
            if (cancelled) return;
            uniforms.time = performance.now() / 1000 * speed;
            requestAnimationFrame(loop);
          }

          loop();
        });
      } catch (err) {
        console.warn('TextDistortion initialization failed:', err);
      }
    }

    init();

    return () => {
      cancelled = true;
      vfxRef.current.forEach((vfx) => {
        try {
          vfx.dispose();
        } catch {
          // ignore
        }
      });
      vfxRef.current = [];
    };
  }, [enabled]);
}
