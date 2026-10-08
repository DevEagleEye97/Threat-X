'use client';

import { useState } from 'react';
import { Link2, Clipboard, Globe, Shield, Zap, Target, Lock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isLoading?: boolean;
}

const TEST_VECTORS = [
  {
    title: 'Phishing Bank Portal',
    url: 'https://auth-portal.central-reserve-bank.cfd/login',
    riskLabel: 'High Risk',
    riskColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  },
  {
    title: 'Credential Harvesting Link',
    url: 'https://ms-account-security-alert-token491.org/auth/verify',
    riskLabel: 'Critical',
    riskColor: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
  {
    title: 'Legitimate SaaS Verification',
    url: 'https://auth.enterprise-workspace.com/session/sso',
    riskLabel: 'Clean',
    riskColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
];

export function URLInput({ onAnalyze, isLoading = false }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setInputError(null);
      }
    } catch {
      // Clipboard access not granted
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) {
      setInputError('Please enter a target URL to investigate.');
      return;
    }
    setInputError(null);
    onAnalyze(url.trim());
  };

  const handleSelectVector = (vectorUrl: string) => {
    setUrl(vectorUrl);
    setInputError(null);
    onAnalyze(vectorUrl);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Sandbox Inspector Card */}
      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-2xl relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2738]/60 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs text-slate-400 tracking-wider ml-1">
              SANDBOX_INSPECTOR_V2
            </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50 text-[10px] font-mono font-medium text-slate-300">
            <Lock className="h-2.5 w-2.5 text-indigo-400" />
            <span>ISOLATED</span>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center rounded-xl border border-[#222E42] bg-[#0A0E17] focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all">
            <div className="pl-3.5 pr-2 text-slate-500">
              <Link2 className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="https://secure-account-verify.example.xyz/auth..."
              className="w-full bg-transparent py-3 pr-24 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none font-mono"
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161F2E] border border-[#26354D] text-xs text-slate-300 hover:text-white hover:bg-[#1E2A3E] transition-colors"
            >
              <Clipboard className="h-3 w-3" />
              <span>Paste</span>
            </button>
          </div>

          {inputError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 pl-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-semibold text-sm transition-all',
              'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.99] shadow-lg shadow-indigo-600/25',
              isLoading && 'opacity-60 cursor-not-allowed'
            )}
          >
            <Globe className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            <span>{isLoading ? 'Analyzing in Sandbox...' : 'Analyze Threat'}</span>
          </button>
        </form>

        {/* Security Guarantees */}
        <div className="mt-5 pt-4 border-t border-[#1E2738]/50 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-slate-500" />
            <span>Analyze without opening or pinging the link</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Multi-layer heuristic & reputation engine</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-indigo-400" />
            <span>Evidence-backed AI reasoning & mitigation</span>
          </div>
        </div>
      </div>

      {/* Zero Risk Isolation Notice */}
      <div className="flex items-start gap-3.5 rounded-xl border border-[#1E2738] bg-[#0E131E] p-4 text-xs">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mt-0.5">
          <Shield className="h-3.5 w-3.5" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">Zero-Risk Server Isolation</h4>
          <p className="mt-1 text-slate-400 leading-relaxed">
            THREATX analyzes suspicious URLs server-side in ephemeral, air-gapped micro-sandboxes. We never trigger tracking beacons or execute payload scripts client-side.
          </p>
        </div>
      </div>

      {/* Quick Select Test Vectors */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span className="uppercase tracking-wider text-[11px] font-semibold text-slate-500">
            Quick Select Test Vectors
          </span>
          <span className="text-[11px] text-slate-500">Simulate</span>
        </div>

        <div className="space-y-2">
          {TEST_VECTORS.map((vec) => (
            <button
              key={vec.title}
              type="button"
              onClick={() => handleSelectVector(vec.url)}
              disabled={isLoading}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-[#1E2738] bg-[#111622] hover:bg-[#151C2C] hover:border-slate-700/80 transition-all text-left group"
            >
              <div className="min-w-0 flex-1">
                <div className="font-medium text-xs text-slate-200 group-hover:text-white transition-colors">
                  {vec.title}
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                  {vec.url}
                </div>
              </div>

              <span className={cn('shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border', vec.riskColor)}>
                {vec.riskLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="rounded-xl border border-[#1E2738]/60 bg-[#0E131E] p-3 text-center">
          <div className="font-bold text-base text-slate-100 font-mono">1.4M+</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">URLs Analyzed</div>
        </div>
        <div className="rounded-xl border border-[#1E2738]/60 bg-[#0E131E] p-3 text-center">
          <div className="font-bold text-base text-emerald-400 font-mono">99.8%</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Verdict Precision</div>
        </div>
        <div className="rounded-xl border border-[#1E2738]/60 bg-[#0E131E] p-3 text-center">
          <div className="font-bold text-base text-indigo-400 font-mono">0</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">Client Exposure</div>
        </div>
      </div>
    </div>
  );
}
