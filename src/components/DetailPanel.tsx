'use client';
import React from 'react';

import { useEffect, useState } from 'react';
import { fetchNearby, fetchSchoolDistrict } from '@/lib/api-client';
import type { NearbyResource, ResidentialCommunity, SchoolDistrictInfo } from '@/types/domain';

function CategoryBlock({ title, items }: { title: string; items: NearbyResource[] }) {
  return (
    <section>
      <h4 className="font-semibold">{title}</h4>
      {items.length === 0 ? <p className="text-sm text-gray-500">暂无数据</p> : <ul className="text-sm">{items.map((item) => <li key={item.id}>{item.name}（约{item.distanceMeters}米）</li>)}</ul>}
    </section>
  );
}

export function DetailPanel({ selected }: { selected?: ResidentialCommunity }) {
  const [school, setSchool] = useState<SchoolDistrictInfo | null | undefined>(undefined);
  const [nearby, setNearby] = useState<NearbyResource[] | undefined>(undefined);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
    if (!selected) return;
    setSchool(undefined);
    setNearby(undefined);
    Promise.all([fetchSchoolDistrict(selected.id), fetchNearby(selected.id)])
      .then(([schoolData, nearbyData]) => {
        setSchool(schoolData);
        setNearby(nearbyData);
      })
      .catch(() => setError('加载详情失败，请稍后重试'));
  }, [selected]);

  if (!selected) {
    return <aside className="h-full w-full border-l bg-white p-4">请选择地图上的住宅点位查看详情。</aside>;
  }

  return (
    <aside className="h-full w-full overflow-auto border-l bg-white p-4" data-testid="detail-panel">
      <h3 className="text-lg font-bold">{selected.name}</h3>
      <p className="text-sm text-gray-600">{selected.district}</p>
      <p className="text-sm">地址：{selected.address ?? '暂无数据'}</p>
      <p className="text-sm">经纬度：{selected.coordinates[0]}, {selected.coordinates[1]}</p>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <section className="mt-4">
        <h4 className="font-semibold">学区信息</h4>
        {school === undefined ? (
          <p className="text-sm text-gray-500">加载中...</p>
        ) : school === null ? (
          <p className="text-sm text-gray-500">暂无数据</p>
        ) : (
          <div className="text-sm">
            <p>{school.schoolDistrictName}</p>
            <p>小学：{school.primarySchools.join('、') || '暂无数据'}</p>
            <p>中学：{school.middleSchools.join('、') || '暂无数据'}</p>
          </div>
        )}
      </section>

      <section className="mt-4 space-y-2">
        <h4 className="font-semibold">周边公共资源</h4>
        {nearby === undefined ? (
          <p className="text-sm text-gray-500">加载中...</p>
        ) : (
          <>
            <CategoryBlock title="交通" items={nearby.filter((item) => item.category === 'transport')} />
            <CategoryBlock title="医院" items={nearby.filter((item) => item.category === 'hospital')} />
            <CategoryBlock title="商超" items={nearby.filter((item) => item.category === 'mall')} />
          </>
        )}
      </section>
    </aside>
  );
}
