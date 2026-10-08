'use client';

import { useState } from 'react';
import { NormalizedUrlDetails } from '@/types/investigation';
import { ChevronDown, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalEvidenceProps {
  urlDetails: NormalizedUrlDetails;
}

export function TechnicalEvidence({ urlDetails }: TechnicalEvidenceProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-[#1E2738] bg-[#111622] overflow-hidden shadow-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[#151C2C]"
      >
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-indigo-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
            Technical Evidence
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] font-mono text-slate-500">Telemetry Dump</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-[#1E2738]/40 space-y-2 text-xs font-mono">
          <div className="grid grid-cols-3 py-1.5 border-b border-[#1E2738]/30">
            <span className="text-slate-500">FQDN:</span>
            <span className="col-span-2 text-slate-200 truncate">{urlDetails.hostname}</span>
          </div>

          <div className="grid grid-cols-3 py-1.5 border-b border-[#1E2738]/30">
            <span className="text-slate-500">Registrable Domain:</span>
            <span className="col-span-2 text-indigo-400">{urlDetails.registrableDomain}</span>
          </div>

          <div className="grid grid-cols-3 py-1.5 border-b border-[#1E2738]/30">
            <span className="text-slate-500">Punycode (IDN):</span>
            <span className="col-span-2 text-slate-200">{urlDetails.isPunycode ? 'DETECTED (xn--)' : 'NONE (Latin-1)'}</span>
          </div>

          <div className="grid grid-cols-3 py-1.5 border-b border-[#1E2738]/30">
            <span className="text-slate-500">Shannon Entropy:</span>
            <span className="col-span-2 text-slate-200">{urlDetails.entropy} bits</span>
          </div>

          <div className="grid grid-cols-3 py-1.5 border-b border-[#1E2738]/30">
            <span className="text-slate-500">Subdomain Count:</span>
            <span className="col-span-2 text-slate-200">{urlDetails.subdomains.length} tiers</span>
          </div>

          <div className="grid grid-cols-3 py-1.5">
            <span className="text-slate-500">Host Scheme:</span>
            <span className="col-span-2 text-slate-200">{urlDetails.protocol.toUpperCase()} / Port {urlDetails.port || (urlDetails.protocol === 'https' ? '443' : '80')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
