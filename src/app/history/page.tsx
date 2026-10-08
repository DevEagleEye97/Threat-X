'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvestigationResult } from '@/types/investigation';
import { SiteCheckResult } from '@/types/siteCheck';
import { Search, ArrowRight, Clock, Trash2, Globe, Shield } from 'lucide-react';
import { formatTimeAgo, cn } from '@/lib/utils';
import { getSeverityColor } from '@/lib/risk/severity';

export default function HistoryPage() {
  const [investigations, setInvestigations] = useState<InvestigationResult[]>([]);
  const [siteChecks, setSiteChecks] = useState<SiteCheckResult[]>([]);
  const [activeTab, setActiveTab] = useState<'investigations' | 'siteChecks'>('investigations');
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'clean'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/investigations').then((res) => (res.ok ? res.json() : [])),
      fetch('/api/site-check').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([invData, scData]) => {
        setInvestigations(Array.isArray(invData) ? invData : []);
        setSiteChecks(Array.isArray(scData) ? scData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleClearHistory = async () => {
    if (confirm('Clear local investigation case history?')) {
      await fetch('/api/investigations', { method: 'DELETE' });
      setInvestigations([]);
    }
  };

  // Filtered investigations
  const filteredInvestigations = investigations.filter((item) => {
    const target = item.targetUrl || item.inputContentSnippet || item.targetTitle || '';
    const title = item.verdict?.title || '';
    const matchesSearch =
      target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'critical') return item.risk.score >= 80;
    if (filter === 'high') return item.risk.score >= 60 && item.risk.score < 80;
    if (filter === 'medium') return item.risk.score >= 20 && item.risk.score < 60;
    if (filter === 'clean') return item.risk.score < 20;
    return true;
  });

  const filteredSiteChecks = siteChecks.filter((item) => {
    return item.hostname.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8 pb-28 md:pb-16 cyber-grid animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] text-[11px] font-mono uppercase tracking-wider text-[#A1A7B3]">
          Case Ledger
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F5F7]">
          Investigation History
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A7B3] max-w-xl leading-relaxed">
          Forensic investigation case records, correlated threat evidence logs, and passive site checks.
        </p>
      </div>

      {/* Primary / Site Check Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-2 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('investigations')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
            activeTab === 'investigations'
              ? 'bg-[#141A22] text-[#F4F5F7] border border-[#7667E8]/35 font-semibold'
              : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
          )}
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Threat Cases ({investigations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('siteChecks')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
            activeTab === 'siteChecks'
              ? 'bg-[#141A22] text-[#F4F5F7] border border-[#7667E8]/35 font-semibold'
              : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Site Checks ({siteChecks.length})</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="relative flex items-center rounded-md border border-[rgba(255,255,255,0.07)] bg-[#10151C] px-3 py-2 text-xs">
          <Search className="h-3.5 w-3.5 text-[#69717F] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by target URL, domain, or verdict title…"
            className="w-full bg-transparent text-[#F4F5F7] placeholder:text-[#69717F] focus:outline-none font-mono text-xs"
          />
        </div>

        {/* Filter Pills for investigations */}
        {activeTab === 'investigations' && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'critical', label: 'Critical (80+)' },
              { id: 'high', label: 'High (60-79)' },
              { id: 'medium', label: 'Medium (20-59)' },
              { id: 'clean', label: 'Clean (0-19)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as 'all' | 'critical' | 'high' | 'medium' | 'clean')}
                className={cn(
                  'px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap text-[11px]',
                  filter === tab.id
                    ? 'bg-[#141A22] text-[#F4F5F7] border-[#7667E8]/35 font-bold'
                    : 'bg-[#10151C] text-[#A1A7B3] border-[rgba(255,255,255,0.07)] hover:text-[#F4F5F7]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: THREAT INVESTIGATIONS */}
      {activeTab === 'investigations' && (
        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] divide-y divide-[rgba(255,255,255,0.07)]">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[#69717F]">
              Loading investigation cases…
            </div>
          ) : filteredInvestigations.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-sm font-bold text-[#F4F5F7]">NO INVESTIGATIONS YET</div>
              <p className="text-xs text-[#A1A7B3] max-w-sm mx-auto">
                Start by investigating something suspicious. Cases will be recorded here locally.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#7667E8] text-[#F4F5F7] text-xs font-semibold hover:bg-[#8B7CF6] transition-colors"
              >
                <span>Start investigation →</span>
              </Link>
            </div>
          ) : (
            filteredInvestigations.map((item) => {
              const sevStyles = getSeverityColor(item.risk.severity);
              const target = item.targetUrl || item.inputContentSnippet || item.targetTitle || 'Case Target';

              return (
                <Link
                  key={item.id}
                  href={`/analysis/${item.id}`}
                  className="flex items-center justify-between p-4 hover:bg-[#141A22] transition-colors block group"
                >
                  <div className="min-w-0 flex-1 pr-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#A1A7B3] uppercase px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-[#0B0F14]">
                        {item.inputType || 'URL'}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#F4F5F7] group-hover:text-[#8B7CF6] truncate">
                        {target}
                      </span>
                    </div>

                    <div className="text-xs text-[#A1A7B3] line-clamp-1">
                      {item.verdict.title}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#69717F] pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(item.createdAt)}</span>
                      </span>
                      <span>•</span>
                      <span>{item.evidence.length} indicators</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono">
                      <div
                        className={cn(
                          'text-sm font-bold',
                          item.risk.score >= 80 ? 'text-[#F05A5A]' : item.risk.score >= 60 ? 'text-[#F05A5A]' : item.risk.score >= 20 ? 'text-[#D8A84E]' : 'text-[#59B98A]'
                        )}
                      >
                        {item.risk.score} / 100
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-[#69717F]">
                        {item.risk.severity}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#69717F] group-hover:text-[#F4F5F7] transition-colors" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: SITE CHECKS */}
      {activeTab === 'siteChecks' && (
        <div className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#10151C] divide-y divide-[rgba(255,255,255,0.07)]">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[#69717F]">
              Loading site check records…
            </div>
          ) : filteredSiteChecks.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-sm font-bold text-[#F4F5F7]">NO SITE CHECKS YET</div>
              <p className="text-xs text-[#A1A7B3] max-w-sm mx-auto">
                Review a website’s public security posture passively without destructive testing.
              </p>
              <Link
                href="/site-check"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#7667E8] text-[#F4F5F7] text-xs font-semibold hover:bg-[#8B7CF6] transition-colors"
              >
                <span>Run Site Check →</span>
              </Link>
            </div>
          ) : (
            filteredSiteChecks.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-[#141A22] transition-colors"
              >
                <div className="min-w-0 flex-1 pr-4 space-y-1 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8B7CF6] uppercase px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.07)] bg-[#0B0F14]">
                      {item.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#F4F5F7] truncate">
                      {item.hostname}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#69717F]">
                    Observed: {item.timestamp.split('T')[0]} · {item.headers.length} headers inspected
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#F4F5F7]">{item.postureScore} / 100</div>
                    <div
                      className={cn(
                        'text-[9px] uppercase tracking-wider font-bold',
                        item.postureRating === 'GOOD' ? 'text-[#59B98A]' : item.postureRating === 'NEEDS ATTENTION' ? 'text-[#D8A84E]' : 'text-[#F05A5A]'
                      )}
                    >
                      {item.postureRating}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Controls */}
      {investigations.length > 0 && activeTab === 'investigations' && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-[#69717F] hover:text-[#F05A5A] transition-colors font-mono"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Case History</span>
          </button>
        </div>
      )}
    </div>
  );
}
