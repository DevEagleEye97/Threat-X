'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Built for the people.',
  'Built by the people.',
  'Built to protect the people.',
  'Built in India. 🇮🇳',
];

export function TypewriterStatement() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = MESSAGES[messageIndex];
    const isIndia = messageIndex === MESSAGES.length - 1;

    // Typing and deleting speeds
    const speed = deleting ? 30 : 60;

    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));

        if (text.length + 1 === current.length) {
          // Pause longer on the final "Built in India. 🇮🇳" signature
          const pauseTime = isIndia ? 2600 : 1500;
          setTimeout(() => setDeleting(true), pauseTime);
        }
      } else {
        setText(current.slice(0, text.length - 1));

        if (text.length === 0) {
          setDeleting(false);
          setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, deleting, messageIndex]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[rgba(255,255,255,0.12)] bg-[#10151C] font-mono text-[12px] sm:text-[13px] text-[#F5F6F8] shadow-sm">
      <span className="text-[#8B7CF6] font-bold">&gt;</span>
      <span className="tracking-wide font-medium">{text}</span>
      <span className="animate-pulse text-[#8B7CF6] font-bold">|</span>
    </div>
  );
}
