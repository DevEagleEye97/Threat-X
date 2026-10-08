'use client';

import { useState } from 'react';
import { Dna, ArrowRight, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThreatDNASignal {
  id: string;
  label: string;
  category: 'delivery' | 'technique' | 'objective' | 'anomaly';
  evidenceSnippet?: string;
  confidence?: number;
}

interface ThreatDNAProps {
  signals?: ThreatDNASignal[];
  sharedPatternCount?: number;
  patternName?: string;
}

const DEFAULT_SIGNALS: ThreatDNASignal[] = [
  { id: '1', label: 'IMPERSONATION', category: 'technique', evidenceSnippet: 'Spoofed Brand / Institutional Header', confidence: 96 },
  { id: '2', label: 'URGENCY', category: 'anomaly', evidenceSnippet: 'Artificial Deadline & Service Suspension Lure', confidence: 92 },
  { id: '3', label: 'UNVERIFIED GATEWAY', category: 'delivery', evidenceSnippet: 'Direct APK / Phish Tunnel Delivery', confidence: 88 },
  { id: '4', label: 'FAKE LOGIN FORM', category: 'technique', evidenceSnippet: 'Credential Input Fields on Untrusted Host', confidence: 95 },
  { id: '5', label: 'CREDENTIAL HARVEST', category: 'objective', evidenceSnippet: 'Intercepts Password & Session Tokens', confidence: 94 },
  { id: '6', label: 'ACCOUNT TAKEOVER', category: 'objective', evidenceSnippet: 'Full Identity & Account Access Pivot', confidence: 91 },
];

export function ThreatDNA({
  signals = DEFAULT_SIGNALS,
  sharedPatternCount = 4,
  patternName = 'Credential Phishing Campaign',
}: ThreatDNAProps) {
  const [hoveredNode, setHoveredNode] = useState<ThreatDNASignal | null>(null);

  return (
    <div className="threat-glass p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-2">
          <Dna className="h-4 w-4 text-[#8B7CF6]" />
          <span className="font-mono text-xs font-bold text-[#F5F6F8] tracking-wider uppercase">
            Threat DNA Chain
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A1A7B3] border border-[rgba(255,255,255,0.08)] bg-[#0B0F14]">
          KILL-CHAIN SEQUENCE
        </span>
      </div>

      <p className="text-xs text-[#A1A7B3] leading-relaxed">
        Interconnected tactical stages reconstructed from empirical payload evidence.
      </p>

      {/* Sequential Glass DNA Nodes */}
      <div className="p-3.5 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#07090D]/90 overflow-x-auto relative">
        <div className="flex items-center gap-2 min-w-max text-xs font-mono py-1">
          {signals.map((sig, idx) => {
            const isObjective = sig.category === 'objective';
            const isTechnique = sig.category === 'technique';
            const isAnomaly = sig.category === 'anomaly';

            return (
              <div key={sig.id} className="flex items-center gap-2 relative group">
                <div
                  onMouseEnter={() => setHoveredNode(sig)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={cn(
                    'px-3 py-1.5 rounded-md border text-[11px] font-mono font-semibold transition-all cursor-pointer backdrop-blur-md relative z-10',
                    isObjective
                      ? 'border-[#F05A5A]/35 bg-[#F05A5A]/12 text-[#F05A5A] hover:bg-[#F05A5A]/20 hover:border-[#F05A5A]/60'
                      : isTechnique
                      ? 'border-[#7667E8]/35 bg-[#7667E8]/12 text-[#8B7CF6] hover:bg-[#7667E8]/20 hover:border-[#7667E8]/60'
                      : isAnomaly
                      ? 'border-[#D8A84E]/35 bg-[#D8A84E]/12 text-[#D8A84E] hover:bg-[#D8A84E]/20 hover:border-[#D8A84E]/60'
                      : 'border-[rgba(255,255,255,0.12)] bg-[#10151C]/80 text-[#F5F6F8] hover:bg-[#141A22]'
                  )}
                >
                  {sig.label}
                </div>

                {idx < signals.length - 1 && (
                  <span className="text-[#7667E8] font-bold text-xs shrink-0 select-none">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Hover Evidence Tooltip / Node Detail */}
      {hoveredNode && (
        <div className="rounded-lg border border-[#7667E8]/30 bg-[#10151C] p-3 text-xs font-mono space-y-1 animate-in fade-in duration-150 shadow-lg">
          <div className="flex items-center justify-between text-[#8B7CF6]">
            <span className="font-bold">{hoveredNode.label}</span>
            <span>Confidence: {hoveredNode.confidence || 94}%</span>
          </div>
          <div className="text-[11px] text-[#A1A7B3]">
            Evidence: {hoveredNode.evidenceSnippet || 'Observable tactical signal'}
          </div>
        </div>
      )}

      {/* Pattern Correlation Note */}
      <div className="flex items-start gap-2.5 pt-1 text-xs text-[#69717F]">
        <Layers className="h-4 w-4 text-[#8B7CF6] shrink-0 mt-0.5" />
        <p className="leading-snug">
          This investigation maps <strong className="text-[#F5F6F8]">{signals.length} empirical signals</strong> directly into the known <span className="text-[#8B7CF6] font-medium">{patternName}</span> kill-chain.
        </p>
      </div>
    </div>
  );
}
