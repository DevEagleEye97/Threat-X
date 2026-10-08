import { describe, it, expect } from 'vitest';
import { detectBrandImpersonation, levenshteinDistance } from '@/lib/url/brandDetection';

describe('Brand Impersonation & Typosquatting Engine', () => {
  it('correctly calculates Levenshtein distance', () => {
    expect(levenshteinDistance('paypal', 'paypa1')).toBe(1);
    expect(levenshteinDistance('apple', 'aple')).toBe(1);
    expect(levenshteinDistance('microsoft', 'micros0ft')).toBe(1);
  });

  it('recognizes authentic brand domains as legitimate', () => {
    const match = detectBrandImpersonation('accounts.google.com', 'google.com', '/signin');
    expect(match).not.toBeNull();
    expect(match?.isLegitimateDomain).toBe(true);
  });

  it('detects brand impersonation in subdomains on third-party domains', () => {
    const match = detectBrandImpersonation(
      'login.microsoft.com.security-alert-token.xyz',
      'security-alert-token.xyz',
      '/verify'
    );
    expect(match).not.toBeNull();
    expect(match?.isLegitimateDomain).toBe(false);
    expect(match?.brand.name).toBe('Microsoft');
  });

  it('detects typosquatting attempts on registrable domains', () => {
    const match = detectBrandImpersonation('paypa1.com', 'paypa1.com', '/login');
    expect(match).not.toBeNull();
    expect(match?.isTyposquatting).toBe(true);
    expect(match?.brand.name).toBe('PayPal');
  });
});
