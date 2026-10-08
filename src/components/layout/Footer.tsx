import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.07)] bg-[#07090D] py-12 pb-24 md:pb-12 text-xs text-[#A1A7B3]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7667E8]/12 text-[#8B7CF6] border border-[#7667E8]/25">
                <Shield className="h-3 w-3" />
              </div>
              <span className="font-bold text-sm tracking-wider text-[#F4F5F7]">
                THREAT<span className="text-[#7667E8]">X</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-[#F4F5F7]">
              Don&apos;t click it. Investigate it.
            </p>
            <p className="text-xs text-[#69717F] max-w-sm leading-relaxed">
              Open-source digital threat investigation platform enabling secure, air-gapped inspection of untrusted digital content before interaction.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#F4F5F7] font-semibold">
              Platform
            </div>
            <ul className="space-y-1.5 text-xs text-[#A1A7B3]">
              <li>
                <Link href="/" className="hover:text-[#F4F5F7] transition-colors">
                  Investigate
                </Link>
              </li>
              <li>
                <Link href="/site-check" className="hover:text-[#F4F5F7] transition-colors">
                  Site Check
                </Link>
              </li>
              <li>
                <Link href="/threat-feed" className="hover:text-[#F4F5F7] transition-colors">
                  Threat Feed
                </Link>
              </li>
              <li>
                <Link href="/exposure-check" className="hover:text-[#F4F5F7] transition-colors">
                  Exposure Check
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-[#F4F5F7] transition-colors">
                  Investigation History
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-[#F4F5F7] transition-colors">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Source */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#F4F5F7] font-semibold">
              Assurance
            </div>
            <ul className="space-y-1.5 text-xs text-[#A1A7B3]">
              <li>
                <Link href="/security" className="hover:text-[#F4F5F7] transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F4F5F7] transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <Link href="/security#privacy" className="hover:text-[#F4F5F7] transition-colors">
                  Privacy & Data Isolation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#69717F]">
          <div>
            THREATX · Evidence before interaction · Open-source Digital Threat Investigation Platform
          </div>
          <div className="font-mono text-[10px]">
            Zero client execution · Deterministic scoring
          </div>
        </div>
      </div>
    </footer>
  );
}
