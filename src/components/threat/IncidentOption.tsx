'use client';

import { useState } from 'react';
import { UserIncidentState, IncidentActionStep } from '@/types/investigation';
import { ShieldAlert, AlertOctagon, CheckCircle2, Send, Download } from 'lucide-react';
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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-indigo-400" />
          <span>What should I do?</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Action Center</span>
      </div>

      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-2xl space-y-4">
        {/* Question Prompt */}
        <div className="space-y-2">
          <div className="text-xs text-slate-300 font-semibold">
            What happened after you received it?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STATE_OPTIONS.map((opt) => {
              const isSelected = selectedState === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedState(opt.key)}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-2',
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-[#0E131E] text-slate-300 border-[#1E2738] hover:bg-[#151D2C]'
                  )}
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full shrink-0',
                      isSelected ? 'bg-white' : 'bg-slate-600'
                    )}
                  />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tailored Response Plan */}
        <div className="rounded-xl border border-[#1E2738] bg-[#0B0F18] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2738]/50 text-xs">
            <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
              <span>!</span>
              <span>Tailored Response Plan</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              State: {STATE_OPTIONS.find((o) => o.key === selectedState)?.label}
            </span>
          </div>

          <div className="space-y-3">
            {currentPlaybook.map((step) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-200 mt-0.5">
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200">
                    {step.title}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDispatchTicket}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold transition-all',
              ticketDispatched
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.99] shadow-lg shadow-indigo-600/20'
            )}
          >
            {ticketDispatched ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Ticket #TX-SEC-{investigationId.slice(0, 6)} Dispatched</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Dispatch Incident Ticket</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-semibold bg-[#161F2E] border border-[#26354D] text-slate-200 hover:text-white hover:bg-[#1E2A3E] transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Action Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
