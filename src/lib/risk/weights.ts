import { RiskSignalWeight } from '@/types/risk';

export const DEFAULT_RISK_WEIGHTS: RiskSignalWeight = {
  threatIntelMatch: 40,
  phishingListing: 35,
  malwareIndicator: 30,
  credentialHarvesting: 20,
  brandImpersonation: 15,
  suspiciousUrlStructure: 10,
  suspiciousRedirect: 10,
  domainAnomaly: 10,
};
