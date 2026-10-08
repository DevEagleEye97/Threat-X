/**
 * Enterprise security headers for THREATX
 */

export const SECURE_HEADERS: Record<string, string> = {
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent framing to stop clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Cross-site scripting filter
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy to disable sensitive browser APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',

  // Strict Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js and hydration
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://safebrowsing.googleapis.com https://urlhaus-api.abuse.ch https://checkurl.phishtank.com https://www.virustotal.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.pwnedpasswords.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};
