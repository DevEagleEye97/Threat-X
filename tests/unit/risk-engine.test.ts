import { describe, it, expect } from 'vitest';
import { calculateDeterministicRisk } from '@/lib/risk/score';
import { EvidenceIndicator } from '@/types/evidence';

describe('Deterministic Risk Engine', () => {
  it('assigns high/critical risk to compound threats (Threat Intel + Brand Spoof)', () => {
    const evidence: EvidenceIndicator[] = [
      {
        id: 'intel-1',
        category: 'threat_intelligence',
        title: 'Confirmed Phishing Feed Match',
        description: 'Active phishing listing',
        severity: 'critical',
        confidence: 0.99,
        source: 'urlhaus',
        evidenceType: 'observed',
      },
      {
        id: 'brand-1',
        category: 'brand_impersonation',
        title: 'Brand Impersonation: Microsoft',
        description: 'Spoofing Microsoft login',
        severity: 'critical',
        confidence: 0.95,
        source: 'local-heuristics',
        evidenceType: 'detected',
      },
      {
        id: 'cred-1',
        category: 'credential_harvesting',
        title: 'Credential Harvesting Pattern',
        description: 'Form submission endpoint',
        severity: 'high',
        confidence: 0.90,
        source: 'local-heuristics',
        evidenceType: 'detected',
      },
    ];

    const result = calculateDeterministicRisk(evidence);
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.severity).toBe('CRITICAL');
    expect(result.signalsTriggered.length).toBeGreaterThan(0);
  });

  it('assigns low score to clean evidence with proper disclaimer', () => {
    const result = calculateDeterministicRisk([]);
    expect(result.score).toBe(0);
    expect(result.severity).toBe('LOW');
    expect(result.reasons[0]).toContain('No known threat detected');
  });

  it('clamps scores strictly between 0 and 100', () => {
    const manyEvidences: EvidenceIndicator[] = Array.from({ length: 15 }, (_, i) => ({
      id: `ev-${i}`,
      category: 'threat_intelligence',
      title: `Match ${i}`,
      description: 'Listed',
      severity: 'critical',
      confidence: 0.99,
      source: 'test',
      evidenceType: 'observed',
    }));

    const result = calculateDeterministicRisk(manyEvidences);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});
