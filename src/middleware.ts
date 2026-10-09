import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * THREATX Security Middleware
 * Applies enterprise security headers to every response.
 * Enforces HTTPS-only, frame protection, CSP, and anti-sniffing headers.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent framing to stop clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');

  // Cross-site scripting filter
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy to disable sensitive browser APIs
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()'
  );

  // Strict Transport Security (1 year, include subdomains, preload)
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://safebrowsing.googleapis.com https://urlhaus-api.abuse.ch https://checkurl.phishtank.com https://www.virustotal.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.pwnedpasswords.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  // Remove server identification header
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
