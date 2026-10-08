import { InvestigationResult } from '@/types/investigation';
import { SiteCheckResult } from '@/types/siteCheck';

// Global memory cache preserving history across hot reloads in dev
const globalStore = globalThis as unknown as {
  __threatx_investigations?: Map<string, InvestigationResult>;
  __threatx_site_checks?: Map<string, SiteCheckResult>;
};

if (!globalStore.__threatx_investigations) {
  globalStore.__threatx_investigations = new Map<string, InvestigationResult>();
  seedInitialHistory(globalStore.__threatx_investigations);
}

if (!globalStore.__threatx_site_checks) {
  globalStore.__threatx_site_checks = new Map<string, SiteCheckResult>();
}

function seedInitialHistory(store: Map<string, InvestigationResult>) {
  // 1. Phishing URL investigation (Safe example domain)
  const phishUrl: InvestigationResult = {
    id: 'tx-phish-9842',
    inputType: 'url',
    targetUrl: 'https://login-verify.example-auth.org/service',
    normalizedUrl: 'https://login-verify.example-auth.org/service',
    targetTitle: 'login-verify.example-auth.org',
    urlDetails: {
      rawUrl: 'https://login-verify.example-auth.org/service',
      normalizedUrl: 'https://login-verify.example-auth.org/service',
      protocol: 'https',
      hostname: 'login-verify.example-auth.org',
      port: null,
      pathname: '/service',
      search: '',
      hash: '',
      registrableDomain: 'example-auth.org',
      subdomains: ['login-verify'],
      tld: 'org',
      isIpAddress: false,
      isPunycode: false,
      hasSuspiciousPort: false,
      entropy: 4.12,
    },
    verdict: {
      title: 'Credential Harvester',
      summary: 'Likely credential-harvesting phishing targeting user authentication data.',
      threatClassification: 'Credential Phishing / Authentication Spoof',
      immediateRecommendation: 'Do not open the link or enter credentials.',
      confidence: 0.94,
      isSafeGuarantee: false,
    },
    risk: {
      score: 91,
      severity: 'CRITICAL',
      confidence: 0.94,
      reasons: [
        'Matches confirmed credential harvester fingerprint from active threat intelligence feeds.',
        'Subdomain chaining simulating legitimate single-sign-on gateway.',
      ],
      evidenceIds: ['intel-1', 'heur-1', 'heur-2'],
      signalsTriggered: [
        { name: 'Known Threat Intelligence', weight: 35, description: 'Active listing in phishing database' },
        { name: 'Credential Harvesting', weight: 20, description: 'Authentication endpoint pattern in path' },
        { name: 'Brand Impersonation', weight: 15, description: 'Mimicking enterprise single-sign-on' },
        { name: 'Suspicious URL Structure', weight: 10, description: 'Deep subdomain nesting' },
        { name: 'Social Engineering', weight: 11, description: 'Urgency keywords in parameter signature' },
      ],
    },
    whyVerdict: [
      { signal: 'Known phishing indicator', weight: 35, category: 'threat_intelligence' },
      { signal: 'Credential harvesting indicators', weight: 20, category: 'credential_harvesting' },
      { signal: 'Brand impersonation', weight: 15, category: 'brand_impersonation' },
      { signal: 'Social engineering', weight: 11, category: 'social_engineering' },
      { signal: 'Suspicious URL structure', weight: 10, category: 'url_structure' },
    ],
    evidence: [
      {
        id: 'intel-1',
        category: 'threat_intelligence',
        title: 'Confirmed Phishing Indicator',
        description: 'Host signature flagged in community phishing verification database.',
        severity: 'critical',
        confidence: 0.96,
        source: 'Threat Intelligence Provider',
        evidenceType: 'observed',
      },
      {
        id: 'heur-1',
        category: 'credential_harvesting',
        title: 'Credential Harvesting Form',
        description: 'Endpoint binds event listeners on username and password inputs.',
        severity: 'high',
        confidence: 0.92,
        source: 'Local Analysis',
        evidenceType: 'detected',
      },
      {
        id: 'heur-2',
        category: 'brand_impersonation',
        title: 'Enterprise Brand Mimicry',
        description: 'Domain resembles authorized enterprise authentication portal but does not match authentic registrable domain.',
        severity: 'high',
        confidence: 0.94,
        source: 'Local Analysis',
        evidenceType: 'detected',
      },
    ],
    threatIntel: [
      {
        provider: 'ThreatX Internal Intelligence DB',
        status: 'match',
        threatType: 'Credential Phishing',
        details: 'Active phishing campaign targeting enterprise accounts.',
        confidence: 0.95,
      },
    ],
    attackGraph: {
      nodes: [
        { id: 'user', label: 'USER', phase: 'initial', status: 'observed', description: 'Target user receives untrusted communication' },
        { id: 'msg', label: 'SUSPICIOUS MESSAGE', phase: 'delivery', status: 'observed', description: 'Phishing lure sent via SMS or email' },
        { id: 'site', label: 'FAKE WEBSITE', phase: 'weaponization', status: 'detected', description: 'Cloned login portal hosted on example-auth.org' },
        { id: 'form', label: 'LOGIN FORM', phase: 'exploitation', status: 'detected', description: 'Form script forwards input telemetry to adversary C2' },
        { id: 'cred', label: 'CREDENTIAL HARVEST', phase: 'exploitation', status: 'inferred', description: 'Adversary captures password & session nonces' },
        { id: 'takeover', label: 'ACCOUNT TAKEOVER', phase: 'impact', status: 'potential', description: 'Unauthorized access gained to target service' },
        { id: 'loss', label: 'FINANCIAL / DATA LOSS', phase: 'impact', status: 'potential', description: 'Exfiltration of sensitive assets or funds' },
      ],
      edges: [
        { source: 'user', target: 'msg' },
        { source: 'msg', target: 'site' },
        { source: 'site', target: 'form' },
        { source: 'form', target: 'cred' },
        { source: 'cred', target: 'takeover' },
        { source: 'takeover', target: 'loss' },
      ],
    },
    telemetry: [
      { id: '1', timestamp: '14:02:11.20', stage: 'Input Processed', message: 'Target URL ingested safely without client execution', status: 'info', durationMs: 15 },
      { id: '2', timestamp: '14:02:12.04', stage: 'Content Normalized', message: 'RFC-3986 normalization confirmed', status: 'success', durationMs: 25 },
      { id: '3', timestamp: '14:02:13.41', stage: 'Threat Intelligence', message: 'Correlated against active blocklists: 1 MATCH', status: 'warning', durationMs: 120 },
      { id: '4', timestamp: '14:02:14.48', stage: 'Risk Calculated', message: 'Calculated mathematical risk score: 91/100', status: 'warning', durationMs: 40 },
    ],
    actionsByState: {
      not_opened: [
        { step: 1, title: 'Do not open the suspicious link', instruction: 'Delete the message immediately without clicking.', priority: 'immediate', actionType: 'report_incident' },
        { step: 2, title: 'Do not reply', instruction: 'Avoid replying to prevent sender confirmation.', priority: 'immediate', actionType: 'report_incident' },
        { step: 3, title: 'Report and block', instruction: 'Report message as phishing to your mail or messaging app.', priority: 'standard', actionType: 'report_incident' },
      ],
      opened_link: [
        { step: 1, title: 'Close browser tab', instruction: 'Close the tab immediately.', priority: 'immediate', actionType: 'session_revocation' },
        { step: 2, title: 'Clear cookies & cache', instruction: 'Clear browser cookies from the past 2 hours.', priority: 'high', actionType: 'session_revocation' },
      ],
      entered_password: [
        { step: 1, title: 'Change password on legitimate website', instruction: 'Go directly to official website and change your password.', priority: 'immediate', actionType: 'password_reset' },
        { step: 2, title: 'Revoke active sessions', instruction: 'Sign out of all other sessions in security settings.', priority: 'immediate', actionType: 'session_revocation' },
        { step: 3, title: 'Enable MFA', instruction: 'Enforce authenticator app 2FA.', priority: 'high', actionType: 'mfa_rotation' },
      ],
      entered_otp: [
        { step: 1, title: 'Revoke sessions immediately', instruction: 'Sign out of all sessions to break adversary proxy token.', priority: 'immediate', actionType: 'session_revocation' },
        { step: 2, title: 'Rotate MFA seeds', instruction: 'Generate new 2FA keys.', priority: 'immediate', actionType: 'mfa_rotation' },
      ],
      entered_payment: [
        { step: 1, title: 'Contact bank via official number', instruction: 'Call your card provider immediately.', priority: 'immediate', actionType: 'bank_contact' },
        { step: 2, title: 'Freeze card', instruction: 'Block card in banking app.', priority: 'immediate', actionType: 'bank_contact' },
      ],
      downloaded_file: [
        { step: 1, title: 'Disconnect Wi-Fi', instruction: 'Disconnect network immediately.', priority: 'immediate', actionType: 'endpoint_scan' },
        { step: 2, title: 'Delete file', instruction: 'Delete downloaded file without opening.', priority: 'immediate', actionType: 'endpoint_scan' },
      ],
      sent_money: [
        { step: 1, title: 'Emergency bank recall', instruction: 'Contact bank fraud desk immediately to recall wire.', priority: 'immediate', actionType: 'bank_contact' },
      ],
    },
    impacts: [
      { type: 'PASSWORD', title: 'Credential Theft', description: 'Primary account password stolen', severity: 'critical' },
      { type: 'OTP / 2FA', title: 'Authentication Compromise', description: 'Real-time proxy relay captures second-factor tokens', severity: 'high' },
      { type: 'ACCOUNT', title: 'Account Takeover', description: 'Persistent unauthorized access to target services', severity: 'high' },
    ],
    createdAt: new Date(Date.now() - 600000).toISOString(),
    durationMs: 240,
  };

  // 2. Screenshot investigation: Banking Alert
  const screenshotPhish: InvestigationResult = {
    ...phishUrl,
    id: 'tx-shot-8411',
    inputType: 'screenshot',
    targetTitle: 'Banking Alert Screenshot',
    targetUrl: undefined,
    inputContentSnippet: 'SMS alert screenshot: "URGENT: Your account has been temporarily restricted..."',
    verdict: {
      title: 'Credential Phishing Alert',
      summary: 'Screenshot contains high-urgency fraudulent bank lock notification with credential harvesting link.',
      threatClassification: 'Credential Phishing / Brand Spoof',
      immediateRecommendation: 'Do not follow the link shown in the screenshot or respond to the sender.',
      confidence: 0.94,
      isSafeGuarantee: false,
    },
    risk: {
      ...phishUrl.risk,
      score: 94,
      severity: 'CRITICAL',
    },
    whyVerdict: [
      { signal: 'Known phishing indicator', weight: 35, category: 'threat_intelligence' },
      { signal: 'Credential harvesting indicators', weight: 20, category: 'credential_harvesting' },
      { signal: 'Brand impersonation', weight: 15, category: 'brand_impersonation' },
      { signal: 'Social engineering', weight: 14, category: 'social_engineering' },
      { signal: 'Suspicious URL structure', weight: 10, category: 'url_structure' },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  };

  // 3. Message investigation: Prize notification
  const messageScam: InvestigationResult = {
    ...phishUrl,
    id: 'tx-msg-3210',
    inputType: 'message',
    targetTitle: 'Prize Notification Message',
    targetUrl: undefined,
    inputContentSnippet: 'Congratulations! You have been selected for a special refund. Click here to verify...',
    verdict: {
      title: 'Social Engineering Scam',
      summary: 'Message employs false prize incentives and artificial urgency to coerce recipient into visiting an unverified portal.',
      threatClassification: 'Social Engineering / Lottery Scam',
      immediateRecommendation: 'Ignore and delete the message. Do not reply to the sender.',
      confidence: 0.88,
      isSafeGuarantee: false,
    },
    risk: {
      score: 63,
      severity: 'HIGH',
      confidence: 0.88,
      reasons: [
        'Artificial urgency linguistic pattern detected.',
        'Unverified external link embedded in reward claim solicitation.',
      ],
      evidenceIds: ['heur-msg-1', 'heur-msg-2'],
      signalsTriggered: [
        { name: 'Social Engineering', weight: 25, description: 'Lure based on false prize promises' },
        { name: 'Suspicious Request', weight: 20, description: 'Directing recipient to unverified domain' },
        { name: 'Domain Anomaly', weight: 18, description: 'Disposable registration' },
      ],
    },
    whyVerdict: [
      { signal: 'Social engineering', weight: 25, category: 'social_engineering' },
      { signal: 'Suspicious request', weight: 20, category: 'credential_harvesting' },
      { signal: 'Domain anomaly', weight: 18, category: 'domain_anomaly' },
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  };

  // 4. QR Code investigation: Unknown destination
  const qrThreat: InvestigationResult = {
    ...phishUrl,
    id: 'tx-qr-7789',
    inputType: 'qr',
    targetTitle: 'Unknown Destination QR Code',
    targetUrl: 'https://track-package.delivery-notice.example.net/qr-pay',
    inputContentSnippet: 'QR payload decodes to: https://track-package.delivery-notice.example.net/qr-pay',
    verdict: {
      title: 'Quishing / Suspicious Redirect',
      summary: 'QR code conceals an unverified delivery payment redirection page designed to capture card credentials.',
      threatClassification: 'Quishing / Payment Scam',
      immediateRecommendation: 'Do not scan or browse the QR code destination.',
      confidence: 0.87,
      isSafeGuarantee: false,
    },
    risk: {
      score: 87,
      severity: 'CRITICAL',
      confidence: 0.87,
      reasons: [
        'QR destination leads to payment fee harvesting endpoint.',
        'High-abuse domain structure masking real identity.',
      ],
      evidenceIds: ['qr-1', 'qr-2'],
      signalsTriggered: [
        { name: 'Phishing Listing', weight: 35, description: 'Quishing campaign host' },
        { name: 'Suspicious Redirect', weight: 20, description: 'QR destination obfuscation' },
        { name: 'Credential Harvesting', weight: 20, description: 'Payment card entry form' },
        { name: 'Domain Anomaly', weight: 12, description: 'Unregistered business SLD' },
      ],
    },
    whyVerdict: [
      { signal: 'Known phishing indicator', weight: 35, category: 'threat_intelligence' },
      { signal: 'Suspicious redirect / QR masking', weight: 20, category: 'url_structure' },
      { signal: 'Credential harvesting indicators', weight: 20, category: 'credential_harvesting' },
      { signal: 'Domain anomaly', weight: 12, category: 'domain_anomaly' },
    ],
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  };

  // 5. Clean documentation URL
  const cleanDoc: InvestigationResult = {
    ...phishUrl,
    id: 'tx-clean-0102',
    inputType: 'url',
    targetUrl: 'https://developer-docs.example.org/api',
    targetTitle: 'developer-docs.example.org',
    verdict: {
      title: 'Legitimate Developer Documentation',
      summary: 'Standard verified technical documentation portal with no security anomalies or malicious indicators.',
      threatClassification: 'Legitimate Web Resource',
      immediateRecommendation: 'No malicious indicators observed. Safe to browse normally.',
      confidence: 0.99,
      isSafeGuarantee: false,
    },
    risk: {
      score: 4,
      severity: 'LOW',
      confidence: 0.99,
      reasons: [
        'No known threat detected across deterministic heuristics or intelligence feeds. This does not guarantee safety.',
      ],
      evidenceIds: [],
      signalsTriggered: [],
    },
    whyVerdict: [],
    evidence: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  };

  store.set(phishUrl.id, phishUrl);
  store.set(screenshotPhish.id, screenshotPhish);
  store.set(messageScam.id, messageScam);
  store.set(qrThreat.id, qrThreat);
  store.set(cleanDoc.id, cleanDoc);
}

export const InvestigationStore = {
  get(id: string): InvestigationResult | undefined {
    return globalStore.__threatx_investigations?.get(id);
  },

  getAll(): InvestigationResult[] {
    return Array.from(globalStore.__threatx_investigations?.values() || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  set(investigation: InvestigationResult): void {
    globalStore.__threatx_investigations?.set(investigation.id, investigation);
  },

  clear(): void {
    globalStore.__threatx_investigations?.clear();
  },
};

export const SiteCheckStore = {
  get(id: string): SiteCheckResult | undefined {
    return globalStore.__threatx_site_checks?.get(id);
  },

  getAll(): SiteCheckResult[] {
    return Array.from(globalStore.__threatx_site_checks?.values() || []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  set(result: SiteCheckResult): void {
    globalStore.__threatx_site_checks?.set(result.id, result);
  },

  clear(): void {
    globalStore.__threatx_site_checks?.clear();
  },
};

