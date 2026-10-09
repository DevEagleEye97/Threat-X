'use client';

import { useState } from 'react';
import { NormalizedUrlDetails } from '@/types/investigation';
import { ChevronDown, Server, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalEvidenceProps {
  urlDetails: NormalizedUrlDetails;
}

export function TechnicalEvidence({ urlDetails }: TechnicalEvidenceProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (value: string, key: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section
      role="region"
      aria-label="Technical Forensic Telemetry"
      className="threat-panel overflow-hidden transition-all"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="technical-evidence-details"
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-[#161B25]"
      >
        <div className="flex items-center gap-2.5">
          <Server className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#E2E8F0]">
            Technical Evidence & Telemetry
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span className="text-[11px] font-mono text-[#64748B] hidden sm:inline">
            RFC-3986 Deconstruction
          </span>
          <ChevronDown
            className={cn('h-4 w-4 text-[#94A3B8] transition-transform duration-150', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </div>
      </button>

      {isOpen && (
        <div
          id="technical-evidence-details"
          className="p-4 sm:p-5 pt-0 border-t border-[rgba(255,255,255,0.06)] space-y-2 text-xs font-mono"
        >
          {/* FQDN */}
          <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[#64748B]">FQDN Hostname:</span>
            <div className="flex items-center gap-2 max-w-[65%]">
              <span className="text-[#E2E8F0] font-semibold truncate selection:bg-[#7667E8]/40">
                {urlDetails.hostname}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(urlDetails.hostname, 'fqdn')}
                className="p-1 rounded hover:bg-[#161B25] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors shrink-0"
                title="Copy FQDN"
                aria-label="Copy FQDN"
              >
                {copiedKey === 'fqdn' ? (
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Registrable Domain */}
          <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[#64748B]">Registrable Domain (eTLD+1):</span>
            <div className="flex items-center gap-2 max-w-[65%]">
              <span className="text-[#22D3EE] font-semibold truncate selection:bg-[#7667E8]/40">
                {urlDetails.registrableDomain}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(urlDetails.registrableDomain, 'domain')}
                className="p-1 rounded hover:bg-[#161B25] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors shrink-0"
                title="Copy Registrable Domain"
                aria-label="Copy Registrable Domain"
              >
                {copiedKey === 'domain' ? (
                  <Check className="h-3.5 w-3.5 text-[#10B981]" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Punycode IDN */}
          <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[#64748B]">Punycode (IDN Homograph):</span>
            <span
              className={cn(
                'font-semibold px-2 py-0.5 rounded text-[11px] border',
                urlDetails.isPunycode
                  ? 'bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30'
                  : 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
              )}
            >
              {urlDetails.isPunycode ? 'DETECTED (xn-- Homograph)' : 'NONE (Clean ASCII)'}
            </span>
          </div>

          {/* Shannon Entropy */}
          <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[#64748B]">Shannon Entropy:</span>
            <span className="text-[#E2E8F0] tabular-nums font-semibold">
              {urlDetails.entropy} <span className="text-[#64748B] font-normal">bits / char</span>
            </span>
          </div>

          {/* Subdomain Tiers */}
          <div className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[#64748B]">Subdomain Count:</span>
            <span className="text-[#E2E8F0] tabular-nums font-semibold">
              {urlDetails.subdomains.length} <span className="text-[#64748B] font-normal">tiers</span>
            </span>
          </div>

          {/* Scheme & Port */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[#64748B]">Scheme & Egress Port:</span>
            <span className="text-[#CBD5E1] tabular-nums">
              {urlDetails.protocol.toUpperCase()} / Port{' '}
              {urlDetails.port || (urlDetails.protocol === 'https' ? '443 (TLS)' : '80 (Cleartext)')}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
