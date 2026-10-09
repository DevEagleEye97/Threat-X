'use client';

import { WhyVerdictSignal } from '@/types/investigation';
import { Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WhyVerdictProps {
  score: number;
  signals: WhyVerdictSignal[];
}

export function WhyVerdict({ score, signals }: WhyVerdictProps) {
  // If no signals provided, show clean baseline
  if (!signals || signals.length === 0) {
    return (
      <section
        role="region"
        aria-label="Mathematical verdict explanation"
        className="threat-panel p-5 space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(255,255,255,0.08)] text-xs">
          <span className="font-mono font-bold uppercase tracking-[0.06em] text-[#E2E8F0] flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
            <span>Why this verdict?</span>
          </span>
          <span className="text-[11px] font-mono tabular-nums text-[#10B981] font-bold">
            0 / 100 Risk
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          No malicious weight accumulated. All observed signals conform to verified baseline characteristics.
        </p>
      </section>
    );
  }

  return (
    <section role="region" aria-label="Mathematical verdict breakdown" className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#E2E8F0] flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
          <span>Why this verdict?</span>
        </h3>
        <span className="text-[11px] font-mono text-[#64748B]">
          Deterministic Mathematical Model
        </span>
      </div>

      <div className="threat-panel p-5 space-y-3 font-mono text-xs">
        <div className="divide-y divide-[rgba(255,255,255,0.06)]">
          {signals.map((sig, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 text-xs">
              <span className="text-[#CBD5E1] font-sans">{sig.signal}</span>
              <span className="font-bold tabular-nums text-[#F59E0B] shrink-0 ml-3">
                +{sig.weight}
              </span>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="border-t border-[rgba(255,255,255,0.12)] pt-3 flex items-center justify-between font-bold text-sm">
          <span className="text-[#94A3B8] text-xs uppercase tracking-[0.06em]">
            Normalized Mathematical Risk:
          </span>
          <span
            className={cn(
              'text-base tabular-nums font-mono',
              score >= 80 ? 'text-[#EF4444]' : score >= 20 ? 'text-[#F59E0B]' : 'text-[#10B981]'
            )}
          >
            {score} / 100
          </span>
        </div>

        <p className="text-[11px] font-sans text-[#64748B] pt-1 leading-relaxed">
          Risk scores are strictly derived from weighted empirical signals. AI reasoning assists with correlation and attack-path translation but never overrides deterministic calculations.
        </p>
      </div>
    </section>
  );
}
