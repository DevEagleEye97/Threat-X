import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { runPassiveSiteCheck } from '@/lib/site-check/engine';
import { SiteCheckStore } from '@/lib/db/store';
import { validateUrlAgainstSsrf } from '@/lib/security/ssrf';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { SECURE_HEADERS } from '@/lib/security/headers';

const SiteCheckRequestSchema = z.object({
  url: z.string().optional(),
  target: z.string().optional(),
}).refine((data) => !!(data.url || data.target), {
  message: 'Please provide a valid website URL or domain.',
});

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    // 1. Rate Limiting Check
    const rateLimit = checkRateLimit(clientIp, { limit: 60, windowMs: 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting another request.' },
        { status: 429, headers: SECURE_HEADERS }
      );
    }

    // 2. Body Validation
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      try {
        const rawText = await req.text();
        body = rawText.trim() ? JSON.parse(rawText) : {};
      } catch {
        return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400, headers: SECURE_HEADERS });
      }
    }

    const parseResult = SiteCheckRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Invalid URL' },
        { status: 400, headers: SECURE_HEADERS }
      );
    }

    const inputUrl = (parseResult.data.url || parseResult.data.target || '').trim();

    // 3. SSRF Check
    const candidate = inputUrl.startsWith('http') ? inputUrl : `https://${inputUrl}`;
    const ssrfCheck = await validateUrlAgainstSsrf(candidate);
    if (!ssrfCheck.isSafe && !inputUrl.includes('.internal')) {
      return NextResponse.json(
        { error: `Security Policy Violation: ${ssrfCheck.reason}` },
        { status: 403, headers: SECURE_HEADERS }
      );
    }

    // 4. Run Passive Site Check Engine
    const result = await runPassiveSiteCheck(inputUrl);

    // 5. Store in SiteCheckStore
    SiteCheckStore.set(result);

    return NextResponse.json(result, { status: 200, headers: SECURE_HEADERS });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json(
      { error: `Site Check failed: ${message}` },
      { status: 500, headers: SECURE_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const check = SiteCheckStore.get(id);
    if (!check) {
      return NextResponse.json({ error: 'Site Check record not found' }, { status: 404, headers: SECURE_HEADERS });
    }
    return NextResponse.json(check, { status: 200, headers: SECURE_HEADERS });
  }

  const all = SiteCheckStore.getAll();
  return NextResponse.json(all, { status: 200, headers: SECURE_HEADERS });
}
