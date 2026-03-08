'use client';
import React from 'react';

import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Supercluster from 'supercluster';
import type { PointFeature } from 'supercluster';
import type { ResidentialCommunity } from '@/types/domain';

interface Props {
  styleUrl: string;
  items: ResidentialCommunity[];
  showHousingLayer: boolean;
  selectedId?: string;
  onSelectResidential: (id: string) => void;
}

type ClusterProps = { cluster: true; point_count: number; cluster_id: number };
type ResidentialPointProps = { id: string; name: string; district: string };

export function MapView({ styleUrl, items, showHousingLayer, onSelectResidential, selectedId }: Props) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(9);

  const points = useMemo<PointFeature<ResidentialPointProps>[]>(
    () =>
      items.map((item) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: item.coordinates },
        properties: { id: item.id, name: item.name, district: item.district },
      })),
    [items],
  );

  const clusterEngine = useMemo(() => new Supercluster<ResidentialPointProps, ClusterProps>({ radius: 60, maxZoom: 16 }), []);
  clusterEngine.load(points);
  const clusters = clusterEngine.getClusters([120.8, 30.6, 122.2, 31.8], Math.round(zoom));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [121.4737, 31.2304],
      zoom: 9,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('zoomend', () => setZoom(map.getZoom()));

    mapRef.current = map;
    return () => map.remove();
  }, [styleUrl]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const sourceData = {
      type: 'FeatureCollection' as const,
      features: points,
    };

    const applyLayers = () => {
      if (!map.getSource('housing')) {
        map.addSource('housing', {
          type: 'geojson',
          data: sourceData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });
        map.addLayer({ type: 'circle', id: 'clusters', source: 'housing', filter: ['has', 'point_count'], paint: { 'circle-color': '#2563eb', 'circle-radius': 18 } });
        map.addLayer({ type: 'symbol', id: 'cluster-count', source: 'housing', filter: ['has', 'point_count'], layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 12 }, paint: { 'text-color': '#fff' } });
        map.addLayer({ type: 'circle', id: 'unclustered-point', source: 'housing', filter: ['!', ['has', 'point_count']], paint: { 'circle-color': '#ef4444', 'circle-radius': 8, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' } });

        map.on('click', 'clusters', (e) => {
          const feature = e.features?.[0];
          if (!feature) return;
          const clusterId = feature.properties?.cluster_id;
          const source = map.getSource('housing') as maplibregl.GeoJSONSource & { getClusterExpansionZoom: (id: number, cb: (err: Error | null, zoom?: number) => void) => void };
          source.getClusterExpansionZoom(clusterId, (_err, targetZoom) => {
            map.easeTo({ center: (feature.geometry as GeoJSON.Point).coordinates as [number, number], zoom: targetZoom ?? map.getZoom() + 1 });
          });
        });

        map.on('click', 'unclustered-point', (e) => {
          const feature = e.features?.[0];
          const id = feature?.properties?.id as string | undefined;
          if (id) onSelectResidential(id);
        });
      } else {
        (map.getSource('housing') as maplibregl.GeoJSONSource).setData(sourceData);
      }
    };

    if (map.isStyleLoaded()) applyLayers();
    else map.once('load', applyLayers);
  }, [onSelectResidential, points]);

  useEffect(() => {
    if (!mapRef.current) return;
    const visibility = showHousingLayer ? 'visible' : 'none';
    ['clusters', 'cluster-count', 'unclustered-point'].forEach((layerId) => {
      if (mapRef.current?.getLayer(layerId)) {
        mapRef.current.setLayoutProperty(layerId, 'visibility', visibility);
      }
    });
  }, [showHousingLayer]);

  useEffect(() => {
    const selected = items.find((item) => item.id === selectedId);
    if (selected && mapRef.current) {
      mapRef.current.easeTo({ center: selected.coordinates, zoom: Math.max(mapRef.current.getZoom(), 12) });
    }
  }, [items, selectedId]);

  return (
    <div className="relative h-full w-full" data-testid="map-view">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute left-2 top-2 rounded bg-white/95 px-3 py-2 text-xs shadow" data-testid="cluster-debug">
        缩放级别: {zoom.toFixed(1)} | 当前聚合结果: {clusters.length}
      </div>
    </div>
  );
}
