# 数据源策略与合规边界

## 1. 地图底图

优先使用公开免费、可用于 Web 地图展示的资源。

建议优先级：

1. OpenStreetMap 相关公开瓦片/样式
2. 可与 MapLibre 兼容的公开矢量或栅格瓦片
3. 自部署瓦片服务（后续可选）

要求：

- 必须保留 attribution
- 必须将瓦片 URL 与样式配置抽到环境变量或配置文件
- 不要把某个不稳定瓦片服务硬编码为唯一来源

## 2. 民用住宅数据

理想来源：

- 公开 GeoJSON/CSV 数据
- OpenStreetMap 中带有 residential/community/housing 语义的数据（需二次清洗）
- 人工整理数据集

工程要求：

- 必须支持 mock 数据，以便先完成 UI
- 数据结构尽量统一为 GeoJSON + 附属属性 JSON

## 3. 行政区边界数据

可采用公开行政区 GeoJSON 数据。

要求：

- 坐标系在导入时统一
- 保留 district code / district name 字段

## 4. 周边公共资源数据

推荐做法：

- 优先接入公开 POI 数据或整理后的本地文件
- 数据类型至少覆盖：交通、医院、商超
- 后端可根据住宅坐标做一定半径范围查询

## 5. 学区信息来源

学区信息属于敏感且更新频繁的数据域，必须采用“可替换 provider”设计。

### 5.1 允许方案

- 手工整理结构化数据后导入 JSON/CSV
- 从公开可访问页面采集，并保留来源 URL 与抓取时间
- 使用半自动脚本辅助整理

### 5.2 禁止方案

- 绕过登录
- 破解验证码
- 伪造身份访问受限数据
- 抓取明显禁止自动采集的页面作为首版核心依赖

### 5.3 工程落地建议

- `school_districts.json` 作为首版默认来源
- `scripts/import-school-districts.ts` 负责导入
- `providers/school-district/` 下保留 `fileProvider` 与 `crawlerProvider` 接口位置

## 6. 坐标与距离

要求：

- 所有地图展示统一为 WGS84 / Web Mercator 兼容流程
- 距离计算需注明近似规则（如使用 Turf.js 或 PostGIS ST_DistanceSphere）

## 7. 失败兜底

当以下情况发生时，系统必须仍可运行：

- 学区数据缺失
- 某类 nearby 资源缺失
- 外部瓦片源临时不可用（应支持替换配置）
- 线上抓取流程未启用
