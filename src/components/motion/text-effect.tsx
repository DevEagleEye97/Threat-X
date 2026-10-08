'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TextEffectPreset = 'fade' | 'fade-in-blur' | 'scale' | 'slide';

interface TextEffectProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  preset?: TextEffectPreset;
  per?: 'word' | 'char' | 'line';
  delay?: number;
  staggerDuration?: number;
  trigger?: boolean;
}

const defaultVariants: Record<TextEffectPreset, Variants> = {
  fade: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } },
  },
  'fade-in-blur': {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 16 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  },
};

export function TextEffect({
  children,
  className,
  as: Component = 'span',
  preset = 'fade-in-blur',
  per = 'word',
  delay = 0,
  staggerDuration = 0.04,
  trigger = true,
}: TextEffectProps) {
  const words = children.split(' ');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDuration,
      },
    },
  };

  const itemVariants = defaultVariants[preset];

  if (per === 'char') {
    const chars = Array.from(children);
    return (
      <Component className={cn('inline-block', className)}>
        <motion.span
          variants={containerVariants}
          initial="hidden"
          animate={trigger ? 'visible' : 'hidden'}
          aria-hidden="true"
        >
          {chars.map((char, index) => (
            <motion.span key={`${char}-${index}`} variants={itemVariants} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
        <span className="sr-only">{children}</span>
      </Component>
    );
  }

  return (
    <Component className={cn('inline-block', className)}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={trigger ? 'visible' : 'hidden'}
        aria-hidden="true"
        className="inline-flex flex-wrap"
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={itemVariants}
            className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
      <span className="sr-only">{children}</span>
    </Component>
  );
}
