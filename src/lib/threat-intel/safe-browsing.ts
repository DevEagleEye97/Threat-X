import { ThreatIntelProvider } from './provider';
import { ThreatIntelMatch } from '@/types/threat';

export class SafeBrowsingProvider implements ThreatIntelProvider {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  }

  getProviderName(): string {
    return 'Google Safe Browsing';
  }

  getCapabilities(): string[] {
    return ['malware', 'social_engineering', 'unwanted_software'];
  }

  async checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch> {
    if (!this.apiKey) {
      return {
        provider: this.getProviderName(),
        status: 'unavailable',
        details: 'API key not configured in environment (GOOGLE_SAFE_BROWSING_API_KEY)',
      };
    }

    try {
      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${this.apiKey}`;
      const payload = {
        client: {
          clientId: 'threatx-engine',
          clientVersion: '2.4.0',
        },
        threatInfo: {
          threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes: ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries: [{ url: normalizedUrl }, { url }],
        },
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        return {
          provider: this.getProviderName(),
          status: 'error',
          details: `Safe Browsing API returned status code ${resp.status}`,
        };
      }

      const data = await resp.json();
      if (data && data.matches && data.matches.length > 0) {
        const first = data.matches[0];
        return {
          provider: this.getProviderName(),
          status: 'match',
          threatType: first.threatType || 'SOCIAL_ENGINEERING',
          referenceUrl: 'https://transparencyreport.google.com/safe-browsing/search',
          details: `Flagged as ${first.threatType} on platform ${first.platformType}`,
          matchedAt: new Date().toISOString(),
          confidence: 0.98,
        };
      }

      return {
        provider: this.getProviderName(),
        status: 'no_match',
        details: 'URL not flagged by Google Safe Browsing indices.',
        matchedAt: new Date().toISOString(),
        confidence: 0.95,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network timeout or connection error';
      return {
        provider: this.getProviderName(),
        status: 'error',
        details: `Connection error: ${msg}`,
      };
    }
  }
}
