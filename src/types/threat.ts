export type ThreatCategory =
  | 'clean'
  | 'phishing'
  | 'credential_harvesting'
  | 'malware_distribution'
  | 'c2_server'
  | 'scam'
  | 'typosquatting'
  | 'suspicious_redirect'
  | 'unknown';

export type ProviderMatchStatus = 'match' | 'no_match' | 'unavailable' | 'error';

export interface ThreatIntelMatch {
  provider: string;
  status: ProviderMatchStatus;
  threatType?: string;
  referenceUrl?: string;
  details?: string;
  matchedAt?: string;
  confidence?: number;
}

export interface AttackNode {
  id: string;
  label: string;
  phase: string; // e.g. 'initial_access', 'delivery', 'exploitation', 'credential_access', 'impact'
  status: 'observed' | 'detected' | 'inferred' | 'potential';
  description: string;
  evidenceId?: string;
}

export interface AttackEdge {
  source: string;
  target: string;
  label?: string;
}

export interface AttackGraphData {
  nodes: AttackNode[];
  edges: AttackEdge[];
}
