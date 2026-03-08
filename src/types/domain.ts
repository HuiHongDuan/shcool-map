export type LngLat = [number, number];

export interface ResidentialCommunity {
  id: string;
  name: string;
  district: string;
  address?: string;
  housingType?: string;
  tags?: string[];
  coordinates: LngLat;
}

export interface AdministrativeDistrict {
  name: string;
  residentialCount: number;
}

export interface SchoolDistrictInfo {
  residentialId: string;
  schoolDistrictName: string;
  primarySchools: string[];
  middleSchools: string[];
  source: 'mock' | 'manual-import' | 'crawler';
  updatedAt: string;
}

export type NearbyCategory = 'transport' | 'hospital' | 'mall';

export interface NearbyResource {
  id: string;
  residentialId: string;
  category: NearbyCategory;
  name: string;
  distanceMeters: number;
  address?: string;
}

export interface ResidentialFeatureProperties {
  id: string;
  name: string;
  district: string;
  address?: string;
}

export interface ResidentialQuery {
  bbox?: [number, number, number, number];
  zoom?: number;
  keyword?: string;
}
