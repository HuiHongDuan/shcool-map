import { NextResponse } from 'next/server';
import { providers } from '@/lib/services/container';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const item = await providers.schoolDistrict.getSchoolDistrictByResidentialId(id);
  return NextResponse.json({ item });
}
