# ACCEPTANCE_CRITERIA

## A. 地图基础
- [x] 上海范围初始化
- [x] 地图可平移/缩放
- [x] 显示公开底图并保留 attribution

## B. 住宅图层与聚合
- [x] 住宅点位展示
- [x] 低层级聚合/高层级展开
- [x] 行政区住宅数量统计

## C. 详情能力
- [x] 点击住宅显示详情
- [x] 展示学区信息
- [x] 展示交通/医院/商超
- [x] 空数据提示“暂无数据”

## D. API 能力
- [x] `GET /api/residential`
- [x] `GET /api/residential/:id`
- [x] `GET /api/residential/:id/nearby`
- [x] `GET /api/residential/:id/school-district`

## E. 测试
- [x] 单元测试
- [x] 页面渲染测试
- [x] 至少 3 条 Playwright E2E

## F. 合规
- [x] 使用 mock/人工导入数据完成 MVP
- [x] 学区 provider 可替换
- [x] 未引入违规抓取实现
