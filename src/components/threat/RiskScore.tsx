'use client';

import { RiskCalculationResult } from '@/types/risk';
import { getSeverityColor } from '@/lib/risk/severity';
import { cn } from '@/lib/utils';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-2xl space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]/60 text-xs">
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <span className={styles.badgeText}>THREATX VERDICT • {risk.severity} RISK</span>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Confidence: <span className="text-slate-200 font-semibold">{(risk.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Hero Score Display */}
      <div className="flex items-start gap-4">
        {/* Score Number Badge */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#090D15] border border-[#222E42] px-4 py-3 min-w-[88px]">
          <span className={cn('text-3xl font-extrabold font-mono', styles.badgeText)}>
            {risk.score}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
            / 100 RISK
          </span>
        </div>

        {/* Threat Title & Summary */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-100">
            {classification}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Immediate Recommendation Banner */}
      {immediateRecommendation && (
        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold">
              Immediate Recommendation:
            </span>
            <p className="text-slate-200 font-medium mt-0.5">
              {immediateRecommendation}
            </p>
          </div>
        </div>
      )}

      {/* Spectrum Bar (Safe / Suspicious / Malicious) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span className={cn(risk.score < 20 && 'text-emerald-400 font-semibold')}>Safe (0–19)</span>
          <span className={cn(risk.score >= 20 && risk.score < 80 && 'text-amber-400 font-semibold')}>Suspicious (20–79)</span>
          <span className={cn(risk.score >= 80 && 'text-red-400 font-semibold')}>Malicious (80–100)</span>
        </div>

        <div className="h-2 w-full rounded-full bg-[#0A0E17] border border-[#1E2738] overflow-hidden flex">
          <div className="w-[20%] bg-emerald-500/40" />
          <div className="w-[60%] bg-amber-500/40" />
          <div className="w-[20%] bg-red-500/60" />
        </div>

        {/* Pointer indicator */}
        <div className="relative w-full h-2">
          <div
            className="absolute -top-1 w-2.5 h-2.5 rounded-full bg-white shadow-md transition-all -translate-x-1/2 ring-2 ring-indigo-500"
            style={{ left: `${Math.min(100, Math.max(0, risk.score))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
