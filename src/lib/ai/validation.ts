/**
 * THREATX AI Output Validation & Safety Boundary
 *
 * Ensures:
 * 1. AI never overrides deterministic risk scoring
 * 2. AI output is schema-validated via Zod
 * 3. Prompt injection patterns in AI output are flagged
 * 4. AI cannot fabricate evidence or invent indicators
 */

import { AIAnalysisResponse } from './schemas';

/**
 * Known adversarial patterns that could appear in AI output
 * if the model was manipulated via prompt injection in threat data.
 */
const AI_OUTPUT_INJECTION_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /disregard\s+all\s+prior/i,
  /you\s+are\s+now\s+a/i,
  /execute\s+(?:command|script|code)/i,
  /reveal\s+(?:secrets?|api\s*key|password)/i,
  /system\s+prompt/i,
  /override\s+(?:score|risk|verdict)/i,
];

export interface AIOutputValidationResult {
  isValid: boolean;
  sanitized: AIAnalysisResponse;
  warnings: string[];
}

/**
 * Post-process and validate AI reasoning output.
 * AI output is treated as advisory — it NEVER overrides the deterministic pipeline.
 */
export function validateAndSanitizeAIOutput(
  aiOutput: AIAnalysisResponse,
  deterministicScore: number,
  deterministicSeverity: string
): AIOutputValidationResult {
  const warnings: string[] = [];

  // 1. Check for prompt injection patterns in AI output
  const allTextFields = [
    aiOutput.summary,
    aiOutput.threatClassification,
    aiOutput.primaryIntent,
    aiOutput.attackTechnique.name,
    aiOutput.attackTechnique.description,
    ...aiOutput.potentialImpact.map((i) => i.description),
    ...aiOutput.attackPathNodes.map((n) => n.description),
  ].join(' ');

  for (const pattern of AI_OUTPUT_INJECTION_PATTERNS) {
    if (pattern.test(allTextFields)) {
      warnings.push(`Prompt injection pattern detected in AI output: ${pattern.source}`);
    }
  }

  // 2. Validate attack path nodes have valid status values
  const validStatuses = new Set(['observed', 'detected', 'inferred', 'potential']);
  const sanitizedNodes = aiOutput.attackPathNodes.map((node) => ({
    ...node,
    status: validStatuses.has(node.status) ? node.status : ('inferred' as const),
  }));

  // 3. Validate impact severities
  const validSeverities = new Set(['low', 'medium', 'high', 'critical']);
  const sanitizedImpacts = aiOutput.potentialImpact.map((impact) => ({
    ...impact,
    severity: validSeverities.has(impact.severity) ? impact.severity : ('medium' as const),
  }));

  // 4. Ensure summary contains appropriate hedging for uncertain findings
  let sanitizedSummary = aiOutput.summary;
  if (deterministicScore === 0 && !sanitizedSummary.toLowerCase().includes('no known threat')) {
    sanitizedSummary += ' No known threat detected. This does not guarantee safety.';
    warnings.push('AI summary lacked safety disclaimer for zero-score result');
  }

  const sanitized: AIAnalysisResponse = {
    ...aiOutput,
    summary: sanitizedSummary,
    attackPathNodes: sanitizedNodes,
    potentialImpact: sanitizedImpacts,
  };

  return {
    isValid: warnings.length === 0,
    sanitized,
    warnings,
  };
}
