import { NormalizedUrlDetails } from '@/types/investigation';
import { EvidenceIndicator } from '@/types/evidence';
import { detectBrandImpersonation } from './brandDetection';

const HIGH_ABUSE_TLDS = new Set([
  'cfd', 'xyz', 'top', 'icu', 'buzz', 'tk', 'ml', 'ga', 'cf', 'gq',
  'click', 'link', 'rest', 'sbs', 'quest', 'skin', 'autos', 'cam',
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'sign-in', 'log-in', 'secure', 'verify', 'verification',
  'account', 'banking', 'update', 'confirm', 'wallet', 'token', 'security-alert',
  'authenticate', 'credential', 'password', 'recover', 'billing', 'invoice',
];

const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rb.gy', 'shorte.st',
]);

const REDIRECT_PARAM_KEYS = [
  'redirect', 'redirect_uri', 'redirect_url', 'url', 'dest', 'destination', 'return_to', 'next', 'forward', 'out',
];

export function runDeterministicHeuristics(urlDetails: NormalizedUrlDetails): EvidenceIndicator[] {
  const evidence: EvidenceIndicator[] = [];
  const { hostname, registrableDomain, pathname, search, isIpAddress, isPunycode, entropy, subdomains, tld, normalizedUrl } = urlDetails;

  // 1. IP-based hostname
  if (isIpAddress) {
    evidence.push({
      id: 'heur-ip-host',
      category: 'network_anomaly',
      title: 'Direct IP Address Hostname',
      description: `Hostname "${hostname}" is a raw IP address instead of a registered domain name. Legitimate services virtually never ask users to authenticate via raw IP addresses.`,
      severity: 'high',
      confidence: 0.95,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { ip: hostname },
    });
  }

  // 2. Punycode / IDN Homograph attack check
  if (isPunycode) {
    evidence.push({
      id: 'heur-punycode-homograph',
      category: 'url_structure',
      title: 'Internationalized Domain Name (Punycode) Detected',
      description: `Domain contains an encoded punycode prefix ("xn--"). Attackers frequently use Cyrillic or Greek homoglyphs to visually spoof familiar Latin characters (e.g., Cyrillic "а" replacing Latin "a").`,
      severity: 'high',
      confidence: 0.92,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { hostname },
    });
  }

  // 3. High Shannon Entropy (Randomness/DGA indicator)
  if (entropy >= 3.8 && !isIpAddress) {
    evidence.push({
      id: 'heur-high-entropy',
      category: 'domain_anomaly',
      title: 'High Domain Name Entropy',
      description: `Calculated Shannon entropy of domain label is ${entropy.toFixed(2)} bits (threshold: 3.8). High character randomness is characteristic of Domain Generation Algorithms (DGA) or disposable automated phishing kits.`,
      severity: 'medium',
      confidence: 0.78,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { entropy },
    });
  }

  // 4. Excessive Subdomain Nesting / Chaining
  if (subdomains.length >= 3) {
    evidence.push({
      id: 'heur-subdomain-chain',
      category: 'url_structure',
      title: 'Excessive Subdomain Chaining',
      description: `URL contains ${subdomains.length} subdomain tiers: [${subdomains.join(', ')}]. Deep subdomain chains are frequently weaponized to simulate genuine service URLs on mobile viewports.`,
      severity: 'medium',
      confidence: 0.85,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { subdomainsCount: subdomains.length },
    });
  }

  // 5. High-Abuse TLD
  if (HIGH_ABUSE_TLDS.has(tld.toLowerCase())) {
    evidence.push({
      id: 'heur-abusive-tld',
      category: 'domain_anomaly',
      title: `High-Risk Top-Level Domain (.${tld})`,
      description: `The domain utilizes the .${tld} TLD, statistically recognized by threat intelligence groups (APWG, Spamhaus) as having disproportionately elevated rates of short-lived malicious registrations.`,
      severity: 'medium',
      confidence: 0.70,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { tld },
    });
  }

  // 6. Brand Spoofing & Impersonation
  const brandMatch = detectBrandImpersonation(hostname, registrableDomain, pathname);
  if (brandMatch && !brandMatch.isLegitimateDomain) {
    if (brandMatch.isTyposquatting) {
      evidence.push({
        id: 'heur-brand-typosquat',
        category: 'brand_impersonation',
        title: `Typosquatting Attack: Mimicking ${brandMatch.brand.name}`,
        description: `Domain SLD closely mimics brand name "${brandMatch.matchedKeyword}" with edit distance of ${brandMatch.typosquattingDistance}. Attackers exploit subtle typographical errors to deceive recipients.`,
        severity: 'critical',
        confidence: brandMatch.confidence,
        source: 'local-heuristics',
        evidenceType: 'detected',
        metadata: { brand: brandMatch.brand.name, distance: brandMatch.typosquattingDistance },
      });
    } else {
      evidence.push({
        id: 'heur-brand-spoof',
        category: 'brand_impersonation',
        title: `Suspected Brand Impersonation: ${brandMatch.brand.name}`,
        description: `The URL references well-known brand "${brandMatch.brand.name}", but the registrable domain is "${registrableDomain}". The domain is NOT owned or affiliated with ${brandMatch.brand.name}.`,
        severity: 'critical',
        confidence: brandMatch.confidence,
        source: 'local-heuristics',
        evidenceType: 'detected',
        metadata: { brand: brandMatch.brand.name, keyword: brandMatch.matchedKeyword },
      });
    }
  }

  // 7. Credential Harvesting Indicators in Path or Query
  const fullPathLower = `${pathname}${search}`.toLowerCase();
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => fullPathLower.includes(kw));

  if (matchedKeywords.length >= 2) {
    evidence.push({
      id: 'heur-cred-keywords',
      category: 'credential_harvesting',
      title: 'Credential Harvesting Pattern in Path/Parameters',
      description: `Path or query parameters contain multiple security-sensitive keywords: [${matchedKeywords.slice(0, 4).join(', ')}]. Typical of phishing landing forms designed to trick users into re-authenticating.`,
      severity: brandMatch && !brandMatch.isLegitimateDomain ? 'critical' : 'high',
      confidence: 0.89,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { matchedKeywords },
    });
  } else if (matchedKeywords.length === 1 && brandMatch && !brandMatch.isLegitimateDomain) {
    evidence.push({
      id: 'heur-cred-single-kw',
      category: 'credential_harvesting',
      title: 'Authentication Keyword on Unverified Domain',
      description: `Path or query parameter contains authentication keyword "${matchedKeywords[0]}" on an unverified third-party domain "${registrableDomain}".`,
      severity: 'high',
      confidence: 0.84,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { keyword: matchedKeywords[0] },
    });
  }

  // 8. Open Redirect Parameters
  const parsedSearch = new URLSearchParams(search);
  const matchedRedirects: string[] = [];
  for (const key of REDIRECT_PARAM_KEYS) {
    const val = parsedSearch.get(key);
    if (val && (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('//'))) {
      matchedRedirects.push(`${key}=${val.substring(0, 30)}...`);
    }
  }

  if (matchedRedirects.length > 0) {
    evidence.push({
      id: 'heur-open-redirect',
      category: 'url_structure',
      title: 'Suspicious Open Redirect Parameter Detected',
      description: `URL contains parameter attempting secondary external redirection: [${matchedRedirects.join(', ')}]. Open redirect mechanisms are commonly exploited to bypass email gateway filters.`,
      severity: 'high',
      confidence: 0.88,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { matchedRedirects },
    });
  }

  // 9. Shortener Service
  if (SHORTENER_DOMAINS.has(registrableDomain.toLowerCase())) {
    evidence.push({
      id: 'heur-url-shortener',
      category: 'url_structure',
      title: 'URL Shortening / Masking Service',
      description: `Domain is a known public URL shortening service ("${registrableDomain}"). Shorteners mask the eventual destination target, frequently masking phishing campaigns from manual inspection.`,
      severity: 'guarded',
      confidence: 0.90,
      source: 'local-heuristics',
      evidenceType: 'observed',
      metadata: { service: registrableDomain },
    });
  }

  // 10. Excessive Total URL Length
  if (normalizedUrl.length > 150) {
    evidence.push({
      id: 'heur-url-length',
      category: 'url_structure',
      title: 'Abnormal URL Length',
      description: `URL length is ${normalizedUrl.length} characters (typical legitimate entry points are < 80 characters). Extended URLs often conceal serialized exploit payloads, base64 tokens, or tracking hashes.`,
      severity: 'guarded',
      confidence: 0.72,
      source: 'local-heuristics',
      evidenceType: 'detected',
      metadata: { length: normalizedUrl.length },
    });
  }

  return evidence;
}
