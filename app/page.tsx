'use client';
import React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { DetailPanel } from '@/components/DetailPanel';
import { MapView } from '@/components/MapView';
import { fetchResidential } from '@/lib/api-client';
import { providers } from '@/lib/services/container';
import type { AdministrativeDistrict, ResidentialCommunity } from '@/types/domain';

export default function HomePage() {
  const [items, setItems] = useState<ResidentialCommunity[]>([]);
  const [districtStats, setDistrictStats] = useState<AdministrativeDistrict[]>([]);
  const [keyword, setKeyword] = useState('');
  const [showLayer, setShowLayer] = useState(true);
  const [selectedId, setSelectedId] = useState<string>();
  const [sourceLabel, setSourceLabel] = useState('mock');

  useEffect(() => {
    fetchResidential(keyword)
      .then((data) => {
        setItems(data.items);
        setDistrictStats(data.districtStats);
        setSourceLabel(data.source);
        if (selectedId && !data.items.some((item) => item.id === selectedId)) setSelectedId(undefined);
      })
      .catch(() => {
        setItems([]);
        setDistrictStats([]);
      });
  }, [keyword, selectedId]);

  const selected = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <header className="flex items-center gap-3 border-b bg-white px-4 py-2">
        <h1 className="text-lg font-semibold">上海住房地图 MVP</h1>
        <input
          className="w-72 rounded border px-2 py-1 text-sm"
          placeholder="搜索住宅名或地址"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="搜索住宅"
        />
        <label className="text-sm">
          <input type="checkbox" checked={showLayer} onChange={(e) => setShowLayer(e.target.checked)} /> 显示住宅图层
        </label>
        <span className="text-xs text-gray-600">数据源：{sourceLabel}</span>
      </header>

      <section className="grid h-[calc(100vh-49px)] grid-cols-[1fr_340px]">
        <div className="relative">
          <MapView
            styleUrl={providers.map.getStyleUrl()}
            items={items}
            showHousingLayer={showLayer}
            selectedId={selectedId}
            onSelectResidential={setSelectedId}
          />

          <div className="absolute bottom-2 left-2 max-h-48 w-72 overflow-auto rounded bg-white/95 p-2 text-xs shadow" data-testid="district-stats">
            <p className="mb-1 font-semibold">行政区住宅统计</p>
            <ul>
              {districtStats.map((stat) => (
                <li key={stat.name}>{stat.name}: {stat.residentialCount}</li>
              ))}
            </ul>
          </div>

          <div className="absolute right-2 top-2 max-h-64 w-72 overflow-auto rounded bg-white/95 p-2 text-xs shadow" data-testid="residential-list">
            <p className="mb-1 font-semibold">住宅列表</p>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`w-full rounded px-2 py-1 text-left ${selectedId === item.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    {item.name}（{item.district}）
                  </button>
                </li>
              ))}
              {items.length === 0 && <li>暂无匹配住宅</li>}
            </ul>
          </div>
        </div>
        <DetailPanel selected={selected} />
      </section>
    </main>
  );
}
