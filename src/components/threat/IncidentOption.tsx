'use client';

import { useState } from 'react';
import { UserIncidentState, IncidentActionStep } from '@/types/investigation';
import { ShieldAlert, CheckCircle2, Send, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IncidentOptionProps {
  actionsByState: Record<UserIncidentState, IncidentActionStep[]>;
  investigationId: string;
}

const STATE_OPTIONS: Array<{ key: UserIncidentState; label: string }> = [
  { key: 'not_opened', label: "I haven't interacted" },
  { key: 'opened_link', label: 'I opened the link' },
  { key: 'downloaded_file', label: 'I downloaded the file' },
  { key: 'installed_apk', label: 'I installed the APK' },
  { key: 'entered_password', label: 'I entered my password' },
  { key: 'entered_otp', label: 'I entered an OTP' },
  { key: 'entered_payment', label: 'I entered payment info' },
  { key: 'sent_money', label: 'I sent money' },
];

export function IncidentOption({ actionsByState, investigationId }: IncidentOptionProps) {
  const [selectedState, setSelectedState] = useState<UserIncidentState>('not_opened');
  const [ticketDispatched, setTicketDispatched] = useState(false);

  const currentPlaybook = actionsByState[selectedState] || [];

  const handleDispatchTicket = () => {
    setTicketDispatched(true);
    setTimeout(() => setTicketDispatched(false), 4000);
  };

  const handleExportReport = () => {
    const reportData = {
      investigationId,
      userState: selectedState,
      playbook: currentPlaybook,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threatx-incident-${investigationId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section role="region" aria-label="Incident Response Playbook" className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#E2E8F0] flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[#8B7CF6]" aria-hidden="true" />
          <span>Incident Action Center</span>
        </h3>
        <span className="text-[11px] font-mono text-[#64748B]">
          Tailored Playbook
        </span>
      </div>

      <div className="threat-panel p-5 sm:p-6 space-y-4">
        {/* Interaction Assessment Selector */}
        <div className="space-y-2">
          <label className="text-xs text-[#CBD5E1] font-semibold block">
            What was your interaction with this target?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Incident interaction states">
            {STATE_OPTIONS.map((opt) => {
              const isSelected = selectedState === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedState(opt.key)}
                  aria-pressed={isSelected}
                  className={cn(
                    'px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors text-left flex items-center gap-2.5',
                    isSelected
                      ? 'bg-[#7667E8] text-white border-[#8B7CF6] shadow-sm font-semibold'
                      : 'bg-[#07090D] text-[#94A3B8] border-[rgba(255,255,255,0.08)] hover:bg-[#161B25] hover:text-[#E2E8F0]'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0 transition-colors',
                      isSelected ? 'bg-white' : 'bg-[#64748B]'
                    )}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tailored Response Plan */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#07090D] p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[rgba(255,255,255,0.06)] text-xs">
            <span className="font-mono font-bold uppercase tracking-[0.06em] text-[#22D3EE] flex items-center gap-1.5">
              <span>Tailored Action Steps</span>
            </span>
            <span className="text-[11px] font-mono text-[#64748B]">
              Selected State: {STATE_OPTIONS.find((o) => o.key === selectedState)?.label}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {currentPlaybook.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#161B25] border border-[rgba(255,255,255,0.12)] text-[10px] font-mono font-bold text-[#22D3EE] mt-0.5 tabular-nums">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="text-xs font-semibold text-[#E2E8F0]">
                    {step.title}
                  </div>
                  <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Dispatch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDispatchTicket}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all',
              ticketDispatched
                ? 'bg-[#10B981] text-white'
                : 'bg-[#7667E8] text-white hover:bg-[#8B7CF6] active:scale-[0.99] shadow-sm'
            )}
          >
            {ticketDispatched ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span className="font-mono">Ticket #TX-{investigationId.slice(0, 6).toUpperCase()} Dispatched</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Dispatch Incident Ticket</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold bg-[#161B25] border border-[rgba(255,255,255,0.10)] text-[#CBD5E1] hover:text-[#E2E8F0] hover:bg-[#1E2738] transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-[#22D3EE]" aria-hidden="true" />
            <span>Export Action Plan (.JSON)</span>
          </button>
        </div>
      </div>
    </section>
  );
}
