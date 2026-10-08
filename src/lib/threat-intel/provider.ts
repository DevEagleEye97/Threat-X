import { ThreatIntelMatch } from '@/types/threat';

export interface ThreatIntelProvider {
  getProviderName(): string;
  getCapabilities(): string[];
  checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch>;
}

export interface AggregatedThreatIntel {
  results: ThreatIntelMatch[];
  hasMatches: boolean;
  matchCount: number;
  criticalMatches: ThreatIntelMatch[];
}

/**
 * Runs all providers safely via Promise.allSettled
 * Ensures that if any provider network times out or fails, the platform keeps running.
 */
export async function executeThreatIntelChecks(
  providers: ThreatIntelProvider[],
  url: string,
  normalizedUrl: string
): Promise<AggregatedThreatIntel> {
  const settled = await Promise.allSettled(
    providers.map((p) => p.checkUrl(url, normalizedUrl))
  );

  const results: ThreatIntelMatch[] = [];

  settled.forEach((res, index) => {
    const provider = providers[index];
    if (res.status === 'fulfilled') {
      results.push(res.value);
    } else {
      results.push({
        provider: provider.getProviderName(),
        status: 'error',
        details: res.reason instanceof Error ? res.reason.message : 'Unknown provider error',
      });
    }
  });

  const matches = results.filter((r) => r.status === 'match');

  return {
    results,
    hasMatches: matches.length > 0,
    matchCount: matches.length,
    criticalMatches: matches,
  };
}
