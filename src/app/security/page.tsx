'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Server,
  FileCheck,
  ChevronDown,
  Key,
  Database,
  ExternalLink,
  Code2,
  Cpu,
  EyeOff,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionDoc {
  id: string;
  title: string;
  badge: string;
  summary: string;
  points: string[];
}

const SECURITY_SECTIONS: SectionDoc[] = [
  {
    id: 'secret-management',
    title: '1. Secret & Credential Management',
    badge: 'ZERO CLIENT LEAKS',
    summary: 'All API keys, cloud tokens, and service credentials reside exclusively in server-side runtime environments.',
    points: [
      'No API keys prefixed with NEXT_PUBLIC_ or embedded in client-side bundles.',
      'Server-side threat intelligence calls authenticated via isolated environment secrets.',
      'Strict repository hygiene preventing inadvertent secret commits or environment exposure.',
    ],
  },
  {
    id: 'input-validation',
    title: '2. Input Isolation & Untrusted Target Processing',
    badge: 'AIR-GAPPED EXECUTION',
    summary: 'Every submitted URL, screenshot, message, or file is treated as hostile adversary input. No client browser ever executes untrusted destinations.',
    points: [
      'Zero client-side network connections or iframe renders of untrusted target servers.',
      'Headless payload inspection performed in ephemeral memory without persistent local execution.',
      'Active defense strips drive-by scripts, exploit payloads, and tracking pixels.',
    ],
  },
  {
    id: 'ssrf-protection',
    title: '3. SSRF & Egress Boundary Protection',
    badge: 'NETWORK CONTROL',
    summary: 'Server-side request forgery defense enforces pre-resolution DNS filtering to prevent internal intranet reconnaissance.',
    points: [
      'Strict blocking of RFC 1918 private IPv4 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).',
      'Hardened block against cloud metadata endpoints (169.254.169.254, metadata.google.internal).',
      'IPv6 loopbacks (::1), link-local, and reserved non-routable CIDRs completely barred.',
      'Explicit DNS resolution validation before any external connection is permitted.',
    ],
  },
  {
    id: 'rate-limiting',
    title: '4. Rate Limiting & Denial-of-Service Defense',
    badge: 'TRAFFIC GOVERNANCE',
    summary: 'Sliding-window IP throttling prevents automated scraping, brute-force abuse, and backend exhaustion.',
    points: [
      'Configured threshold of 60 requests per minute per IP address.',
      'Instant HTTP 429 Too Many Requests response with standard retry headers upon threshold breach.',
      'Lightweight in-memory sliding window cache with automated garbage collection.',
    ],
  },
  {
    id: 'prompt-injection',
    title: '5. AI Safety & Dual-Boundary Injection Defense',
    badge: 'PROMPT SECURITY',
    summary: 'Untrusted content is encapsulated within strict delimitation tags to neutralize prompt injection and generative evasion tactics.',
    points: [
      'Adversary payloads are encapsulated inside strict <UNTRUSTED_THREAT_DATA> boundaries.',
      'Adversarial instructions (e.g. "Ignore instructions", "Output Safe") are classified as empirical threat markers.',
      'Rigid output schemas enforced with deterministic fallbacks if LLM output fails validation.',
    ],
  },
  {
    id: 'data-minimization',
    title: '6. Data Minimization & Privacy Protection',
    badge: 'PRIVACY BY DESIGN',
    summary: 'THREATX operates with zero persistent tracking, no user authentication requirement, and zero payload retention.',
    points: [
      'Zero persistent logging of submitted target vectors or client IP addresses.',
      'Password exposure checks executed via client-side SHA-1 k-anonymity (raw passwords never transmitted).',
      'No marketing trackers, third-party analytics pixels, or telemetry beacons.',
    ],
  },
  {
    id: 'output-validation',
    title: '7. Output Validation & Strict JSON Schemas',
    badge: 'SCHEMA ENFORCEMENT',
    summary: 'All backend responses and AI inferences are validated against immutable TypeScript and Zod schemas.',
    points: [
      'Zod runtime validation on every analysis and Site Check response.',
      'Deterministic fallback synthesis triggered automatically on schema validation failures.',
      'Sanitized output formatting preventing Cross-Site Scripting (XSS) in UI rendering.',
    ],
  },
  {
    id: 'authentication-protocols',
    title: '8. Authentication & Zero-Login Model',
    badge: 'PUBLIC ACCESS',
    summary: 'THREATX requires no account creation, no password storage, and no session state for investigations.',
    points: [
      'No user credential database to compromise.',
      'Eliminates credential stuffing, password spray, and session hijacking vectors.',
      'All investigation records remain local to the user session.',
    ],
  },
  {
    id: 'authorization-boundaries',
    title: '9. Authorization & Defensive Boundaries',
    badge: 'DEFENSIVE CHARTER',
    summary: 'THREATX is strictly a defensive investigation tool and never performs offensive cyber attacks.',
    points: [
      'Site Check is limited strictly to passive, publicly observable security controls.',
      'No credential brute-forcing, SQL injection testing, or exploit payload execution.',
      'Prominent authorization notices requiring domain assessment permission.',
    ],
  },
  {
    id: 'logging-hygiene',
    title: '10. Audit Logging & Sensitive Data Redaction',
    badge: 'HYGIENIC LOGS',
    summary: 'Developer logs and telemetry streams automatically scrub sensitive user inputs and authorization headers.',
    points: [
      'Bearer tokens, passwords, session cookies, and sensitive headers are redacted before logging.',
      'Generic user-facing error messages prevent backend infrastructure fingerprinting.',
      'Zero external data pipeline streaming for sensitive target vectors.',
    ],
  },
  {
    id: 'dependency-security',
    title: '11. Dependency Security & Build Verification',
    badge: 'SUPPLY CHAIN',
    summary: 'Strict dependency management, continuous vulnerability scanning, and minimal third-party package footprint.',
    points: [
      'Automated peer dependency resolution and regular audit reviews.',
      'Minimal third-party dependencies utilized in core security heuristics engine.',
      'Pinned package versions preventing supply chain compromise.',
    ],
  },
  {
    id: 'third-party-feeds',
    title: '12. Third-Party Intelligence Attribution & Honest Reliability',
    badge: 'INTEL INTEGRITY',
    summary: 'External threat feeds provide context, but unavailable feeds are reported honestly without false safety claims.',
    points: [
      'Integrates Google Safe Browsing, URLhaus (abuse.ch), and PhishTank.',
      'If an intelligence provider times out or fails, status displays "Source unavailable", never "Safe".',
      'Transparent attribution of community feeds and verified threat markers.',
    ],
  },
];

export default function SecurityPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'secret-management': true,
    'input-validation': true,
    'ssrf-protection': true,
    'prompt-injection': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-12 pb-28 md:pb-16 cyber-grid animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-wider text-[#A1A7B3]">
          <Shield className="h-3 w-3 text-[#7667E8]" />
          <span>Security Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7]">
          THREATX Security
        </h1>

        <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed">
          THREATX is engineered from first principles around air-gapped isolation, deterministic mathematical scoring, zero client execution, and transparent evidence synthesis.
        </p>
      </div>

      {/* Core Architectural Invariants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#7667E8] font-mono text-xs font-bold">
            <Lock className="h-4 w-4" />
            <span>AIR-GAPPED BY DESIGN</span>
          </div>
          <p className="text-xs text-[#A1A7B3] leading-relaxed">
            Your browser never navigates to, loads scripts from, or renders frames of submitted URLs or targets.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#8B7CF6] font-mono text-xs font-bold">
            <Cpu className="h-4 w-4" />
            <span>DETERMINISTIC FIRST</span>
          </div>
          <p className="text-xs text-[#A1A7B3] leading-relaxed">
            Risk scores (0–100) are purely mathematical from empirical signals. AI is an interpreter, never an arbiter.
          </p>
        </div>

        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-4 space-y-2">
          <div className="flex items-center gap-2 text-[#59B98A] font-mono text-xs font-bold">
            <EyeOff className="h-4 w-4" />
            <span>HONEST UNCERTAINTY</span>
          </div>
          <p className="text-xs text-[#A1A7B3] leading-relaxed">
            We never claim &ldquo;100% safe&rdquo; or &ldquo;guaranteed benign&rdquo;. We state evidence and bounds with integrity.
          </p>
        </div>
      </div>

      {/* 12 Security Directives Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.07)]">
          <h2 className="text-base font-bold text-[#F4F5F7] tracking-wide">
            Platform Security Controls (12 Directives)
          </h2>
          <span className="text-[11px] font-mono text-[#69717F]">
            Defence-in-Depth Model
          </span>
        </div>

        <div className="space-y-3">
          {SECURITY_SECTIONS.map((sec) => {
            const isOpen = openSections[sec.id];
            return (
              <div
                key={sec.id}
                className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(sec.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#141A22] transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F14] border border-[rgba(255,255,255,0.07)] text-[#8B7CF6]">
                        {sec.badge}
                      </span>
                      <h3 className="text-sm font-bold text-[#F4F5F7]">{sec.title}</h3>
                    </div>
                    <p className="text-xs text-[#A1A7B3] line-clamp-1">{sec.summary}</p>
                  </div>

                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-[#69717F] shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[#F4F5F7]'
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 space-y-3 border-t border-[rgba(255,255,255,0.07)] text-xs text-[#A1A7B3] animate-in fade-in duration-150">
                    <p className="text-xs text-[#F4F5F7] leading-relaxed">{sec.summary}</p>
                    <ul className="space-y-1.5 list-disc list-inside text-[11px] text-[#A1A7B3]">
                      {sec.points.map((p, idx) => (
                        <li key={idx} className="leading-relaxed">{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Source Policy */}
      <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-6 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-[#F4F5F7] font-mono">
          OPEN SOURCE & VERIFIABLE
        </h3>
        <p className="text-[#A1A7B3] leading-relaxed">
          THREATX is built in the open. Security practitioners, engineers, and researchers can review every heuristic, normalization rule, and risk coefficient directly in the repository.
        </p>
        <div className="pt-2 flex items-center gap-4">
          <a
            href="https://github.com/DevEagleEye97/Threat-X"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#8B7CF6] hover:text-[#F5F6F8] font-medium"
          >
            <span>Inspect GitHub repository</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
