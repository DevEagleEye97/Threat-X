'use client';

import { useEffect, useRef, useState } from 'react';

interface ThreatMatrixProps {
  isInvestigating?: boolean;
}

export function ThreatMatrix({ isInvestigating = false }: ThreatMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(isInvestigating);

  useEffect(() => {
    setActive(isInvestigating);
  }, [isInvestigating]);

  useEffect(() => {
    const handleInvestigatingEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ active?: boolean }>;
      if (typeof customEvent.detail?.active === 'boolean') {
        setActive(customEvent.detail.active);
      }
    };
    window.addEventListener('threatx:investigating', handleInvestigatingEvent);
    return () => {
      window.removeEventListener('threatx:investigating', handleInvestigatingEvent);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle binary and signal fragments: 01, 10, 001, 1011, 0110, 1001, ·, —
    const FRAGMENTS = ['01', '10', '001', '1011', '0110', '1001', '·', '—', '1', '0', 'tx'];
    const columns = Math.floor(width / 44);
    const drops: Array<{ y: number; speed: number; char: string; isPulse: boolean }> = [];

    for (let i = 0; i < columns; i++) {
      drops.push({
        y: Math.random() * height,
        speed: 0.18 + Math.random() * 0.3,
        char: FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)],
        isPulse: Math.random() < 0.08,
      });
    }

    const render = () => {
      // Clear with soft trail
      ctx.fillStyle = 'rgba(7, 9, 13, 0.22)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '9px "JetBrains Mono", ui-monospace, SFMono-Regular, monospace';

      const speedMultiplier = active ? 1.8 : 0.85;
      const baseOpacity = active ? 0.05 : 0.028;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * 44 + 14;

        if (drop.isPulse) {
          ctx.fillStyle = `rgba(118, 103, 232, ${baseOpacity * 1.6})`; // subtle #7667E8 purple signal
        } else {
          ctx.fillStyle = `rgba(161, 167, 179, ${baseOpacity})`; // muted charcoal/gray
        }

        ctx.fillText(drop.char, x, drop.y);

        drop.y += drop.speed * speedMultiplier;

        // Reset drop when past bottom
        if (drop.y > height) {
          drop.y = -15;
          drop.char = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)];
          drop.speed = 0.18 + Math.random() * 0.3;
          drop.isPulse = Math.random() < 0.08;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="threat-matrix-bg pointer-events-none opacity-90"
      aria-hidden="true"
    />
  );
}
