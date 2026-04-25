# full-cycle-builder 优化 — 竞品/技术调研报告

> **调研日期**：2026-03-09
> **调研目的**：为 full-cycle-builder Skill 的通用化优化提供方向
> **服务决策**：当前 Skill 过度绑定 fitness-muscle-building 项目场景，需要识别通用化方向
> **状态**：v2（审查修订版）
> **调研来源**：7 个竞品方案 + 2 个内部项目完整回溯

---

## 一、调研对象

| 类型 | 竞品/方案 | 选取原因 |
|------|----------|---------|
| 方法论-重型 | Shape Up (Basecamp) | 成熟的"固定时间、可变范围"开发周期方法论 |
| 方法论-轻型 | ADR（Audit-Driven Refinement）| 我们自己创造的方法论，已有成功案例 |
| AI 框架-重型 | CrewAI | 角色驱动的多 Agent 编排，有 Planning 阶段 |
| AI 框架-轻型 | AI-SDLC (ai-sdlc.io) | 声明式控制的 AI 开发生命周期 |
| 内部系统 | project-planner + project-audit 协作链 | 当前 Agent Toolchain 已有的规划-审查闭环 |
| 反面教材 | 传统瀑布式 | 质量门过重导致交付缓慢 |
| 反面教材 | "AI 自动化一切" | AI 同时当计划者+执行者+审查者 |

---

## 二、核心方案对比

### 2.1 对比矩阵

| 维度 | Shape Up | CrewAI | AI-SDLC | ADR (我们的) | 当前 full-cycle-builder | **实现复杂度** |
|------|----------|--------|---------|-------------|----------------------|------|
| **编排层级** | 项目周期 | 任务级 | 全生命周期 | 文档级 | 项目周期 | — |
| **质量控制** | 固定时间+可变范围 | Manager Agent 验证 | CI/CD 质量门 | 🔴🟡🟢 三层审查 | 评分质量门 | — |
| **人在回路** | ✅ Betting Table | 可选 HiTL | 可选 | ✅ 每轮审查 | ✅ 质量门人工判定 | — |
| **范围控制** | ✅ Appetite 机制 | ❌ 无 | ⚠️ 弱 | ⚠️ 靠审查发现 | ⚠️ 靠反模式 | — |
| **回退机制** | ❌ 超时即砍 | ❌ 无 | ✅ 回退 | ✅ 修订→再审查 | ✅ 质量门回退 | — |
| **经验沉淀** | ✅ Cool-down | ❌ 无 | ❌ 无 | ✅ retrospective | ✅ Phase 5 | — |
| **通用性** | ✅ 高 | ✅ 高 | ✅ 高 | 🟡 中 | 🔴 低 | — |

> v1→v2 变更（来源：🟢1）：新增"实现复杂度"列，在下方借鉴清单中标注。

### 2.2 各方案亮点与借鉴

#### Shape Up — Appetite 机制

> v1→v2 变更（来源：🔴2）：分析 Appetite 与质量门的兼容性。

Shape Up 的 Appetite 机制：
- 开始前定义"愿意投多少时间"（小批量 2 周 / 大批量 6 周）
- 时间到了范围砍到能交付为止

**Appetite 与质量门的兼容性分析**：

| 场景 | Appetite 说 | 质量门说 | 冲突？ | 解法 |
|------|------------|---------|--------|------|
| 时间够 + 质量通过 | ✅ 继续 | ✅ 通过 | 无 | 正常流程 |
| 时间够 + 质量没过 | ✅ 继续 | 🔄 回退修订 | 无 | 正常回退 |
| **时间到 + 质量没过** | ❌ 砍范围交付 | 🔄 继续修 | **冲突** | 见下方 |
| 时间到 + 质量通过 | ✅ 完成 | ✅ 通过 | 无 | 正常流程 |

**冲突解法**：在 AI Agent 环境下，"时间"的含义不是工时，而是**项目规模预算**（Scope Budget）。因此：

- **不引入严格的时间砍线**（Shape Up 的砍线不适合 AI Agent 场景）
- **改为引入"项目规模判定"**：在 Phase 0 判定项目是 Small（1 天）/ Medium（3 天）/ Large（1 周+）
- **规模影响质量门宽松度**：
  - Small → 质量门 A 可跳过（无需正式调研），质量门 B 阈值降为 7.5
  - Medium → 标准流程
  - Large → 增加代码审查环节（质量门 C+）
- **实现复杂度**：低（Phase 0 加几行判定逻辑 + 质量门表增加一列）

#### CrewAI — 角色分离

CrewAI 给每个 Agent 定义 Role + Goal + Backstory，通过 Manager Agent 协调。

**对我们的启示**：
- 当前 Skill 通过调用不同子 Skill 实现角色切换（调研员=deep-research，审查员=project-audit 等）
- **无需引入新的角色系统，当前子 Skill 调用已覆盖**
- **实现复杂度**：零（已有）

#### AI-SDLC — 声明式控制

**对我们的启示**：
- 质量门阈值可以参数化（声明在 Phase 0），而不是硬编码在 Skill 中
- **实现复杂度**：低（Phase 0 的配置表）

---

## 三、项目类型执行路径差异分析

> v1→v2 新增（来源：🔴1）

### 3.1 三类已验证项目的实际路径比较

| Phase | Web 前端应用 (fitness tracker) | 工具链/框架 (agent-os) | Skill 优化（当前任务，文档型） |
|-------|------|------|------|
| **Phase 0 上下文** | ✅ 确认目标/约束/用户 | ✅ 确认现状/缺口/竞品 | ✅ 确认优化目标 |
| **Phase 1 调研** | ✅ 竞品 App 调研 | ✅ 竞品框架调研 | ✅ 方法论调研 |
| **Phase 2 规划** | ✅ 功能规划 + 任务清单 | ✅ 架构设计 + Phase 路线图 | ✅ 优化方案规划 |
| **Phase 3 编码** | ✅ 写 HTML/CSS/JS | ✅ 写 Python 脚本 + SKILL.md | ✅ 写优化后的 SKILL.md |
| **Phase 4 部署** | ✅ GitHub Pages 部署 | ⚠️ 部署=安装到 ~/.ai-skills/ | ❌ 无需正式部署 |
| **Phase 5 沉淀** | ✅ WORKFLOW 文档 | ✅ PROJECT.md 更新 | ✅ 踩坑/模式沉淀 |

### 3.2 差异总结

| 差异维度 | 说明 | 对 Skill 的影响 |
|---------|------|----------------|
| **Phase 4 可选** | 非部署型项目（文档/设计/方案）无需部署阶段 | Phase 4 需要标记为可选 |
| **质量门 C 差异很大** | Web=浏览器验收；工具链=脚本通过+安全审计；文档=审查通过 | 质量门 C 需要按项目类型分支 |
| **调研深度差异** | 大项目需要 Full Mode 调研；小项目 Quick Mode 即可 | 调研阶段需要分档 |
| **Phase 结构一致** | 核心 5 Phase 结构对所有类型都适用 | ✅ 无需改变 Phase 结构 |

### 3.3 结论

**5 Phase 结构不需要改变，但每个 Phase 内部需要"项目类型分支"：**
- Phase 0：增加项目类型判定（Web / 工具链 / 文档型 / 数据分析 / 其他）
- Phase 1：调研深度分档（Full / Quick / Skip）
- Phase 3：验收标准分支（浏览器测试 / 脚本测试 / 审查通过）
- Phase 4：标记可选（有些项目不需要部署）

---

## 四、内部案例执行偏差回溯

> v1→v2 新增（来源：🔴3）

### 4.1 fitness-muscle-building 项目回溯

**实际执行路径** vs **full-cycle-builder 定义的路径**：

| full-cycle-builder 定义 | fitness 实际执行 | 偏差 | 偏差原因 |
|------------------------|-----------------|------|---------|
| Phase 0 上下文理解 | Phase 2 项目初始化 | 步骤对应但名称不同 | full-cycle-builder 尚未被创建 |
| Phase 1.1 调研 v1 | Phase 1 增肌知识研究 | 对应，但 fitness 的调研不是竞品调研 | 领域知识研究 ≠ 竞品分析 |
| Phase 1.2-1.4 审查循环 | Phase 3-5 审查+修订+再审查 | ✅ 完全对应 | ADR 方法论一致 |
| Phase 2 规划 | Phase 5 PHASE-5.md | ✅ 对应 | — |
| Phase 3 编码 | Phase 5.4-5.5 编码 | ✅ 对应 | — |
| Phase 3.2 踩坑预警检查 | **未执行** | ❌ 缺失 | 当时没有踩坑库 |
| Phase 4 部署 | Phase 5.5.10-12 部署 | ✅ 对应 | — |
| Phase 5 经验沉淀 | WORKFLOW 文档 | ✅ 对应 | — |

**关键发现**：
1. **调研不一定是竞品调研**——fitness 的调研是"增肌科学知识研究"，不是"同类 App 竞品分析"。Phase 1 应该泛化为"领域调研"而非"竞品调研"
2. 踩坑预警检查在 fitness 中未执行，但白屏 bug 证明它确实有价值

### 4.2 agent-os 项目回溯

**project-planner 的 8 Phase** vs **full-cycle-builder 的 5 Phase**：

| project-planner | full-cycle-builder | 映射关系 |
|----------------|-------------------|---------|
| Phase 1 信息获取 | Phase 1 调研 | ✅ 对应 |
| Phase 2 体系对接 | Phase 0 上下文 | ≈ 对应（更精细） |
| Phase 3 项目初始化 + Skeleton | Phase 0 上下文 | ❌ 缺 Skeleton-First |
| Phase 3.5 调研-审查循环 | Phase 1.2-1.4 审查循环 | ✅ 对应 |
| Phase 4 多角色审查 | Phase 2.2 审查规划 | ✅ 对应 |
| Phase 4.5 设计迭代 | Phase 2.3-2.4 修订+质量门 | ✅ 对应 |
| **Phase 5-7 方法论→Skill** | **缺失** | ❌ 重要缺失 |
| Phase 8 审查驱动实现 | Phase 3 编码 | ✅ 对应 |

**关键发现**：
1. **缺失 Skeleton-First**——project-planner 的 Phase 3 有"先骨架后内容"流程，full-cycle-builder 没有
2. **缺失 Methodology-to-Skill 闭环**——project-planner 的 Phase 5-7 描述了"成功模式→可复用工具"的转化过程，full-cycle-builder 的 Phase 5 只是经验沉淀，没有"是否应该从本次经验中提炼新 Skill"的检查点

### 4.3 WORKFLOW-fitness-plan.md 中未被 SKILL.md 覆盖的模式

> v1→v2 新增（来源：🟡4）

从 WORKFLOW 文档的 10 个可复用模式中，以下 4 个未被当前 SKILL.md 覆盖：

| 模式 | WORKFLOW 原文 | 当前 SKILL 覆盖？ |
|------|-------------|----------------|
| **"V1 是好的起点，不是终点"** | 任何专业方案第一稿都有结构性盲点 | ❌ 没显式提醒 |
| **"执行系统 vs 说明书"** | 告诉你该怎么做 + 遇到障碍怎么处理 + 如何判断效果 | ❌ 没提到产出物标准 |
| **v1→v2 平均提升 ~2 分规律** | 审查不是挑毛病，是帮你发现自己看不到的问题 | ❌ 没量化预期 |
| **"你以为测过的路径 ≠ 所有路径"** | 白屏 bug 来自认证状态机覆盖不全 | ⚠️ 有但太具体（直接写 Firebase） |

---

## 五、project-planner 与 full-cycle-builder 的互斥边界

> v1→v2 新增（来源：🟡2）

| 维度 | project-planner | full-cycle-builder |
|------|----------------|-------------------|
| **适用场景** | 从灵感/文章到项目雏形 | 从确定的项目到部署上线 |
| **起点** | 一篇文章/一个想法 | 已有 PROJECT.md 或明确目标 |
| **终点** | PROJECT.md v2 + 经验沉淀 | 部署上线 + 经验沉淀 |
| **包含编码？** | ❌ 不包含 | ✅ 包含 |
| **包含部署？** | ❌ 不包含 | ✅ 包含 |

**结论**：
- **project-planner** 负责"0 → 1"（从灵感到项目设计文档）
- **full-cycle-builder** 负责"1 → 100"（从项目设计到部署上线）
- 两者是**前序→后续关系**，不是互斥关系
- full-cycle-builder 的 Phase 0-2 与 project-planner 有重叠，但 full-cycle-builder 更侧重"执行到上线"

---

## 六、code-review Skill 当前状态确认

> v1→v2 新增（来源：🟡3）

**code-review Skill 已存在且成熟**（v2，242行），具备：
- 5 层审查（架构 → 逻辑 → 可读性 → 性能 → 安全）
- 3 种模式（Focused ≤20行 / Standard 20-200行 / Split >200行）
- Self-Review 模式（审查自己写的代码）
- 与 project-audit 的路由互斥已定义

**结论**：可以在 Phase 3（编码后）增加"调用 code-review"步骤。标记为 🟡 应做。

---

## 七、差距分析与借鉴清单

### 7.1 需要新增的能力（含实现复杂度）

| 能力 | 来源 | 优先级 | 实现复杂度 |
|------|------|--------|-----------|
| **项目类型/规模判定** | 🔴1 + Shape Up | 🔴 必做 | 低（Phase 0 加表格） |
| **Skeleton-First 流程** | agent-os Phase 3 | 🔴 必做 | 低（Phase 0 加一段指令） |
| **调研泛化（领域调研 not just 竞品调研）** | 🔴3 fitness 案例 | 🔴 必做 | 低（改描述） |
| **调用 deep-research** | agent-os 生态 | 🟡 应做 | 低（加一行调用指令） |
| **代码审查环节（调用 code-review）** | 🟡3 确认可用 | 🟡 应做 | 低（Phase 3 加一步） |
| **Phase 间价值链检查** | agent-os Phase Value Chain | 🟡 应做 | 低（每 Phase 加一问） |
| **质量门阈值按规模可配** | 🔴2 兼容分析 | 🟡 应做 | 低（阈值表增加列） |
| **Phase 4 可选** | 🔴1 路径分析 | 🟡 应做 | 低（标记可选） |
| **踩坑预警库分类化** | 通用化 | 🟡 应做 | 中（需创建子文件） |
| **Methodology-to-Skill 检查点** | agent-os Phase 5-7 | 🟡 应做 | 低（Phase 5 加一段） |
| **references/ 子文件 + 显式加载指令** | 🟡1 | 🟡 应做 | 中（创建目录结构） |

### 7.2 需要泛化的内容

| 当前写死 | 泛化方式 |
|---------|---------|
| "竞品/技术调研" | → "领域调研"（竞品/技术/知识均可） |
| Firebase 认证踩坑 | → 移入 references/pitfalls/web-auth.md |
| CDN 版本错位 | → 泛化为"外部依赖版本验证" |
| GitHub Pages 部署 | → 部署方式选择表（按项目类型） |
| Console 零 JS 错误 | → "运行时零错误"（按语言/环境） |
| 375px 移动适配 | → "目标环境适配"（按项目类型） |

### 7.3 必须保留的核心

| 核心 | 已验证案例 |
|------|-----------|
| 5 Phase 结构 | fitness + agent-os + 当前任务，三个项目均验证 |
| 质量门 + 回退 | 每次 v1→v2 循环平均提升 ~2 分 |
| 双循环（调研+规划） | fitness Phase 5.5 验证 |
| 子 Skill 调用编排 | 已与 project-audit / design-iteration / project-retrospective 成功协作 |
| 全局状态追踪 | 项目进度可视化，多次使用 |
| 反模式清单 | 防止重蹈覆辙，已有实际案例支撑 |

---

## 八、技术选型

### 8.1 Skill 结构：方案 B — SKILL.md + references/

> v1→v2 补充（来源：🟡1）：说明加载机制。

```
full-cycle-builder/
├── SKILL.md                              # 核心流程（~350行）
└── references/
    ├── pitfalls/                          # 踩坑预警库（分类）
    │   ├── universal.md                   # 通用踩坑（init 兜底、版本验证等）
    │   ├── web-frontend.md                # Web 前端专用
    │   ├── backend-api.md                 # 后端 API 专用
    │   └── cli-tool.md                    # CLI 工具专用
    ├── deployment-matrix.md               # 部署方式选择矩阵
    └── quality-gate-presets.md             # 质量门预设方案（按规模）
```

**加载机制**：SKILL.md 中在对应 Phase 的步骤里用**显式指令**引导 Agent 读取子文件：

```markdown
#### 3.2 踩坑预警检查
根据 Phase 0 判定的项目类型，阅读对应的踩坑预警文件：
- 所有项目：`references/pitfalls/universal.md`
- Web 前端：另读 `references/pitfalls/web-frontend.md`
- 后端 API：另读 `references/pitfalls/backend-api.md`
```

这种显式指令方式兼容所有 Agent（Claude/Gemini/Codex），不依赖特定的 references/ 自动发现机制。

---

## 九、引力陷阱过滤

| 被砍方案 | 为什么砍 |
|---------|---------|
| YAML 声明式配置 | Markdown 指令已足够 |
| 多 Agent 角色系统 | 子 Skill 调用已覆盖 |
| 自动化质量门评分 | LLM 评分不够确定性 |
| 项目管理看板集成 | 状态追踪表已覆盖 80% 需求 |
| CI/CD 集成 | 零基础设施约束 |
| **严格的时间砍线（Appetite 原版）** | 与质量门冲突，改为规模判定 |

---

## 十、调研方向结论

**保核心 + 增弹性 + 去绑定 + 补生态 + 添闭环**

| 方向 | 具体内容 |
|------|---------|
| 保核心 | 5 Phase + 质量门 + 双循环 + ADR |
| 增弹性 | 项目规模判定 + 质量门可配 + Phase 4 可选 |
| 去绑定 | 踩坑库分类化 + 部署矩阵 + 验收泛化 + 调研泛化 |
| 补生态 | 调用 deep-research + code-review + Skeleton-First |
| 添闭环 | Methodology-to-Skill 检查 + Phase 间价值链 |

---

## v2 对 v1 审查意见的逐条回应

| # | 审查意见 | 类型 | v2 修订 | 状态 |
|---|---------|------|--------|------|
| 1 | 缺项目类型执行路径差异分析 | 🔴 | 新增第三节：3 类项目路径对比 + 差异总结 + 结论 | ✅ 已修 |
| 2 | Appetite 与质量门兼容性未分析 | 🔴 | 第二节新增冲突分析表 + 解法（改为规模判定） | ✅ 已修 |
| 3 | 缺内部案例执行偏差回溯 | 🔴 | 新增第四节：fitness + agent-os 执行路径对比 | ✅ 已修 |
| 4 | references/ 加载机制未说明 | 🟡 | 第八节新增显式指令加载方式 | ✅ 已修 |
| 5 | project-planner 互斥边界未分析 | 🟡 | 新增第五节：前序→后续关系 | ✅ 已修 |
| 6 | code-review Skill 状态未确认 | 🟡 | 新增第六节：确认 v2 可用 | ✅ 已修 |
| 7 | WORKFLOW 模式未提取 | 🟡 | 第四节新增 4 个未覆盖模式 | ✅ 已修 |
| 8 | 对比矩阵缺实现复杂度 | 🟢 | 第七节借鉴清单增加复杂度列 | ✅ 已修 |
| 9 | 缺机器可读摘要 | 🟢 | 暂不加（非自动化 Skill 链） | ⏭️ 延后 |

---

## 变更日志

| 日期 | 版本 | 变更 | 审查结果 |
|------|------|------|---------|
| 2026-03-09 | v1 | 初版调研 | 🔴×3 🟡×4 🟢×2，7.5/10，未通过 |
| 2026-03-09 | v2 | 修订：项目类型路径分析 + Appetite 兼容性 + 内部案例回溯 + WORKFLOW 模式提取 + project-planner 互斥 + code-review 确认 + 加载机制 + 实现复杂度 | 待审查 |
