'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowEffectProps {
  className?: string;
  color?: string;
  blur?: number;
  opacity?: number;
  pulse?: boolean;
}

export function GlowEffect({
  className,
  color = '#7667E8',
  blur = 32,
  opacity = 0.18,
  pulse = true,
}: GlowEffectProps) {
  return (
    <motion.div
      aria-hidden="true"
      animate={
        pulse
          ? {
              opacity: [opacity * 0.7, opacity, opacity * 0.7],
              scale: [0.98, 1.02, 0.98],
            }
          : undefined
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      className={cn('pointer-events-none absolute inset-0 -z-10 rounded-[inherit]', className)}
    />
  );
}
