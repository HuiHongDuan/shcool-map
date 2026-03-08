import type { MapProvider } from '@/types/providers';

export class EnvMapProvider implements MapProvider {
  getStyleUrl(): string {
    return process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? 'https://demotiles.maplibre.org/style.json';
  }
}
