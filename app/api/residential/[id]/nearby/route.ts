import { NextResponse } from 'next/server';
import { providers } from '@/lib/services/container';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const items = await providers.poi.getNearbyResourcesByResidentialId(id);
  return NextResponse.json({ items });
}
