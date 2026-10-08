import { Key, Smartphone, DollarSign, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImpactCardProps {
  impacts: Array<{
    type: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'critical';
  }>;
}

function getImpactIcon(type: string) {
  const upper = type.toUpperCase();
  if (upper.includes('PASSWORD') || upper.includes('CREDENTIAL')) {
    return <Key className="h-4 w-4 text-orange-400" />;
  }
  if (upper.includes('OTP') || upper.includes('2FA') || upper.includes('TOKEN')) {
    return <Smartphone className="h-4 w-4 text-indigo-400" />;
  }
  if (upper.includes('FINANCIAL') || upper.includes('MONEY') || upper.includes('PAYMENT')) {
    return <DollarSign className="h-4 w-4 text-red-400" />;
  }
  return <ShieldAlert className="h-4 w-4 text-amber-400" />;
}

export function ImpactCard({ impacts }: ImpactCardProps) {
  if (!impacts || impacts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-red-400" />
          <span>Potential Impact</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500">Risk Exposure</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {impacts.map((imp) => (
          <div
            key={imp.title}
            className="flex flex-col p-3.5 rounded-xl border border-[#1E2738] bg-[#111622] hover:bg-[#151C2C] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A0E17] border border-[#222E42]">
                {getImpactIcon(imp.type)}
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {imp.type}
              </span>
            </div>

            <div className="font-semibold text-xs text-slate-200 mt-1">
              {imp.title}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
              {imp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
