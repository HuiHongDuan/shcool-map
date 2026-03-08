import nearbyData from '@/data/mock/nearby-resources.json';
import type { NearbyResource } from '@/types/domain';
import type { PoiProvider } from '@/types/providers';

export class MockPoiProvider implements PoiProvider {
  async getNearbyResourcesByResidentialId(id: string): Promise<NearbyResource[]> {
    return (nearbyData as NearbyResource[]).filter((item) => item.residentialId === id);
  }
}
