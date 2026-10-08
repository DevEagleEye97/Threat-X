import { ThreatIntelProvider } from './provider';
import { ThreatIntelMatch } from '@/types/threat';

export class URLhausProvider implements ThreatIntelProvider {
  getProviderName(): string {
    return 'URLhaus (abuse.ch)';
  }

  getCapabilities(): string[] {
    return ['malware_payloads', 'c2_servers', 'botnet_hosts'];
  }

  async checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      // URLhaus query endpoint
      const body = new URLSearchParams({ url: normalizedUrl });
      const resp = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        return {
          provider: this.getProviderName(),
          status: 'unavailable',
          details: `URLhaus responded with status ${resp.status}`,
        };
      }

      const data = await resp.json();

      if (data.query_status === 'ok') {
        return {
          provider: this.getProviderName(),
          status: 'match',
          threatType: data.threat || 'Malware Distribution',
          referenceUrl: data.urlhaus_reference || 'https://urlhaus.abuse.ch',
          details: `Listed in URLhaus database. Status: ${data.url_status}. Tags: ${(data.tags || []).join(', ')}`,
          matchedAt: data.date_added || new Date().toISOString(),
          confidence: 0.99,
        };
      } else if (data.query_status === 'no_results') {
        return {
          provider: this.getProviderName(),
          status: 'no_match',
          details: 'URL not found in active URLhaus malware distribution feed.',
          confidence: 0.90,
        };
      }

      return {
        provider: this.getProviderName(),
        status: 'no_match',
        details: 'No match in URLhaus dataset.',
        confidence: 0.85,
      };
    } catch {
      // Graceful fallback for offline, rate-limited, or dev environments
      return {
        provider: this.getProviderName(),
        status: 'unavailable',
        details: 'External URLhaus feed unavailable or network timeout.',
      };
    }
  }
}
