import { describe, it, expect } from 'vitest';
import { runDeterministicHeuristics } from '@/lib/url/heuristics';
import { parseUrl } from '@/lib/url/parser';

describe('Deterministic Heuristics Engine', () => {
  it('flags raw IP address hosts with high severity', () => {
    const details = parseUrl('http://185.220.101.5/login', 'http://185.220.101.5/login');
    const evidence = runDeterministicHeuristics(details);
    const ipEvidence = evidence.find((e) => e.category === 'network_anomaly');
    expect(ipEvidence).toBeDefined();
    expect(ipEvidence?.severity).toBe('high');
  });

  it('flags punycode domains with IDN homograph warnings', () => {
    const details = parseUrl('https://xn--e1afmkfd.xn--p1ai/', 'https://xn--e1afmkfd.xn--p1ai/');
    const evidence = runDeterministicHeuristics(details);
    const punyEvidence = evidence.find((e) => e.id === 'heur-punycode-homograph');
    expect(punyEvidence).toBeDefined();
    expect(punyEvidence?.severity).toBe('high');
  });

  it('flags credential harvesting keywords on unverified domains', () => {
    const details = parseUrl(
      'https://secure-portal.xyz/banking/login/verify-account',
      'https://secure-portal.xyz/banking/login/verify-account'
    );
    const evidence = runDeterministicHeuristics(details);
    const credEvidence = evidence.find((e) => e.category === 'credential_harvesting');
    expect(credEvidence).toBeDefined();
  });

  it('flags high-abuse TLDs like .cfd or .xyz', () => {
    const details = parseUrl('https://fake-login.cfd/', 'https://fake-login.cfd/');
    const evidence = runDeterministicHeuristics(details);
    const tldEvidence = evidence.find((e) => e.id === 'heur-abusive-tld');
    expect(tldEvidence).toBeDefined();
  });

  it('flags open redirect parameters', () => {
    const details = parseUrl(
      'https://example.com/out?redirect_url=https://malicious-drop.com',
      'https://example.com/out?redirect_url=https://malicious-drop.com'
    );
    const evidence = runDeterministicHeuristics(details);
    const redir = evidence.find((e) => e.id === 'heur-open-redirect');
    expect(redir).toBeDefined();
  });
});
