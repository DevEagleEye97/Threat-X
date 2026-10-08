import Link from 'next/link';
import { Shield } from 'lucide-react';
import { TypewriterStatement } from '@/components/layout/TypewriterStatement';

export function Footer() {
  return (
    <footer className="relative z-20 border-t border-[rgba(255,255,255,0.12)] bg-[#0B0F14]/98 backdrop-blur-md py-14 pb-28 md:pb-14 text-xs text-[#A1A7B3]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7667E8]/15 text-[#8B7CF6] border border-[#7667E8]/30">
                <Shield className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold text-[17px] tracking-[-0.02em] text-[#F5F6F8]">
                THREAT<span className="text-[#7667E8]">X</span>
              </span>
            </div>
            <p className="text-[15px] font-medium text-[#F5F6F8]">
              Don&apos;t click it. Investigate it.
            </p>
            <p className="text-[13px] text-[#A1A7B3] max-w-md leading-relaxed font-sans">
              Open-source digital threat investigation platform enabling secure, air-gapped inspection of untrusted digital content before interaction.
            </p>
            <div className="pt-2">
              <TypewriterStatement />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-[12px] font-mono uppercase tracking-wider text-[#F5F6F8] font-semibold">
              Platform
            </div>
            <ul className="space-y-2 text-[13px] text-[#A1A7B3]">
              <li>
                <Link href="/" className="hover:text-[#F5F6F8] transition-colors">
                  Investigate
                </Link>
              </li>
              <li>
                <Link href="/site-check" className="hover:text-[#F5F6F8] transition-colors">
                  Site Check
                </Link>
              </li>
              <li>
                <Link href="/threat-feed" className="hover:text-[#F5F6F8] transition-colors">
                  Threat Feed
                </Link>
              </li>
              <li>
                <Link href="/exposure-check" className="hover:text-[#F5F6F8] transition-colors">
                  Exposure Check
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#F5F6F8] transition-colors">
                  Investigation History
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-[#F5F6F8] transition-colors">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Source */}
          <div className="space-y-3">
            <div className="text-[12px] font-mono uppercase tracking-wider text-[#F5F6F8] font-semibold">
              Assurance
            </div>
            <ul className="space-y-2 text-[13px] text-[#A1A7B3]">
              <li>
                <Link href="/security" className="hover:text-[#F5F6F8] transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/DevEagleEye97/Threat-X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F6F8] transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/security#privacy" className="hover:text-[#F5F6F8] transition-colors">
                  Privacy & Data Isolation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(255,255,255,0.09)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#9CA3AF]">
          <div>
            THREATX · Evidence before interaction · Open-source Digital Threat Investigation Platform
          </div>
          <div className="font-mono text-[11px] text-[#8B7CF6]">
            Zero client execution · Deterministic scoring
          </div>
        </div>
      </div>
    </footer>
  );
}
