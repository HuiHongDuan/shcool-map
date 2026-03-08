import { MockHousingProvider } from '@/lib/providers/housing-provider';
import { EnvMapProvider } from '@/lib/providers/map-provider';
import { MockPoiProvider } from '@/lib/providers/poi-provider';
import { MockSchoolDistrictProvider } from '@/lib/providers/school-district-provider';

export const providers = {
  map: new EnvMapProvider(),
  housing: new MockHousingProvider(),
  schoolDistrict: new MockSchoolDistrictProvider(),
  poi: new MockPoiProvider(),
};
