import { ThreatIntelProvider } from './provider';
import { ThreatIntelMatch } from '@/types/threat';

export class MockThreatIntelProvider implements ThreatIntelProvider {
  getProviderName(): string {
    return 'ThreatX Internal Intelligence DB';
  }

  getCapabilities(): string[] {
    return ['phishing_reputation', 'malware_hashes', 'active_campaign_tracking'];
  }

  async checkUrl(url: string, normalizedUrl: string): Promise<ThreatIntelMatch> {
    const lower = normalizedUrl.toLowerCase();

    // 1. Phishing banking portal test vector
    if (lower.includes('example-banking-alert') || lower.includes('secure-account-verification') || lower.includes('secure-account-verify')) {
      return {
        provider: this.getProviderName(),
        status: 'match',
        threatType: 'Credential Phishing / Banking Alert Spoof',
        referenceUrl: 'https://threatx.internal/advisories/TX-2026-9842',
        details: 'Active credential interceptor campaign spoofing banking authentication portal. JavaScript payload binds input listener.',
        matchedAt: new Date().toISOString(),
        confidence: 0.98,
      };
    }

    // 2. Microsoft Account Phishing
    if (lower.includes('ms-account-security-alert') || lower.includes('token491.org')) {
      return {
        provider: this.getProviderName(),
        status: 'match',
        threatType: 'Credential Harvesting / OAuth Phishing',
        referenceUrl: 'https://threatx.internal/advisories/TX-2026-0491',
        details: 'High-confidence credential harvester spoofing Microsoft authentication tokens.',
        matchedAt: new Date().toISOString(),
        confidence: 0.99,
      };
    }

    // 3. Malware Dropper
    if (lower.includes('payload-drop') || lower.includes('.exe') || lower.includes('.scr')) {
      return {
        provider: this.getProviderName(),
        status: 'match',
        threatType: 'Drive-by Malware Dropper',
        referenceUrl: 'https://threatx.internal/advisories/TX-2026-1104',
        details: 'Known payload distribution node for info-stealer malware binaries.',
        matchedAt: new Date().toISOString(),
        confidence: 0.97,
      };
    }

    // 4. SMS Phishing / Smishing
    if (lower.includes('track-package-delivery-update') || lower.includes('usps-track-package')) {
      return {
        provider: this.getProviderName(),
        status: 'match',
        threatType: 'Smishing / Postal Scam',
        referenceUrl: 'https://threatx.internal/advisories/TX-2026-7821',
        details: 'SMS phishing landing page harvesting payment card data for fake delivery redelivery fees.',
        matchedAt: new Date().toISOString(),
        confidence: 0.92,
      };
    }

    // 5. Explicitly clean/legitimate domains
    if (
      lower.includes('auth.enterprise-workspace.com') ||
      lower.includes('github.com') ||
      lower.includes('stripe.com') ||
      lower.includes('google.com') ||
      lower.includes('microsoft.com')
    ) {
      return {
        provider: this.getProviderName(),
        status: 'no_match',
        details: 'Domain is absent from all malicious blocklists and recognized as verified infrastructure.',
        matchedAt: new Date().toISOString(),
        confidence: 0.99,
      };
    }

    return {
      provider: this.getProviderName(),
      status: 'no_match',
      details: 'No active threat campaign listing located in internal threat database.',
      matchedAt: new Date().toISOString(),
      confidence: 0.85,
    };
  }
}
