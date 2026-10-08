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
      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2738]/60 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-indigo-400" />
            <span>Why this verdict?</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 font-bold">0 / 100 Risk</span>
        </div>
        <p className="text-xs text-slate-400">
          No malicious weight accumulated. All observed signals conform to verified baseline characteristics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-indigo-400" />
          <span>Why this verdict?</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          Deterministic Mathematical Model
        </span>
      </div>

      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-xl space-y-3 font-mono text-xs">
        <div className="space-y-2">
          {signals.map((sig, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-[#1E2738]/40">
              <span className="text-slate-300 font-sans text-xs">{sig.signal}</span>
              <span className="font-bold text-amber-400 shrink-0 ml-2">
                +{sig.weight}
              </span>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="border-t-2 border-[#263248] pt-2 flex items-center justify-between font-bold text-sm">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Normalized Risk Score:</span>
          <span className={cn(
            'text-base',
            score >= 80 ? 'text-red-400' : score >= 20 ? 'text-amber-400' : 'text-emerald-400'
          )}>
            {score} / 100
          </span>
        </div>

        <p className="text-[11px] font-sans text-slate-500 pt-1 leading-relaxed">
          Risk scores are strictly derived from empirical evidence weights. AI reasoning assists with correlation and attack-path translation but does not invent scores.
        </p>
      </div>
    </div>
  );
}
