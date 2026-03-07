# AGENTS.md

你是负责实现“上海住房地图 Web UI 应用”的代码代理。你的目标不是只写静态页面，而是交付一个可运行、可测试、可继续扩展的数据驱动应用。

## 1. 总目标

构建一个基于上海地图的住房信息浏览应用，满足以下核心能力：

1. 使用中国可公开免费地图资源作为底图。
2. 高亮民用住宅信息。
3. 地图缩放/平移时，住宅点位支持聚合与分散展示。
4. 选中住宅后，展示学区、交通、医院、商超等周边公共资源信息。
5. 学区信息支持通过公开页面采集或由人工导入结构化数据。
6. 交付最小可运行版本（MVP）与自动化测试。

## 2. 实施原则

### 2.1 优先级

实现顺序必须遵循：

1. 地图基础能力（缩放、拖拽、底图加载）
2. 住宅图层与聚合
3. 住宅详情侧边栏
4. 周边公共资源查询
5. 学区信息接入
6. 自动化测试、性能优化、错误兜底

### 2.2 技术选型约束

默认采用以下技术栈，除非遇到无法落地的问题：

- 前端：Next.js 14+ / React / TypeScript
- 地图：MapLibre GL JS
- 地理检索：Turf.js + Supercluster（前端聚合）或 PostGIS（后端聚合）
- UI：Tailwind CSS + shadcn/ui
- 后端：Next.js Route Handlers 或独立 Node API
- 数据库：PostgreSQL + PostGIS（优先），也允许先用 SQLite + GeoJSON 做 MVP
- 测试：Vitest + React Testing Library + Playwright

### 2.3 数据策略

- 地图底图优先使用 OpenStreetMap 瓦片或兼容公开资源，并确认国内网络可访问性。
- 民用住宅数据、学区数据、POI 数据必须区分：
  - 可直接在线拉取的公开数据
  - 需预处理后导入的静态数据
  - 暂时无法稳定获取时，用 mock 数据先完成主流程
- 不要默认使用收费地图 SDK 作为唯一实现路径。
- 不要把违法爬取、绕过登录、破解接口作为方案。

### 2.4 学区信息规则

- 学区信息优先采用“人工导入结构化数据 + 后续可替换抓取器”的设计。
- 若公开页面允许抓取，可实现可插拔采集器。
- 若目标网站存在登录、验证码、反爬或法律/服务条款限制，必须退回为人工导入 CSV/JSON 的方案。
- 代码中保留 school-district provider interface，避免后续重构。

## 3. 交付物要求

你必须产出：

1. 可运行的项目代码
2. 清晰的 README
3. 示例数据（至少一份住宅 GeoJSON/CSV、一份学区 JSON、一份 POI JSON）
4. 自动化测试
5. 地图交互说明
6. 环境变量说明

## 4. MVP 范围

MVP 必须包括：

- 上海范围地图初始化
- 住宅点位展示
- 点聚合与展开
- 行政区级别住宅数量统计展示
- 点击住宅查看详情
- 详情中展示：
  - 小区/住宅名称
  - 行政区
  - 经纬度
  - 学区信息（如有）
  - 周边交通、医院、商超（如有）
- 基础搜索（按住宅名或地址关键词）
- 至少 3 条 Playwright E2E 测试

## 5. 非目标

首版不要把以下内容作为阻塞项：

- 真实房价估值
- 复杂路线规划
- 用户登录/权限系统
- 支付功能
- 原生移动端 App
- 实时房源交易能力

## 6. 实现细节建议

### 6.1 地图表现

- 默认中心定位到上海市中心。
- 使用聚合圆点 + 数量标签展示住宅分布。
- 放大后逐步从区级/街道级聚合过渡到单住宅点位。
- 选中住宅后使用侧边抽屉，而非地图 popup 承载全部详情。

### 6.2 数据模型

至少设计以下实体：

- `ResidentialCommunity`
- `AdministrativeDistrict`
- `SchoolDistrictInfo`
- `NearbyResource`

### 6.3 API 设计

建议提供：

- `GET /api/residential?bbox=&zoom=&keyword=`
- `GET /api/residential/:id`
- `GET /api/residential/:id/nearby`
- `GET /api/residential/:id/school-district`
- `POST /api/import/school-district`（仅开发环境或脚本）

## 7. 质量门槛

提交代码前必须确认：

- `npm run lint` 通过
- `npm run typecheck` 通过
- `npm run test` 通过
- `npm run test:e2e` 至少有 3 个关键场景通过
- 地图首屏渲染可用
- 无明显运行时报错

## 8. 决策规则

如果文档之间有冲突，优先级如下：

1. `ACCEPTANCE_CRITERIA.md`
2. `PRD.md`
3. `ARCHITECTURE.md`
4. `IMPLEMENTATION_PLAN.md`
5. 你自己的实现偏好

当数据源不可用时，先保证产品闭环，再在 README 中明确写出替换点。
