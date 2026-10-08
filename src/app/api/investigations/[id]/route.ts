import { NextRequest, NextResponse } from 'next/server';
import { InvestigationStore } from '@/lib/db/store';
import { SECURE_HEADERS } from '@/lib/security/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const investigation = InvestigationStore.get(id);

  if (!investigation) {
    return NextResponse.json(
      { error: 'Investigation not found or session expired.' },
      { status: 404, headers: SECURE_HEADERS }
    );
  }

  return NextResponse.json(investigation, { status: 200, headers: SECURE_HEADERS });
}
