'use client';

import { useState } from 'react';
import { AttackGraphData, AttackNode } from '@/types/threat';
import {
  GitBranch,
  Shield,
  Eye,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ListOrdered,
  Workflow,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttackGraphProps {
  graphData: AttackGraphData;
}

function getNodeStatusConfig(status: AttackNode['status']) {
  switch (status) {
    case 'observed':
      return {
        label: 'OBSERVED',
        badge: 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30',
        dot: 'bg-[#10B981]',
        icon: <Eye className="h-3 w-3" aria-hidden="true" />,
        isDirectlySupported: true,
      };
    case 'detected':
      return {
        label: 'DETECTED',
        badge: 'bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30',
        dot: 'bg-[#F59E0B]',
        icon: <AlertCircle className="h-3 w-3" aria-hidden="true" />,
        isDirectlySupported: true,
      };
    case 'inferred':
      return {
        label: 'INFERRED',
        badge: 'bg-[#7667E8]/15 text-[#A5B4FC] border-[#7667E8]/30',
        dot: 'bg-[#7667E8]',
        icon: <Shield className="h-3 w-3" aria-hidden="true" />,
        isDirectlySupported: false,
      };
    case 'potential':
    default:
      return {
        label: 'POTENTIAL',
        badge: 'bg-[#64748B]/15 text-[#94A3B8] border-[#64748B]/30',
        dot: 'bg-[#64748B]',
        icon: <HelpCircle className="h-3 w-3" aria-hidden="true" />,
        isDirectlySupported: false,
      };
  }
}

export function AttackGraph({ graphData }: AttackGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    graphData.nodes.length > 2 ? graphData.nodes[1].id : graphData.nodes[0]?.id || null
  );
  const [viewMode, setViewMode] = useState<'blueprint' | 'list'>('blueprint');

  if (!graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="threat-panel p-5 text-center text-xs text-[#94A3B8]">
        No multi-stage attack path correlation recorded for this target.
      </div>
    );
  }

  const selectedNode = graphData.nodes.find((n) => n.id === selectedNodeId);

  return (
    <section role="region" aria-label="MITRE ATT&CK Attack Reconstruction" className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-[#8B7CF6]" aria-hidden="true" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-[#E2E8F0]">
            Attack Path Reconstruction
          </h3>
        </div>

        {/* View Toggle (Blueprint vs Accessible List) */}
        <div className="flex items-center rounded-lg bg-[#07090D] p-0.5 border border-[rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={() => setViewMode('blueprint')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
              viewMode === 'blueprint'
                ? 'bg-[#161B25] text-[#E2E8F0] shadow-sm font-semibold'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            )}
            aria-pressed={viewMode === 'blueprint'}
          >
            <Workflow className="h-3 w-3" aria-hidden="true" />
            <span>Blueprint</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors',
              viewMode === 'list'
                ? 'bg-[#161B25] text-[#E2E8F0] shadow-sm font-semibold'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            )}
            aria-pressed={viewMode === 'list'}
            aria-label="Text alternative list view"
          >
            <ListOrdered className="h-3 w-3" aria-hidden="true" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="threat-panel p-5 sm:p-6 space-y-4">
        {/* Context subtitle */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <p className="max-w-xl">
            Correlated MITRE kill-chain stages. Solid connectors represent directly supported evidence; dashed connectors represent inferred or potential downstream phases.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-[#CBD5E1]">
              <span className="inline-block w-3 h-0.5 bg-[rgba(255,255,255,0.25)]" /> Direct
            </span>
            <span className="flex items-center gap-1 text-[#94A3B8]">
              <span className="inline-block w-3 border-t border-dashed border-[#64748B]" /> Inferred
            </span>
          </div>
        </div>

        {/* Blueprint Flow View */}
        {viewMode === 'blueprint' ? (
          <div className="relative pl-6 sm:pl-8 space-y-4 py-2">
            {graphData.nodes.map((node, index) => {
              const statusConfig = getNodeStatusConfig(node.status);
              const isSelected = selectedNodeId === node.id;
              const isLast = index === graphData.nodes.length - 1;
              const isDirect = statusConfig.isDirectlySupported;

              return (
                <div key={node.id} className="relative group">
                  {/* Vertical Connector Line to next node */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className={cn(
                        'absolute -left-6 sm:-left-8 top-5 bottom-0 w-0.5 pointer-events-none translate-x-[9px]',
                        isDirect
                          ? 'bg-[rgba(255,255,255,0.18)]'
                          : 'border-l-2 border-dashed border-[#64748B]/40 bg-transparent'
                      )}
                    />
                  )}

                  {/* Stage Circle Indicator on Connector */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute -left-6 sm:-left-8 top-1.5 h-5 w-5 rounded-full border flex items-center justify-center transition-all bg-[#0F1219]',
                      isSelected
                        ? 'border-[#22D3EE] ring-2 ring-[#22D3EE]/25 scale-110'
                        : 'border-[rgba(255,255,255,0.12)] group-hover:border-[rgba(255,255,255,0.25)]'
                    )}
                  >
                    <span className={cn('h-2 w-2 rounded-full', statusConfig.dot)} />
                  </div>

                  {/* Stage Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                    className={cn(
                      'w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all',
                      isSelected
                        ? 'bg-[#161B25] border-[rgba(255,255,255,0.18)] shadow-md'
                        : 'bg-[#07090D] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)] hover:bg-[#0B0F14]'
                    )}
                    aria-expanded={isSelected}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-[#64748B] tabular-nums">
                          0{index + 1}.
                        </span>
                        <span className="font-semibold text-[13px] text-[#E2E8F0]">
                          {node.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-[0.06em]',
                            statusConfig.badge
                          )}
                        >
                          {statusConfig.icon}
                          <span>{statusConfig.label}</span>
                        </span>
                        <ChevronRight
                          className={cn(
                            'h-3.5 w-3.5 text-[#64748B] transition-transform',
                            isSelected && 'rotate-90'
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <p className="text-[12px] text-[#94A3B8] mt-1.5 leading-relaxed">
                      {node.description}
                    </p>

                    {/* Detailed Expanded Telemetry */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)] text-[11px] font-mono space-y-1 bg-[#0F1219] p-3 rounded-lg border border-[rgba(255,255,255,0.06)]">
                        <div className="flex items-center justify-between text-[#CBD5E1]">
                          <span>MITRE PHASE:</span>
                          <span className="text-[#22D3EE] font-bold">
                            [{node.phase.toUpperCase()}]
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#CBD5E1]">
                          <span>EVIDENCE STATUS:</span>
                          <span className="font-bold">[{node.status.toUpperCase()}]</span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] pt-1 border-t border-[rgba(255,255,255,0.04)] font-sans">
                          {isDirect
                            ? 'Direct empirical signals observed in network telemetry or static heuristic extraction.'
                            : 'Inferred attack step derived from behavioral threat model and standard MITRE adversary patterns.'}
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Accessible Sequential List View for Screen Readers & Keyboard */
          <ol className="divide-y divide-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] rounded-xl bg-[#07090D] overflow-hidden">
            {graphData.nodes.map((node, index) => {
              const statusConfig = getNodeStatusConfig(node.status);
              return (
                <li key={node.id} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#8B7CF6]">
                        Stage {index + 1}:
                      </span>
                      <span className="font-semibold text-sm text-[#E2E8F0]">
                        {node.label}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-mono font-bold border tracking-[0.06em]',
                        statusConfig.badge
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {node.description}
                  </p>
                  <div className="font-mono text-[11px] text-[#64748B]">
                    MITRE Phase: <strong className="text-[#CBD5E1]">{node.phase}</strong>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
