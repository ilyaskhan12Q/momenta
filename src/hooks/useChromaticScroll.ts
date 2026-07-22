import { useEffect, useRef } from 'react';

const chromaticShader = `
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
  float d = scroll * 2.0;
  vec4 cr = readTex(uv + vec2(0.0, d));
  vec4 cg = readTex(uv + vec2(0.0, d * 2.0));
  vec4 cb = readTex(uv + vec2(0.0, d * 3.0));
  float a = max(max(cr.a, cg.a), cb.a);
  gl_FragColor = vec4(cr.r, cg.g, cb.b, a);
}
`;

export function useChromaticScroll(enabled: boolean = true) {
  const vfxRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function init() {
      try {
        const { VFX } = await import('@vfx-js/core');
        if (cancelled) return;

        await document.fonts.ready;
        if (cancelled) return;

        const heroText = document.querySelector('[data-distortion]') as HTMLElement;
        if (!heroText) return;

        const vfx = new VFX();
        vfxRef.current = vfx;

        const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

        let scrollCurrent = window.scrollY / window.innerHeight;
        let scrollTarget = scrollCurrent;
        let scrollPrev = scrollCurrent;
        let velocity = 0;

        const shaderUniforms = { scroll: scrollCurrent };

        vfx.add(heroText, {
          shader: chromaticShader,
          overflow: 500,
          uniforms: shaderUniforms,
        });

        const onScroll = () => {
          scrollTarget = window.scrollY / window.innerHeight;
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        function renderLoop() {
          if (cancelled) return;
          scrollCurrent = scrollTarget;
          velocity = lerp(velocity, Math.abs(scrollCurrent - scrollPrev), 0.03);
          shaderUniforms.scroll = scrollCurrent + velocity * 2.0;
          scrollPrev = scrollCurrent;
          requestAnimationFrame(renderLoop);
        }

        renderLoop();

        return () => {
          window.removeEventListener('scroll', onScroll);
        };
      } catch (err) {
        console.warn('ChromaticScroll initialization failed:', err);
      }
    }

    init();

    return () => {
      cancelled = true;
      if (vfxRef.current) {
        try {
          vfxRef.current.dispose();
        } catch {
          // ignore
        }
      }
    };
  }, [enabled]);
}
