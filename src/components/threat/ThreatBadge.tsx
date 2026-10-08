import { RiskSeverity } from '@/types/risk';
import { getSeverityColor } from '@/lib/risk/severity';
import { cn } from '@/lib/utils';

interface ThreatBadgeProps {
  severity: RiskSeverity;
  className?: string;
  showDot?: boolean;
}

export function ThreatBadge({ severity, className, showDot = true }: ThreatBadgeProps) {
  const styles = getSeverityColor(severity);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase',
        styles.badgeBg,
        className
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full', styles.dotColor)} />}
      <span>{severity}</span>
    </span>
  );
}
