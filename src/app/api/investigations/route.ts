import { NextResponse } from 'next/server';
import { InvestigationStore } from '@/lib/db/store';
import { SECURE_HEADERS } from '@/lib/security/headers';

export async function GET() {
  const all = InvestigationStore.getAll();
  return NextResponse.json(all, { status: 200, headers: SECURE_HEADERS });
}

export async function DELETE() {
  InvestigationStore.clear();
  return NextResponse.json({ success: true, message: 'Local investigation history cleared.' }, { status: 200, headers: SECURE_HEADERS });
}
