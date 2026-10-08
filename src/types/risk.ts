export type RiskSeverity = 'LOW' | 'GUARDED' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskSignalWeight {
  threatIntelMatch: number;      // default: 40
  phishingListing: number;       // default: 35
  malwareIndicator: number;      // default: 30
  credentialHarvesting: number;  // default: 20
  brandImpersonation: number;    // default: 15
  suspiciousUrlStructure: number;// default: 10
  suspiciousRedirect: number;    // default: 10
  domainAnomaly: number;         // default: 10
}

export interface RiskCalculationResult {
  score: number; // 0 - 100
  severity: RiskSeverity;
  confidence: number; // 0.0 - 1.0
  reasons: string[];
  evidenceIds: string[];
  signalsTriggered: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
}
