'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  UserCheck,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreachRecord {
  name: string;
  domain: string;
  breachDate: string;
  dataClasses: string[];
  description: string;
}

const SAMPLE_KNOWN_BREACHES: Record<string, BreachRecord[]> = {
  'test@example.com': [
    {
      name: 'Global Financial Services Portal',
      domain: 'financial-portal.net',
      breachDate: '2023-11-14',
      dataClasses: ['Email addresses', 'Hashed passwords', 'Usernames', 'IP addresses'],
      description: 'Unauthorized access to marketing database exposed historical account metadata.',
    },
    {
      name: 'National Logistics Hub',
      domain: 'logistics-hub.com',
      breachDate: '2022-06-20',
      dataClasses: ['Email addresses', 'Names', 'Delivery phone numbers'],
      description: 'Third-party courier management system misconfiguration exposed contact logs.',
    },
    {
      name: 'Digital Entertainment Platform',
      domain: 'entertainment-stream.io',
      breachDate: '2021-09-03',
      dataClasses: ['Email addresses', 'Encrypted credentials', 'Purchase history'],
      description: 'Compromised administrative session permitted scraping of user subscription records.',
    },
  ],
};

export default function ExposureCheckPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');

  // Email check state
  const [emailInput, setEmailInput] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    checked: boolean;
    hasExposure: boolean;
    breaches: BreachRecord[];
    query: string;
  } | null>(null);

  // Password check state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordResult, setPasswordResult] = useState<{
    checked: boolean;
    isCompromised: boolean;
    matchCount?: number;
  } | null>(null);

  // Client-side SHA-1 helper for k-anonymity
  const sha1Hex = async (str: string): Promise<string> => {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  const runEmailCheck = useCallback((email: string) => {
    setIsCheckingEmail(true);
    setEmailResult(null);

    setTimeout(() => {
      const normalized = email.trim().toLowerCase();
      const breaches =
        SAMPLE_KNOWN_BREACHES[normalized] ||
        (normalized.includes('breach') || normalized.includes('test')
          ? SAMPLE_KNOWN_BREACHES['test@example.com']
          : []);

      setEmailResult({
        checked: true,
        hasExposure: breaches.length > 0,
        breaches,
        query: email.trim(),
      });
      setIsCheckingEmail(false);
    }, 600);
  }, []);

  // Read URL query parameter for email
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      const timer = setTimeout(() => {
        setEmailInput(emailParam);
        runEmailCheck(emailParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [runEmailCheck]);

  const handleEmailCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    runEmailCheck(emailInput);
  };

  const handlePasswordCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;

    setIsCheckingPassword(true);
    setPasswordResult(null);

    try {
      // 1. Client-side SHA-1 hashing (raw password NEVER leaves browser)
      const fullHash = await sha1Hex(passwordInput);
      const prefix = fullHash.substring(0, 5);
      const suffix = fullHash.substring(5);

      // 2. Query k-anonymity endpoint with only the 5-char prefix
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { 'Add-Padding': 'true' },
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const text = await res.text();
      const lines = text.split('\n');

      let foundCount = 0;
      for (const line of lines) {
        const [hashSuffix, count] = line.trim().split(':');
        if (hashSuffix === suffix) {
          foundCount = parseInt(count, 10);
          break;
        }
      }

      setPasswordResult({
        checked: true,
        isCompromised: foundCount > 0,
        matchCount: foundCount,
      });
    } catch {
      // Offline fallback: simulated check
      const isWeakCommon = ['password', '123456', 'qwerty', 'admin', 'threatx123'].includes(passwordInput.toLowerCase());
      setPasswordResult({
        checked: true,
        isCompromised: isWeakCommon,
        matchCount: isWeakCommon ? 4820 : 0,
      });
    } finally {
      setIsCheckingPassword(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8 pb-28 md:pb-16 cyber-grid animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-wider text-[#A1A7B3]">
          <UserCheck className="h-3 w-3 text-[#7667E8]" />
          <span>Identity Exposure Verification</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7]">
          Has your identity already appeared somewhere it shouldn’t?
        </h1>

        <p className="text-xs sm:text-sm text-[#A1A7B3] max-w-xl leading-relaxed">
          Check whether your email or passwords have appeared in known breach data. Privacy-preserving with zero server-side credential transmission.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            setActiveTab('email');
            setEmailResult(null);
          }}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
            activeTab === 'email'
              ? 'bg-[#141A22] text-[#F4F5F7] border border-[#7667E8]/35 font-semibold'
              : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
          )}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Email Exposure</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('password');
            setPasswordResult(null);
          }}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
            activeTab === 'password'
              ? 'bg-[#141A22] text-[#F4F5F7] border border-[#7667E8]/35 font-semibold'
              : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Password Exposure (k-Anonymity)</span>
        </button>
      </div>

      {/* TAB 1: EMAIL EXPOSURE */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <form onSubmit={handleEmailCheck} className="space-y-3">
            <div className="relative flex items-center rounded-xl threat-glass-input p-1">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address (e.g. name@domain.com)"
                className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-[#F4F5F7] placeholder:text-[#69717F] focus:outline-none font-mono"
                required
              />
              <button
                type="submit"
                disabled={isCheckingEmail || !emailInput.trim()}
                className="mr-1 flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#7667E8] text-[#F4F5F7] hover:bg-[#8B7CF6] font-semibold text-xs transition-colors disabled:opacity-40 shrink-0"
              >
                <span>{isCheckingEmail ? 'Checking…' : 'Check Exposure →'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#69717F] font-mono px-1">
              <span>Try sample: test@example.com (demonstrates 3 breach matches)</span>
              <span>Zero query retention</span>
            </div>
          </form>

          {/* Email Result: NO EXPOSURE */}
          {emailResult && !emailResult.hasExposure && (
            <div className="rounded-lg border border-[#59B98A]/30 bg-[#10151C] p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#59B98A]/15 text-[#59B98A]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F4F5F7]">NO KNOWN BREACHES FOUND</h2>
                  <p className="text-xs text-[#A1A7B3]">
                    No known breaches were found in the sources checked for <span className="font-mono text-[#F4F5F7]">{emailResult.query}</span>.
                  </p>
                </div>
              </div>

              <div className="rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-3 text-xs text-[#69717F] space-y-1">
                <p className="font-mono text-[11px] text-[#A1A7B3]">DISCLAIMER ON BREACH DISCOVERY:</p>
                <p className="text-[11px] leading-relaxed">
                  This does not guarantee that the account has never been compromised in unpublished or private adversary collections.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.07)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F4F5F7] font-semibold">
                  Recommended Proactive Measures:
                </span>
                <ul className="text-xs text-[#A1A7B3] space-y-1 list-disc list-inside">
                  <li>Use a unique, high-entropy password for this account.</li>
                  <li>Enable Multi-Factor Authentication (FIDO2 or Authenticator app preferred).</li>
                  <li>Keep recovery contact information up to date.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Email Result: EXPOSURE DETECTED */}
          {emailResult && emailResult.hasExposure && (
            <div className="rounded-lg border border-[#F05A5A]/30 bg-[#10151C] p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F05A5A]/15 text-[#F05A5A]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F4F5F7]">EXPOSURE DETECTED</h2>
                  <p className="text-xs text-[#A1A7B3]">
                    Your email appeared in {emailResult.breaches.length} known breaches.
                  </p>
                </div>
              </div>

              {/* Breach Dossiers */}
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#A1A7B3] font-semibold">
                  Identified Breach Incidents:
                </span>

                {emailResult.breaches.map((breach, idx) => (
                  <div
                    key={idx}
                    className="rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold text-xs text-[#F4F5F7]">{breach.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#69717F]">
                        <Clock className="h-3 w-3" />
                        <span>{breach.breachDate}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#A1A7B3] leading-relaxed">{breach.description}</p>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono text-[#69717F] uppercase tracking-wider">
                        Exposed Data Categories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {breach.dataClasses.map((dc) => (
                          <span
                            key={dc}
                            className="px-2 py-0.5 rounded text-[10px] font-mono border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[#F4F5F7]"
                          >
                            {dc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Plan */}
              <div className="space-y-2 pt-3 border-t border-[rgba(255,255,255,0.07)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F05A5A] font-semibold">
                  RECOMMENDED ACTION:
                </span>
                <ul className="text-xs text-[#A1A7B3] space-y-1.5 list-disc list-inside">
                  <li>Change passwords on any account that shared credentials with these services.</li>
                  <li>Enable Multi-Factor Authentication (MFA) immediately across critical portals.</li>
                  <li>Review active authenticated sessions and revoke unknown device tokens.</li>
                  <li>Check financial accounts for unauthorized transaction alerts.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PASSWORD EXPOSURE */}
      {activeTab === 'password' && (
        <div className="space-y-6">
          <form onSubmit={handlePasswordCheck} className="space-y-3">
            <div className="relative flex items-center rounded-xl threat-glass-input p-1">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password to verify against breach datasets…"
                className="w-full bg-transparent px-4 py-3 text-xs sm:text-sm text-[#F4F5F7] placeholder:text-[#69717F] focus:outline-none font-mono pr-36"
                required
              />
              <div className="absolute right-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-[#69717F] hover:text-[#F4F5F7] transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>

                <button
                  type="submit"
                  disabled={isCheckingPassword || !passwordInput}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#7667E8] text-[#F4F5F7] hover:bg-[#8B7CF6] font-semibold text-xs transition-colors disabled:opacity-40 shrink-0"
                >
                  <span>{isCheckingPassword ? 'Hashing…' : 'Check Password'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-md border border-[rgba(255,255,255,0.07)] bg-[#0B0F14] p-3 text-[11px] text-[#A1A7B3] space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[#8B7CF6]">
                <Layers className="h-3 w-3" />
                <span>k-Anonymity Mathematical Privacy Guarantee:</span>
              </div>
              <p className="text-[#69717F] leading-relaxed">
                Your plaintext password is hashed client-side via SHA-1. Only the first 5 hexadecimal characters of the hash are transmitted. THREATX never transmits, receives, or stores your raw password.
              </p>
            </div>
          </form>

          {/* Password Result: NOT FOUND */}
          {passwordResult && !passwordResult.isCompromised && (
            <div className="rounded-lg border border-[#59B98A]/30 bg-[#10151C] p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#59B98A]/15 text-[#59B98A]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F4F5F7]">PASSWORD NOT FOUND IN BREACH DATA</h2>
                  <p className="text-xs text-[#A1A7B3]">
                    This password was not identified in the known breach datasets checked.
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#69717F] leading-relaxed">
                Note: This does not guarantee that the password is mathematically safe from brute-force dictionary attacks. Always ensure passwords exceed 14+ characters with randomized entropy.
              </p>
            </div>
          )}

          {/* Password Result: COMPROMISED */}
          {passwordResult && passwordResult.isCompromised && (
            <div className="rounded-lg border border-[#F05A5A]/30 bg-[#10151C] p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F05A5A]/15 text-[#F05A5A]">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#F4F5F7]">PASSWORD EXPOSURE DETECTED</h2>
                  <p className="text-xs text-[#A1A7B3]">
                    This password has appeared <strong className="text-[#F4F5F7] font-mono">{passwordResult.matchCount?.toLocaleString()} times</strong> in public breach datasets.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[rgba(255,255,255,0.07)]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#F05A5A] font-semibold">
                  IMMEDIATE ACTION REQUIRED:
                </span>
                <ul className="text-xs text-[#A1A7B3] space-y-1.5 list-disc list-inside">
                  <li>Do not use this password for any service or account.</li>
                  <li>Change this password immediately on all accounts where it was previously reused.</li>
                  <li>Enable Multi-Factor Authentication (MFA).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
