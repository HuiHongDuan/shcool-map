# 数据源策略与合规边界（实施状态）

## 当前数据模式

- `DATA_PROVIDER_MODE=mock`
- 住宅：`src/data/mock/residential.geojson`
- 学区：`src/data/mock/school-districts.json`
- 周边资源：`src/data/mock/nearby-resources.json`

## 合规说明

- 当前版本不依赖登录态、验证码或受限接口。
- 学区来源采用“人工整理 + provider 抽象”方案。
- 后续若接入 crawler provider，必须遵循目标站点条款。

## 替换策略

1. 新增 provider 实现（file/db/crawler）。
2. 在容器层切换注入。
3. API 与 UI 保持稳定，降低迁移成本。
