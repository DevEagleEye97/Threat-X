import { describe, it, expect } from 'vitest';
import { executeThreatIntelChecks, ThreatIntelProvider } from '@/lib/threat-intel/provider';
import { MockThreatIntelProvider } from '@/lib/threat-intel/mock';

class FailingTestProvider implements ThreatIntelProvider {
  getProviderName(): string {
    return 'Failing Provider';
  }
  getCapabilities(): string[] {
    return ['test'];
  }
  async checkUrl(): Promise<any> {
    throw new Error('Remote threat server timeout');
  }
}

describe('Threat Intel Provider Abstraction & Fault Tolerance', () => {
  it('does not crash when an external provider fails or throws', async () => {
    const mock = new MockThreatIntelProvider();
    const failing = new FailingTestProvider();

    const result = await executeThreatIntelChecks(
      [mock, failing],
      'https://secure-account-verification.example.xyz',
      'https://secure-account-verification.example.xyz'
    );

    expect(result.results.length).toBe(2);
    const failEntry = result.results.find((r) => r.provider === 'Failing Provider');
    expect(failEntry?.status).toBe('error');
    expect(failEntry?.details).toContain('Remote threat server timeout');

    const matchEntry = result.results.find((r) => r.provider === 'ThreatX Internal Intelligence DB');
    expect(matchEntry?.status).toBe('match');
    expect(result.hasMatches).toBe(true);
  });
});
