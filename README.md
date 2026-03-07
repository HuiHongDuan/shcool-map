# Shanghai Housing Map Codex Starter Kit

这是一套可直接上传给 Codex 的启动文件，目标是让 Codex 根据文档自动开始实现并测试一个“基于上海地图查看住房相关信息”的 Web UI 应用。

## 文件说明

- `AGENTS.md`：给 Codex/代码代理的执行指令与边界条件。
- `PRD.md`：产品需求说明。
- `ARCHITECTURE.md`：推荐技术架构与数据流。
- `IMPLEMENTATION_PLAN.md`：分阶段开发计划。
- `ACCEPTANCE_CRITERIA.md`：验收标准。
- `DATA_SOURCE_POLICY.md`：地图与学区/公共资源数据的来源策略与合规约束。
- `package.json`：前端/后端一体化开发依赖与脚本定义。
- `.env.example`：环境变量模板。
- `docker-compose.yml`：本地 PostGIS 开发环境。
- `.nvmrc`：Node 版本约束。

## 建议你上传给 Codex 的最小文件集

至少上传：

1. `AGENTS.md`
2. `PRD.md`
3. `ARCHITECTURE.md`
4. `IMPLEMENTATION_PLAN.md`
5. `ACCEPTANCE_CRITERIA.md`
6. `DATA_SOURCE_POLICY.md`
7. `package.json`
8. `.env.example`
9. `docker-compose.yml`
10. `.nvmrc`

## 建议项目目标

让 Codex 生成一个 MVP：

- 以上海底图为基础；
- 支持缩放、拖拽、住宅点位高亮；
- 支持点聚合与按行政区统计；
- 点击住宅后展示学区信息与周边公共资源；
- 提供基础自动化测试；
- 在缺失正式住宅数据时，支持导入 GeoJSON/CSV 假数据先完成 UI 与交互闭环。

## 建议执行顺序

1. 先完成地图 UI、图层、聚合、侧边栏；
2. 再接入住宅与 POI 数据；
3. 再接入学区数据抓取/导入流程；
4. 最后补全 E2E 测试与性能优化。
