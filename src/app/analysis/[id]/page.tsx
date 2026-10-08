'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InvestigationResult } from '@/types/investigation';
import { IncidentOption } from '@/components/threat/IncidentOption';
import { AttackGraph } from '@/components/threat/AttackGraph';
import { ThreatDNA } from '@/components/threat/ThreatDNA';
import { ThreatIntelList } from '@/components/threat/ThreatIntelList';
import {
  ArrowLeft,
  Copy,
  Check,
  ShieldAlert,
  Download,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { getSeverityColor } from '@/lib/risk/severity';

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [investigation, setInvestigation] = useState<InvestigationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/investigations/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Investigation record not found.');
        return res.json();
      })
      .then((data) => {
        setInvestigation(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleCopyTarget = () => {
    const target = investigation?.targetUrl || investigation?.inputContentSnippet || '';
    if (target) {
      navigator.clipboard.writeText(target);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJson = () => {
    if (!investigation) return;
    const blob = new Blob([JSON.stringify(investigation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threatx-${investigation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center space-y-4">
        <div className="h-6 w-6 border-2 border-[#7667E8] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#A1A7B3]">Loading forensic case dossier…</p>
      </div>
    );
  }

  if (error || !investigation) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <div className="text-[#F05A5A] font-semibold text-sm">
          {error || 'Investigation session not found'}
        </div>
        <p className="text-xs text-[#A1A7B3]">
          The requested investigation ID may have expired or was purged from ephemeral memory.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 rounded-md bg-[#7667E8] text-xs font-medium text-[#F4F5F7] hover:bg-[#8B7CF6] transition-colors font-mono"
        >
          Return to Workstation
        </button>
      </div>
    );
  }

  const targetLabel = investigation.targetUrl || investigation.inputContentSnippet || 'Unspecified Target';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6 pb-28 md:pb-16 cyber-grid animate-in fade-in duration-200">
      {/* Top Action Header */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-[rgba(255,255,255,0.07)]">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-[#A1A7B3] hover:text-[#F4F5F7] font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>New Investigation</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3] hover:text-[#F4F5F7] text-[11px] font-mono transition-colors"
          >
            <Download className="h-3 w-3" />
            <span>Export Case Dossier</span>
          </button>
          <button
            onClick={handleCopyTarget}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3] hover:text-[#F4F5F7] text-[11px] font-mono transition-colors"
          >
            {copied ? <Check className="h-3 w-3 text-[#59B98A]" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy Target'}</span>
          </button>
        </div>
      </div>

      {/* FORENSIC CASE FILE CONTAINER */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] divide-y divide-[rgba(255,255,255,0.07)] shadow-2xl">
        {/* CASE FILE HEADER */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#10151C]">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-[#F4F5F7] tracking-wider">
                INVESTIGATION #{investigation.id.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#A1A7B3] uppercase">
                {investigation.inputType || 'URL'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#69717F]">
              Recorded {formatTimeAgo(investigation.createdAt)} · Isolated Execution Sandbox · Zero Client Exposure
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-3 py-1 rounded-md text-xs font-mono font-bold border tracking-wider',
                investigation.risk.score >= 80
                  ? 'border-[#F05A5A]/30 bg-[#F05A5A]/10 text-[#F05A5A]'
                  : investigation.risk.score >= 60
                  ? 'border-[#F05A5A]/30 bg-[#F05A5A]/10 text-[#F05A5A]'
                  : investigation.risk.score >= 20
                  ? 'border-[#D8A84E]/30 bg-[#D8A84E]/10 text-[#D8A84E]'
                  : 'border-[#59B98A]/30 bg-[#59B98A]/10 text-[#59B98A]'
              )}
            >
              {investigation.risk.severity} RISK
            </span>
          </div>
        </div>

        {/* 1. TARGET */}
        <div className="p-6 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
            Target Content
          </div>
          <div className="flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-[#F4F5F7] bg-[#07090D] p-3.5 rounded-md border border-[rgba(255,255,255,0.07)] break-all">
            <span>{targetLabel}</span>
          </div>

          {investigation.urlDetails && (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#A1A7B3] pt-1">
              <span>Domain: <strong className="text-[#F4F5F7]">{investigation.urlDetails.registrableDomain || investigation.urlDetails.hostname}</strong></span>
              <span>•</span>
              <span>TLD: <strong className="text-[#F4F5F7]">.{investigation.urlDetails.tld}</strong></span>
              <span>•</span>
              <span>Entropy: <strong className="text-[#F4F5F7]">{investigation.urlDetails.entropy} bits</strong></span>
              <span>•</span>
              <span>Punycode: <strong className="text-[#F4F5F7]">{investigation.urlDetails.isPunycode ? 'YES' : 'NO'}</strong></span>
            </div>
          )}
        </div>

        {/* 2. VERDICT */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
              Forensic Verdict
            </div>
            <div className="font-mono text-xs text-[#A1A7B3]">
              Normalized Score: <strong className="text-[#F4F5F7] text-sm">{investigation.risk.score} / 100</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F5F7] tracking-tight">
              {investigation.verdict.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed max-w-2xl">
              {investigation.verdict.summary}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#D8A84E] font-bold flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Immediate Recommendation</span>
            </div>
            <p className="text-xs font-medium text-[#F4F5F7]">
              {investigation.verdict.immediateRecommendation ||
                (investigation.risk.score >= 80
                  ? 'Do not open the link or enter credentials. Block sender immediately.'
                  : 'Exercise caution before opening or sharing.')}
            </p>
          </div>
        </div>

        {/* 3. WHY THIS VERDICT? (DETERMINISTIC EVIDENCE WEIGHTS) */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
              Why This Verdict? (Structured Evidence Weights)
            </div>
            <span className="text-[11px] font-mono text-[#A1A7B3]">
              Calculated Score: {investigation.risk.score}
            </span>
          </div>

          <div className="rounded-md border border-[rgba(255,255,255,0.07)] bg-[#07090D] divide-y divide-[rgba(255,255,255,0.07)] font-mono text-xs">
            {investigation.whyVerdict && investigation.whyVerdict.length > 0 ? (
              investigation.whyVerdict.map((sig, idx) => (
                <div key={idx} className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-[#F4F5F7] font-sans text-xs">{sig.signal}</span>
                  <span className="font-bold text-[#D8A84E]">+{sig.weight}</span>
                </div>
              ))
            ) : (
              <div className="px-3.5 py-2.5 text-[#A1A7B3] text-xs">
                Zero malicious weight accumulated. Matches normal baseline.
              </div>
            )}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#10151C] font-bold">
              <span className="text-[#A1A7B3] text-xs uppercase tracking-wider font-sans">
                Normalized Threat Score
              </span>
              <span className="text-sm font-mono text-[#F4F5F7]">
                {investigation.risk.score} / 100
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#69717F] leading-snug">
            The final risk score is calculated from structured evidence. AI assists with correlation and explanation but does not invent the final security score.
          </p>
        </div>

        {/* 4. EVIDENCE INVENTORY */}
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
              Evidence ({investigation.evidence.length} Indicators Flagged)
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-mono">
              <span className="text-[#59B98A] font-semibold">OBSERVED</span>
              <span className="text-[#69717F]">·</span>
              <span className="text-[#D8A84E] font-semibold">DETECTED</span>
              <span className="text-[#69717F]">·</span>
              <span className="text-[#7667E8] font-semibold">INFERRED</span>
              <span className="text-[#69717F]">·</span>
              <span className="text-[#A1A7B3] font-semibold">POTENTIAL</span>
            </div>
          </div>

          {/* Classification Legend Box */}
          <div className="p-3 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#07090D] text-[10px] font-mono grid grid-cols-1 sm:grid-cols-4 gap-2 text-[#A1A7B3]">
            <div>
              <strong className="text-[#59B98A] block">OBSERVED:</strong> Empirical record in verified feed
            </div>
            <div>
              <strong className="text-[#D8A84E] block">DETECTED:</strong> Matched heuristic or signature locally
            </div>
            <div>
              <strong className="text-[#7667E8] block">INFERRED:</strong> Contextual correlation of attacker intent
            </div>
            <div>
              <strong className="text-[#A1A7B3] block">POTENTIAL:</strong> Downstream consequence if interacted
            </div>
          </div>

          <div className="space-y-2.5">
            {investigation.evidence.map((item, idx) => {
              const numStr = (idx + 1).toString().padStart(2, '0');
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-[#69717F]">{numStr}</span>
                      <span className="font-semibold text-xs text-[#F4F5F7]">{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase',
                          item.severity === 'critical'
                            ? 'bg-[#F05A5A]/15 text-[#F05A5A] border border-[#F05A5A]/30'
                            : item.severity === 'high'
                            ? 'bg-[#D8A84E]/15 text-[#D8A84E] border border-[#D8A84E]/30'
                            : 'bg-[#10151C] text-[#A1A7B3] border border-[rgba(255,255,255,0.07)]'
                        )}
                      >
                        {item.severity}
                      </span>
                      {item.evidenceType && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-[#A1A7B3] border border-[rgba(255,255,255,0.07)] bg-[#07090D]">
                          {item.evidenceType.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#A1A7B3] leading-relaxed pl-6">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 pl-6 text-[10px] font-mono text-[#69717F]">
                    <span>Source: {item.source}</span>
                    <span>•</span>
                    <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Telemetry Toggle */}
          {investigation.urlDetails && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="flex items-center gap-1.5 text-xs font-mono text-[#A1A7B3] hover:text-[#F4F5F7] transition-colors"
              >
                {showTechnicalDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                <span>{showTechnicalDetails ? 'Hide Technical Telemetry' : 'View Raw Technical Telemetry'}</span>
              </button>

              {showTechnicalDetails && (
                <div className="mt-3 p-3.5 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#07090D] text-xs font-mono text-[#A1A7B3] space-y-1.5">
                  <div><strong>Protocol:</strong> {investigation.urlDetails.protocol}</div>
                  <div><strong>Hostname:</strong> {investigation.urlDetails.hostname}</div>
                  <div><strong>Pathname:</strong> {investigation.urlDetails.pathname || '/'}</div>
                  <div><strong>Subdomains:</strong> {investigation.urlDetails.subdomains.join('.') || 'none'}</div>
                  <div><strong>Calculated Entropy:</strong> {investigation.urlDetails.entropy} bits</div>
                  <div><strong>Punycode Flag:</strong> {investigation.urlDetails.isPunycode ? 'TRUE' : 'FALSE'}</div>
                  <div><strong>Suspicious Port:</strong> {investigation.urlDetails.hasSuspiciousPort ? 'TRUE' : 'FALSE'}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. THREAT INTELLIGENCE MULTI-SOURCE VERIFICATION */}
        <div className="p-6">
          <ThreatIntelList threatIntel={investigation.threatIntel} />
        </div>

        {/* 6. SIGNATURE THREAT DNA */}
        <div className="p-6">
          <ThreatDNA />
        </div>

        {/* 7. ATTACK PATH RECONSTRUCTION (MITRE ATT&CK) */}
        <div className="p-6 space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
            Attack Path Reconstruction (MITRE ATT&CK Chain)
          </div>

          {/* Sequential Linear Progression */}
          <div className="p-3.5 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#07090D] overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max text-xs font-mono">
              {investigation.attackGraph.nodes.map((node, i) => (
                <div key={node.id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-[11px] font-medium border',
                      node.status === 'detected'
                        ? 'border-[#F05A5A]/30 bg-[#F05A5A]/10 text-[#F05A5A]'
                        : node.status === 'observed'
                        ? 'border-[#59B98A]/30 bg-[#59B98A]/10 text-[#59B98A]'
                        : 'border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]'
                    )}
                  >
                    {node.label}
                  </span>
                  {i < investigation.attackGraph.nodes.length - 1 && (
                    <span className="text-[#69717F] font-bold">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <AttackGraph graphData={investigation.attackGraph} />
        </div>

        {/* 8. RECOMMENDED ACTION & INCIDENT RESPONSE */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold">
              What Should You Do?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]">
                <strong className="text-[#F4F5F7] block mb-0.5">1. Do not open the link again</strong>
                Prevent secondary browser exploitation and beacon telemetry.
              </div>
              <div className="p-3 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]">
                <strong className="text-[#F4F5F7] block mb-0.5">2. Do not enter credentials</strong>
                Avoid submitting usernames, passwords, or one-time codes.
              </div>
              <div className="p-3 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]">
                <strong className="text-[#F4F5F7] block mb-0.5">3. Report the sender</strong>
                Submit SMS to spam carrier numbers or flag email as phishing.
              </div>
              <div className="p-3 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]">
                <strong className="text-[#F4F5F7] block mb-0.5">4. Enable Multi-Factor Authentication</strong>
                Activate authenticator app (TOTP) or hardware key verification.
              </div>
            </div>
          </div>

          {/* Interactive Incident Response Guidance */}
          <div className="pt-2">
            <IncidentOption
              actionsByState={investigation.actionsByState}
              investigationId={investigation.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
