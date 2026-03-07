# 技术架构建议

## 1. 总体架构

建议采用单仓应用：

- `Next.js App Router` 负责 Web UI 与 API 路由
- `MapLibre GL JS` 负责地图渲染
- `PostgreSQL + PostGIS` 负责空间存储与地理查询
- `Playwright` 负责端到端测试

也允许先做简化版：

- 使用本地 `GeoJSON` + `JSON` 作为数据源
- 周边资源查询由前端使用 Turf.js 计算距离
- 后续再迁移到 PostGIS

## 2. 推荐目录结构

```text
src/
  app/
    page.tsx
    api/
      residential/
      nearby/
      school-district/
  components/
    map/
    sidebar/
    search/
    legend/
  features/
    residential/
    school-district/
    nearby-resources/
  lib/
    map/
    geo/
    db/
    providers/
  types/
  data/
    mock/
  styles/
```

## 3. 前端架构

### 3.1 页面层

首页主要由三部分组成：

- Map Canvas
- Search Bar
- Detail Drawer

### 3.2 状态管理

建议使用：

- React state + context 作为 MVP
- 若复杂度升高，可切到 Zustand

至少维护以下状态：

- 当前地图视口
- 当前缩放级别
- 当前选中住宅
- 当前搜索关键词
- 当前图层开关

## 4. 地图与空间方案

## 4.1 地图底图

优先方案：

- OpenStreetMap 瓦片
- 或兼容 MapLibre 的公开瓦片源

注意：

- 地图展示必须标注适当 attribution
- 若直接访问海外瓦片不稳定，需要在 README 中预留可替换 tile server 配置

## 4.2 住宅数据展示

住宅数据建议以 GeoJSON FeatureCollection 形式组织：

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [121.4737, 31.2304]
      },
      "properties": {
        "id": "res-001",
        "name": "示例小区",
        "district": "浦东新区",
        "address": "示例地址"
      }
    }
  ]
}
```

## 4.3 聚合实现

优先方案：

- MapLibre source 自带 cluster 功能实现前端聚合

增强方案：

- 使用 `Supercluster` 在服务端或共享层处理
- 使用 PostGIS 做 bbox + zoom 分级聚合

## 4.4 行政区统计

行政区图层建议采用 Polygon/GeoJSON 数据。

展示方式：

- 在低 zoom 下显示区边界
- 按区统计住宅数量
- hover/click 显示统计 tooltip 或侧边统计卡片

## 5. 数据层设计

## 5.1 核心表

### residential_communities

- id
- name
- district
- address
- longitude
- latitude
- geom
- metadata_json

### school_districts

- id
- residential_id
- school_name
- school_stage
- source
- source_url
- notes
- updated_at

### nearby_resources

- id
- residential_id
- name
- category
- subcategory
- distance_meters
- address
- longitude
- latitude
- geom

### districts

- id
- name
- geom
- residential_count_cache

## 5.2 Provider 抽象

应设计 provider 接口：

- `ResidentialProvider`
- `SchoolDistrictProvider`
- `NearbyResourceProvider`

这样可以支持：

- mock provider
- file provider
- crawler/import provider
- db provider

## 6. API 层建议

### GET /api/residential

参数：

- `bbox`
- `zoom`
- `keyword`
- `district`

返回：

- 当前视口内住宅点位或聚合结果

### GET /api/residential/:id

返回住宅详情。

### GET /api/residential/:id/nearby

返回该住宅附近的公共资源分类结果。

### GET /api/residential/:id/school-district

返回学区信息。

### POST /api/import/*

仅用于开发环境导入结构化数据。

## 7. 学区信息接入策略

### 7.1 推荐做法

- 先定义统一数据结构
- 优先支持本地 JSON/CSV 导入
- 后续如公开页面可合法抓取，再实现独立 importer

### 7.2 不建议做法

- 直接把目标网站页面耦合进前端运行时
- 绕过登录验证
- 依赖不稳定 HTML 结构作为唯一来源

## 8. 测试架构

### 单元测试

测试：

- 格式转换
- 距离计算
- 聚合工具函数
- provider 返回结果

### 组件测试

测试：

- 地图图例
- 详情抽屉
- 搜索结果列表

### E2E 测试

至少覆盖：

1. 首页地图成功加载
2. 点击住宅打开详情
3. 搜索后地图定位与详情联动

## 9. 部署建议

- 前端/API：Vercel 或自托管 Node
- 数据库：Neon / Supabase(Postgres) / 自建 PostGIS
- 静态数据：对象存储或仓库内 mock 目录
