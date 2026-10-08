import { EvidenceIndicator } from './evidence';
import { ThreatIntelMatch, AttackGraphData } from './threat';
import { RiskCalculationResult } from './risk';

export type InvestigationInputType = 'url' | 'screenshot' | 'image' | 'message' | 'email' | 'qr';

export interface NormalizedUrlDetails {
  rawUrl: string;
  normalizedUrl: string;
  protocol: string;
  hostname: string;
  port: string | null;
  pathname: string;
  search: string;
  hash: string;
  registrableDomain: string;
  subdomains: string[];
  tld: string;
  isIpAddress: boolean;
  isPunycode: boolean;
  hasSuspiciousPort: boolean;
  entropy: number;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  stage: string;
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  durationMs?: number;
}

export type UserIncidentState =
  | 'not_opened'
  | 'opened_link'
  | 'entered_password'
  | 'entered_otp'
  | 'entered_payment'
  | 'downloaded_file'
  | 'sent_money';

export interface IncidentActionStep {
  step: number;
  title: string;
  instruction: string;
  priority: 'immediate' | 'high' | 'standard';
  actionType: 'password_reset' | 'mfa_rotation' | 'session_revocation' | 'bank_contact' | 'endpoint_scan' | 'report_incident';
}

export interface WhyVerdictSignal {
  signal: string;
  weight: number;
  category: string;
}

export interface InvestigationResult {
  id: string;
  inputType: InvestigationInputType;
  targetUrl?: string;
  normalizedUrl?: string;
  targetTitle?: string;
  inputContentSnippet?: string;
  extractedMeta?: {
    sender?: string;
    subject?: string;
    detectedCategories?: string[];
    extractedUrl?: string;
    qrDestination?: string;
  };
  urlDetails?: NormalizedUrlDetails;
  verdict: {
    title: string;
    summary: string;
    threatClassification: string;
    immediateRecommendation: string;
    confidence: number;
    isSafeGuarantee: false;
  };
  risk: RiskCalculationResult;
  whyVerdict: WhyVerdictSignal[];
  evidence: EvidenceIndicator[];
  threatIntel: ThreatIntelMatch[];
  attackGraph: AttackGraphData;
  telemetry: TelemetryEvent[];
  actionsByState: Record<UserIncidentState, IncidentActionStep[]>;
  impacts: Array<{
    type: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'critical';
  }>;
  createdAt: string;
  durationMs: number;
}
