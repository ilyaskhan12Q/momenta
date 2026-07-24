'use client';

import React, { useEffect, useRef } from 'react';
import type { ShaderTokens, ColorTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface ShaderBackgroundCanvasProps {
  shader: ShaderTokens;
  colors: ColorTokens;
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

const FRAGMENT_SHADER_AURORA = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_intensity;

  void main() {
    vec2 uv = v_uv;
    float wave = sin(uv.x * 4.0 + u_time * u_speed * 1.5) * 0.5 + 0.5;
    wave += cos(uv.y * 3.0 - u_time * u_speed) * 0.5 + 0.5;
    
    vec3 colorA = vec3(0.12, 0.05, 0.15);
    vec3 colorB = vec3(0.9, 0.3, 0.5);
    vec3 finalColor = mix(colorA, colorB, wave * u_intensity * 0.4);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const ShaderBackgroundCanvas: React.FC<ShaderBackgroundCanvasProps> = ({
  shader,
  colors,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    let animFrameId: number;
    let startTime = Date.now();

    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_AURORA);
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

    const render = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uSpeed, shader.speed || 0.8);
      gl.uniform1f(uIntensity, shader.intensity || 0.6);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [shader, reducedMotion]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: colors.background,
        backgroundImage: colors.ambientGradients[0],
      }}
    >
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
        />
      )}
    </div>
  );
};
