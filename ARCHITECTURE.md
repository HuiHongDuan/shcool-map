# ARCHITECTURE

## 1. 系统分层

- **UI 层**：`app/page.tsx` + `src/components/*`
- **API 层**：`app/api/residential/**`
- **Provider 层**：`src/lib/providers/*`
- **数据层**：`src/data/mock/*`

## 2. Provider 抽象

统一接口定义在 `src/types/providers.ts`：

- `MapProvider`
- `HousingProvider`
- `SchoolDistrictProvider`
- `PoiProvider`

当前容器 `src/lib/services/container.ts` 注入 mock 实现，可平滑替换成 file/db/crawler。

## 3. 地图与聚合

- 地图：MapLibre GL JS
- 前端聚合：
  - MapLibre source cluster（渲染层）
  - Supercluster（调试与可验证聚合状态展示）
- 当前视口逻辑：MVP 先返回全集 + 关键词过滤，后续可在 API 接入 bbox + zoom 优化。

## 4. 数据流

1. 页面加载调用 `GET /api/residential`
2. 选择住宅后调用：
   - `GET /api/residential/:id/school-district`
   - `GET /api/residential/:id/nearby`
3. 详情面板按分类展示资源，并对空数据显示“暂无数据”。
