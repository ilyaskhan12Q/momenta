import { useEffect, useRef } from 'react';

interface StarFieldOptions {
  starCount?: number;
  isMobile?: boolean;
}

export function useStarField(canvasRef: React.RefObject<HTMLCanvasElement | null>, options: StarFieldOptions = {}) {
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const starCount = options.isMobile ? 800 : (options.starCount || 1800);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const layerSpeeds = [0.8, 0.5, 0.2];

    class Star {
      x = Math.random() * width;
      y = Math.random() * height;
      size = Math.random() * 2.5 + 0.5;
      speed = Math.random() * 0.3 + 0.05;
      opacity = Math.random();
      fade = Math.random() * 0.02 + 0.005;
      direction = Math.random() < 0.5 ? 1 : -1;
      layer = Math.floor(Math.random() * 3);

      update() {
        this.x += this.speed * this.direction * layerSpeeds[this.layer];

        const wrapWidth = width + 200;
        if (this.x < -100) this.x = wrapWidth;
        if (this.x > wrapWidth) this.x = -100;

        this.opacity += this.fade * this.direction;

        if (this.opacity > 1 || this.opacity < 0) {
          this.direction *= -1;
        }
      }

      draw() {
        const speedFactor = layerSpeeds[this.layer];
        const brightness = 0.5 + 0.5 * Math.cos(Date.now() * 0.001 * speedFactor + this.x * 0.01);
        const alpha = this.opacity * brightness;
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fillRect(this.x, this.y, this.size, this.size);
      }
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      initStars();
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw();
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [canvasRef, options.starCount, options.isMobile]);
}
