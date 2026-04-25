# 🏗️ V4 全栈身体管理系统 — 重构规划方案 v2

> **推进模式**: B 型并行（文档 + App 同步推进）
> **PM 管理**: ✅ `project-manager` skill 已导入
> **版本**: v2（基于架构审查修订，修复 🔴×2 + 🟡×3）

---

## 📊 决策确认摘要

| 决策项 | 最终方案 |
|---|---|
| 训练方案 | V3 居家哑铃作为并行轨道 + Gemini 2天极简分化 |
| App 架构 | **在 tracker-app-v2 上原地重构** |
| Firebase | 继续使用 |
| 推进模式 | **B 型并行** — 文档与 App 两个轨道同步推进 |
| 5 Tab 结构 | 仪表盘 / 日常打卡 / 训练 / 趋势 / 设置 |

---

## 🔀 B 型并行推进架构

```
文档轨道（全程独立）:  D1(V4方案文档) ──────→ D2(PROJECT.md v6)

App 轨道（有串行依赖）:
  A1(数据模型) ──→ A2(睡眠) + A3(习惯打卡) ──→ A6(仪表盘)
       │                                            ↑
       └──→ A4(凯格尔) + A5(水合) ────────────────────┘
                                                     ↓
                                    A7(训练模板) → A8(导航) → A9(周复盘)

⚠️ A1 必须先完成，A2-A5 才能开始（串行依赖）
✅ D1 与 App 轨道完全独立，可全程并行
```

---

## 📋 Sprint 1 — 收敛行动（≤3 项）

> 预估周期：2-3 天

### 🎯 行动 1：[D1] 产出 V4 全栈方案文档 `∥ 全程可并行`

**交付物**: `docs/plans/身体调养与增肌方案-V4.md`

**验收 Checklist**:
- [ ] 个人健康档案表（≥8 字段：年龄/身高/体重/BMI/睡眠/饮食/运动/困扰）
- [ ] 三级优先级干预体系各有 ≥2 项具体操作
- [ ] 训练双轨各有完整动作表（含组数/次数/重量）
- [ ] 营养方案含消化适应期时间表（第1-2周 / 第3-4周 / 正常期）
- [ ] 睡眠工程含分钟级睡前流程（22:30-23:30）
- [ ] 每日执行时间轴（工作日 + 周末各一份）

### 🎯 行动 2：[A1] 扩展 store.js 数据模型 `→ 先于 A2/A3`

**改动文件**: `tracker-app-v2/js/store.js`

**数据模型设计**（审查修订版）:
```javascript
// 独立数据源 — 有独立输入 UI
sleepLog: [{ date, bedTime, wakeTime, duration, quality, beforeDeadline }]
kegelLog: [{ date, sets, completed }]
hydrationLog: [{ date, cups, liters }]

// habitLog 改为聚合视图 — 由 store 从各 Log 自动推导
// 仅 kegel 和 detox 需要独立打卡，其余自动推算
// getSleepHabit(date) → sleepLog 中 beforeDeadline === true
// getProteinHabit(date) → nutritionLog 中 protein >= 75
// getWaterHabit(date) → hydrationLog 中 liters >= 2.0
```

**兼容策略**: `_ensureArrays()` 新增 `sleepLog/kegelLog/hydrationLog` 兜底

**验收标准**: 
- [ ] 新字段在 `_getDefault()` 和 `_ensureArrays()` 中均有处理
- [ ] V2 现有 localStorage 数据加载无报错
- [ ] Firebase 写入/读取新字段正常

### 🎯 行动 3：[A2+A3] 睡眠追踪 + 习惯打卡 `← 依赖 A1 完成`

**改动文件**: `tracker-app-v2/js/components.js` + `css/style.css` + `js/app.js`

**临时路由**: 新模块暂放"更多"菜单（Sprint 3 迁移到新 Tab）

**验收标准**:
- [ ] 睡眠记录 Modal：输入入睡/起床时间 → 自动算时长 → 标记 23:30 前入睡
- [ ] 习惯打卡页面：5 项打卡（睡眠/凯格尔/饮水/蛋白/戒断）
- [ ] 其中 睡眠/蛋白/饮水 自动从各 Log 推导，凯格尔/戒断 手动打卡
- [ ] 打卡数据持久化到 localStorage + Firebase
- [ ] 浏览器控制台零 JS 错误

---

## 📁 PM 文件体系

| 文件 | 状态 |
|---|---|
| Current-State.md | ✅ 已填充 |
| Sprint-Backlog.md | ✅ 已填充 |
| Decision-Log.md | ✅ 已填充 |
| sprint-status.md | ✅ 已填充 |
| Changelog.md | ⏳ 待首次更新 |
| **execution-plan.md** | ✅ v2 本文件 |
| reviews/execution-plan-audit.md | ✅ 审查报告 |

---

## 后续 Sprint 预览

| Sprint | 行动 | 预估 | 依赖 |
|---|---|---|---|
| Sprint 2 | A4 凯格尔 + A5 水合 + A7 训练模板 | ~2天 | Sprint 1 |
| Sprint 3 | A6 仪表盘重构 + A8 导航(5 Tab) | ~2天 | Sprint 2 |
| Sprint 4 | A9 周复盘升级 + D2 PROJECT.md v6 + 冒烟测试 | ~1天 | Sprint 3 |

---

## 审查修订记录

| # | 审查问题 | 类型 | 修订内容 |
|---|---|---|---|
| 1 | A1→A2/A3 串行依赖未标注 | 🔴 | 明确标注执行顺序 + 依赖箭头 |
| 2 | D1 验收标准模糊 | 🔴 | 改为 6 项量化 checklist |
| 3 | habitLog 与其他 Log 冗余 | 🟡 | 改为聚合视图，仅 kegel/detox 独立打卡 |
| 4 | 缺 V2→V4 迁移策略 | 🟡 | 补充 _ensureArrays() 兼容处理 |
| 5 | 5 Tab 结构未定义 | 🟡 | 预定义结构 + Sprint 1 临时路由方案 |
