import { describe, it, expect } from 'vitest';
import { parseUrl } from '@/lib/url/parser';

describe('URL Parser & Decomposition Engine', () => {
  it('correctly parses domain, subdomains, and TLD', () => {
    const parsed = parseUrl('https://sub.domain.example.com/test', 'https://sub.domain.example.com/test');
    expect(parsed.registrableDomain).toBe('example.com');
    expect(parsed.subdomains).toEqual(['sub', 'domain']);
    expect(parsed.tld).toBe('com');
    expect(parsed.isIpAddress).toBe(false);
  });

  it('correctly handles multi-part TLDs (e.g. .co.uk)', () => {
    const parsed = parseUrl('https://login.service.co.uk/', 'https://login.service.co.uk/');
    expect(parsed.registrableDomain).toBe('service.co.uk');
    expect(parsed.subdomains).toEqual(['login']);
    expect(parsed.tld).toBe('co.uk');
  });

  it('detects IPv4 hostnames', () => {
    const parsed = parseUrl('http://192.168.1.1/login', 'http://192.168.1.1/login');
    expect(parsed.isIpAddress).toBe(true);
    expect(parsed.registrableDomain).toBe('192.168.1.1');
  });

  it('identifies punycode (IDN homograph attack)', () => {
    const parsed = parseUrl('https://xn--pple-43d.com/', 'https://xn--pple-43d.com/');
    expect(parsed.isPunycode).toBe(true);
  });

  it('computes Shannon entropy of high-randomness domains', () => {
    const clean = parseUrl('https://google.com', 'https://google.com');
    const random = parseUrl('https://a8f3b9c7e2d1f0z9.com', 'https://a8f3b9c7e2d1f0z9.com');
    expect(random.entropy).toBeGreaterThan(clean.entropy);
  });
});
