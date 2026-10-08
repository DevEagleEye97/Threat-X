'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Investigate', href: '/' },
    { label: 'Site Check', href: '/site-check' },
    { label: 'Threat Feed', href: '/threat-feed' },
    { label: 'Exposure Check', href: '/exposure-check' },
    { label: 'History', href: '/history' },
    { label: 'Methodology', href: '/methodology' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.07)] bg-[#07090D]/92 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#7667E8]/12 text-[#8B7CF6] border border-[#7667E8]/25 group-hover:border-[#7667E8]/50 transition-colors">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold tracking-wider text-[#F4F5F7] text-sm">
                THREAT<span className="text-[#7667E8]">X</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-[#10151C] text-[#F4F5F7] border border-[rgba(255,255,255,0.09)]'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-[#0B0F14]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side utilities */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/security"
            className="text-[13px] text-[#A1A7B3] hover:text-[#F4F5F7] transition-colors"
          >
            Security
          </Link>

          <span className="h-3 w-px bg-[rgba(255,255,255,0.08)]" />

          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#A1A7B3]">
            OPEN SOURCE
          </span>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#A1A7B3] hover:text-[#F4F5F7] transition-colors"
            title="GitHub Repository"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgba(255,255,255,0.07)] text-[#A1A7B3] hover:text-[#F4F5F7] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-b border-[rgba(255,255,255,0.07)] bg-[#07090D] px-4 py-4 md:hidden animate-in fade-in duration-150 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-xs font-medium',
                  isActive
                    ? 'bg-[#10151C] text-[#F4F5F7] border border-[rgba(255,255,255,0.09)]'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] flex items-center justify-between text-xs text-[#A1A7B3] px-1">
            <Link
              href="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-[#F4F5F7]"
            >
              Security Architecture
            </Link>
            <span className="font-mono text-[10px]">OPEN SOURCE</span>
          </div>
        </div>
      )}
    </header>
  );
}
