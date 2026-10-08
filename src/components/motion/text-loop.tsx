'use client';

import React, { useState, useEffect, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextLoopProps {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
}

export function TextLoop({ children, className, interval = 2800 }: TextLoopProps) {
  const [index, setIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  return (
    <span className={cn('relative inline-flex overflow-hidden align-baseline', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
