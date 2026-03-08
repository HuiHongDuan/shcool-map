import type { AdministrativeDistrict, NearbyResource, ResidentialCommunity, ResidentialQuery, SchoolDistrictInfo } from './domain';

export interface MapProvider {
  getStyleUrl(): string;
}

export interface HousingProvider {
  listResidential(query?: ResidentialQuery): Promise<ResidentialCommunity[]>;
  getResidentialById(id: string): Promise<ResidentialCommunity | null>;
  getDistrictStats(keyword?: string): Promise<AdministrativeDistrict[]>;
}

export interface SchoolDistrictProvider {
  getSchoolDistrictByResidentialId(id: string): Promise<SchoolDistrictInfo | null>;
}

export interface PoiProvider {
  getNearbyResourcesByResidentialId(id: string): Promise<NearbyResource[]>;
}
