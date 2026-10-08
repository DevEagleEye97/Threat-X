'use client';

import { useState, useEffect } from 'react';
import { Check, Shield, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InvestigationInputType } from '@/types/investigation';
import { BorderBeam } from '@/components/motion';

interface AnalysisProgressProps {
  targetInput?: string;
  targetUrl?: string;
  inputType?: InvestigationInputType;
  onComplete: () => void;
  onCancel: () => void;
}

interface PipelineStep {
  title: string;
  subtitle: string;
  duration: string;
}

const UNIVERSAL_PIPELINE_STEPS: PipelineStep[] = [
  {
    title: 'NORMALIZING INPUT',
    subtitle: 'Strict RFC-3986 normalization and structure deconstruction',
    duration: '15ms',
  },
  {
    title: 'EXTRACTING SIGNALS',
    subtitle: 'Analyzing entropy, Punycode, subdomains, and lexical patterns',
    duration: '35ms',
  },
  {
    title: 'CHECKING THREAT INTELLIGENCE',
    subtitle: 'Cross-referencing Safe Browsing, URLhaus, PhishTank, and reputation feeds',
    duration: '120ms',
  },
  {
    title: 'CORRELATING EVIDENCE',
    subtitle: 'Synthesizing observed, detected, and inferred indicators',
    duration: '50ms',
  },
  {
    title: 'ASSESSING RISK',
    subtitle: 'Executing deterministic mathematical risk engine (0-100)',
    duration: '20ms',
  },
  {
    title: 'RECONSTRUCTING ATTACK PATH',
    subtitle: 'Building MITRE ATT&CK kill-chain and Threat DNA mapping',
    duration: '140ms',
  },
  {
    title: 'GENERATING RESPONSE',
    subtitle: 'Formulating tailored incident containment playbook',
    duration: '30ms',
  },
];

export function AnalysisProgress({
  targetInput,
  targetUrl,
  inputType = 'url',
  onComplete,
  onCancel,
}: AnalysisProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const displayTarget = targetInput || targetUrl || 'Target vector';

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('threatx:investigating', { detail: { active: true } }));
    return () => {
      window.dispatchEvent(new CustomEvent('threatx:investigating', { detail: { active: false } }));
    };
  }, []);

  useEffect(() => {
    if (currentStepIndex < UNIVERSAL_PIPELINE_STEPS.length) {
      const stepTimer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 420);
      return () => clearTimeout(stepTimer);
    } else {
      const doneTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(doneTimer);
    }
  }, [currentStepIndex, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded border border-[rgba(255,255,255,0.08)] bg-[#11151B] text-[10px] font-mono text-[#9298A5]">
            ISOLATED WORKFLOW
          </span>
        </div>
      </div>

      {/* Target Content Banner */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0C0F14] p-3 text-xs font-mono text-[#F5F7FA] truncate flex items-center gap-2">
        <span className="text-[#626977] shrink-0 uppercase text-[10px]">{inputType}:</span>
        <span className="truncate">{displayTarget}</span>
      </div>

      {/* Status Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#F5F7FA] tracking-wide font-mono">INVESTIGATING</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#11151B] text-[#9298A5] border border-[rgba(255,255,255,0.08)]">
            Stage {(currentStepIndex + 1).toString().padStart(2, '0')} / {UNIVERSAL_PIPELINE_STEPS.length.toString().padStart(2, '0')}
          </span>
        </div>
        <p className="text-xs text-[#9298A5]">
          Isolated server-side extraction and deterministic threat assessment without client browser exposure.
        </p>
      </div>

      {/* Frosted Investigation Pipeline Steps Card */}
      <div className="threat-glass p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden">
        <BorderBeam size={200} duration={8} colorFrom="#7667E8" colorTo="#59B98A" />

        <div className="space-y-3 relative z-10">
          {UNIVERSAL_PIPELINE_STEPS.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const stepNum = (idx + 1).toString().padStart(2, '0');

            return (
              <div key={step.title} className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5 text-xs transition-colors',
                    isFinished && 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80',
                    isCurrent && 'bg-indigo-950 text-indigo-400 border border-indigo-700',
                    !isFinished && !isCurrent && 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                  )}
                >
                  {isFinished ? (
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'text-xs font-mono font-medium',
                        isFinished ? 'text-[#F5F7FA]' : isCurrent ? 'text-[#9B85FF]' : 'text-[#626977]'
                      )}
                    >
                      <span className="text-[#626977] mr-1.5">{stepNum}</span>
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#626977]">{step.duration}</span>
                  </div>
                  <p className="text-[11px] text-[#9298A5] leading-snug">{step.subtitle}</p>

                  {isCurrent && (
                    <div className="mt-1.5 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Understated Privacy Guarantee */}
      <div className="text-center text-[11px] text-zinc-500 font-mono">
        Zero client exposure · Passive reputation correlation · Ephemeral session
      </div>
    </div>
  );
}
