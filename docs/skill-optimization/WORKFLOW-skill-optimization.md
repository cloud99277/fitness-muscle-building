# WORKFLOW — full-cycle-builder Skill 通用化优化的完整过程

> **提炼自**：skill-optimization 项目全生命周期（2026-03-09）
> **适用场景**：使用 full-cycle-builder 自身流程（dogfooding）优化方法论/Skill
> **特殊之处**：用 Skill 的流程来优化 Skill 自身

---

## 工作流总览

```
Phase 0: 上下文理解 ──────────────→ 确认优化目标 + 与 agent-os P3 的关系澄清
  ↓
Phase 1: 领域调研 ────────────────→ 7 竞品方案 + 3 类项目路径分析 + 内部案例回溯
  │       ┌──────────────┐
  │       │ 调研 v1       │→ 7.5/10，🔴×3（缺路径分析/Appetite 兼容/内部回溯）
  │       │ 审查          │→ COMPETITIVE-RESEARCH-V1-REVIEW.md
  │       │ 修订 v2       │→ 新增 6 节（路径分析+案例回溯+互斥边界+加载机制等）
  │       │ 再审          │→ 8.9/10 ✅ 质量门 A 通过
  │       └──────────────┘
  ↓
Phase 2: 规划 ────────────────────→ 10 任务优化方案
  │       ┌──────────────┐
  │       │ 规划 v1       │→ 8.5/10，🟡×2，质量门 B 通过
  │       └──────────────┘
  ↓
Phase 3: 执行 ────────────────────→ SKILL.md v2 + 6 个 references/ 子文件
  │       ┌──────────────┐
  │       │ T0-T8 编码    │→ 1 SKILL.md + 6 references/
  │       │ T9 验收       │→ 11/11 验收项通过，质量门 C 通过
  │       └──────────────┘
  ↓
Phase 4: 部署（待决定）───────────→ 待用户决定是否替换原 Skill 文件
  ↓
Phase 5: 经验沉淀 ────────────────→ 本文档
```

**总执行时间**：约 30 分钟

---

## 各 Phase 实际操作记录

### Phase 0：上下文理解

| 步骤 | 动作 | 产出 |
|------|------|------|
| 0.1 | 确认优化目标：通用化 full-cycle-builder | 目标定义 |
| 0.2 | 用户纠正：必须调用 Skill 自身流程（dogfooding） | 方法论修正 |
| 0.3 | 用户追问：与 agent-os P3 编排能力的关系 | 澄清：不同层级（方法论层 vs 数据流层） |

### Phase 1：领域调研

| 步骤 | 动作 | 产出 |
|------|------|------|
| 1.1 | 搜索 3 个外部方向 + 结合内部积累 → 调研 v1 | COMPETITIVE-RESEARCH-V1.md |
| 1.2 | 以架构师视角审查 → 🔴×3 🟡×4 🟢×2，7.5/10 | COMPETITIVE-RESEARCH-V1-REVIEW.md |
| 1.3 | 读 WORKFLOW-fitness-plan.md + 确认 code-review Skill 可用 → 修订 v2 | COMPETITIVE-RESEARCH-V2.md |
| 1.4 | 再审查 → 8.9/10 ✅ 质量门 A 通过 | 通过 |

### Phase 2：规划

| 步骤 | 动作 | 产出 |
|------|------|------|
| 2.1 | 基于调研 v2 结论 → 10 任务优化方案 | OPTIMIZATION-PLAN-V1.md |
| 2.2 | 审查 → 8.5/10 🟡×2（非阻塞）质量门 B 通过 | 通过 |

### Phase 3：执行

| 步骤 | 动作 | 产出 |
|------|------|------|
| 3.1 | 按 T0-T7 逐项编写优化后 SKILL.md | skill-optimization/SKILL.md |
| 3.2 | T8 创建 references/ 子文件 | 6 个文件 |
| 3.3 | T9 自审查：搜索 fitness/Firebase/CDN 关键词 → 11/11 通过 | 质量门 C 通过 |

### Phase 5：经验沉淀

| 步骤 | 动作 | 产出 |
|------|------|------|
| 5.1 | 用户纠正：必须调用 project-retrospective Skill | 方法论修正 |
| 5.2 | 读 project-retrospective SKILL.md → 按 5 Step 执行 | 结构化沉淀 |
| 5.3 | 用户纠正：WORKFLOW 应归属本项目而非 fitness 项目 | 文档归属修正 |
| 5.4 | 产出本文档 | WORKFLOW-skill-optimization.md |

---

## 关键决策复盘

| 决策 | 为什么这么做 | 效果 |
|------|------------|------|
| 不引入 Shape Up 时间砍线 | AI Agent 环境下"时间"含义不同，与质量门冲突 | ✅ 改为规模判定 |
| "竞品调研"泛化为"领域调研" | fitness 的调研本质是知识研究不是竞品分析 | ✅ 扩大适用范围 |
| 踩坑库用 references/ + 显式加载指令 | 不同 Agent 的 references/ 自动加载行为不同 | ✅ 兼容所有 Agent |
| Phase 4 标记可选 | 文档型项目不需要部署 | ✅ 消除不合理约束 |
| 质量门按规模分三档 | Small 被 8.5 卡死不合理 | ✅ 增加弹性 |

---

## 可复用模式

### Skill/方法论优化通用

```
11. Dogfooding 验证 — 用工具/流程自身来优化该工具/流程
    - 在实际执行中暴露流程自身问题
    - 比纯理论分析更能发现"跳步"和"遗漏"
    - 本次验证：Phase 5 自己都没调用 project-retrospective
    - 教训：自己写的流程自己都不遵守 = 流程有问题或执行者有惰性

12. 内部回溯优先 — 优化已有方案时的调研策略
    - 自有项目的执行偏差分析 > 外部竞品对比
    - 外部竞品是别人的环境和约束
    - 内部案例是自己的真实数据，诊断价值更高
    - 本次验证：fitness 和 agent-os 的回溯发现了 3 个关键偏差

13. Skill 接力关系 — 互斥边界的新维度
    - Skill 间不只有互斥（"不要用这个，用那个"）
    - 还有接力（"先用那个完成前序，再用这个完成后续"）
    - 本次发现：project-planner（0→1）→ full-cycle-builder（1→100）

14. 质量门弹性化 — 不同规模项目用不同标准
    - Small / Medium / Large 三档预设
    - Small 项目可跳过调研和 code-review
    - 避免"质量门僵化"导致小项目效率低下
```

---

## 踩坑记录

### 🟡 未调用 Skill 就直接上手

```
出现次数：2 次
第 1 次：Phase 0 上下文理解后直接写分析文档，没按 full-cycle-builder 流程走
第 2 次：Phase 5 经验沉淀直接写 RETROSPECTIVE.md，没调用 project-retrospective
根因：执行者（Agent）的惰性——"我知道怎么做"就跳过了"按流程做怎么做"
教训：Skill 的价值不在于"是否知道该做什么"，而在于"确保不遗漏该做的事"
预防：每个 Phase 开头强制 checklist："该调哪个子 Skill？"
```

### 🟡 工作流文档归属错误

```
出现次数：1 次
场景：Phase 5 经验沉淀本该产出 skill-optimization 项目的 WORKFLOW，却去更新 fitness 的 WORKFLOW
根因：project-retrospective Step 1 说"找 WORKFLOW-*.md"，惯性思维找到了 fitness 的
教训：Step 1 定位目标文档时，必须确认"当前任务的项目目录是哪个"
```

---

## 质量迭代跟踪

| 文档 | v1 | 审查 | v2 | 再审 | 跃升 |
|------|-----|------|-----|------|------|
| 竞品调研 | V1 写完 | 7.5/10 🔴×3 | 新增 6 节 | 8.9/10 ✅ | +1.4 |
| 优化规划 | V1 写完 | 8.5/10 🟡×2 | — | — | 一次过 |

---

## 一句话总结

> 用 full-cycle-builder 的流程来优化 full-cycle-builder 自身（dogfooding），发现了两种最常见的执行偏差：**"知道该调 Skill 但没调"**（惰性）和**"文档归属搞错"**（惯性）。最有价值的调研不是竞品分析而是**内部案例回溯**（从自己的两个项目中发现了比外部竞品更多的改进点）。优化后的核心改造：通用化（去绑定）+ 弹性化（规模判定）+ 生态化（6 个子 Skill）+ 闭环化（Methodology-to-Skill 检查）。

---

## 项目文件清单

| 文件 | 角色 | 状态 |
|------|------|------|
| `ANALYSIS.md` | 初始分析（被流程替代） | 🗄️ 历史 |
| `COMPETITIVE-RESEARCH-V1.md` | 调研 v1（7.5/10） | 🗄️ 历史 |
| `COMPETITIVE-RESEARCH-V1-REVIEW.md` | 调研审查报告 | ✅ 完成 |
| `COMPETITIVE-RESEARCH-V2.md` | 调研 v2（8.9/10） | ✅ 通过 |
| `OPTIMIZATION-PLAN-V1.md` | 规划（8.5/10） | ✅ 通过 |
| `SKILL.md` | **★ 优化后的核心产出** | ✅ 待部署 |
| `RETROSPECTIVE.md` | 未按流程产出的经验总结 | 🗄️ 被本文档替代 |
| `WORKFLOW-skill-optimization.md` | 经验沉淀（本文档） | ✅ 完成 |
| `references/pitfalls/universal.md` | 通用踩坑库 | ✅ 完成 |
| `references/pitfalls/web-frontend.md` | Web 踩坑库 | ✅ 完成 |
| `references/pitfalls/backend-api.md` | 后端踩坑库 | ✅ 完成 |
| `references/pitfalls/cli-tool.md` | CLI 踩坑库 | ✅ 完成 |
| `references/deployment-matrix.md` | 部署方式矩阵 | ✅ 完成 |
| `references/quality-gate-presets.md` | 质量门预设 | ✅ 完成 |
