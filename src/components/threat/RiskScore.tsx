'use client';

import { RiskCalculationResult } from '@/types/risk';
import { getSeverityColor } from '@/lib/risk/severity';
import { cn } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface RiskScoreProps {
  risk: RiskCalculationResult;
  classification: string;
  summary: string;
  immediateRecommendation?: string;
}

export function RiskScore({
  risk,
  classification,
  summary,
  immediateRecommendation,
}: RiskScoreProps) {
  const styles = getSeverityColor(risk.severity);

  // Pick semantic icon based on severity
  const SeverityIcon =
    risk.severity === 'CRITICAL' || risk.severity === 'HIGH'
      ? ShieldAlert
      : risk.severity === 'MEDIUM' || risk.severity === 'GUARDED'
      ? AlertTriangle
      : ShieldCheck;

  const signalsCount = risk.signalsTriggered?.length || 0;

  return (
    <section
      role="region"
      aria-label={`Forensic Threat Assessment: ${risk.score} out of 100, ${risk.severity} Risk`}
      className={cn(
        'threat-panel p-5 sm:p-6 space-y-5 transition-all',
        risk.score >= 80
          ? 'threat-glass-edge-critical'
          : risk.score >= 40
          ? 'threat-glass-edge-warning'
          : 'border-[rgba(255,255,255,0.08)]'
      )}
    >
      {/* Top Banner — Technical Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-[0.06em] uppercase border',
              styles.badgeBg
            )}
          >
            <SeverityIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{risk.severity} RISK</span>
          </span>
          <span className="text-[11px] font-mono text-[#64748B] hidden sm:inline">
            DETERMINISTIC VERDICT
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[12px] text-[#94A3B8]">
          {signalsCount > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#161B25] border border-[rgba(255,255,255,0.06)] text-[#CBD5E1]">
              <span className="tabular-nums font-semibold text-[#22D3EE]">{signalsCount}</span>{' '}
              {signalsCount === 1 ? 'Signal' : 'Signals'} Triggered
            </span>
          )}
          <span className="tabular-nums">
            Confidence:{' '}
            <strong className="text-[#E2E8F0] font-semibold">
              {(risk.confidence * 100).toFixed(0)}%
            </strong>
          </span>
        </div>
      </div>

      {/* Hero Score Display */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        {/* Score Number Badge */}
        <div
          className="flex flex-row sm:flex-col items-baseline sm:items-center justify-center gap-2 sm:gap-0 rounded-xl bg-[#07090D] border border-[rgba(255,255,255,0.10)] px-4 py-3 min-w-[100px] w-full sm:w-auto shrink-0 shadow-inner"
          aria-hidden="true"
        >
          <span
            className={cn(
              'text-4xl font-extrabold font-mono tabular-nums tracking-tight',
              styles.badgeText
            )}
          >
            {risk.score}
          </span>
          <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-[0.08em] sm:mt-1">
            / 100 RISK
          </span>
        </div>

        {/* Threat Title & Summary */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#22D3EE] uppercase tracking-[0.06em]">
              Primary Assessment
            </span>
          </div>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#E2E8F0] tracking-tight leading-snug">
            {classification}
          </h2>
          <p className="text-[14px] text-[#94A3B8] leading-relaxed max-w-2xl">
            {summary}
          </p>
        </div>
      </div>

      {/* Immediate Recommendation Banner */}
      {immediateRecommendation && (
        <div
          role="note"
          aria-label="Immediate recommendation"
          className="p-3.5 rounded-xl border border-[#7667E8]/35 bg-[#7667E8]/10 text-xs flex items-start gap-3"
        >
          <AlertTriangle className="h-4 w-4 text-[#8B7CF6] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[#A5B4FC] font-bold block">
              Immediate Operator Guidance
            </span>
            <p className="text-[#F1F5F9] text-[13px] font-medium leading-relaxed">
              {immediateRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* Segmented Risk Gauge */}
      <div className="space-y-2 pt-1" aria-hidden="true">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.06em] text-[#64748B]">
          <span className={cn(risk.score < 20 && 'text-[#10B981] font-bold')}>Low (0–19)</span>
          <span className={cn(risk.score >= 20 && risk.score < 40 && 'text-[#22D3EE] font-bold')}>
            Guarded (20–39)
          </span>
          <span className={cn(risk.score >= 40 && risk.score < 60 && 'text-[#F59E0B] font-bold')}>
            Medium (40–59)
          </span>
          <span className={cn(risk.score >= 60 && risk.score < 80 && 'text-[#F97316] font-bold')}>
            High (60–79)
          </span>
          <span className={cn(risk.score >= 80 && 'text-[#EF4444] font-bold')}>
            Critical (80–100)
          </span>
        </div>

        {/* Segmented Gauge Track */}
        <div className="h-2 w-full rounded-md bg-[#07090D] border border-[rgba(255,255,255,0.08)] overflow-hidden flex gap-0.5 p-0.5">
          <div
            className={cn(
              'h-full rounded-sm transition-all',
              'w-[20%]',
              risk.score >= 0 ? 'bg-[#10B981]' : 'bg-[#10B981]/25'
            )}
          />
          <div
            className={cn(
              'h-full rounded-sm transition-all',
              'w-[20%]',
              risk.score >= 20 ? 'bg-[#22D3EE]' : 'bg-[#22D3EE]/25'
            )}
          />
          <div
            className={cn(
              'h-full rounded-sm transition-all',
              'w-[20%]',
              risk.score >= 40 ? 'bg-[#F59E0B]' : 'bg-[#F59E0B]/25'
            )}
          />
          <div
            className={cn(
              'h-full rounded-sm transition-all',
              'w-[20%]',
              risk.score >= 60 ? 'bg-[#F97316]' : 'bg-[#F97316]/25'
            )}
          />
          <div
            className={cn(
              'h-full rounded-sm transition-all',
              'w-[20%]',
              risk.score >= 80 ? 'bg-[#EF4444]' : 'bg-[#EF4444]/25'
            )}
          />
        </div>

        {/* Position Tick Line */}
        <div className="relative w-full h-3">
          <div
            className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all"
            style={{ left: `${Math.min(100, Math.max(0, risk.score))}%` }}
          >
            <div className="w-1.5 h-1.5 bg-[#E2E8F0] rotate-45 shadow-sm" />
            <span className="text-[9px] font-mono text-[#E2E8F0] tabular-nums font-bold">
              {risk.score}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
