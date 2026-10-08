'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TextScrambleProps {
  children: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  duration?: number;
  characterSet?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function TextScramble({
  children,
  className,
  as: Component = 'span',
  duration = 800,
  characterSet = DEFAULT_CHARS,
  trigger = true,
  onScrambleComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const isScrambling = useRef(false);

  useEffect(() => {
    if (!trigger) return;
    if (isScrambling.current) return;

    isScrambling.current = true;
    const targetText = children;
    const length = targetText.length;
    const startTime = Date.now();
    const frameInterval = 30;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedLength = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (targetText[i] === ' ') {
          scrambled += ' ';
        } else if (i < revealedLength) {
          scrambled += targetText[i];
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);

      if (progress >= 1) {
        clearInterval(interval);
        setDisplayText(targetText);
        isScrambling.current = false;
        onScrambleComplete?.();
      }
    }, frameInterval);

    return () => clearInterval(interval);
  }, [children, trigger, duration, characterSet, onScrambleComplete]);

  return <Component className={cn('font-mono inline-block', className)}>{displayText}</Component>;
}
