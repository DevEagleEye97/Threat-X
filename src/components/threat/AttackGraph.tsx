'use client';

import { useState } from 'react';
import { AttackGraphData } from '@/types/threat';
import { GitBranch, Shield, Eye, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttackGraphProps {
  graphData: AttackGraphData;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'observed':
      return {
        label: 'OBSERVED',
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-400',
        icon: <Eye className="h-3 w-3" />,
      };
    case 'detected':
      return {
        label: 'DETECTED',
        badge: 'bg-red-500/15 text-red-400 border-red-500/30',
        dot: 'bg-red-400',
        icon: <AlertCircle className="h-3 w-3" />,
      };
    case 'inferred':
      return {
        label: 'INFERRED',
        badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
        dot: 'bg-indigo-400',
        icon: <Shield className="h-3 w-3" />,
      };
    case 'potential':
    default:
      return {
        label: 'POTENTIAL',
        badge: 'bg-slate-700/30 text-slate-400 border-slate-700/50',
        dot: 'bg-slate-500',
        icon: <HelpCircle className="h-3 w-3" />,
      };
  }
}

export function AttackGraph({ graphData }: AttackGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    graphData.nodes.length > 3 ? graphData.nodes[3].id : graphData.nodes[0]?.id || null
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-indigo-400" />
          <span>Attack Reconstruction</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">MITRE Kill Chain</span>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-[#1E2738] bg-[#111622] p-5 shadow-xl space-y-4">
        <p className="text-xs text-slate-400">
          Node graph interactive kill-chain telemetry. Select any stage to inspect underlying evidence.
        </p>

        {/* Vertical Connected Chain matching Stitch Screenshot 5 */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E2738]">
          {graphData.nodes.map((node) => {
            const statusConfig = getStatusBadge(node.status);
            const isSelected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                className="relative cursor-pointer group"
              >
                {/* Node circle on the vertical line */}
                <div
                  className={cn(
                    'absolute -left-6 top-1.5 h-5 w-5 rounded-full border flex items-center justify-center transition-all bg-[#111622]',
                    isSelected
                      ? 'border-indigo-400 ring-2 ring-indigo-500/30 scale-110'
                      : 'border-[#222E42] group-hover:border-slate-500'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', statusConfig.dot)} />
                </div>

                {/* Node item row */}
                <div
                  className={cn(
                    'p-3 rounded-xl border transition-all',
                    isSelected
                      ? 'bg-[#151D2C] border-indigo-500/40 shadow-md'
                      : 'bg-[#0E131E] border-[#1E2738] hover:border-slate-700/80'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-slate-200">
                      {node.label}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold border tracking-wider',
                        statusConfig.badge
                      )}
                    >
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </span>
                  </div>

                  {/* Node Description & Telemetry */}
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {node.description}
                  </p>

                  {/* Expanded evidence details if selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-[#1E2738]/60 text-[11px] font-mono text-indigo-300 bg-[#090D15]/80 p-2.5 rounded-lg border border-indigo-500/20">
                      <span className="text-slate-500">TELEMETRY CORRELATION: </span>
                      <span>Phase [{node.phase.toUpperCase()}] • Status [{node.status.toUpperCase()}]</span>
                      <div className="text-slate-400 mt-1 text-[10px]">
                        Empirical verification logged in isolated sandbox node graph. No client execution triggered.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
