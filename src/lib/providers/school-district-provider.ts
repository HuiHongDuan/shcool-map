import schoolDistrictData from '@/data/mock/school-districts.json';
import type { SchoolDistrictInfo } from '@/types/domain';
import type { SchoolDistrictProvider } from '@/types/providers';

export class MockSchoolDistrictProvider implements SchoolDistrictProvider {
  async getSchoolDistrictByResidentialId(id: string): Promise<SchoolDistrictInfo | null> {
    return (schoolDistrictData as SchoolDistrictInfo[]).find((item) => item.residentialId === id) ?? null;
  }
}
