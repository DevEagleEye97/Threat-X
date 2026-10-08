'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Calculator,
  Compass,
  CheckCircle2,
  Lock,
  Eye,
  AlertTriangle,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    num: '01',
    name: 'INPUT',
    title: 'User Submits Suspicious Content',
    desc: 'Users provide a link, screenshot, message, email, or QR code without opening it. THREATX isolates the payload in air-gapped memory, neutralizing client browser exploitation.',
    layer: 'Boundary Isolation',
  },
  {
    num: '02',
    name: 'EVIDENCE',
    title: 'Deterministic Signal Extraction',
    desc: 'Local heuristic engines parse RFC-3986 URL structures, evaluate Shannon entropy on hostnames, flag Punycode homograph attacks, and identify high-abuse TLDs and credential harvest signatures.',
    layer: 'Empirical Heuristics',
  },
  {
    num: '03',
    name: 'INTELLIGENCE',
    title: 'Multi-Feed Intelligence Cross-Reference',
    desc: 'Extracted indicators are verified against active reputation repositories including Google Safe Browsing, URLhaus (abuse.ch), and PhishTank. Unavailable sources are flagged honestly.',
    layer: 'Threat Intelligence',
  },
  {
    num: '04',
    name: 'CORRELATION',
    title: 'AI-Assisted Evidence Correlation',
    desc: 'AI synthesizes observed indicators and translates low-level anomalies into human-understandable adversary intent and MITRE ATT&CK techniques. AI never overrides empirical findings.',
    layer: 'Generative Synthesis',
  },
  {
    num: '05',
    name: 'RISK',
    title: 'Deterministic Risk Calculation (0–100)',
    desc: 'A pure mathematical scoring engine calculates a normalized threat score from 0 to 100 based on weighted empirical signals. AI does not invent the final risk score.',
    layer: 'Mathematical Engine',
  },
  {
    num: '06',
    name: 'ATTACK PATH',
    title: 'Attack Path & Threat DNA Reconstruction',
    desc: 'THREATX models the adversary kill chain from delivery lure to credential theft, account takeover, and financial exfiltration, highlighting known pattern DNA.',
    layer: 'Forensic Reconstruction',
  },
  {
    num: '07',
    name: 'ACTION',
    title: 'Tailored Incident Response Playbook',
    desc: 'Interactive containment guidance adapts based on user interaction state (e.g. unopened, opened, password submitted, OTP exposed, money transferred).',
    layer: 'Containment Protocols',
  },
];

const COMPARISONS = [
  {
    dim: 'Verdict Generation',
    blackBox: 'Opaque binary label ("Safe" / "Malicious") without evidence rationale',
    threatx: 'Transparent evidence breakdown + signal weights + confidence scoring',
  },
  {
    dim: 'Role of AI',
    blackBox: 'AI hallucinating risk scores and predicting benign status blindly',
    threatx: 'AI strictly interprets structured empirical signals; risk engine is deterministic',
  },
  {
    dim: 'Safety Guarantees',
    blackBox: 'False claims of "100% Protection" or "Guaranteed Benign"',
    threatx: 'Honest uncertainty: "No known threat detected. This does not guarantee safety."',
  },
  {
    dim: 'Client Exposure',
    blackBox: 'Often navigates or renders iframes directly in user browsers',
    threatx: 'Complete air-gapped sandboxing with DNS-level SSRF pre-flight validation',
  },
  {
    dim: 'Post-Exposure Guidance',
    blackBox: 'Generic static advice ("Run antivirus scan")',
    threatx: 'Dynamic step-by-step incident containment tailored to actual user action',
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen py-10 md:py-16 cyber-grid pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono tracking-wider text-[#A1A7B3]">
            INVESTIGATION METHODOLOGY
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7] leading-tight">
            Security should be explained, <br />
            <span className="text-[#7667E8]">not hidden in a black box.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A1A7B3] leading-relaxed">
            THREATX treats security as a forensic discipline. Every assessment proceeds through
            observable signals, deterministic mathematical scoring, and verifiable evidence.
          </p>
        </div>

        {/* The 7-Stage Pipeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.07)]">
            <h2 className="text-base font-bold text-[#F4F5F7] tracking-wide">
              The 7-Stage Investigation Pipeline
            </h2>
            <span className="text-[11px] font-mono text-[#69717F]">
              INPUT → EVIDENCE → RISK → ATTACK PATH → ACTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#7667E8]">{step.num}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#07090D] border border-[rgba(255,255,255,0.07)] text-[#A1A7B3]">
                      {step.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#69717F]">{step.layer}</span>
                </div>

                <h3 className="text-sm font-semibold text-[#F4F5F7]">{step.title}</h3>
                <p className="text-xs text-[#A1A7B3] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Separation Principle Callout */}
        <div className="rounded-lg border border-[rgba(118,103,232,0.3)] bg-[#10151C] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7667E8]/15 text-[#8B7CF6] shrink-0 border border-[#7667E8]/30">
              <Cpu className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#8B7CF6] font-semibold">
                ARCHITECTURAL DIRECTIVE: AI AS INTERPRETER, NOT ARBITER
              </div>
              <h3 className="text-base font-bold text-[#F4F5F7]">
                AI never invents risk scores or overrides empirical findings.
              </h3>
              <p className="text-xs text-[#A1A7B3] leading-relaxed">
                Large language models are probabilistic by design. In THREATX, the risk score (0–100) is calculated
                purely by a deterministic mathematical rule engine from verified heuristic and threat intelligence
                signals. AI is constrained to translating raw telemetry into MITRE ATT&CK techniques, intent summaries,
                and actionable containment playbooks.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Matrix */}
        <div className="space-y-4">
          <div className="pb-3 border-b border-[rgba(255,255,255,0.07)]">
            <h2 className="text-base font-bold text-[#F4F5F7] tracking-wide">
              Architectural Comparison
            </h2>
            <p className="text-xs text-[#A1A7B3]">
              How THREATX differs fundamentally from generic URL checkers and AI chatbots.
            </p>
          </div>

          <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.07)] text-xs">
              {COMPARISONS.map((row, idx) => (
                <div key={idx} className="p-4 space-y-2 col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[rgba(255,255,255,0.07)] last:border-b-0">
                  <div className="font-medium text-[#F4F5F7]">{row.dim}</div>
                  <div className="text-[#69717F] font-mono text-[11px] flex items-start gap-1.5">
                    <span className="text-[#F05A5A] shrink-0">✕</span>
                    <span>{row.blackBox}</span>
                  </div>
                  <div className="text-[#A1A7B3] text-xs flex items-start gap-1.5">
                    <span className="text-[#59B98A] shrink-0 font-bold">✓</span>
                    <span>{row.threatx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#7667E8] text-[#F4F5F7] text-xs font-semibold hover:bg-[#8B7CF6] transition-colors"
          >
            <span>Start an investigation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/security"
            className="text-xs text-[#A1A7B3] hover:text-[#F4F5F7] transition-colors"
          >
            Read Security Architecture →
          </Link>
        </div>
      </div>
    </div>
  );
}
