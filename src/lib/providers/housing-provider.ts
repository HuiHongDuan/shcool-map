import { residentialData } from '@/data/mock/residential-data';
import type { AdministrativeDistrict, ResidentialCommunity, ResidentialQuery } from '@/types/domain';
import type { HousingProvider } from '@/types/providers';
import { isWithinBbox, normalizeKeyword } from '@/lib/utils';

const allResidential: ResidentialCommunity[] = residentialData;

export class MockHousingProvider implements HousingProvider {
  async listResidential(query?: ResidentialQuery): Promise<ResidentialCommunity[]> {
    const keyword = normalizeKeyword(query?.keyword);
    return allResidential.filter((item) => {
      const inBbox = isWithinBbox(item, query?.bbox);
      const hitKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        (item.address ?? '').toLowerCase().includes(keyword);
      return inBbox && hitKeyword;
    });
  }

  async getResidentialById(id: string): Promise<ResidentialCommunity | null> {
    return allResidential.find((item) => item.id === id) ?? null;
  }

  async getDistrictStats(keyword?: string): Promise<AdministrativeDistrict[]> {
    const keywordNorm = normalizeKeyword(keyword);
    const filtered = allResidential.filter((item) =>
      !keywordNorm
        ? true
        : item.name.toLowerCase().includes(keywordNorm) || (item.address ?? '').toLowerCase().includes(keywordNorm),
    );
    const buckets = filtered.reduce<Record<string, number>>((acc, item) => {
      acc[item.district] = (acc[item.district] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(buckets).map(([name, residentialCount]) => ({ name, residentialCount }));
  }
}
