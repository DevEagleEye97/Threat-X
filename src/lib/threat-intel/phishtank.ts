import { ThreatIntelProvider } from './provider';
import { ThreatIntelMatch } from '@/types/threat';

export class PhishTankProvider implements ThreatIntelProvider {
  getProviderName(): string {
    return 'PhishTank Community Feed';
  }

  getCapabilities(): string[] {
    return ['community_verified_phishing', 'targeted_brands'];
  }

  async checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch> {
    try {
      const apiKey = process.env.PHISHTANK_API_KEY;
      const params = new URLSearchParams({
        url: normalizedUrl,
        format: 'json',
      });
      if (apiKey) params.append('app_key', apiKey);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      const resp = await fetch('https://checkurl.phishtank.com/checkurl/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'threatx-incident-evaluator/2.4',
        },
        body: params.toString(),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!resp.ok) {
        return {
          provider: this.getProviderName(),
          status: 'unavailable',
          details: `PhishTank API returned status ${resp.status}`,
        };
      }

      const data = await resp.json();
      if (data && data.results && data.results.in_database) {
        return {
          provider: this.getProviderName(),
          status: 'match',
          threatType: 'Verified Phishing Site',
          referenceUrl: data.results.phish_detail_page || 'https://www.phishtank.com',
          details: `PhishTank verified entry. Verified: ${data.results.verified ? 'Yes' : 'Pending'}. Target: ${data.results.target || 'General'}`,
          matchedAt: new Date().toISOString(),
          confidence: data.results.verified ? 0.99 : 0.85,
        };
      }

      return {
        provider: this.getProviderName(),
        status: 'no_match',
        details: 'URL not found in active PhishTank repository.',
        confidence: 0.90,
      };
    } catch {
      return {
        provider: this.getProviderName(),
        status: 'unavailable',
        details: 'PhishTank service temporarily unreachable.',
      };
    }
  }
}
