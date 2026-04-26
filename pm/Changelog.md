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

---

## [2026-04-25] Sprint 2 完成 — 训练双轨

- ✅ **A7**: 新增 GA/GB 健身房极简模板（倒蹬机/器械胸推/高位下拉/腿弯举/坐姿划船/臀桥）
- ✅ V4 模板升级补丁：`_ensureArrays()` 自动补充旧数据缺失的 GA/GB 模板
- ✅ **A4/A5**: 标记为 Sprint 1 已实现（凯格尔+饮水 Modal 已在 Sprint 1 完整交付）

## [2026-04-25] Sprint 3 完成 — 仪表盘 V4 重构

- ✅ **A6**: 仪表盘重构
  - 新增第二行统计卡片：平均睡眠 / 习惯达标% / 今日饮水
  - 新增凯格尔连击提示条
  - 新增快捷入口：记录睡眠 / 记录饮水
  - 标题从"增肌追踪"更名为"身体管理"
- ✅ 训练页双轨选择器：居家哑铃(A/B/C) + 健身房极简(GA/GB)
- ✅ 登录页品牌更新：身体管理 V4 + 全栈健康追踪·多设备同步·科学量化
- ⏭️ **A8**: 5-Tab 导航延期至 Sprint 5

## [2026-04-26] Sprint 4 完成 — 6维度复盘 + PROJECT.md v6

- ✅ **A9**: 周复盘升级为 6 维度
  - 新增睡眠达标天数（23:30前+≥7.5h）
  - 新增凯格尔打卡天数（≥3组/天）
  - 新增数字戒断天数（=睡眠达标）
  - Store 新增 getSleepDaysOnTargetThisWeek / getKegelDaysThisWeek / getDetoxDaysThisWeek
  - 历史复盘列表包含新维度摘要
- ✅ **D2**: PROJECT.md 升级为 v6
  - 标题更新为「全栈身体管理系统 V4」
  - 新增 Phase 6（V4 全栈重构）
  - 更新已有资产表、变更日志
- ✅ 冒烟测试通过：浏览器零错误 + 6维度复盘 UI 验证通过

