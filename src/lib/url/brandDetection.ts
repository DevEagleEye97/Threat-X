/**
 * Brand Spoofing & Typosquatting Detection Engine
 */

export interface TargetBrand {
  name: string;
  legitimateDomains: string[];
  keywords: string[];
}

export const TARGET_BRANDS: TargetBrand[] = [
  {
    name: 'Microsoft',
    legitimateDomains: ['microsoft.com', 'live.com', 'office.com', 'outlook.com', 'microsoftonline.com', 'azure.com'],
    keywords: ['microsoft', 'office365', 'outlook', 'onedrive', 'msft', 'azure', 'sharepoint'],
  },
  {
    name: 'Google',
    legitimateDomains: ['google.com', 'gmail.com', 'youtube.com', 'googlemail.com', 'accounts.google.com'],
    keywords: ['google', 'gmail', 'gsuite', 'workspace'],
  },
  {
    name: 'Apple',
    legitimateDomains: ['apple.com', 'icloud.com', 'appleid.apple.com'],
    keywords: ['apple', 'icloud', 'appleid', 'itunes'],
  },
  {
    name: 'PayPal',
    legitimateDomains: ['paypal.com', 'paypal.me'],
    keywords: ['paypal', 'pay-pal'],
  },
  {
    name: 'Chase Bank',
    legitimateDomains: ['chase.com', 'jpmorganchase.com'],
    keywords: ['chase', 'jpmorgan'],
  },
  {
    name: 'Bank of America',
    legitimateDomains: ['bankofamerica.com', 'bofa.com'],
    keywords: ['bankofamerica', 'bofa'],
  },
  {
    name: 'Wells Fargo',
    legitimateDomains: ['wellsfargo.com'],
    keywords: ['wellsfargo'],
  },
  {
    name: 'Amazon',
    legitimateDomains: ['amazon.com', 'aws.amazon.com', 'amazon.co.uk'],
    keywords: ['amazon', 'prime-video', 'aws'],
  },
  {
    name: 'Netflix',
    legitimateDomains: ['netflix.com'],
    keywords: ['netflix'],
  },
  {
    name: 'Meta / Facebook / Instagram',
    legitimateDomains: ['facebook.com', 'instagram.com', 'meta.com', 'whatsapp.com'],
    keywords: ['facebook', 'instagram', 'whatsapp', 'meta-support'],
  },
  {
    name: 'Coinbase',
    legitimateDomains: ['coinbase.com'],
    keywords: ['coinbase'],
  },
  {
    name: 'Binance',
    legitimateDomains: ['binance.com'],
    keywords: ['binance'],
  },
  {
    name: 'DHL',
    legitimateDomains: ['dhl.com', 'dhl.de'],
    keywords: ['dhl-express', 'dhl-tracking', 'dhl'],
  },
  {
    name: 'USPS',
    legitimateDomains: ['usps.com'],
    keywords: ['usps', 'usps-tracking', 'postalservice'],
  },
];

/**
 * Standard Levenshtein Distance calculation
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

export interface BrandDetectionMatch {
  brand: TargetBrand;
  matchedKeyword: string;
  isLegitimateDomain: boolean;
  isSubdomainImpersonation: boolean;
  isTyposquatting: boolean;
  typosquattingDistance?: number;
  confidence: number;
}

export function detectBrandImpersonation(
  hostname: string,
  registrableDomain: string,
  pathname: string
): BrandDetectionMatch | null {
  const lowerHost = hostname.toLowerCase();
  const lowerReg = registrableDomain.toLowerCase();
  const fullCheck = `${lowerHost}${pathname.toLowerCase()}`;

  for (const brand of TARGET_BRANDS) {
    // 1. Is this domain actually legitimate?
    const isLegitimate = brand.legitimateDomains.some(
      (legit) => lowerReg === legit || lowerHost.endsWith(`.${legit}`)
    );

    if (isLegitimate) {
      return {
        brand,
        matchedKeyword: brand.name,
        isLegitimateDomain: true,
        isSubdomainImpersonation: false,
        isTyposquatting: false,
        confidence: 0.99,
      };
    }

    // 2. Check for exact brand keywords in untrusted domains or subdomains
    for (const kw of brand.keywords) {
      // Subdomain spoofing: e.g. login.microsoft.com.evil.xyz or microsoft-auth.evil.xyz
      if (lowerHost.includes(kw)) {
        const isSubdomain = !lowerReg.includes(kw);
        return {
          brand,
          matchedKeyword: kw,
          isLegitimateDomain: false,
          isSubdomainImpersonation: isSubdomain,
          isTyposquatting: false,
          confidence: isSubdomain ? 0.95 : 0.88,
        };
      }

      // 3. Path spoofing: e.g. evil.com/login/paypal/verify
      if (pathname.toLowerCase().includes(kw)) {
        return {
          brand,
          matchedKeyword: kw,
          isLegitimateDomain: false,
          isSubdomainImpersonation: false,
          isTyposquatting: false,
          confidence: 0.82,
        };
      }

      // 4. Typosquatting / Levenshtein check on registrable domain SLD
      const sld = lowerReg.split('.')[0] || '';
      if (sld.length >= 4 && kw.length >= 4) {
        const distance = levenshteinDistance(sld, kw);
        // Distance 1 or 2 with high similarity
        if (distance > 0 && distance <= 2) {
          return {
            brand,
            matchedKeyword: kw,
            isLegitimateDomain: false,
            isSubdomainImpersonation: false,
            isTyposquatting: true,
            typosquattingDistance: distance,
            confidence: distance === 1 ? 0.92 : 0.78,
          };
        }
      }
    }
  }

  return null;
}
