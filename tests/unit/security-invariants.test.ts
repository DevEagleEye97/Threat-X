import { describe, it, expect } from 'vitest';
import { validateUrlAgainstSsrf } from '@/lib/security/ssrf';
import { calculateDeterministicRisk } from '@/lib/risk/score';
import { EvidenceIndicator } from '@/types/evidence';
import { normalizeUrl } from '@/lib/url/normalize';

describe('Security Invariants & Charter Compliance', () => {
  describe('SSRF & Private Network Isolation', () => {
    it('blocks localhost and loopback IPv4/IPv6 addresses', async () => {
      const localhost = await validateUrlAgainstSsrf('http://localhost:3000/secret');
      expect(localhost.isSafe).toBe(false);

      const loopback = await validateUrlAgainstSsrf('http://127.0.0.1:8080/admin');
      expect(loopback.isSafe).toBe(false);

      const ipv6Loopback = await validateUrlAgainstSsrf('http://[::1]:8080/admin');
      expect(ipv6Loopback.isSafe).toBe(false);
    });

    it('blocks AWS/GCP cloud metadata endpoints (169.254.169.254)', async () => {
      const metadata = await validateUrlAgainstSsrf('http://169.254.169.254/latest/meta-data/');
      expect(metadata.isSafe).toBe(false);
    });

    it('blocks RFC-1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)', async () => {
      const classA = await validateUrlAgainstSsrf('http://10.0.1.5/internal');
      expect(classA.isSafe).toBe(false);

      const classB = await validateUrlAgainstSsrf('http://172.20.10.4/internal');
      expect(classB.isSafe).toBe(false);

      const classC = await validateUrlAgainstSsrf('http://192.168.1.1/router');
      expect(classC.isSafe).toBe(false);
    });

    it('blocks non-HTTP protocols and dangerous schemes', async () => {
      const fileScheme = await validateUrlAgainstSsrf('file:///etc/passwd');
      expect(fileScheme.isSafe).toBe(false);

      const gopherScheme = await validateUrlAgainstSsrf('gopher://127.0.0.1:6379/_test');
      expect(gopherScheme.isSafe).toBe(false);
    });
  });

  describe('RFC-3986 URL Normalization and Punycode Homograph Resolution', () => {
    it('properly normalizes schemes, ports, and relative fragments', () => {
      const result = normalizeUrl('HTTP://EXAMPLE.COM:80/path/../file');
      expect(result.isValid).toBe(true);
      expect(result.normalized).toBe('http://example.com/file');
    });

    it('decodes percent-encoded characters correctly', () => {
      const result = normalizeUrl('https://example.com/%7Euser/%20test');
      expect(result.isValid).toBe(true);
      expect(result.normalized).toBe('https://example.com/~user/%20test');
    });
  });

  describe('Deterministic Mathematical Risk Engine Invariants', () => {
    it('produces 0 risk for zero evidence indicators without claiming 100% safe', () => {
      const result = calculateDeterministicRisk([]);
      expect(result.score).toBe(0);
      expect(result.severity).toBe('LOW');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('caps maximum risk score strictly at 100 regardless of stacked critical indicators', () => {
      const heavyEvidence: EvidenceIndicator[] = [
        {
          id: '1',
          category: 'threat_intelligence',
          title: 'Known Phishing',
          description: 'Flagged on URLhaus',
          severity: 'critical',
          confidence: 0.99,
          source: 'URLhaus',
          evidenceType: 'observed',
        },
        {
          id: '2',
          category: 'malware_delivery',
          title: 'Malware Host',
          description: 'Known malware distribution point',
          severity: 'critical',
          confidence: 0.95,
          source: 'ThreatFeed',
          evidenceType: 'observed',
        },
        {
          id: '3',
          category: 'credential_harvesting',
          title: 'Credential Harvester',
          description: 'Fake login form',
          severity: 'high',
          confidence: 0.9,
          source: 'Heuristics',
          evidenceType: 'detected',
        },
        {
          id: '4',
          category: 'brand_impersonation',
          title: 'Targeted Brand Mimicry',
          description: 'Cloning State Bank portal',
          severity: 'critical',
          confidence: 0.95,
          source: 'BrandEngine',
          evidenceType: 'detected',
        },
      ];

      const result = calculateDeterministicRisk(heavyEvidence);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(result.severity).toBe('CRITICAL');
    });
  });
});
