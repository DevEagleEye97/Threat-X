'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Rss,
  Search,
  ArrowRight,
  Dna,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThreatStory {
  id: string;
  title: string;
  category: 'Banking' | 'Messaging' | 'Malware' | 'Phishing' | 'Recruitment' | 'Social Media' | 'Payments';
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  target: string;
  platform: 'WhatsApp' | 'SMS' | 'Email' | 'Web' | 'Android';
  deliveryVector: string;
  technique: string;
  indicators: string[];
  whatToDo: string[];
  source: string;
  threatDna: string[];
  samplePayload: {
    type: 'url' | 'message';
    content: string;
  };
}

const THREAT_STORIES: ThreatStory[] = [
  {
    id: 'tf-01',
    title: 'Deceptive Postal Redelivery & Parcel Fee Lure',
    category: 'Phishing',
    risk: 'High',
    target: 'E-commerce consumers & mobile subscribers',
    platform: 'SMS',
    deliveryVector: 'Spoofed courier SMS claiming incomplete delivery address',
    technique: 'Social engineering urgency → Subdomain spoofing → Fake card payment gate',
    indicators: ['Unverified SMS sender', '.cfd / .top TLD redirection', 'Urgent $1.99 redelivery fee request'],
    whatToDo: [
      'Do not click the tracking link in the SMS.',
      'Check official tracking via the postal service app directly.',
      'If card details were entered, freeze card via banking app immediately.',
    ],
    source: 'Community Threat Exchange & URLhaus',
    threatDna: ['COURIER IMPERSONATION', 'URGENT RESCHEDULE', 'SMS LURE', 'MICRO-PAYMENT BAIT', 'CARD THEFT'],
    samplePayload: {
      type: 'url',
      content: 'https://track-package.delivery-notice.example.net',
    },
  },
  {
    id: 'tf-02',
    title: 'Urgent Banking KYC Renewal Compliance Notice',
    category: 'Banking',
    risk: 'High',
    target: 'Commercial banking retail customers',
    platform: 'WhatsApp',
    deliveryVector: 'WhatsApp direct message impersonating regulatory compliance desk',
    technique: 'Regulatory panic → Mimicked banking auth gateway → In-session OTP interception',
    indicators: ['Unsolicited messaging app contact', 'Non-standard authentication domain', 'Request for live 2FA token'],
    whatToDo: [
      'Never share 2FA codes or passwords over messaging apps.',
      'Log in directly to verified mobile banking app.',
      'Report sender account via WhatsApp spam reporting tool.',
    ],
    source: 'Financial ISAC & PhishTank Feeds',
    threatDna: ['BANK IMPERSONATION', 'KYC DEADLINE', 'WHATSAPP DELIVERY', 'FAKE AUTH GATEWAY', 'OTP HARVEST'],
    samplePayload: {
      type: 'message',
      content: 'URGENT: Your KYC status has expired. Complete identity verification at https://login-verify.example-auth.org/service within 24 hours to prevent account suspension.',
    },
  },
  {
    id: 'tf-03',
    title: 'High-Comp Remote Project Specialist Recruitment Scam',
    category: 'Recruitment',
    risk: 'Medium',
    target: 'Job seekers & freelancers',
    platform: 'Email',
    deliveryVector: 'Cold email offering unrequested remote role at $55/hr',
    technique: 'Financial lure → Google Docs questionnaire → Advanced fee or check-cashing task',
    indicators: ['Unsolicited offer without formal interview', 'Free email host sender address', 'Immediate request for banking details for equipment check'],
    whatToDo: [
      'Verify vacancy on company official careers portal.',
      'Never send funds for equipment or onboarding materials.',
      'Mark email as phishing.',
    ],
    source: 'Open Threat Exchange Feed',
    threatDna: ['HIGH SALARY LURE', 'IMMEDIATE OFFER', 'UNVERIFIED SENDER', 'ADVANCE FEE SOLICITATION'],
    samplePayload: {
      type: 'message',
      content: 'Congratulations! Selected for Remote Project Specialist role ($55/hr). Verify identity and payment details at https://login-verify.example-auth.org/onboarding to claim position.',
    },
  },
  {
    id: 'tf-04',
    title: 'Fake Banking Security Patch APK Dropper',
    category: 'Malware',
    risk: 'High',
    target: 'Android mobile banking users',
    platform: 'Android',
    deliveryVector: 'SMS warning of urgent security breach requiring app update',
    technique: 'Social engineering → Direct .apk download → Accessibility service abuse → Screen scraping',
    indicators: ['Direct .apk file download link outside Google Play', 'Requests Accessibility permissions on install', 'Automated SMS forwarding requests'],
    whatToDo: [
      'Never sideload APK files from SMS links.',
      'Only install updates through Google Play Store.',
      'Change banking passwords from another unaffected device.',
    ],
    source: 'Threat Intelligence Lab / MalwareBazaar',
    threatDna: ['IT SECURITY BAIT', 'DIRECT APK DOWNLOAD', 'ACCESSIBILITY HIJACK', 'CREDENTIAL OVERLAY', 'FUNDS SIPHON'],
    samplePayload: {
      type: 'message',
      content: 'Security Alert: Critical mobile banking security update. Download and install security-patch-v3.apk from https://track-package.delivery-notice.example.net/apk to maintain access.',
    },
  },
  {
    id: 'tf-05',
    title: 'Physical Parking Meter QR Replacement (Quishing)',
    category: 'Payments',
    risk: 'High',
    target: 'Motorists paying at public parking stations',
    platform: 'Web',
    deliveryVector: 'Adhesive malicious QR sticker placed over legitimate parking payment signage',
    technique: 'Physical overlay → Redirect to deceptive parking payment site → Recurring subscription capture',
    indicators: ['Physical sticker pasted over metal sign', 'Domain does not match municipal parking authority', 'Recurring monthly billing clause in fine print'],
    whatToDo: [
      'Inspect physical QR signs for overlaid stickers before scanning.',
      'Pay via official municipal parking apps or physical coin/card slots.',
      'If scanned, verify the URL domain before approving any charge.',
    ],
    source: 'Federal Consumer Protection & Threat Analysis',
    threatDna: ['PHYSICAL QR OVERLAY', 'MUNICIPAL IMPERSONATION', 'FAKE PAYMENT UI', 'SUBSCRIPTION FRAUD'],
    samplePayload: {
      type: 'url',
      content: 'https://track-package.delivery-notice.example.net/qr-pay',
    },
  },
];

export default function ThreatFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = ['All', 'Banking', 'Messaging', 'Malware', 'Phishing', 'Recruitment', 'Payments'];
  const RISKS = ['All', 'Critical', 'High', 'Medium'];
  const PLATFORMS = ['All', 'WhatsApp', 'SMS', 'Android', 'Web'];

  const filteredStories = THREAT_STORIES.filter((story) => {
    if (selectedCategory !== 'All' && story.category !== selectedCategory) return false;
    if (selectedRisk !== 'All' && story.risk !== selectedRisk) return false;
    if (selectedPlatform !== 'All' && story.platform !== selectedPlatform) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        story.title.toLowerCase().includes(q) ||
        story.deliveryVector.toLowerCase().includes(q) ||
        story.indicators.some((i) => i.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 pb-28 md:pb-16 cyber-grid animate-in fade-in duration-200">
      {/* Editorial Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-wider text-[#A1A7B3]">
          <Rss className="h-3 w-3 text-[#7667E8]" />
          <span>Threat Intelligence Bulletin</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7]">
          Threats worth knowing about.
        </h1>

        <p className="text-xs sm:text-sm text-[#A1A7B3] max-w-2xl leading-relaxed">
          Understand current scam patterns, delivery methods, and structural indicators appearing in the wild.
        </p>
      </div>

      {/* Filter System */}
      <div className="space-y-3 p-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0B0F14]">
        {/* Search Input */}
        <div className="relative flex items-center rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] px-3 py-2 text-xs">
          <Search className="h-3.5 w-3.5 text-[#69717F] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active scam campaigns, indicators, or techniques…"
            className="w-full bg-transparent text-[#F4F5F7] placeholder:text-[#69717F] focus:outline-none font-mono text-xs"
          />
        </div>

        {/* Minimal Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pt-1">
          <span className="text-[#69717F] text-[10px] shrink-0 mr-1">CATEGORY:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-2.5 py-1 rounded-md border transition-colors text-[11px] shrink-0',
                selectedCategory === cat
                  ? 'bg-[#141A22] text-[#F4F5F7] border-[#7667E8]/35'
                  : 'bg-[#10151C] text-[#A1A7B3] border-[rgba(255,255,255,0.07)] hover:text-[#F4F5F7]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Risk & Platform Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-[#69717F]">
          <div className="flex items-center gap-1.5">
            <span>RISK:</span>
            {RISKS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  selectedRisk === r ? 'text-[#F4F5F7] bg-[#141A22] font-bold' : 'hover:text-[#A1A7B3]'
                )}
              >
                {r}
              </button>
            ))}
          </div>

          <span>·</span>

          <div className="flex items-center gap-1.5">
            <span>PLATFORM:</span>
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={cn(
                  'px-2 py-0.5 rounded transition-colors',
                  selectedPlatform === p ? 'text-[#F4F5F7] bg-[#141A22] font-bold' : 'hover:text-[#A1A7B3]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Editorial List */}
      <div className="space-y-6">
        {filteredStories.map((story) => (
          <article
            key={story.id}
            className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] p-6 space-y-5 hover:border-[rgba(255,255,255,0.14)] transition-all"
          >
            {/* Top Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(255,255,255,0.07)] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#8B7CF6]">
                  {story.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#69717F]">
                  DEMO THREAT
                </span>
                <span className="text-[11px] font-mono text-[#69717F]">
                  {story.platform} · Target: {story.target}
                </span>
              </div>

              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border',
                  story.risk === 'Critical'
                    ? 'border-[#F05A5A]/30 bg-[#F05A5A]/10 text-[#F05A5A]'
                    : story.risk === 'High'
                    ? 'border-[#F05A5A]/30 bg-[#F05A5A]/10 text-[#F05A5A]'
                    : 'border-[#D8A84E]/30 bg-[#D8A84E]/10 text-[#D8A84E]'
                )}
              >
                {story.risk} RISK
              </span>
            </div>

            {/* Title & Delivery Vector */}
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#F4F5F7] tracking-tight">
                {story.title}
              </h2>
              <p className="text-xs text-[#A1A7B3] leading-relaxed">
                <strong className="text-[#F4F5F7]">Delivery Vector:</strong> {story.deliveryVector}
              </p>
            </div>

            {/* Threat DNA Ribbon */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#69717F] font-bold flex items-center gap-1.5">
                <Dna className="h-3 w-3 text-[#7667E8]" />
                <span>Threat DNA Pattern Signature</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                {story.threatDna.map((node, i) => (
                  <div key={node} className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] text-[#F4F5F7]">
                      {node}
                    </span>
                    {i < story.threatDna.length - 1 && (
                      <span className="text-[#69717F] font-bold">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Techniques & Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1 bg-[#0B0F14] p-3.5 rounded-md border border-[rgba(255,255,255,0.07)]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A7B3] font-semibold">
                  Observed Techniques
                </span>
                <p className="text-[#F4F5F7] text-[11px] leading-snug">{story.technique}</p>
              </div>

              <div className="space-y-1 bg-[#0B0F14] p-3.5 rounded-md border border-[rgba(255,255,255,0.07)]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A1A7B3] font-semibold">
                  Key Indicators
                </span>
                <ul className="text-[11px] text-[#A1A7B3] space-y-0.5 list-disc list-inside">
                  {story.indicators.map((ind) => (
                    <li key={ind}>{ind}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What to do & Investigate CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[rgba(255,255,255,0.07)]">
              <div className="text-[11px] text-[#A1A7B3] space-y-0.5">
                <strong className="text-[#F4F5F7] block">Recommended Action:</strong>
                <p>{story.whatToDo[0]}</p>
              </div>

              <Link
                href={`/?demoType=${story.samplePayload.type}&demoContent=${encodeURIComponent(story.samplePayload.content)}`}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-[#7667E8] text-[#F4F5F7] hover:bg-[#8B7CF6] font-semibold text-xs transition-colors shrink-0"
              >
                <span>Investigate pattern →</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
