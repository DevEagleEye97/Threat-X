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
} from 'lucide-react';

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

      let data: any;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
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
          <div className="space-y-24 animate-in fade-in duration-200">
            {/* HERO SECTION */}
            <div className="space-y-8 max-w-3xl mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-widest text-[#A1A7B3]">
                EVIDENCE BEFORE INTERACTION
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F5F7] leading-[1.08]">
                Don’t click it.<br />
                <span className="text-[#7667E8]">Investigate it.</span>
              </h1>

              {/* Subheadline & Supporting Copy */}
              <div className="space-y-2 max-w-xl mx-auto">
                <p className="text-base sm:text-lg font-medium text-[#F4F5F7]">
                  See the evidence. Understand the attack. Know what to do next.
                </p>
                <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed">
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
                      className="px-3 py-1.5 rounded-md text-xs font-medium border border-[rgba(255,255,255,0.09)] bg-[#0B0F14] text-[#F4F5F7] hover:bg-[#141A22] transition-colors"
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
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-16 space-y-10">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <div className="text-[11px] font-mono tracking-widest text-[#7667E8] font-semibold">
                  CORE PRINCIPLE
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7]">
                  Don’t guess. Investigate.
                </h2>
                <p className="text-xs sm:text-sm text-[#A1A7B3]">
                  A deterministic workflow built for evidence-backed clarity.
                </p>
              </div>

              {/* Visual Flow Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 relative">
                  <div className="font-mono text-xs text-[#7667E8] font-bold">01 — EVIDENCE</div>
                  <h3 className="text-sm font-semibold text-[#F4F5F7]">Extract Signals</h3>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    Extract observable indicators from URLs, headers, Punycode, entropy, and message content.
                  </p>
                </div>

                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 relative">
                  <div className="font-mono text-xs text-[#7667E8] font-bold">02 — RISK</div>
                  <h3 className="text-sm font-semibold text-[#F4F5F7]">Assess Severity</h3>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    Correlate evidence across intelligence feeds and calculate a deterministic 0–100 score.
                  </p>
                </div>

                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 relative">
                  <div className="font-mono text-xs text-[#7667E8] font-bold">03 — ATTACK PATH</div>
                  <h3 className="text-sm font-semibold text-[#F4F5F7]">Reconstruct Intent</h3>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    Understand how the attack progresses from delivery lure to credential theft or host impact.
                  </p>
                </div>

                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-2.5 relative">
                  <div className="font-mono text-xs text-[#7667E8] font-bold">04 — ACTION</div>
                  <h3 className="text-sm font-semibold text-[#F4F5F7]">Know What To Do</h3>
                  <p className="text-xs text-[#A1A7B3] leading-relaxed">
                    Receive tailored, step-by-step incident response guidance tailored to your specific exposure.
                  </p>
                </div>
              </div>
            </div>

            {/* THREAT FEED PREVIEW */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-16 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono tracking-widest text-[#7667E8] font-semibold">
                    THREAT FEED
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7]">
                    Threats worth knowing about.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A1A7B3]">
                    Understand the scams, delivery methods and patterns appearing in the wild.
                  </p>
                </div>

                <Link
                  href="/threat-feed"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8B7CF6] hover:text-[#F4F5F7] font-medium transition-colors shrink-0"
                >
                  <span>Explore full threat feed</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Entry 1 */}
                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                        DEMO THREAT
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F05A5A]/10 text-[#F05A5A] border border-[#F05A5A]/20 font-bold">
                        HIGH RISK
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#69717F]">WhatsApp · Android</div>
                    <h3 className="text-sm font-bold text-[#F4F5F7]">Fake Delivery APK</h3>
                    <p className="text-xs text-[#A1A7B3] leading-relaxed">
                      Fake delivery notifications are being used to distribute malicious Android packages disguised as tracking tools.
                    </p>
                  </div>
                  <Link
                    href="/threat-feed"
                    className="inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F4F5F7] pt-2 font-medium"
                  >
                    <span>Read investigation</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Entry 2 */}
                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                        DEMO THREAT
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F05A5A]/10 text-[#F05A5A] border border-[#F05A5A]/20 font-bold">
                        HIGH RISK
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#69717F]">SMS · WhatsApp</div>
                    <h3 className="text-sm font-bold text-[#F4F5F7]">Fake KYC Update</h3>
                    <p className="text-xs text-[#A1A7B3] leading-relaxed">
                      Urgent compliance alerts directing banking customers to spoofed identity portals to capture OTPs and login credentials.
                    </p>
                  </div>
                  <Link
                    href="/threat-feed"
                    className="inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F4F5F7] pt-2 font-medium"
                  >
                    <span>Read investigation</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Entry 3 */}
                <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                        DEMO THREAT
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#D8A84E]/10 text-[#D8A84E] border border-[#D8A84E]/20 font-bold">
                        MEDIUM RISK
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#69717F]">Email · Telegram</div>
                    <h3 className="text-sm font-bold text-[#F4F5F7]">Fake Recruitment Offer</h3>
                    <p className="text-xs text-[#A1A7B3] leading-relaxed">
                      High-paying remote work invitations enticing candidates to submit identity documents and banking credentials.
                    </p>
                  </div>
                  <Link
                    href="/threat-feed"
                    className="inline-flex items-center gap-1 text-xs text-[#8B7CF6] hover:text-[#F4F5F7] pt-2 font-medium"
                  >
                    <span>Read investigation</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* EXPOSURE CHECK PREVIEW */}
            <div className="border-t border-[rgba(255,255,255,0.07)] pt-16">
              <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="text-[11px] font-mono tracking-widest text-[#7667E8] font-semibold">
                    EXPOSURE CHECK
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F4F5F7]">
                    Has your identity already appeared somewhere it shouldn’t?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed">
                    Check whether your email has appeared in known breach data.
                  </p>
                </div>

                <form onSubmit={handleQuickEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                    placeholder="Enter your email address…"
                    className="flex-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F5F7] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-[#141A22] border border-[rgba(255,255,255,0.09)] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F4F5F7] hover:bg-[#10151C] hover:border-[#7667E8]/40 transition-colors shrink-0"
                  >
                    Check Exposure →
                  </button>
                </form>

                <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-[11px] text-[#69717F]">
                  <span>Your password is never sent to THREATX.</span>
                  <Link href="/exposure-check" className="hover:text-[#F4F5F7] text-[#A1A7B3] transition-colors">
                    Advanced Password Exposure Check →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
