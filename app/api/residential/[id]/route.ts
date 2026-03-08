import { NextResponse } from 'next/server';
import { providers } from '@/lib/services/container';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const item = await providers.housing.getResidentialById(id);
  if (!item) {
    return NextResponse.json({ message: 'Residential not found' }, { status: 404 });
  }
  return NextResponse.json(item);
}
