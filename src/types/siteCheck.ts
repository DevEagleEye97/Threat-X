export type HeaderStatus = 'PASS' | 'WARNING' | 'MISSING' | 'NOT_OBSERVABLE';

export type SecurityPostureRating = 'GOOD' | 'NEEDS ATTENTION' | 'CRITICAL';

export interface HeaderFinding {
  header: string;
  status: HeaderStatus;
  observed: string;
  whyItMatters: string;
  recommendation: string;
}

export interface CookieFinding {
  name: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  domain?: string;
  path?: string;
  maskedValue: string;
  status: 'PASS' | 'WARNING';
}

export interface DnsRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
  value: string;
  ttl?: number;
  explanation: string;
}

export interface CertificateObservation {
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isValid: boolean;
  isHostnameMatch: boolean;
  observedHostnames: string[];
}

export interface TechnologyItem {
  name: string;
  category: string;
  confidence: number;
  version?: string;
  note?: string;
}

export interface ThirdPartyService {
  name: string;
  category: 'CDN' | 'Analytics' | 'Fonts' | 'Payment Gateway' | 'Customer Support' | 'Marketing';
  domain: string;
  isFirstParty: boolean;
  purpose: string;
}

export interface PublicMetadataFile {
  path: 'security.txt' | 'robots.txt' | 'sitemap.xml';
  present: boolean;
  url: string;
  summary: string;
}

export interface HistoricalSnapshot {
  date: string;
  title: string;
  source: string;
  changesObserved: string;
}

export interface PublicCodeReference {
  repository: string;
  language: string;
  lastUpdated: string;
  observedPublicFiles: string[];
  note: string;
}

export interface SiteCheckResult {
  id: string;
  targetUrl: string;
  hostname: string;
  timestamp: string;
  postureScore: number;
  postureRating: SecurityPostureRating;
  categoryScores: {
    transport: number;
    headers: number;
    cookies: number;
    dns: number;
    certificates: number;
    technology: number;
    thirdParty: number;
  };
  transport: {
    httpsAvailable: boolean;
    httpRedirectsToHttps: boolean;
    tlsVersion?: string;
    hstsActive: boolean;
  };
  headers: HeaderFinding[];
  cookies: CookieFinding[];
  dnsRecords: DnsRecord[];
  certificate: CertificateObservation;
  technologies: TechnologyItem[];
  thirdParties: ThirdPartyService[];
  publicMetadata: PublicMetadataFile[];
  historicalContext: HistoricalSnapshot[];
  publicCodeReferences: PublicCodeReference[];
  recommendedPriorities: Array<{
    priority: number;
    action: string;
    category: string;
    impact: string;
  }>;
}
