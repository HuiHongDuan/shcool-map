import type { AdministrativeDistrict, NearbyResource, ResidentialCommunity, SchoolDistrictInfo } from '@/types/domain';

export interface ResidentialListResponse {
  items: ResidentialCommunity[];
  districtStats: AdministrativeDistrict[];
  source: string;
}

export async function fetchResidential(keyword?: string): Promise<ResidentialListResponse> {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
  const resp = await fetch(`/api/residential${query}`);
  if (!resp.ok) throw new Error('Failed to fetch residential list');
  return resp.json();
}

export async function fetchSchoolDistrict(id: string): Promise<SchoolDistrictInfo | null> {
  const resp = await fetch(`/api/residential/${id}/school-district`);
  if (!resp.ok) throw new Error('Failed to fetch school district');
  const data = (await resp.json()) as { item: SchoolDistrictInfo | null };
  return data.item;
}

export async function fetchNearby(id: string): Promise<NearbyResource[]> {
  const resp = await fetch(`/api/residential/${id}/nearby`);
  if (!resp.ok) throw new Error('Failed to fetch nearby resources');
  const data = (await resp.json()) as { items: NearbyResource[] };
  return data.items;
}
