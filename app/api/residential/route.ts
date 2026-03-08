import { NextRequest, NextResponse } from 'next/server';
import { providers } from '@/lib/services/container';

function parseBbox(raw?: string): [number, number, number, number] | undefined {
  if (!raw) return undefined;
  const parts = raw.split(',').map(Number);
  if (parts.length !== 4 || parts.some(Number.isNaN)) return undefined;
  return [parts[0], parts[1], parts[2], parts[3]];
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const keyword = params.get('keyword') ?? undefined;
  const bbox = parseBbox(params.get('bbox') ?? undefined);
  const zoom = params.get('zoom') ? Number(params.get('zoom')) : undefined;

  const [items, districtStats] = await Promise.all([
    providers.housing.listResidential({ keyword, bbox, zoom }),
    providers.housing.getDistrictStats(keyword),
  ]);

  return NextResponse.json({ items, districtStats, source: process.env.DATA_PROVIDER_MODE ?? 'mock' });
}
