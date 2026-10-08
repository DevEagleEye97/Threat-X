'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThreatInputSelector, ThreatSubmitPayload } from '@/components/threat/ThreatInputSelector';
import { AnalysisProgress } from '@/components/threat/AnalysisProgress';
import { InvestigationResult } from '@/types/investigation';
import {
  ShieldAlert,
  ArrowRight,
  Shield,
  Layers,
  AlertTriangle,
  ArrowDown,
  Lock,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  TextEffect,
  TextLoop,
  InView,
  Spotlight,
  Magnetic,
} from '@/components/motion';

export default function HomePage() {
  const router = useRouter();
  const [analyzingTarget, setAnalyzingTarget] = useState<string | null>(null);
  const [completedResult, setCompletedResult] = useState<InvestigationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exposure check quick state
  const [quickEmail, setQuickEmail] = useState('');

  const handleStartAnalysis = async (payload: ThreatSubmitPayload) => {
    setIsSubmitting(true);
    setAnalyzingTarget(payload.content);
    setApiError(null);
    setCompletedResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: InvestigationResult & { error?: string };
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : ({} as InvestigationResult & { error?: string });
      } catch {
        throw new Error('Analysis pipeline returned an unexpected response format.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'The analysis service returned an incomplete response.');
      }

      setCompletedResult(data);
    } catch (err: unknown) {
      setApiError('We couldn\'t complete this investigation. The analysis service returned an incomplete response.');
      setAnalyzingTarget(null);
      setIsSubmitting(false);
    }
  };

  const handleProgressComplete = () => {
    if (completedResult) {
      router.push(`/analysis/${completedResult.id}`);
    }
  };

  const handleCancel = () => {
    setAnalyzingTarget(null);
    setCompletedResult(null);
    setIsSubmitting(false);
  };

  const handleRetry = () => {
    setApiError(null);
  };

  const handleQuickEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail.trim()) {
      router.push(`/exposure-check?email=${encodeURIComponent(quickEmail.trim())}`);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] cyber-grid pb-24 md:pb-20">
      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-20 space-y-24">
        {analyzingTarget ? (
          /* Execution Pipeline Telemetry */
          <AnalysisProgress
            targetUrl={analyzingTarget}
            onComplete={handleProgressComplete}
            onCancel={handleCancel}
          />
        ) : (
          /* Primary Security Workstation Landing */
          <div className="space-y-24">
            {/* HERO SECTION */}
            <div className="space-y-7 max-w-3xl mx-auto text-center">
              {/* Eyebrow with rotating status loop */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#10151C] text-[12px] sm:text-[13px] font-mono uppercase tracking-[0.08em] text-[#8B7CF6] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#59B98A] animate-pulse" />
                <TextLoop interval={3000}>
                  <span>EVIDENCE BEFORE INTERACTION</span>
                  <span>ZERO CLIENT EXECUTION</span>
                  <span>ISOLATED THREAT PIPELINE</span>
                  <span>DETERMINISTIC THREAT SCORING</span>
                </TextLoop>
              </div>

              {/* Staggered Motion Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-bold tracking-[-0.05em] leading-[0.96] text-[#F5F6F8]">
                <TextEffect preset="fade-in-blur" per="word" delay={0.05}>
                  DON’T CLICK IT.
                </TextEffect>
                <br />
                <span className="text-[#7667E8]">
                  <TextEffect preset="fade-in-blur" per="word" delay={0.25}>
                    INVESTIGATE IT.
                  </TextEffect>
                </span>
              </h1>

              {/* Subheadline & Supporting Copy */}
              <div className="space-y-2.5 max-w-[580px] mx-auto">
                <p className="text-lg md:text-[20px] font-normal leading-[1.5] text-[#A1A7B3]">
                  See the evidence. Understand the attack. Know what to do next.
                </p>
                <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-[#69717F]">
                  Investigate suspicious URLs, messages, screenshots, emails and QR codes before interacting with them.
                </p>
              </div>

              {/* Professional Error State */}
              {apiError && (
                <div className="rounded-lg border border-[#F05A5A]/30 bg-[#10151C] p-4 text-left max-w-xl mx-auto space-y-2.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#F05A5A]">
                    <span className="h-2 w-2 rounded-full bg-[#F05A5A]" />
                    <span>INVESTIGATION INTERRUPTED</span>
                  </div>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    {apiError}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="px-3 py-1.5 rounded-md text-xs font-medium border border-[rgba(255,255,255,0.09)] bg-[#0B0F14] text-[#F5F6F8] hover:bg-[#141A22] transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              {/* Input Workstation */}
              <div className="pt-2">
                <ThreatInputSelector
                  onSubmit={handleStartAnalysis}
                  isLoading={isSubmitting}
                />
              </div>
            </div>

            {/* PRODUCT PHILOSOPHY SECTION */}
            <InView>
              <div className="border-t border-[rgba(255,255,255,0.07)] pt-16 space-y-10">
                <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                  <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B7CF6]">
                    CORE PRINCIPLE
                  </div>
                  <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-[-0.04em] leading-[1.05] text-[#F5F6F8]">
                    DON’T GUESS.<br className="sm:hidden" /> INVESTIGATE.
                  </h2>
                  <p className="text-[16px] md:text-[17px] font-normal leading-relaxed text-[#9CA3AF]">
                    A deterministic workflow built for evidence-backed clarity.
                  </p>
                </div>

                {/* Visual Flow Grid with Spotlight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 font-mono text-[11px] text-[#7667E8] font-semibold tracking-[0.04em] uppercase">01 — EVIDENCE</div>
                    <h3 className="relative z-10 text-sm font-semibold text-[#F5F6F8]">Extract Signals</h3>
                    <p className="relative z-10 text-xs text-[#A1A7B3] leading-relaxed">
                      Extract observable indicators from URLs, headers, Punycode, entropy, and message content.
                    </p>
                  </div>

                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 font-mono text-[11px] text-[#7667E8] font-semibold tracking-[0.04em] uppercase">02 — RISK</div>
                    <h3 className="relative z-10 text-sm font-semibold text-[#F5F6F8]">Assess Severity</h3>
                    <p className="relative z-10 text-xs text-[#A1A7B3] leading-relaxed">
                      Correlate evidence across intelligence feeds and calculate a deterministic 0–100 score.
                    </p>
                  </div>

                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 font-mono text-[11px] text-[#7667E8] font-semibold tracking-[0.04em] uppercase">03 — ATTACK PATH</div>
                    <h3 className="relative z-10 text-sm font-semibold text-[#F5F6F8]">Reconstruct Intent</h3>
                    <p className="relative z-10 text-xs text-[#A1A7B3] leading-relaxed">
                      Understand how the attack progresses from delivery lure to credential theft or host impact.
                    </p>
                  </div>

                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 hover:border-[rgba(255,255,255,0.15)] transition-colors">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 font-mono text-[11px] text-[#7667E8] font-semibold tracking-[0.04em] uppercase">04 — ACTION</div>
                    <h3 className="relative z-10 text-sm font-semibold text-[#F5F6F8]">Know What To Do</h3>
                    <p className="relative z-10 text-xs text-[#A1A7B3] leading-relaxed">
                      Receive tailored, step-by-step incident response guidance tailored to your specific exposure.
                    </p>
                  </div>
                </div>
              </div>
            </InView>

            {/* THREAT FEED PREVIEW */}
            <InView>
              <div className="border-t border-[rgba(255,255,255,0.07)] pt-16 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.08em] text-[#8B7CF6]">
                      THREAT FEED
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-[-0.03em] text-[#F5F6F8]">
                      Threats worth knowing about.
                    </h2>
                    <p className="text-[15px] font-normal text-[#9CA3AF]">
                      Understand the scams, delivery methods and patterns appearing in the wild.
                    </p>
                  </div>

                  <Magnetic>
                    <Link
                      href="/threat-feed"
                      className="inline-flex items-center gap-1.5 text-[14px] text-[#8B7CF6] hover:text-[#F5F6F8] font-medium transition-colors shrink-0 px-3 py-1.5 rounded-md hover:bg-[#10151C]"
                    >
                      <span>Explore full threat feed</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Magnetic>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Entry 1 */}
                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#59B98A]/12 text-[#59B98A] border border-[#59B98A]/25 font-semibold">
                          VERIFIED REPORT
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F05A5A]/12 text-[#F05A5A] border border-[#F05A5A]/25 font-bold">
                          CRITICAL RISK
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#69717F]">WhatsApp · Android · India · 06 Oct 2026</div>
                      <h3 className="text-sm font-bold text-[#F5F6F8] leading-snug">Malicious APK Factory Linked to 9,600+ Indian Victims</h3>
                      <p className="text-xs text-[#A1A7B3] leading-relaxed">
                        Mumbai Crime Branch dismantled an operation distributing 2,800+ fraudulent APKs disguised as pension and senior-citizen certificates.
                      </p>
                    </div>
                    <Link
                      href="/threat-feed"
                      className="relative z-10 inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F5F6F8] pt-2 font-medium"
                    >
                      <span>Read intelligence & Threat DNA</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Entry 2 */}
                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#59B98A]/12 text-[#59B98A] border border-[#59B98A]/25 font-semibold">
                          VERIFIED REPORT
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F05A5A]/12 text-[#F05A5A] border border-[#F05A5A]/25 font-bold">
                          CRITICAL RISK
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#69717F]">Web · Search Ads · Global · 06 Oct 2026</div>
                      <h3 className="text-sm font-bold text-[#F5F6F8] leading-snug">Fake AI Portals Target Advertising & Enterprise Accounts</h3>
                      <p className="text-xs text-[#A1A7B3] leading-relaxed">
                        Look-alike ChatGPT, Gemini, and Claude domains use simulated browser windows to capture credentials and live MFA sessions.
                      </p>
                    </div>
                    <Link
                      href="/threat-feed"
                      className="relative z-10 inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F5F6F8] pt-2 font-medium"
                    >
                      <span>Read intelligence & Threat DNA</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Entry 3 */}
                  <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all">
                    <Spotlight fill="rgba(118, 103, 232, 0.08)" />
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#59B98A]/12 text-[#59B98A] border border-[#59B98A]/25 font-semibold">
                          VERIFIED REPORT
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F05A5A]/12 text-[#F05A5A] border border-[#F05A5A]/25 font-bold">
                          CRITICAL RISK
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#69717F]">Web · Windows · Global · 07 Oct 2026</div>
                      <h3 className="text-sm font-bold text-[#F5F6F8] leading-snug">ClickFix Campaign Injects Lunex Password Stealer</h3>
                      <p className="text-xs text-[#A1A7B3] leading-relaxed">
                        Compromised websites present fake Cloudflare human checks prompting users to copy and execute terminal PowerShell payloads.
                      </p>
                    </div>
                    <Link
                      href="/threat-feed"
                      className="relative z-10 inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F5F6F8] pt-2 font-medium"
                    >
                      <span>Read intelligence & Threat DNA</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </InView>

            {/* EXPOSURE CHECK PREVIEW */}
            <InView>
              <div className="border-t border-[rgba(255,255,255,0.07)] pt-16">
                <div className="relative overflow-hidden rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                  <Spotlight fill="rgba(118, 103, 232, 0.1)" />
                  <div className="relative z-10 space-y-2">
                    <div className="text-[11px] font-mono tracking-widest text-[#7667E8] font-semibold uppercase">
                      EXPOSURE CHECK
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F5F7]">
                      Has your identity already appeared somewhere it shouldn’t?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed">
                      Check whether your email has appeared in known breach data.
                    </p>
                  </div>

                  <form onSubmit={handleQuickEmailSubmit} className="relative z-10 flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={quickEmail}
                      onChange={(e) => setQuickEmail(e.target.value)}
                      placeholder="Enter your email address…"
                      className="flex-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F5F7] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none font-mono"
                    />
                    <Magnetic>
                      <button
                        type="submit"
                        className="rounded-md bg-[#141A22] border border-[rgba(255,255,255,0.09)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F4F5F7] hover:bg-[#10151C] hover:border-[#7667E8]/40 transition-colors shrink-0"
                      >
                        Check Exposure →
                      </button>
                    </Magnetic>
                  </form>

                  <div className="relative z-10 pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[11px] text-[#69717F] font-mono">
                    <span>Your password is never sent to THREATX.</span>
                    <Link href="/exposure-check" className="hover:text-[#F4F5F7] text-[#A1A7B3] transition-colors">
                      Advanced Password Exposure Check →
                    </Link>
                  </div>
                </div>
              </div>
            </InView>
          </div>
        )}
      </main>
    </div>
  );
}
