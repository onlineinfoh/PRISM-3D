"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    const pointer = { x: 0, y: 0, active: false };
    let particles: Particle[] = [];

    const particleCount = () => {
      const area = width * height;
      return Math.max(70, Math.min(220, Math.floor(area / 10000)));
    };

    const resetParticles = () => {
      const count = particleCount();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.9 + Math.random() * 1.5,
        seed: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      resetParticles();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const step = () => {
      // Slight persistence creates flow trails instead of static-looking points.
      ctx.fillStyle = "rgba(248, 250, 252, 0.23)";
      ctx.fillRect(0, 0, width, height);

      const linkDist = 98;
      const linkDistSq = linkDist * linkDist;
      const collisionDist = 20;
      const collisionDistSq = collisionDist * collisionDist;
      const t = frame * 0.012;

      // Periodic low-rate reseed prevents long-term lane collapse/banding.
      if (frame > 0 && frame % 240 === 0) {
        const reseedCount = Math.max(1, Math.floor(particles.length * 0.04));
        for (let r = 0; r < reseedCount; r += 1) {
          const idx = Math.floor(Math.random() * particles.length);
          const p = particles[idx];
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = (Math.random() - 0.5) * 0.6;
          p.seed = Math.random() * Math.PI * 2;
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;

          if (distSq <= 0.0001) continue;
          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq);
            const fade = 1 - dist / linkDist;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * fade})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }

          if (distSq < collisionDistSq) {
            const dist = Math.sqrt(distSq);
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            const push = (collisionDist - dist) * 0.0046;
            a.vx -= nx * push;
            a.vy -= ny * push;
            b.vx += nx * push;
            b.vy += ny * push;
          }
        }

        if (pointer.active) {
          const pdx = a.x - pointer.x;
          const pdy = a.y - pointer.y;
          const pDistSq = pdx * pdx + pdy * pdy;
          const pRadius = 170;
          if (pDistSq < pRadius * pRadius) {
            const pDist = Math.sqrt(pDistSq) || 1;
            const pnX = pdx / pDist;
            const pnY = pdy / pDist;
            const repel = (1 - pDist / pRadius) * 0.06;
            a.vx += pnX * repel;
            a.vy += pnY * repel;
          }
        }

        // Curl-dominant flow keeps motion dynamic without collapsing into a narrow band.
        const flowX =
          Math.sin(a.y * 0.007 + t * 0.9 + a.seed) * 0.9 +
          Math.sin((a.y + a.x) * 0.003 - t * 0.6) * 0.35;
        const flowY =
          -Math.sin(a.x * 0.007 - t * 0.85 - a.seed * 0.7) * 0.9 +
          Math.sin((a.x - a.y) * 0.003 + t * 0.5) * 0.35;
        const jitterX = Math.sin(t * 2.1 + a.seed * 2.9) * 0.0016;
        const jitterY = Math.cos(t * 1.9 + a.seed * 3.3) * 0.0016;
        const breezeX = Math.cos(t * 0.13 + a.seed) * 0.0009;
        const breezeY = Math.sin(t * 0.11 + a.seed * 1.2) * 0.0009;
        a.vx += flowX * 0.0042 + jitterX + breezeX;
        a.vy += flowY * 0.0042 + jitterY + breezeY;

        // Keep particles in motion so they do not stall and clump.
        a.vx *= 0.986;
        a.vy *= 0.986;
        const speed = Math.hypot(a.vx, a.vy);
        const minSpeed = 0.25;
        const maxSpeed = 1.35;
        if (speed < minSpeed) {
          const ang = Math.atan2(a.vy, a.vx) + 0.35;
          a.vx = Math.cos(ang) * minSpeed;
          a.vy = Math.sin(ang) * minSpeed;
        } else if (speed > maxSpeed) {
          const s = maxSpeed / speed;
          a.vx *= s;
          a.vy *= s;
        }

        a.x += a.vx;
        a.y += a.vy;

        // Wrap at edges to preserve continuous flow.
        if (a.x < -8) a.x = width + 8;
        else if (a.x > width + 8) a.x = -8;
        if (a.y < -8) a.y = height + 8;
        else if (a.y > height + 8) a.y = -8;

        const pulse = 0.45 + 0.35 * Math.sin((frame + i * 17) * 0.02);
        ctx.beginPath();
        ctx.fillStyle = `rgba(15, 118, 110, ${0.35 + pulse * 0.3})`;
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame += 1;
      animation = window.requestAnimationFrame(step);
    };

    let animation = 0;
    resize();
    if (!reduceMotion) {
      animation = window.requestAnimationFrame(step);
    } else {
      // Draw one static frame for users requesting reduced motion.
      step();
      window.cancelAnimationFrame(animation);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
}
