# 上海住房地图 Web UI（MVP）

基于 **Next.js + TypeScript + MapLibre GL JS** 的上海住房信息地图应用。

## 当前实现状态

- ✅ 上海地图初始化（可平移/缩放）
- ✅ 住宅点位显示 + 聚合（MapLibre cluster）
- ✅ 行政区住宅统计
- ✅ 搜索（住宅名/地址关键词）
- ✅ 住宅详情侧栏（基础信息 + 学区 + 周边资源）
- ✅ Provider 抽象（map/housing/school-district/poi）
- ✅ API 路由（住宅列表、详情、学区、周边）
- ✅ 单元测试、组件测试、Playwright E2E（3条）

## 技术栈

- Frontend: Next.js 15 / React 19 / TypeScript
- Map: MapLibre GL JS
- Geo: Supercluster
- Style: Tailwind CSS
- Test: Vitest + React Testing Library + Playwright

## 项目结构

- `app/`：页面与 API Route Handlers
- `src/components/`：地图与详情组件
- `src/lib/providers/`：数据 provider 实现
- `src/lib/services/container.ts`：provider 注入容器
- `src/data/mock/`：演示数据（住宅/学区/POI）
- `tests/unit`、`tests/components`、`tests/e2e`：测试

## 快速开始

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`

## 环境变量

复制 `.env.example` 并按需调整：

- `NEXT_PUBLIC_MAP_STYLE_URL`：底图样式 URL（默认公开 MapLibre demo）
- `DATA_PROVIDER_MODE`：`mock | file | db`（当前默认 `mock`）
- `RESIDENTIAL_DATA_PATH` / `SCHOOL_DISTRICT_DATA_PATH` / `NEARBY_RESOURCES_DATA_PATH`：本地数据路径
- `DATABASE_URL`：后续切换 PostGIS 时使用

## 运行测试

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

## 数据来源说明（MVP）

- 住宅、学区、POI 均为 **mock/人工整理演示数据**。
- 学区 provider 已做接口抽象，后续可替换为 crawler/file/db 实现。
- 未接入任何需要登录、验证码或条款受限的数据抓取。

## 后续替换点

1. 在 `src/lib/providers/` 新增真实 provider（如 PostGIS、公开 API）。
2. 在 `src/lib/services/container.ts` 切换 provider 注入。
3. 保持 API 与 UI 不变，降低重构成本。
