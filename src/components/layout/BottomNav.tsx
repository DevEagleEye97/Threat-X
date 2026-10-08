'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Globe, Rss, UserCheck, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Investigate', href: '/', icon: Search },
    { label: 'Site Check', href: '/site-check', icon: Globe },
    { label: 'Feed', href: '/threat-feed', icon: Rss },
    { label: 'Exposure', href: '/exposure-check', icon: UserCheck },
    { label: 'History', href: '/history', icon: History },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(255,255,255,0.08)] bg-[#07090D]/95 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-5 h-14 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors h-full touch-target select-none',
                isActive ? 'text-[#8B7CF6] font-medium' : 'text-[#A1A7B3] active:text-[#F4F5F7]'
              )}
            >
              <Icon className={cn('h-4 w-4 transition-transform duration-200', isActive ? 'text-[#8B7CF6] scale-110' : 'text-[#69717F]')} />
              <span className="text-[10px] font-sans tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
