'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Rss,
  Search,
  ArrowRight,
  Dna,
  ShieldAlert,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  Globe2,
  Maximize2,
  X,
  Layers,
  Cpu,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeedProvenance = 'VERIFIED REPORT' | 'THREATX ANALYSIS' | 'DEMO VECTOR';

export interface ThreatStory {
  id: string;
  title: string;
  category: 'Malware' | 'Phishing' | 'Account Takeover' | 'Identity Theft' | 'Mobile Fraud' | 'APT' | 'Recruitment';
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  provenance: FeedProvenance;
  region: 'India' | 'Global';
  target?: string;
  platform: 'WhatsApp' | 'Android' | 'Web' | 'Windows' | 'SMS' | 'Email' | 'Instagram';
  publishedDate: string;
  lastCheckedDate: string;
  source: string;
  sourceUrl?: string;
  summary: string;
  imageUrl?: string;
  deliveryVector: string;
  observedTechniques: string[];
  indicators: string[];
  whatToDo: string[];
  threatDna: string[];
  samplePayload: {
    type: 'url' | 'message' | 'screenshot' | 'email' | 'qr';
    content: string;
  };
}

const THREAT_STORIES: ThreatStory[] = [
  {
    id: 'tf-real-01',
    title: 'Malicious APK Factory Linked to Thousands of Indian Victims',
    category: 'Mobile Fraud',
    risk: 'Critical',
    provenance: 'VERIFIED REPORT',
    region: 'India',
    platform: 'WhatsApp',
    publishedDate: '06 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'Mumbai Crime Branch & I4C Cyber Briefing',
    sourceUrl: 'https://cybercrime.gov.in',
    imageUrl: '/images/threat-feed/apk-factory.jpg',
    summary:
      'Mumbai Crime Branch reported the arrest of an alleged developer producing over 2,800 malicious APKs supplied to fraud syndicates. Payloads disguised as senior-citizen verification, pension life-certificates, and banking utilities impacted over 9,600 verified victims.',
    deliveryVector: 'Unsolicited WhatsApp messaging with urgent pension/senior-citizen verification lures',
    observedTechniques: ['Social engineering urgency', 'Sideloaded APK distribution', 'Credential harvesting', 'SMS OTP interception'],
    indicators: ['APK delivered via messaging chat', 'Mimicked government/banking service naming', 'Requires sideloading outside Google Play', 'Requests SMS reading and accessibility permissions'],
    whatToDo: [
      'Never install APK files received unexpectedly through WhatsApp, SMS, or Telegram.',
      'If installed, immediately disconnect the phone from the internet and initiate incident response.',
      'Change banking passwords and revoke all active banking sessions from another device.',
    ],
    threatDna: ['IMPERSONATION', 'WHATSAPP DELIVERY', 'MALICIOUS APK', 'INSTALLATION', 'DATA / CREDENTIAL THEFT', 'FINANCIAL FRAUD'],
    samplePayload: {
      type: 'message',
      content: 'URGENT: Government Pension Verification required for 2026. Download official LifeCertificate_v2.apk to avoid monthly pension hold: https://pension-verify.example.net/app',
    },
  },
  {
    id: 'tf-real-02',
    title: 'Fake ChatGPT, Gemini & Claude Sites Target Advertising Accounts',
    category: 'Phishing',
    risk: 'Critical',
    provenance: 'VERIFIED REPORT',
    region: 'Global',
    platform: 'Web',
    publishedDate: '06 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'BleepingComputer Threat Research',
    sourceUrl: 'https://www.bleepingcomputer.com',
    imageUrl: '/images/threat-feed/ai-phishing.jpg',
    summary:
      'A global credential-harvesting campaign creates look-alike portals impersonating major AI platforms (ChatGPT, Gemini, Claude, Perplexity). Attackers utilize browser-in-browser simulation to capture live session tokens and MFA codes from advertising and enterprise account holders.',
    deliveryVector: 'Sponsored search ads and deceptive social media links offering fake premium AI capabilities',
    observedTechniques: ['Browser-in-the-browser login dialogs', 'Real-time OTP relay', 'Brand mimicry', 'Cookie session hijacking'],
    indicators: ['Look-alike AI service domains (e.g. chatgpt-v5-preview.cfd)', 'Simulated OAuth login windows', 'Immediate request for 6-digit MFA codes'],
    whatToDo: [
      'Verify the actual address bar domain before typing credentials or MFA tokens.',
      'Never trust sponsored search ads for authentication portals.',
      'Enforce FIDO2/WebAuthn hardware security keys to neutralize MITM phishing relays.',
    ],
    threatDna: ['AI BRAND IMPERSONATION', 'FAKE SERVICE', 'LOGIN PROMPT', 'MFA CAPTURE', 'AD ACCOUNT TAKEOVER', 'FINANCIAL ABUSE'],
    samplePayload: {
      type: 'url',
      content: 'https://chatgpt-plus-enterprise.ai-portal.example.com/login',
    },
  },
  {
    id: 'tf-real-03',
    title: 'ClickFix Campaign Uses Compromised Websites to Deliver Lunex Stealer',
    category: 'Malware',
    risk: 'Critical',
    provenance: 'VERIFIED REPORT',
    region: 'Global',
    platform: 'Windows',
    publishedDate: '07 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'The Record from Recorded Future',
    sourceUrl: 'https://therecord.media',
    imageUrl: '/images/threat-feed/clickfix-stealer.jpg',
    summary:
      'Over 100 compromised legitimate websites present fake Cloudflare verification pages instructing visitors to paste and run a PowerShell command to "verify they are human", directly executing the Lunex password and crypto wallet stealer in memory.',
    deliveryVector: 'Injected JavaScript overlays on compromised WordPress and commercial web properties',
    observedTechniques: ['Social engineering verification prompt', 'Clipboard hijacking', 'PowerShell command execution', 'Memory-only credential extraction'],
    indicators: ['Fake "Verify you are human" Cloudflare modal', 'Instructions to press Win+R, Ctrl+V, Enter', 'Obfuscated PowerShell execution command'],
    whatToDo: [
      'Never execute commands copied from website modals into your system terminal.',
      'Legitimate verification systems (Cloudflare, reCAPTCHA) never ask you to execute terminal scripts.',
      'If executed, immediately isolate workstation and revoke all stored browser passwords.',
    ],
    threatDna: ['COMPROMISED WEBSITE', 'FAKE CLOUDFLARE CHECK', 'VERIFY HUMAN BAIT', 'COPY COMMAND', 'MALWARE EXECUTION', 'TOKEN THEFT'],
    samplePayload: {
      type: 'message',
      content: 'Cloudflare Verification: Press Windows Key + R, paste powershell -e aWV4... and press Enter to confirm you are human.',
    },
  },
  {
    id: 'tf-real-04',
    title: 'EPFO Warns Members About Phishing and Fake Portals',
    category: 'Identity Theft',
    risk: 'High',
    provenance: 'VERIFIED REPORT',
    region: 'India',
    platform: 'SMS',
    publishedDate: '07 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'EPFO Official Advisory & LiveMint',
    sourceUrl: 'https://www.livemint.com',
    imageUrl: '/images/threat-feed/identity-phish.jpg',
    summary:
      'The Employees\' Provident Fund Organisation issued a nationwide security alert advising members against deceptive SMS links harvesting UAN, Aadhaar, PAN, and banking credentials under the guise of annual passbook updates.',
    deliveryVector: 'SMS broadcast claiming urgent UAN KYC verification deadline or claim sanction',
    observedTechniques: ['Government brand impersonation', 'Urgent KYC restriction lure', 'Identity harvesting form', 'Direct banking debit attempt'],
    indicators: ['SMS from non-official header numbers', 'Non-.gov.in domains (.top, .info, .live)', 'Demands UAN, Aadhaar, PAN, and bank password simultaneously'],
    whatToDo: [
      'Access member portal exclusively via epfindia.gov.in.',
      'Never share UAN credentials or OTPs with third-party callers or SMS links.',
      'Report malicious domains to cybercrime.gov.in immediately.',
    ],
    threatDna: ['GOVERNMENT IMPERSONATION', 'URGENT ACCOUNT MESSAGE', 'FAKE PORTAL', 'IDENTITY HARVEST', 'FINANCIAL FRAUD'],
    samplePayload: {
      type: 'url',
      content: 'https://epfo-uan-kyc-update.example.net/portal/auth',
    },
  },
  {
    id: 'tf-real-05',
    title: 'Fake AI Trading Ads Used to Capture Instagram Login Codes',
    category: 'Account Takeover',
    risk: 'High',
    provenance: 'VERIFIED REPORT',
    region: 'India',
    platform: 'Instagram',
    publishedDate: '07 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'I4C & Ministry of Cyber Affairs',
    sourceUrl: 'https://cybercrime.gov.in',
    imageUrl: '/images/threat-feed/trading-scam.jpg',
    summary:
      'I4C highlighted targeted campaigns where sponsored social media ads promote automated AI cryptocurrency trading. Registration pages prompt victims for an SMS "verification code" which is secretly the official Instagram account takeover OTP.',
    deliveryVector: 'Sponsored Instagram/Facebook feed ads promising high-yield automated AI trading',
    observedTechniques: ['Social media sponsored lure', 'Secondary authentication interception', 'Social account takeover', 'Subsequent friend fraud'],
    indicators: ['Unrealistic guaranteed financial return promises', 'Requests SMS code arriving with "Instagram" sender header', 'Third-party site requesting social login credentials'],
    whatToDo: [
      'Never share SMS codes with any third-party app or platform.',
      'Always read the full SMS text: if the code says "Instagram code", it belongs only to Instagram.',
      'Enable authenticator app 2FA instead of SMS-based verification.',
    ],
    threatDna: ['SOCIAL AD', 'AI TRADING LURE', 'FAKE REGISTRATION', 'LOGIN CODE REQUEST', 'ACCOUNT TAKEOVER'],
    samplePayload: {
      type: 'message',
      content: 'Earn ₹45,000/day with AI AutoTrader. Register now: https://ai-wealth-trader.example-auth.org - enter 6-digit SMS code to verify identity.',
    },
  },
  {
    id: 'tf-real-06',
    title: 'MATCHBOIL Downloader Evolves With Obfuscation and Persistence',
    category: 'APT',
    risk: 'High',
    provenance: 'VERIFIED REPORT',
    region: 'Global',
    platform: 'Windows',
    publishedDate: '08 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'ESET Threat Research',
    sourceUrl: 'https://www.eset.com',
    imageUrl: '/images/threat-feed/matchboil-apt.jpg',
    summary:
      'ESET researchers detailed updated activity for MATCHBOIL, a sophisticated C# downloader utilized in persistent cyber campaigns. New iterations implement .NET Reactor anti-analysis obfuscation and establish multi-stage registry persistence.',
    deliveryVector: 'Spear-phishing emails containing malicious ISO or ZIP attachments disguised as contracts',
    observedTechniques: ['Spear-phishing attachment', 'C# downloader execution', '.NET Reactor binary obfuscation', 'Registry Run key persistence'],
    indicators: ['ISO/LNK archive attachments', 'Encrypted C2 beaconing over non-standard TLS ports', 'Base64 encoded registry payload storage'],
    whatToDo: [
      'Block execution of script interpreters (.lnk, .vbs, .hta) from archive containers.',
      'Deploy endpoint detection monitoring for unusual C# subprocess execution.',
      'Inspect registry Run keys for unrecognized binary paths.',
    ],
    threatDna: ['SPEAR PHISHING', 'C# DOWNLOADER', 'OBFUSCATION', 'REGISTRY PERSISTENCE', 'C2 BEACONING', 'PAYLOAD INJECTION'],
    samplePayload: {
      type: 'email',
      content: 'Attached: Signed Contract Settlement Agreement (Contract_Doc_081026.zip). Please review terms and execute immediately.',
    },
  },
  {
    id: 'tf-demo-01',
    title: 'Fake Banking Security Patch APK Dropper',
    category: 'Malware',
    risk: 'Critical',
    provenance: 'DEMO VECTOR',
    region: 'India',
    platform: 'Android',
    publishedDate: '08 Oct 2026',
    lastCheckedDate: '08 Oct 2026',
    source: 'THREATX Threat Simulation Lab',
    summary:
      'Synthetic demonstration modeling an aggressive Android banking Trojan masquerading as a mandatory security update.',
    deliveryVector: 'Simulated WhatsApp direct link pushing out-of-band APK download',
    observedTechniques: ['Urgency lure', 'Direct APK delivery', 'Overlay injection', 'Accessibility service abuse'],
    indicators: ['Unsigned APK binary', 'Demands BIND_ACCESSIBILITY_SERVICE', 'Hardcoded C2 destination'],
    whatToDo: ['Test this payload in the THREATX investigation console to observe deterministic risk calculation.'],
    threatDna: ['BANKING THEME', 'FAKE SECURITY PATCH', 'APK DROP', 'ACCESSIBILITY PERMISSION', 'KEYLOGGING'],
    samplePayload: {
      type: 'message',
      content: 'URGENT: Mandatory Bank Security Patch 2026. Install immediately to prevent net banking deactivation: https://secure-bank-patch.example.net/patch.apk',
    },
  },
];

/**
 * High-Tech Forensic Image / Diagram Placeholder for Threats without explicit static images
 */
function ForensicVisualPlaceholder({ story }: { story: ThreatStory }) {
  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0B0F14] overflow-hidden flex flex-col justify-between p-5 select-none">
      {/* Background Cyber Blueprint Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0a_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#7667E8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8B7CF6]">
          <Cpu className="h-4 w-4 animate-pulse" />
          <span className="tracking-wider uppercase font-semibold">VECTOR SCHEMATIC · {story.platform}</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#10151C] border border-[rgba(255,255,255,0.08)] text-[#A1A7B3]">
          {story.category}
        </span>
      </div>

      {/* Center Schematic Nodes */}
      <div className="relative z-10 flex items-center justify-center my-auto py-2">
        <div className="w-full max-w-md flex items-center justify-between gap-2 px-4 py-3 rounded-md bg-[#10151C]/90 border border-[rgba(255,255,255,0.07)] backdrop-blur-sm shadow-inner">
          <div className="flex flex-col items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#7667E8]" />
            <span className="text-[10px] font-mono text-[#A1A7B3]">INGESTION</span>
          </div>
          <span className="text-[#69717F] font-mono text-xs">──►</span>
          <div className="flex flex-col items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D8A84E]" />
            <span className="text-[10px] font-mono text-[#A1A7B3]">DECONSTRUCT</span>
          </div>
          <span className="text-[#69717F] font-mono text-xs">──►</span>
          <div className="flex flex-col items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F05A5A] animate-ping" />
            <span className="text-[10px] font-mono text-[#F05A5A] font-bold">EXPLOITATION</span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#69717F] border-t border-[rgba(255,255,255,0.06)] pt-3">
        <span className="truncate max-w-[280px]">PAYLOAD: {story.deliveryVector}</span>
        <span className="text-[#8B7CF6] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#59B98A]" />
          TELEMETRY CAPTURE
        </span>
      </div>
    </div>
  );
}

export default function ThreatFeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedProvenance, setSelectedProvenance] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ src: string; title: string; source: string } | null>(null);

  const categories = ['All', 'Malware', 'Phishing', 'Mobile Fraud', 'Account Takeover', 'Identity Theft', 'APT'];
  const regions = ['All', 'India', 'Global'];
  const provenances = ['All', 'VERIFIED REPORT', 'DEMO VECTOR'];
  const risks = ['All', 'Critical', 'High', 'Medium'];

  const filteredStories = THREAT_STORIES.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.indicators.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
    const matchesRegion = selectedRegion === 'All' || story.region === selectedRegion;
    const matchesProvenance = selectedProvenance === 'All' || story.provenance === selectedProvenance;
    const matchesRisk = selectedRisk === 'All' || story.risk === selectedRisk;

    return matchesSearch && matchesCategory && matchesRegion && matchesProvenance && matchesRisk;
  });

  return (
    <div className="min-h-screen cyber-grid py-12 pb-24 md:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
        {/* HEADER */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8B7CF6]">
            <Rss className="h-3.5 w-3.5" />
            <span>THREAT INTELLIGENCE FEED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.04em] leading-[1.02] text-[#F5F6F8]">
            Threats worth knowing about.
          </h1>

          <p className="text-[16px] md:text-[18px] text-[#A1A7B3] leading-relaxed">
            Understand scam patterns, delivery methods, and indicators people are actively encountering.
          </p>

          {/* Live Provenance Banner */}
          <div className="pt-2">
            <div className="rounded-lg border border-[rgba(255,255,255,0.09)] bg-[#10151C] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#59B98A] font-mono font-medium">
                <span className="h-2 w-2 rounded-full bg-[#59B98A] animate-pulse" />
                <span>LIVE THREAT INTELLIGENCE · Updated 08 Oct 2026 · 22:30 IST</span>
              </div>
              <div className="text-[#9CA3AF] text-[12px]">
                Sources attributed (I4C · CERT-In · ESET · BleepingComputer · The Record)
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="space-y-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#69717F]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threat reports, malware types, indicators (e.g., APK, EPFO, ClickFix, Instagram, OTP)..."
              className="w-full rounded-md border border-[rgba(255,255,255,0.08)] bg-[#0B0F14] pl-10 pr-4 py-2.5 text-sm text-[#F5F6F8] placeholder-[#69717F] focus:border-[#7667E8] focus:outline-none focus:ring-1 focus:ring-[#7667E8] font-sans"
            />
          </div>

          {/* Category, Region, Provenance Filter Chips */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#69717F] font-mono text-[11px] uppercase tracking-wider">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
                    selectedCategory === cat
                      ? 'bg-[#141A22] text-[#8B7CF6] border border-[#7667E8]/40'
                      : 'bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] border border-[rgba(255,255,255,0.06)]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#69717F] font-mono text-[11px] uppercase tracking-wider">Region:</span>
              {regions.map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
                    selectedRegion === reg
                      ? 'bg-[#141A22] text-[#8B7CF6] border border-[#7667E8]/40'
                      : 'bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] border border-[rgba(255,255,255,0.06)]'
                  )}
                >
                  {reg}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#69717F] font-mono text-[11px] uppercase tracking-wider">Source Status:</span>
              {provenances.map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => setSelectedProvenance(prov)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
                    selectedProvenance === prov
                      ? 'bg-[#141A22] text-[#59B98A] border border-[#59B98A]/40'
                      : 'bg-[#0B0F14] text-[#A1A7B3] hover:text-[#F5F6F8] border border-[rgba(255,255,255,0.06)]'
                  )}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FEED LIST */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#69717F]">
            <span>Showing {filteredStories.length} curated intelligence entries</span>
            <span className="font-mono text-[11px]">OCTOBER 2026 RELEASES</span>
          </div>

          <div className="space-y-8">
            {filteredStories.map((story) => {
              const isCritical = story.risk === 'Critical';
              const isHigh = story.risk === 'High';

              return (
                <article
                  key={story.id}
                  className="content-auto gpu-accelerated rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#10151C] p-6 sm:p-7 space-y-6 hover:border-[rgba(255,255,255,0.15)] transition-all shadow-md overflow-hidden"
                >
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[rgba(255,255,255,0.07)] pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Badge */}
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#0B0F14] border border-[rgba(255,255,255,0.08)] text-[#A1A7B3]">
                        {story.category}
                      </span>

                      {/* Provenance Badge */}
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider',
                          story.provenance === 'VERIFIED REPORT'
                            ? 'bg-[#59B98A]/12 text-[#59B98A] border border-[#59B98A]/25'
                            : 'bg-[#7667E8]/12 text-[#8B7CF6] border border-[#7667E8]/25'
                        )}
                      >
                        {story.provenance}
                      </span>

                      {/* Platform & Region */}
                      <span className="text-[#69717F] font-mono text-[11px]">
                        {story.platform} · {story.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-[#69717F]">First Reported: {story.publishedDate}</span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider',
                          isCritical
                            ? 'bg-[#F05A5A]/15 text-[#F05A5A] border border-[#F05A5A]/30'
                            : isHigh
                            ? 'bg-[#D8A84E]/15 text-[#D8A84E] border border-[#D8A84E]/30'
                            : 'bg-[#5C9FE8]/15 text-[#5C9FE8] border border-[#5C9FE8]/30'
                        )}
                      >
                        {story.risk} Risk
                      </span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[#F5F6F8]">
                      {story.title}
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-[#A1A7B3] leading-relaxed font-sans">
                      {story.summary}
                    </p>
                  </div>

                  {/* FORENSIC THREAT IMAGE / PLACEHOLDER */}
                  <div className="relative group">
                    {story.imageUrl ? (
                      <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0B0F14] overflow-hidden">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                        />
                        
                        {/* Overlay Gradient & Badge */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14]/90 via-[#0B0F14]/20 to-transparent pointer-events-none" />

                        {/* Top Forensic Badge */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#0B0F14]/85 border border-[rgba(255,255,255,0.12)] text-[10px] font-mono text-[#8B7CF6] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                            <Layers className="h-3 w-3" />
                            TECHNICAL FORENSIC VISUAL
                          </span>
                        </div>

                        {/* Bottom Bar with Expand button */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-mono text-[#A1A7B3] bg-[#0B0F14]/80 px-2.5 py-1 rounded backdrop-blur-sm border border-[rgba(255,255,255,0.06)] truncate max-w-[260px] sm:max-w-md">
                            Evidence source: {story.source}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setActiveLightboxImage({
                                src: story.imageUrl!,
                                title: story.title,
                                source: story.source,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#7667E8] hover:bg-[#8B7CF6] text-[#F5F6F8] text-xs font-mono transition-colors shadow-md backdrop-blur-sm"
                          >
                            <Maximize2 className="h-3.5 w-3.5" />
                            <span>Inspect Diagram</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ForensicVisualPlaceholder story={story} />
                    )}
                  </div>

                  {/* Source Provenance */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[#69717F]">
                    <span className="text-[#A1A7B3]">SOURCE:</span>
                    <span className="text-[#F5F6F8]">{story.source}</span>
                    <span>·</span>
                    <span>Last verified: {story.lastCheckedDate}</span>
                  </div>

                  {/* THREAT DNA RIBBON */}
                  <div className="rounded-md border border-[#7667E8]/20 bg-[#0B0F14] p-3.5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8B7CF6]">
                      <Dna className="h-3.5 w-3.5" />
                      <span>THREAT DNA (KILL-CHAIN SEQUENCE)</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#F5F6F8]">
                      {story.threatDna.map((node, i) => (
                        <div key={node} className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-[#10151C] border border-[rgba(255,255,255,0.07)] text-[#E5E7EB]">
                            {node}
                          </span>
                          {i < story.threatDna.length - 1 && (
                            <span className="text-[#7667E8] font-bold">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TWO-COLUMN DETAILS: Techniques & Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0B0F14] p-4 space-y-2">
                      <div className="text-[11px] font-mono uppercase text-[#A1A7B3] font-semibold tracking-wider">
                        Observed Techniques
                      </div>
                      <ul className="space-y-1.5 text-[#9CA3AF]">
                        {story.observedTechniques.map((tech) => (
                          <li key={tech} className="flex items-start gap-1.5">
                            <span className="text-[#7667E8] font-bold">•</span>
                            <span>{tech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0B0F14] p-4 space-y-2">
                      <div className="text-[11px] font-mono uppercase text-[#A1A7B3] font-semibold tracking-wider">
                        Key Indicators
                      </div>
                      <ul className="space-y-1.5 text-[#9CA3AF]">
                        {story.indicators.map((ind) => (
                          <li key={ind} className="flex items-start gap-1.5">
                            <span className="text-[#D8A84E] font-bold">•</span>
                            <span>{ind}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* RECOMMENDED ACTION */}
                  <div className="rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0B0F14] p-4 space-y-2 text-xs">
                    <div className="text-[11px] font-mono uppercase text-[#59B98A] font-semibold tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Recommended Action</span>
                    </div>
                    <ul className="space-y-1 text-[#A1A7B3]">
                      {story.whatToDo.map((action) => (
                        <li key={action} className="leading-relaxed">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ACTION CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <Link
                      href={`/?demoType=${story.samplePayload.type}&demoContent=${encodeURIComponent(story.samplePayload.content)}`}
                      className="inline-flex items-center gap-2 rounded-md bg-[#7667E8] hover:bg-[#8B7CF6] px-4 py-2 text-xs font-semibold text-[#F5F6F8] transition-colors shadow-sm"
                    >
                      <span>Investigate This Pattern →</span>
                    </Link>

                    <div className="text-[11px] font-mono text-[#69717F]">
                      Preloads threat indicators into isolated investigation workstation
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#10151C] border border-[rgba(255,255,255,0.15)] rounded-xl overflow-hidden shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
              <div className="space-y-0.5">
                <div className="text-xs font-mono uppercase text-[#8B7CF6] font-semibold tracking-wider">
                  FORENSIC SCHEMATIC INSPECTION
                </div>
                <div className="text-sm font-bold text-[#F5F6F8]">{activeLightboxImage.title}</div>
              </div>

              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                className="p-1.5 rounded-md text-[#A1A7B3] hover:text-[#F5F6F8] hover:bg-[#141A22] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0B0F14]">
              <Image
                src={activeLightboxImage.src}
                alt={activeLightboxImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 95vw, 1200px"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#69717F] pt-1">
              <span>Source: {activeLightboxImage.source}</span>
              <span>THREATX THREAT INTELLIGENCE REPOSITORY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
