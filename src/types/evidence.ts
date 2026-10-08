export type EvidenceSeverity = 'low' | 'guarded' | 'medium' | 'high' | 'critical';

export type EvidenceClassification = 'observed' | 'detected' | 'inferred' | 'potential';

export type EvidenceCategory =
  | 'url_structure'
  | 'brand_impersonation'
  | 'credential_harvesting'
  | 'threat_intelligence'
  | 'domain_anomaly'
  | 'network_anomaly'
  | 'malware_delivery'
  | 'social_engineering';

export interface EvidenceIndicator {
  id: string;
  category: EvidenceCategory;
  title: string;
  description: string;
  severity: EvidenceSeverity;
  confidence: number; // 0.0 - 1.0
  source: string; // e.g. 'local-heuristics', 'urlhaus', 'gemini-reasoning'
  evidenceType: EvidenceClassification;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}
