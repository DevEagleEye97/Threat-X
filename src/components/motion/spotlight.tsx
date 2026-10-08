'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotlightProps extends HTMLMotionProps<'div'> {
  className?: string;
  size?: number;
  fill?: string;
}

export function Spotlight({
  children,
  className,
  size = 350,
  fill = 'rgba(118, 103, 232, 0.09)',
  ...props
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useSpring(0, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 400, damping: 30 });

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(${size}px circle at ${x}px ${y}px, ${fill}, transparent 80%)`
  );

  useEffect(() => {
    if (containerRef.current) {
      setParentElement(containerRef.current.parentElement);
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [parentElement, mouseX, mouseY]
  );

  useEffect(() => {
    if (!parentElement) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', handleMouseEnter);
    parentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', handleMouseEnter);
      parentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 z-0 transition-opacity duration-300', className)}
      style={{
        opacity: isHovered ? 1 : 0,
        background,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
