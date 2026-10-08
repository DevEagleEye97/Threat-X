import { z } from 'zod';

export const AIAnalysisResponseSchema = z.object({
  summary: z.string().describe('Executive summary of the threat evidence analysis'),
  threatClassification: z.string().describe('Specific classification, e.g. Credential Harvester, Drive-by Dropper, Benign SaaS'),
  primaryIntent: z.string().describe('Threat actor primary objective, e.g. Banking credential theft, Session hijacking'),
  attackTechnique: z.object({
    mitreId: z.string().optional().describe('MITRE ATT&CK Technique ID if applicable, e.g. T1566.002'),
    name: z.string(),
    description: z.string(),
  }),
  potentialImpact: z.array(
    z.object({
      type: z.string(), // e.g. PASSWORD, OTP_2FA, FINANCIAL, IDENTITY
      title: z.string(),
      description: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
    })
  ),
  attackPathNodes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      phase: z.string(),
      status: z.enum(['observed', 'detected', 'inferred', 'potential']),
      description: z.string(),
    })
  ),
  suggestedActionDirectives: z.array(
    z.object({
      actionState: z.enum(['not_opened', 'opened_link', 'entered_password', 'entered_otp', 'downloaded_file', 'sent_money']),
      steps: z.array(
        z.object({
          step: z.number(),
          title: z.string(),
          instruction: z.string(),
          priority: z.enum(['immediate', 'high', 'standard']),
        })
      ),
    })
  ).optional(),
});

export type AIAnalysisResponse = z.infer<typeof AIAnalysisResponseSchema>;
