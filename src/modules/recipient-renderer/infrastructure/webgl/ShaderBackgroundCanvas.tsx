'use client';

import React, { useEffect, useRef } from 'react';
import type { ShaderTokens, ColorTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';
import { AtmosphereEngine } from '../../domain/AtmosphereEngine';

export interface ShaderBackgroundCanvasProps {
  shader?: ShaderTokens;
  colors?: ColorTokens;
  relationshipType?: string;
  currentState?: string;
  particleType?: 'petals' | 'embers' | 'stars' | 'gold_dust' | 'bokeh';
  reducedMotion?: boolean;
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADERS: Record<string, string> = {
  AURORA: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_uv + (u_mouse - 0.5) * 0.05;
      float wave = sin(uv.x * 3.5 + u_time * u_speed * 1.2) * 0.5 + 0.5;
      wave += cos(uv.y * 2.8 - u_time * u_speed * 0.9) * 0.5 + 0.5;
      
      vec3 colorA = vec3(0.04, 0.06, 0.12);
      vec3 colorB = vec3(0.2, 0.45, 0.85);
      vec3 colorC = vec3(0.5, 0.25, 0.7);
      
      vec3 finalColor = mix(colorA, colorB, wave * u_intensity * 0.55);
      finalColor = mix(finalColor, colorC, sin(u_time * 0.3) * 0.2 + 0.2);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  GOLD_DUST: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_uv + (u_mouse - 0.5) * 0.04;
      float glow = sin(uv.x * 5.0 + u_time * u_speed) * cos(uv.y * 5.0 - u_time * u_speed * 0.8);
      glow = pow(abs(glow), 2.0);

      vec3 bg = vec3(0.06, 0.04, 0.02);
      vec3 gold = vec3(0.85, 0.65, 0.2);
      vec3 warmAmber = vec3(0.9, 0.45, 0.1);

      vec3 finalColor = mix(bg, gold, glow * u_intensity * 0.45);
      finalColor += warmAmber * sin(u_time * 0.4 + uv.x * 2.0) * 0.15;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  EMBERS: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_uv + (u_mouse - 0.5) * 0.03;
      float dist = length(uv - vec2(0.5, 0.65));
      float warmGlow = (1.0 - smoothstep(0.0, 0.85, dist)) * 0.5;
      
      vec3 bg = vec3(0.06, 0.02, 0.04);
      vec3 emberRed = vec3(0.85, 0.22, 0.18);
      
      vec3 finalColor = mix(bg, emberRed, warmGlow * u_intensity);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  STARLIGHT: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_uv + (u_mouse - 0.5) * 0.06;
      float twinkle = sin(uv.x * 20.0 + u_time * 2.0) * cos(uv.y * 20.0 - u_time * 1.5);
      twinkle = smoothstep(0.55, 1.0, twinkle);

      vec3 bg = vec3(0.02, 0.04, 0.08);
      vec3 starlight = vec3(0.65, 0.85, 1.0);

      vec3 finalColor = bg + starlight * twinkle * u_intensity * 0.4;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  WATERCOLOR: `
    precision mediump float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform float u_speed;
    uniform float u_intensity;
    uniform vec2 u_mouse;

    void main() {
      vec2 uv = v_uv + (u_mouse - 0.5) * 0.04;
      float bloom = sin(uv.x * 2.5 + u_time * 0.5) * cos(uv.y * 2.5 + u_time * 0.4);
      bloom = smoothstep(-0.5, 0.8, bloom);

      vec3 color1 = vec3(0.07, 0.04, 0.06);
      vec3 color2 = vec3(0.8, 0.45, 0.35);
      vec3 color3 = vec3(0.5, 0.25, 0.55);

      vec3 finalColor = mix(color1, color2, bloom * u_intensity * 0.5);
      finalColor = mix(finalColor, color3, sin(u_time * 0.2) * 0.2 + 0.2);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

export const ShaderBackgroundCanvas: React.FC<ShaderBackgroundCanvasProps> = ({
  shader,
  colors,
  relationshipType = 'ROMANTIC',
  currentState = 'UNOPENED',
  particleType,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Get dynamic atmosphere parameters based on relationship & state
  const atmosphere = AtmosphereEngine.getProfile(relationshipType);
  const modifier = AtmosphereEngine.getStateModifier(currentState);

  const activeShaderKey = shader?.fragmentShaderKey || atmosphere.shaderKey;
  const activeParticleType = particleType || atmosphere.particleType;
  const activeGlowColor = colors?.accentGlow || atmosphere.accentGlow;
  const activeBgColor = colors?.background || atmosphere.backgroundColor;
  const activeGradient = colors?.ambientGradients?.[0] || atmosphere.ambientGradient;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 1. WebGL Shader Rendering Engine
  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animFrameId: number;
    const startTime = Date.now();

    const fragmentCode = FRAGMENT_SHADERS[activeShaderKey] || FRAGMENT_SHADERS.AURORA;

    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const frag = createShader(gl.FRAGMENT_SHADER, fragmentCode);
    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    const render = () => {
      // Smooth mouse lerping
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

      const elapsed = (Date.now() - startTime) / 1000;
      const targetSpeed = (shader?.speed || atmosphere.baseSpeed) * modifier.speedMultiplier;
      const targetIntensity = (shader?.intensity || atmosphere.baseIntensity) * modifier.intensityMultiplier;

      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uSpeed, targetSpeed);
      gl.uniform1f(uIntensity, targetIntensity);
      if (uMouse) {
        gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [activeShaderKey, shader, atmosphere, modifier, reducedMotion]);

  // 2. Interactive Floating Particle Overlay (2D Canvas)
  useEffect(() => {
    if (reducedMotion || !particleCanvasRef.current) return;
    const canvas = particleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const count = Math.round(atmosphere.particleCount * modifier.particleCountMultiplier);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.2,
      opacity: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.4 * modifier.turbulence,
      vy: -(Math.random() * 0.5 + 0.2) * modifier.speedMultiplier,
      phase: Math.random() * Math.PI * 2,
    }));

    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + (mouseRef.current.x - 0.5) * 0.35;
        p.y += p.vy;
        p.phase += 0.02 * modifier.speedMultiplier;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity + Math.sin(p.phase) * 0.18;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = activeGlowColor;
        ctx.globalAlpha = Math.max(0.05, Math.min(0.85, currentOpacity * modifier.intensityMultiplier));
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = activeGlowColor;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(renderParticles);
    };

    renderParticles();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeGlowColor, activeParticleType, atmosphere, modifier, reducedMotion]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: activeBgColor,
        backgroundImage: activeGradient,
      }}
    >
      {!reducedMotion && (
        <>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
          <canvas
            ref={particleCanvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          />
        </>
      )}
    </div>
  );
};
