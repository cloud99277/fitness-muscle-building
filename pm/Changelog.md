# Changelog

> **规则**: 只追加，不重写历史

---

## [2026-04-25] Sprint 1 完成 — V4 全栈重构首批交付

### 文档轨道
- ✅ **D1**: 产出 `docs/plans/身体调养与增肌方案-V4.md`（10章，覆盖全栈健康管理）

### App 轨道
- ✅ **A1**: `store.js` 扩展 +154 行
  - 新增 sleepLog / kegelLog / hydrationLog 数据结构
  - 新增 habit 聚合视图（getHabitsForDate / getHabitScoreForDate / getHabitScoreThisWeek）
  - `_ensureArrays()` 兼容 V2 数据
  - `getDataSummary()` 新增 3 个计数字段
- ✅ **A2**: 睡眠追踪 Modal（时间输入 + 时长计算 + 23:30达标判定）
- ✅ **A3**: 习惯打卡页面（5项打卡 + 评分 + 进度条 + 自动/手动标签）
- ✅ 凯格尔 Modal（组数打卡 + 3圆形按钮 + 连击天数）
- ✅ 饮水 Modal（+/-杯数 + 升数换算 + 达标判定）
- ✅ 更多页面新增 5 个菜单入口

### PM 体系
- ✅ 初始化 5 文件 PM 管理体系
- ✅ 执行计划 v1 → 审查(7.5) → 修订 v2(9.0) → 通过
