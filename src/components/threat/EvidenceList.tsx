'use client';

import { EvidenceIndicator } from '@/types/evidence';
import { ThreatBadge } from './ThreatBadge';
import { AlertTriangle, Key, Globe, Shield, Bug, Network, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceListProps {
  evidence: EvidenceIndicator[];
}

function getIndicatorIcon(category: string) {
  switch (category) {
    case 'threat_intelligence':
      return <Radio className="h-4 w-4 text-red-400" />;
    case 'brand_impersonation':
      return <Shield className="h-4 w-4 text-orange-400" />;
    case 'credential_harvesting':
      return <Key className="h-4 w-4 text-amber-400" />;
    case 'malware_delivery':
      return <Bug className="h-4 w-4 text-red-400" />;
    case 'network_anomaly':
      return <Network className="h-4 w-4 text-blue-400" />;
    case 'domain_anomaly':
    case 'url_structure':
    default:
      return <Globe className="h-4 w-4 text-indigo-400" />;
  }
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 text-center text-xs text-slate-400">
        No empirical threat indicators detected. Content matches normal baseline characteristics.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-indigo-400" />
          <span>Observed Evidence</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">
          {evidence.length} Indicators Flagged
        </span>
      </div>

      {/* Classification Legend */}
      <div className="p-3 rounded-xl border border-[#1E2738] bg-[#0A0E17] text-[10px] space-y-1.5 font-mono">
        <span className="text-slate-400 font-bold uppercase tracking-wider">Classification Legend:</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400">
          <div>
            <span className="text-emerald-400 font-bold">OBSERVED</span>: Confirmed empirical record in external feed
          </div>
          <div>
            <span className="text-amber-400 font-bold">DETECTED</span>: Matched heuristic or signature locally
          </div>
          <div>
            <span className="text-indigo-400 font-bold">INFERRED</span>: Contextual correlation of attacker intent
          </div>
          <div>
            <span className="text-slate-500 font-bold">POTENTIAL</span>: Hypothetical downstream consequence
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3.5 p-3.5 rounded-xl border border-[#1E2738] bg-[#111622] hover:bg-[#151C2C] transition-all"
          >
            {/* Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A0E17] border border-[#222E42] mt-0.5">
              {getIndicatorIcon(item.category)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs text-slate-200 truncate">
                  {item.title}
                </span>
                <ThreatBadge
                  severity={item.severity.toUpperCase() as any}
                  className="text-[9px] px-2 py-0.2 shrink-0"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[10px] font-mono text-slate-500">
                <span>Source: <strong className="text-slate-400">{item.source}</strong></span>
                <span>•</span>
                <span>Confidence: <strong className="text-slate-300">{(item.confidence * 100).toFixed(0)}%</strong></span>
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded bg-[#090D15] border border-[#222E42] uppercase text-indigo-300 font-semibold">
                  {item.evidenceType}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
