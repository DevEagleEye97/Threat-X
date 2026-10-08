import { EvidenceIndicator } from '@/types/evidence';
import { ThreatIntelMatch } from '@/types/threat';
import { NormalizedUrlDetails } from '@/types/investigation';

export function aggregateEvidence(
  heuristicsEvidence: EvidenceIndicator[],
  threatIntelResults: ThreatIntelMatch[],
  urlDetails: NormalizedUrlDetails
): EvidenceIndicator[] {
  const aggregated: EvidenceIndicator[] = [...heuristicsEvidence];

  // Map threat intelligence matches into formal evidence indicators
  for (const match of threatIntelResults) {
    if (match.status === 'match') {
      const isMalware = match.threatType?.toLowerCase().includes('malware') || match.threatType?.toLowerCase().includes('dropper');
      aggregated.push({
        id: `intel-${match.provider.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        category: isMalware ? 'malware_delivery' : 'threat_intelligence',
        title: `Confirmed Malicious Listing: ${match.provider}`,
        description: match.details || `Active listing in ${match.provider} threat intelligence database.`,
        severity: 'critical',
        confidence: match.confidence ?? 0.96,
        source: match.provider,
        evidenceType: 'observed', // Confirmed external record is observed
        timestamp: match.matchedAt,
        metadata: {
          referenceUrl: match.referenceUrl,
          threatType: match.threatType,
        },
      });
    }
  }

  // Ensure unique IDs
  const seenIds = new Set<string>();
  const uniqueEvidence = aggregated.filter((item) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });

  // Sort by severity (critical > high > medium > guarded > low)
  const severityRank = { critical: 5, high: 4, medium: 3, guarded: 2, low: 1 };
  uniqueEvidence.sort((a, b) => severityRank[b.severity] - severityRank[a.severity]);

  return uniqueEvidence;
}
