import type { ResidentialCommunity } from '@/types/domain';

export function isWithinBbox(item: ResidentialCommunity, bbox?: [number, number, number, number]): boolean {
  if (!bbox) return true;
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const [lng, lat] = item.coordinates;
  return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
}

export function normalizeKeyword(keyword?: string): string {
  return (keyword ?? '').trim().toLowerCase();
}
