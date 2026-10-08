'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InViewProps {
  children: React.ReactNode;
  variants?: Variants;
  transition?: Record<string, unknown>;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  viewOptions?: Parameters<typeof useInView>[1];
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  className,
  as: Component = 'div',
  viewOptions = { once: true, margin: '0px 0px -50px 0px' },
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
