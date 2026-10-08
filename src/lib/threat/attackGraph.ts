import { AttackGraphData, AttackNode, AttackEdge } from '@/types/threat';
import { AIAnalysisResponse } from '@/lib/ai/schemas';
import { NormalizedUrlDetails } from '@/types/investigation';

export function buildAttackGraph(
  urlDetails: NormalizedUrlDetails,
  aiReasoning: AIAnalysisResponse
): AttackGraphData {
  if (aiReasoning.attackPathNodes && aiReasoning.attackPathNodes.length > 0) {
    const nodes: AttackNode[] = aiReasoning.attackPathNodes.map((n) => ({
      id: n.id,
      label: n.label,
      phase: n.phase,
      status: n.status,
      description: n.description,
    }));

    const edges: AttackEdge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        source: nodes[i].id,
        target: nodes[i + 1].id,
      });
    }

    return { nodes, edges };
  }

  // Default chain
  const nodes: AttackNode[] = [
    { id: 'user', label: 'Target User', phase: 'initial', status: 'observed', description: 'Target user receives malicious lure vector' },
    { id: 'vector', label: 'Deceptive Message (SMS / Email)', phase: 'delivery', status: 'observed', description: 'Urgent call-to-action to review account activity' },
    { id: 'site', label: `Fake Portal (${urlDetails.registrableDomain})`, phase: 'delivery', status: 'detected', description: 'Spoofed portal imitating genuine institutional layout' },
    { id: 'form', label: 'Credential Harvest Form', phase: 'exploitation', status: 'detected', description: 'Captures and dispatches input telemetry to threat actor C2' },
    { id: 'otp', label: 'OTP / 2FA Intercept', phase: 'exploitation', status: 'inferred', description: 'Real-time proxy requests authentication token' },
    { id: 'takeover', label: 'Account Takeover', phase: 'impact', status: 'potential', description: 'Adversary leverages session to access sensitive services' },
    { id: 'drain', label: 'Financial Exfiltration', phase: 'impact', status: 'potential', description: 'Unauthorized fund liquidations or secondary extortion' },
  ];

  const edges: AttackEdge[] = [
    { source: 'user', target: 'vector' },
    { source: 'vector', target: 'site' },
    { source: 'site', target: 'form' },
    { source: 'form', target: 'otp' },
    { source: 'otp', target: 'takeover' },
    { source: 'takeover', target: 'drain' },
  ];

  return { nodes, edges };
}
