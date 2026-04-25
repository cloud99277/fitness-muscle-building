# full-cycle-builder Skill 优化分析

> **分析日期**：2026-03-09
> **分析目的**：对照 Agent Toolchain 和 fitness-muscle-building 两个项目的完整开发过程，找出当前 SKILL.md 的不足并优化为通用项目开发 Skill

---

## 一、信息来源汇总

### 1.1 Agent Toolchain (agent-os) 项目贡献的经验

| 来源 | 关键模式 |
|------|---------|
| Phase 0 定位 | 先 Skeleton 骨架确认 → 再填内容，避免返工 |
| Phase 1 IO 契约 | 标准化 Skill 接口（io: frontmatter），通用性基础 |
| Phase 2 安全审计 | 6 维度静态分析 + 3 层误报控制；Zero-Dependency 决策框架 |
| Phase 3 记忆管理 | 3 层记忆模型（L1 身份/L2 会话/L3 知识），ADR 方法论 |
| Phase Value Chain | 每个 Phase 的产出必须是下一 Phase 的燃料 |
| Skeleton-First | 先确认骨架再展开，20 行大纲 > 500 行文档 |
| Gravity Trap Filter | 引力陷阱过滤器：70% 能用现有栈实现就不引新依赖 |
| CTB Description Rule | Capability-Task-Boundary 三段式描述 |
| Methodology-to-Skill | 做三次就自动化：成功模式 → 可复用 Skill |
| Multi-Agent Audit | 调研和审查用不同 Agent/角色，避免自我确认偏差 |
| 3-Layer Review Depth | 设计审查 → 真实数据验证 → 代码审查，三层都跑 |

### 1.2 fitness-muscle-building 项目贡献的经验

| 来源 | 关键模式 |
|------|---------|
| Phase 1-3（V1→V2 方案）| 调研→审查→修订→再审查的完整 ADR 闭环 |
| Phase 5（tracker-app V1）| MVP 范围控制、CSS-led 零依赖方案、核心用户场景驱动 |
| Phase 5.5（tracker-app V2）| 双循环（调研循环+规划循环）编排、Firebase 降级策略 |
| PHASE-5-audit | 审查发现 🔴 范围膨胀 + Canvas 过度工程 + 缺用户场景 |
| COMPETITIVE-RESEARCH-V2 | 从场景倒推 UI（不是从趋势正推）、反面教材分析 |
| PHASE-5.5 白屏 bug | init() 认证状态机覆盖不全 → 踩坑预警 |
| Watchdog 模式 | 长任务监控 + Toast 告警 |
| 双区 UI 设计 | 展示区 Glassmorphism / 操作区高对比度 |

---

## 二、当前 SKILL.md 的问题诊断

### 🔴 结构性问题

| # | 问题 | 根因 | 影响 |
|---|------|------|------|
| 1 | **过度绑定 fitness 项目的特定细节** | 踩坑预警库全是 Firebase/认证/CDN 相关 | 对非 Web 项目完全不适用 |
| 2 | **缺少 Phase 0.5：调研前的项目初始化** | 直接跳到调研，没有 Skeleton-First 流程 | 用户可能在调研前就被庞大的架构吓到 |
| 3 | **缺少 deep-research Skill 的协作** | 调研步骤写了"产出竞品调研文档"但没调用 deep-research | 与现有 Skill 生态脱节 |
| 4 | **质量门评分标准过于刚性** | 调研 ≥ 8.5、规划 ≥ 8.0 是固定数字 | 不同类型项目（游戏/后端/数据分析）可能需要不同阈值 |
| 5 | **缺少 Phase 间价值链检查** | 没有机制确保每 Phase 产出被下一 Phase 消费 | Phase 之间可能割裂 |
| 6 | **编码阶段（Phase 3）太薄** | 规划到编码之间缺少"选做什么"的任务拆解机制 | 直接跳入编码可能导致 scope creep |

### 🟡 设计盲点

| # | 问题 | 说明 |
|---|------|------|
| 1 | 缺少 project-planner Skill 的协作位置 | project-planner 有完整的 Phase 1-5 流程，但 full-cycle-builder 没引用 |
| 2 | 缺少非 Web 项目的踩坑预警 | 后端/CLI/数据项目有完全不同的踩坑点 |
| 3 | 部署阶段过度绑定 GitHub Pages | 很多项目不适用 GitHub Pages |
| 4 | 缺少代码审查（code-review）环节 | Agent OS 强调 3 层审查，但编码后只有浏览器验收 |
| 5 | 全局状态追踪模板过于具体 | 状态表写死了 Phase 5.5 的具体步骤 |
| 6 | 经验沉淀（Phase 5）只有一句调用 project-retrospective | 应该规定沉淀的最小内容要求 |
| 7 | 缺少"中途调整/范围变更"的处理机制 | 开发过程中发现需要加减功能时怎么办 |

### 🟢 优化建议

| # | 建议 |
|---|------|
| 1 | 增加"项目类型判定"在 Phase 0，据此选择后续模板 |
| 2 | 踩坑预警库改为"分类+扩展"机制，而非固定列表 |
| 3 | 增加 IO 契约协作说明 |
| 4 | 补充 frontmatter 的 io: 声明 |

---

## 三、优化方向

### 3.1 通用性改造

- Phase 0 增加项目类型判定 + Skeleton-First 流程
- 踩坑预警库改为分类架构（Web/后端/CLI/数据），每类有通用+可扩展条目
- 部署阶段泛化（GitHub Pages / Firebase / Docker / npm publish / 无部署）
- 质量门阈值可配置

### 3.2 Skill 生态整合

- 明确调用 deep-research（调研阶段）
- 明确调用 project-planner（初始化阶段）
- 增加 code-review（编码后增加代码审查环节）
- 强化 project-retrospective（定义最小沉淀内容）

### 3.3 方法论升级

- 增加 Skeleton-First 原则
- 增加 Phase 间价值链检查
- 增加引力陷阱过滤器
- 增加 3 层审查深度
- 增加范围变更控制机制
- 增加 Methodology-to-Skill 反馈闭环

---

## 四、改造后的 Phase 结构（预览）

```
Phase 0: 上下文理解 + 项目初始化（Skeleton-First）
  ↓
Phase 1: 循环 A — 调研（调用 deep-research）
  ↓ ← 质量门 A（调研收敛）
Phase 2: 循环 B — 规划（调用 project-planner 模板）
  ↓ ← 质量门 B（规划收敛）
Phase 3: 执行编码 + 代码审查
  ↓ ← 质量门 C（浏览器/运行时验收 + 代码审查通过）
Phase 4: 部署上线（适配项目类型）
  ↓ ← 质量门 D（目标环境验收）
Phase 5: 经验沉淀 + Methodology-to-Skill
```
