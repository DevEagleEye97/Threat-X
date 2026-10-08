import { EvidenceIndicator } from '@/types/evidence';
import { RiskCalculationResult, RiskSignalWeight } from '@/types/risk';
import { DEFAULT_RISK_WEIGHTS } from './weights';
import { getSeverityTier } from './severity';

export function calculateDeterministicRisk(
  evidenceList: EvidenceIndicator[],
  customWeights: Partial<RiskSignalWeight> = {}
): RiskCalculationResult {
  const weights: RiskSignalWeight = { ...DEFAULT_RISK_WEIGHTS, ...customWeights };

  let rawScore = 0;
  const triggered: Array<{ name: string; weight: number; description: string }> = [];
  const reasons: string[] = [];
  const evidenceIds: string[] = [];

  let hasThreatIntel = false;
  let hasPhishing = false;
  let hasMalware = false;
  let hasCredHarvesting = false;
  let hasBrandSpoof = false;
  let hasUrlAnomaly = false;
  let hasRedirect = false;
  let hasDomainAnomaly = false;

  for (const item of evidenceList) {
    evidenceIds.push(item.id);

    // Threat intelligence match
    if (item.category === 'threat_intelligence' && !hasThreatIntel) {
      hasThreatIntel = true;
      rawScore += weights.threatIntelMatch;
      triggered.push({
        name: 'Known Threat Intelligence',
        weight: weights.threatIntelMatch,
        description: item.title,
      });
      reasons.push(item.description);
    }

    // Malware indicator
    if (item.category === 'malware_delivery' && !hasMalware) {
      hasMalware = true;
      rawScore += weights.malwareIndicator;
      triggered.push({
        name: 'Malware Distribution Indicator',
        weight: weights.malwareIndicator,
        description: item.title,
      });
      reasons.push(item.description);
    }

    // Brand impersonation
    if (item.category === 'brand_impersonation' && !hasBrandSpoof) {
      hasBrandSpoof = true;
      rawScore += weights.brandImpersonation;
      triggered.push({
        name: 'Brand Impersonation / Typosquatting',
        weight: weights.brandImpersonation,
        description: item.title,
      });
      reasons.push(item.description);
    }

    // Credential harvesting
    if (item.category === 'credential_harvesting' && !hasCredHarvesting) {
      hasCredHarvesting = true;
      rawScore += weights.credentialHarvesting;
      triggered.push({
        name: 'Credential Harvesting Blueprint',
        weight: weights.credentialHarvesting,
        description: item.title,
      });
      reasons.push(item.description);
    }

    // Suspicious URL structure
    if (item.category === 'url_structure' && !hasUrlAnomaly) {
      if (item.id === 'heur-open-redirect' && !hasRedirect) {
        hasRedirect = true;
        rawScore += weights.suspiciousRedirect;
        triggered.push({
          name: 'Suspicious Open Redirect Parameter',
          weight: weights.suspiciousRedirect,
          description: item.title,
        });
        reasons.push(item.description);
      } else {
        hasUrlAnomaly = true;
        rawScore += weights.suspiciousUrlStructure;
        triggered.push({
          name: 'Suspicious URL Structure / Obfuscation',
          weight: weights.suspiciousUrlStructure,
          description: item.title,
        });
        reasons.push(item.description);
      }
    }

    // Domain anomaly
    if (item.category === 'domain_anomaly' && !hasDomainAnomaly) {
      hasDomainAnomaly = true;
      rawScore += weights.domainAnomaly;
      triggered.push({
        name: 'Domain Anomaly (High Entropy / High-Abuse TLD)',
        weight: weights.domainAnomaly,
        description: item.title,
      });
      reasons.push(item.description);
    }

    // Network anomaly (IP Host)
    if (item.category === 'network_anomaly') {
      rawScore += 15;
      triggered.push({
        name: 'Raw IP Hostname',
        weight: 15,
        description: item.title,
      });
      reasons.push(item.description);
    }
  }

  // Compound multiplier: If both Brand Impersonation AND Credential Harvesting exist, boost severity
  if (hasBrandSpoof && hasCredHarvesting) {
    rawScore += 15;
    triggered.push({
      name: 'Compound Target Affinity (Brand Spoof + Auth Harvest)',
      weight: 15,
      description: 'Concurrent brand spoofing and authentication parameters dramatically increase phishing probability.',
    });
  }

  // Clamped 0-100 score
  const finalScore = Math.min(100, Math.max(0, rawScore));
  const severity = getSeverityTier(finalScore);

  // Confidence calculation
  let confidence = 0.85;
  if (evidenceList.length > 0) {
    const totalConf = evidenceList.reduce((acc, curr) => acc + curr.confidence, 0);
    confidence = Number((totalConf / evidenceList.length).toFixed(2));
  } else {
    // Zero evidence triggered
    reasons.push('No known threat detected across deterministic heuristics or intelligence feeds. Note: Zero indicators do not guarantee safety for newly minted zero-day infrastructure.');
    confidence = 0.90;
  }

  return {
    score: finalScore,
    severity,
    confidence,
    reasons,
    evidenceIds,
    signalsTriggered: triggered,
  };
}
