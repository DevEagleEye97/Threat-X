import { RiskSeverity } from '@/types/risk';

export function getSeverityTier(score: number): RiskSeverity {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  if (score >= 20) return 'GUARDED';
  return 'LOW';
}

export function getSeverityColor(severity: RiskSeverity): {
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  dotColor: string;
} {
  switch (severity) {
    case 'CRITICAL':
      return {
        badgeBg: 'bg-red-500/15 text-red-400 border-red-500/30',
        badgeText: 'text-red-400',
        borderColor: 'border-red-500/40',
        accentColor: '#EF4444',
        dotColor: 'bg-red-500',
      };
    case 'HIGH':
      return {
        badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        badgeText: 'text-orange-400',
        borderColor: 'border-orange-500/40',
        accentColor: '#F97316',
        dotColor: 'bg-orange-500',
      };
    case 'MEDIUM':
      return {
        badgeBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        badgeText: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        accentColor: '#F59E0B',
        dotColor: 'bg-amber-500',
      };
    case 'GUARDED':
      return {
        badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
        badgeText: 'text-cyan-400',
        borderColor: 'border-cyan-500/40',
        accentColor: '#22D3EE',
        dotColor: 'bg-cyan-400',
      };
    case 'LOW':
    default:
      return {
        badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        badgeText: 'text-emerald-400',
        borderColor: 'border-emerald-500/40',
        accentColor: '#10B981',
        dotColor: 'bg-emerald-500',
      };
  }
}
