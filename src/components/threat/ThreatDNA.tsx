'use client';

import { Dna, ArrowRight, Share2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThreatDNASignal {
  id: string;
  label: string;
  category: 'delivery' | 'technique' | 'objective' | 'anomaly';
}

interface ThreatDNAProps {
  signals?: ThreatDNASignal[];
  sharedPatternCount?: number;
  patternName?: string;
}

const DEFAULT_SIGNALS: ThreatDNASignal[] = [
  { id: '1', label: 'BRAND IMPERSONATION', category: 'technique' },
  { id: '2', label: 'URGENCY LURE', category: 'anomaly' },
  { id: '3', label: 'UNVERIFIED GATEWAY', category: 'delivery' },
  { id: '4', label: 'FAKE LOGIN FORM', category: 'technique' },
  { id: '5', label: 'CREDENTIAL HARVEST', category: 'objective' },
  { id: '6', label: 'ACCOUNT TAKEOVER', category: 'objective' },
];

export function ThreatDNA({
  signals = DEFAULT_SIGNALS,
  sharedPatternCount = 4,
  patternName = 'Credential Phishing Campaign',
}: ThreatDNAProps) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#11151B] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <Dna className="h-4 w-4 text-[#7C5CFF]" />
          <span className="font-mono text-xs font-bold text-[#F5F7FA] tracking-wider uppercase">
            Threat DNA
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#9298A5] border border-[rgba(255,255,255,0.08)] bg-[#0C0F14]">
          SIGNATURE RELATIONSHIPS
        </span>
      </div>

      <p className="text-xs text-[#9298A5] leading-relaxed">
        Interconnected signal relationships mapped to known adversary tactical playbooks.
      </p>

      {/* Sequential DNA Nodes */}
      <div className="p-3.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#07090D] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max text-xs font-mono">
          {signals.map((sig, idx) => (
            <div key={sig.id} className="flex items-center gap-2">
              <div
                className={cn(
                  'px-2.5 py-1.5 rounded border text-[11px] font-medium transition-colors',
                  sig.category === 'objective'
                    ? 'border-[#FF5C5C]/40 bg-[#FF5C5C]/10 text-[#FF5C5C]'
                    : sig.category === 'technique'
                    ? 'border-[#7C5CFF]/40 bg-[#7C5CFF]/10 text-[#9B85FF]'
                    : sig.category === 'anomaly'
                    ? 'border-[#E7B65A]/40 bg-[#E7B65A]/10 text-[#E7B65A]'
                    : 'border-[rgba(255,255,255,0.1)] bg-[#11151B] text-[#F5F7FA]'
                )}
              >
                {sig.label}
              </div>

              {idx < signals.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-[#626977] shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Correlation Note */}
      <div className="flex items-start gap-2.5 pt-1 text-xs text-[#9298A5]">
        <Layers className="h-4 w-4 text-[#7C5CFF] shrink-0 mt-0.5" />
        <p className="leading-snug">
          This investigation shares <strong className="text-[#F5F7FA]">{sharedPatternCount} signals</strong> with previously observed scam patterns associated with <span className="text-[#9B85FF] font-medium">{patternName}</span>.
        </p>
      </div>
    </div>
  );
}
