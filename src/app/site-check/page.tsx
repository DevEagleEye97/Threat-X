'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  Server,
  Archive,
  ExternalLink,
  Info,
  Cookie,
  FileText,
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SiteCheckResult, HeaderStatus } from '@/types/siteCheck';

export default function SiteCheckPage() {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SiteCheckResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/site-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      let data: any;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error('Site Check service returned an unexpected response format.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'The analysis service returned an incomplete response.');
      }

      setResult(data);
    } catch (err: unknown) {
      setError('We couldn’t complete this Site Check. The analysis service returned an incomplete response.');
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderBadge = (status: HeaderStatus) => {
    switch (status) {
      case 'PASS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#59B98A]/15 text-[#59B98A] border border-[#59B98A]/30">PASS</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D8A84E]/15 text-[#D8A84E] border border-[#D8A84E]/30">WARNING</span>;
      case 'MISSING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F05A5A]/15 text-[#F05A5A] border border-[#F05A5A]/30">MISSING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10151C] text-[#A1A7B3]">NOT OBSERVABLE</span>;
    }
  };

  return (
    <div className="min-h-screen py-10 md:py-16 cyber-grid pb-28 md:pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        {/* HERO SECTION */}
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-widest text-[#A1A7B3]">
            SITE SECURITY POSTURE
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7] leading-tight">
            Know how your website <br />
            <span className="text-[#7667E8]">looks from the outside.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#A1A7B3] leading-relaxed">
            Review publicly observable security controls, configuration signals and technology exposure without destructive penetration testing.
          </p>

          {/* Authorization Notice */}
          <div className="rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-3 text-xs text-[#A1A7B3] flex items-start gap-2.5">
            <Info className="h-4 w-4 text-[#7667E8] shrink-0 mt-0.5" />
            <span>
              <strong>Defensive Policy Notice:</strong> Only run Site Check on websites you own or are authorized to assess. THREATX performs exclusively passive observations.
            </span>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative flex items-center rounded-xl threat-glass-input p-1">
              <Globe className="h-4 w-4 text-[#69717F] ml-3.5 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter a website URL (e.g. https://example.com)"
                className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-[#F4F5F7] placeholder:text-[#69717F] focus:outline-none font-mono"
                required
              />
              <button
                type="submit"
                disabled={isLoading || !urlInput.trim()}
                className="mr-1 flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#7667E8] text-[#F4F5F7] hover:bg-[#8B7CF6] font-semibold text-xs transition-colors disabled:opacity-40 shrink-0"
              >
                <span>{isLoading ? 'Assessing…' : 'Run Site Check →'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#69717F] px-1">
              <span>Try sample: https://example.com</span>
              <span>Passive checks · No exploitation</span>
            </div>
          </form>

          {/* Error message */}
          {error && (
            <div className="rounded-md border border-[#F05A5A]/30 bg-[#10151C] p-3.5 text-xs text-[#F05A5A] font-mono">
              {error}
            </div>
          )}
        </div>

        {/* RESULTS DOSSIER */}
        {result && (
          <div className="space-y-10 animate-in fade-in duration-200 border-t border-[rgba(255,255,255,0.07)] pt-10">
            {/* Header Record */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 threat-glass shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#7667E8]">{result.id.toUpperCase()}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                    PASSIVE SITE CHECK
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#F4F5F7] font-mono">{result.hostname}</h2>
                <div className="text-[11px] font-mono text-[#69717F]">Observed at {result.timestamp}</div>
              </div>

              {/* Overall Score */}
              <div className="text-right sm:border-l sm:border-[rgba(255,255,255,0.07)] sm:pl-6 space-y-1">
                <div className="text-[10px] font-mono text-[#69717F] uppercase tracking-wider">
                  SECURITY POSTURE
                </div>
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-3xl font-bold text-[#F4F5F7] font-mono">{result.postureScore}</span>
                  <span className="text-xs text-[#69717F] font-mono">/ 100</span>
                </div>
                <span
                  className={cn(
                    'inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider',
                    result.postureRating === 'GOOD'
                      ? 'bg-[#59B98A]/15 text-[#59B98A] border border-[#59B98A]/30'
                      : result.postureRating === 'NEEDS ATTENTION'
                      ? 'bg-[#D8A84E]/15 text-[#D8A84E] border border-[#D8A84E]/30'
                      : 'bg-[#F05A5A]/15 text-[#F05A5A] border border-[#F05A5A]/30'
                  )}
                >
                  {result.postureRating}
                </span>
              </div>
            </div>

            {/* Category Score Breakdown */}
            <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A7B3] font-semibold">
                Control Category Ratings
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="space-y-1 p-3 rounded-md bg-[#0B0F14] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[#69717F] text-[10px]">TRANSPORT (HTTPS)</div>
                  <div className="text-sm font-bold text-[#F4F5F7]">{result.categoryScores.transport} / 100</div>
                  <div className="text-[#59B98A] text-[10px]">TLS 1.3 Active</div>
                </div>

                <div className="space-y-1 p-3 rounded-md bg-[#0B0F14] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[#69717F] text-[10px]">SECURITY HEADERS</div>
                  <div className="text-sm font-bold text-[#F4F5F7]">{result.categoryScores.headers} / 100</div>
                  <div className="text-[#D8A84E] text-[10px]">CSP Review Needed</div>
                </div>

                <div className="space-y-1 p-3 rounded-md bg-[#0B0F14] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[#69717F] text-[10px]">COOKIE HYGIENE</div>
                  <div className="text-sm font-bold text-[#F4F5F7]">{result.categoryScores.cookies} / 100</div>
                  <div className="text-[#59B98A] text-[10px]">HttpOnly & Secure</div>
                </div>

                <div className="space-y-1 p-3 rounded-md bg-[#0B0F14] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[#69717F] text-[10px]">DNS & CERTIFICATE</div>
                  <div className="text-sm font-bold text-[#F4F5F7]">{result.categoryScores.certificates} / 100</div>
                  <div className="text-[#59B98A] text-[10px]">Valid Certificate</div>
                </div>
              </div>
            </div>

            {/* SECTION 1: SECURITY HEADERS AUDIT */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-[#7667E8]" />
                  <span>Security Response Headers</span>
                </h3>
                <span className="text-[11px] font-mono text-[#69717F]">6 Publicly Observable Controls</span>
              </div>

              <div className="space-y-3">
                {result.headers.map((h) => (
                  <div
                    key={h.header}
                    className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[#F4F5F7]">{h.header}</span>
                      {getHeaderBadge(h.status)}
                    </div>

                    <div className="p-2 rounded bg-[#0B0F14] font-mono text-[11px] text-[#A1A7B3] truncate">
                      <span className="text-[#69717F]">Observed: </span>{h.observed}
                    </div>

                    <p className="text-[#A1A7B3] leading-relaxed text-[11px]">
                      <strong className="text-[#F4F5F7]">Why it matters:</strong> {h.whyItMatters}
                    </p>

                    <p className="text-[#69717F] text-[11px]">
                      <strong className="text-[#A1A7B3]">Recommendation:</strong> {h.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: COOKIE HYGIENE */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-[#7667E8]" />
                  <span>Public Cookie Attributes</span>
                </h3>
                <span className="text-[11px] font-mono text-[#69717F]">Sensitive Tokens Masked</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {result.cookies.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 space-y-2 text-xs font-mono"
                  >
                    <div className="font-bold text-[#F4F5F7] truncate">{c.name}</div>
                    <div className="text-[10px] text-[#69717F] truncate">{c.maskedValue}</div>

                    <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#69717F]">Secure:</span>
                        <span className={c.secure ? 'text-[#59B98A]' : 'text-[#F05A5A]'}>{c.secure ? 'YES' : 'NO'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69717F]">HttpOnly:</span>
                        <span className={c.httpOnly ? 'text-[#59B98A]' : 'text-[#D8A84E]'}>{c.httpOnly ? 'YES' : 'NO'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#69717F]">SameSite:</span>
                        <span className="text-[#F4F5F7]">{c.sameSite}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: PASSIVE DNS & CERTIFICATE TRANSPARENCY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DNS */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide flex items-center gap-2">
                    <Server className="h-4 w-4 text-[#7667E8]" />
                    <span>Passive DNS Records</span>
                  </h3>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {result.dnsRecords.map((r, i) => (
                    <div key={i} className="p-3 rounded-md bg-[#10151C] border border-[rgba(255,255,255,0.07)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 rounded bg-[#0B0F14] text-[#8B7CF6] font-bold text-[10px]">{r.type}</span>
                        <span className="text-[10px] text-[#69717F]">TTL {r.ttl}s</span>
                      </div>
                      <div className="text-[#F4F5F7] text-[11px] truncate">{r.value}</div>
                      <div className="text-[10px] text-[#69717F] font-sans">{r.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide flex items-center gap-2">
                    <Lock className="h-4 w-4 text-[#7667E8]" />
                    <span>Certificate Transparency</span>
                  </h3>
                </div>

                <div className="p-4 rounded-lg bg-[#10151C] border border-[rgba(255,255,255,0.07)] space-y-3 text-xs font-mono">
                  <div>
                    <div className="text-[#69717F] text-[10px]">ISSUER</div>
                    <div className="text-[#F4F5F7] font-semibold">{result.certificate.issuer}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <div className="text-[#69717F] text-[10px]">VALID UNTIL</div>
                      <div className="text-[#F4F5F7]">{result.certificate.validTo.split('T')[0]}</div>
                    </div>
                    <div>
                      <div className="text-[#69717F] text-[10px]">DAYS REMAINING</div>
                      <div className="text-[#59B98A] font-bold">{result.certificate.daysRemaining} days</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] space-y-1.5">
                    <div className="text-[#69717F] text-[10px]">OBSERVED HOSTNAMES (CT LOGS)</div>
                    <div className="flex flex-wrap gap-1">
                      {result.certificate.observedHostnames.map((h) => (
                        <span key={h} className="px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[10px] text-[#A1A7B3]">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: TECHNOLOGY EXPOSURE & THIRD PARTIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technology Exposure */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-[rgba(255,255,255,0.07)]">
                  <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide">
                    Technology Exposure
                  </h3>
                  <p className="text-[11px] text-[#69717F]">Detection is not vulnerability confirmation.</p>
                </div>

                <div className="space-y-2">
                  {result.technologies.map((t) => (
                    <div key={t.name} className="p-3 rounded-md bg-[#10151C] border border-[rgba(255,255,255,0.07)] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F4F5F7]">{t.name}</span>
                        <span className="text-[10px] font-mono text-[#8B7CF6]">{t.category}</span>
                      </div>
                      {t.note && <p className="text-[11px] text-[#A1A7B3] leading-snug">{t.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Third Parties */}
              <div className="space-y-4">
                <div className="pb-2 border-b border-[rgba(255,255,255,0.07)]">
                  <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide">
                    Observed Third-Party Services
                  </h3>
                  <p className="text-[11px] text-[#69717F]">First-party vs external origin services.</p>
                </div>

                <div className="space-y-2">
                  {result.thirdParties.map((s) => (
                    <div key={s.domain} className="p-3 rounded-md bg-[#10151C] border border-[rgba(255,255,255,0.07)] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#F4F5F7]">{s.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F14] text-[#A1A7B3]">
                          {s.isFirstParty ? 'FIRST PARTY' : 'THIRD PARTY'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#69717F]">{s.domain}</div>
                      <p className="text-[11px] text-[#A1A7B3]">{s.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 5: RECOMMENDED PRIORITIES */}
            <div className="rounded-lg border border-[rgba(118,103,232,0.3)] bg-[#10151C] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.07)]">
                <h3 className="text-sm font-bold text-[#F4F5F7] tracking-wide font-mono">
                  RECOMMENDED PRIORITIES
                </h3>
                <span className="text-[11px] font-mono text-[#8B7CF6]">Actionable Hardening</span>
              </div>

              <div className="space-y-3">
                {result.recommendedPriorities.map((item) => (
                  <div key={item.priority} className="flex items-start gap-3 text-xs">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#7667E8]/20 text-[#8B7CF6] font-mono font-bold text-[10px]">
                      0{item.priority}
                    </span>
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[#F4F5F7]">{item.action}</div>
                      <div className="text-[11px] text-[#69717F]">
                        {item.category} · <span className="text-[#A1A7B3]">{item.impact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
