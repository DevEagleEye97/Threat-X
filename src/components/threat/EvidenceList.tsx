'use client';

import { useState } from 'react';
import { EvidenceIndicator, EvidenceClassification } from '@/types/evidence';
import { RiskSeverity } from '@/types/risk';
import { ThreatBadge } from './ThreatBadge';
import {
  Key,
  Globe,
  Shield,
  Bug,
  Network,
  Radio,
  AlertTriangle,
  Copy,
  Check,
  HelpCircle,
  Eye,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvidenceListProps {
  evidence: EvidenceIndicator[];
}

function getIndicatorIcon(category: string) {
  switch (category) {
    case 'threat_intelligence':
      return <Radio className="h-4 w-4 text-[#EF4444]" aria-hidden="true" />;
    case 'brand_impersonation':
      return <Shield className="h-4 w-4 text-[#F97316]" aria-hidden="true" />;
    case 'credential_harvesting':
      return <Key className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />;
    case 'malware_delivery':
      return <Bug className="h-4 w-4 text-[#EF4444]" aria-hidden="true" />;
    case 'network_anomaly':
      return <Network className="h-4 w-4 text-[#22D3EE]" aria-hidden="true" />;
    case 'domain_anomaly':
    case 'url_structure':
    default:
      return <Globe className="h-4 w-4 text-[#8B7CF6]" aria-hidden="true" />;
  }
}

function getClassificationConfig(type: EvidenceClassification) {
  switch (type) {
    case 'observed':
      return {
        label: 'OBSERVED',
        borderClass: 'border-l-4 border-l-[#10B981]',
        tagBg: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
        icon: <Eye className="h-3 w-3" aria-hidden="true" />,
        tooltip: 'Confirmed empirical record in verified external feed',
      };
    case 'detected':
      return {
        label: 'DETECTED',
        borderClass: 'border-l-4 border-l-[#F59E0B]',
        tagBg: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30',
        icon: <Cpu className="h-3 w-3" aria-hidden="true" />,
        tooltip: 'Matched heuristic pattern or structural signature locally',
      };
    case 'inferred':
      return {
        label: 'INFERRED',
        borderClass: 'border-l-4 border-l-[#7667E8]',
        tagBg: 'bg-[#7667E8]/15 text-[#A5B4FC] border-[#7667E8]/30',
        icon: <AlertTriangle className="h-3 w-3" aria-hidden="true" />,
        tooltip: 'Contextual correlation of attacker intent and methodology',
      };
    case 'potential':
    default:
      return {
        label: 'POTENTIAL',
        borderClass: 'border-l-4 border-l-[#64748B]',
        tagBg: 'bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30',
        icon: <HelpCircle className="h-3 w-3" aria-hidden="true" />,
        tooltip: 'Hypothetical downstream impact if action proceeded',
      };
  }
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAnnouncement, setCopiedAnnouncement] = useState<string>('');

  const handleCopyIdentifier = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setCopiedAnnouncement(`Copied ${text} to clipboard`);
    setTimeout(() => {
      setCopiedId(null);
      setCopiedAnnouncement('');
    }, 2000);
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div
        role="region"
        aria-label="Evidence findings"
        className="threat-panel p-6 text-center space-y-2"
      >
        <div className="font-semibold text-sm text-[#E2E8F0]">
          No observable threats detected
        </div>
        <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
          No known threat indicators were found by the checks that completed. This does not guarantee that the content is safe.
        </p>
      </div>
    );
  }

  return (
    <section role="region" aria-label="Evidence indicators" className="space-y-3.5">
      {/* Screen Reader Live Region for Copy Feedback */}
      <div className="sr-only" aria-live="polite" role="status">
        {copiedAnnouncement}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#E2E8F0] flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#8B7CF6]" aria-hidden="true" />
          <span>Observed Evidence</span>
        </h3>
        <span className="text-[11px] font-mono tabular-nums text-[#94A3B8]">
          {evidence.length} {evidence.length === 1 ? 'Indicator' : 'Indicators'} Flagged
        </span>
      </div>

      {/* Classification Legend */}
      <div className="p-3.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#07090D] text-[11px] space-y-2 font-mono">
        <span className="text-[#94A3B8] font-bold uppercase tracking-[0.06em]">
          Classification Hierarchy:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[#94A3B8]">
          <div className="flex items-start gap-1.5">
            <span className="text-[#10B981] font-bold shrink-0">OBSERVED:</span>
            <span>External feed record</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[#F59E0B] font-bold shrink-0">DETECTED:</span>
            <span>Local engine match</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[#8B7CF6] font-bold shrink-0">INFERRED:</span>
            <span>Intent correlation</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[#64748B] font-bold shrink-0">POTENTIAL:</span>
            <span>Downstream impact</span>
          </div>
        </div>
      </div>

      {/* Evidence Cards Stack */}
      <div className="space-y-3">
        {evidence.map((item) => {
          const config = getClassificationConfig(item.evidenceType);
          const hasTechnicalId = Boolean(
            item.metadata?.targetUrl ||
              item.metadata?.hash ||
              item.metadata?.domain ||
              item.metadata?.ip
          );
          const technicalValue = (item.metadata?.targetUrl ||
            item.metadata?.hash ||
            item.metadata?.domain ||
            item.metadata?.ip ||
            '') as string;

          return (
            <article
              key={item.id}
              className={cn(
                'rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0F1219] p-4 transition-all hover:bg-[#161B25]',
                config.borderClass
              )}
            >
              <div className="flex items-start gap-3">
                {/* Category Icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#07090D] border border-[rgba(255,255,255,0.08)] mt-0.5">
                  {getIndicatorIcon(item.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Top line with title, classification, and severity */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-[14px] text-[#E2E8F0] truncate">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-[0.06em]',
                          config.tagBg
                        )}
                        title={config.tooltip}
                      >
                        {config.icon}
                        <span>{config.label}</span>
                      </span>
                    </div>

                    <ThreatBadge
                      severity={item.severity.toUpperCase() as RiskSeverity}
                      className="text-[10px] px-2 py-0.5 shrink-0"
                    />
                  </div>

                  {/* Finding Description */}
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Copyable Technical Value if present */}
                  {hasTechnicalId && technicalValue && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#07090D] border border-[rgba(255,255,255,0.06)] font-mono text-[11px] text-[#22D3EE] overflow-hidden">
                      <span className="truncate selection:bg-[#7667E8]/40">
                        {technicalValue}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyIdentifier(technicalValue, item.id)}
                        className="p-1 rounded hover:bg-[#161B25] text-[#94A3B8] hover:text-[#E2E8F0] transition-colors shrink-0"
                        title="Copy technical identifier"
                        aria-label={`Copy ${technicalValue}`}
                      >
                        {copiedId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Footer telemetry */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px] text-[#64748B]">
                    <span>
                      Source:{' '}
                      <strong className="text-[#94A3B8] font-medium">{item.source}</strong>
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>
                      Confidence:{' '}
                      <strong className="text-[#CBD5E1] tabular-nums font-semibold">
                        {(item.confidence * 100).toFixed(0)}%
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
