import { ThreatIntelProvider } from './provider';
import { ThreatIntelMatch } from '@/types/threat';

export class VirusTotalProvider implements ThreatIntelProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY;
  }

  getProviderName(): string {
    return 'VirusTotal Enterprise';
  }

  getCapabilities(): string[] {
    return ['multi_av_correlation', 'whois_history', 'reputation_score'];
  }

  async checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch> {
    if (!this.apiKey) {
      return {
        provider: this.getProviderName(),
        status: 'unavailable',
        details: 'API key not configured (VIRUSTOTAL_API_KEY)',
      };
    }

    try {
      // VirusTotal URL ID is base64url encoded URL without padding
      const urlId = Buffer.from(normalizedUrl).toString('base64url');
      const endpoint = `https://www.virustotal.com/api/v3/urls/${urlId}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-apikey': this.apiKey,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        if (resp.status === 404) {
          return {
            provider: this.getProviderName(),
            status: 'no_match',
            details: 'URL has not been submitted or observed in VirusTotal database.',
            confidence: 0.80,
          };
        }
        return {
          provider: this.getProviderName(),
          status: 'error',
          details: `VirusTotal API error: ${resp.status}`,
        };
      }

      const data = await resp.json();
      const stats = data?.data?.attributes?.last_analysis_stats;
      const maliciousCount = (stats?.malicious || 0) + (stats?.suspicious || 0);

      if (maliciousCount > 0) {
        return {
          provider: this.getProviderName(),
          status: 'match',
          threatType: `Flagged by ${maliciousCount} Security Engines`,
          referenceUrl: `https://www.virustotal.com/gui/url/${urlId}`,
          details: `${stats.malicious} engines detected malicious, ${stats.suspicious} detected suspicious out of ${stats.harmless + stats.malicious + stats.suspicious + stats.undetected} total.`,
          matchedAt: new Date().toISOString(),
          confidence: Math.min(0.99, 0.7 + maliciousCount * 0.05),
        };
      }

      return {
        provider: this.getProviderName(),
        status: 'no_match',
        details: `Scanned clean by ${stats?.harmless || 0} security vendors.`,
        confidence: 0.95,
      };
    } catch {
      return {
        provider: this.getProviderName(),
        status: 'unavailable',
        details: 'VirusTotal API timeout or network unreachable.',
      };
    }
  }
}
