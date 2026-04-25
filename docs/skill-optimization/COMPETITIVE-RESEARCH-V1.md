# full-cycle-builder 优化 — 竞品/技术调研报告

> **调研日期**：2026-03-09
> **调研目的**：为 full-cycle-builder Skill 的通用化优化提供方向
> **服务决策**：当前 Skill 过度绑定 fitness-muscle-building 项目场景，需要识别通用化方向
> **状态**：v1

---

## 一、调研对象

| 类型 | 竞品/方案 | 选取原因 |
|------|----------|---------|
| 方法论-重型 | Shape Up (Basecamp) | 成熟的"固定时间、可变范围"开发周期方法论 |
| 方法论-轻型 | ADR（Audit-Driven Refinement）| 我们自己创造的方法论，已有成功案例 |
| AI 框架-重型 | CrewAI | 角色驱动的多 Agent 编排，有 Planning 阶段 |
| AI 框架-轻型 | AI-SDLC (ai-sdlc.io) | 声明式控制的 AI 开发生命周期 |
| 内部系统-已有 | project-planner + project-audit 协作链 | 当前 Agent Toolchain 已有的规划-审查闭环 |
| 反面教材 | 传统瀑布式开发流程 | 质量门过重导致交付缓慢 |
| 反面教材 | "AI 自动化一切"的幻想 | 把 AI 同时当计划者+执行者+审查者 |

---

## 二、核心方案对比

### 2.1 开发生命周期编排方案对比矩阵

| 维度 | Shape Up | CrewAI | AI-SDLC | ADR (我们的) | 当前 full-cycle-builder |
|------|----------|--------|---------|-------------|----------------------|
| **编排层级** | 项目周期 | 任务级 | 全生命周期 | 文档级 | 项目周期 |
| **质量控制** | 固定时间+可变范围（内建） | Manager Agent 验证 | CI/CD 质量门 | 🔴🟡🟢 三层审查 | 评分质量门 |
| **人在回路** | ✅ Betting Table 决策 | 可选 HiTL | 可选 | ✅ 每轮审查人确认 | ✅ 质量门人工判定 |
| **范围控制** | ✅ Appetite 机制 | ❌ 无内建 | ⚠️ 弱 | ⚠️ 靠审查发现膨胀 | ⚠️ 靠反模式提醒 |
| **回退机制** | ❌ 超时即砍 | ❌ 无 | ✅ 回退到前阶段 | ✅ 修订→再审查 | ✅ 质量门不过就回退 |
| **经验沉淀** | ✅ Cool-down 期 | ❌ 无 | ❌ 无 | ✅ project-retrospective | ✅ Phase 5 |
| **项目类型** | 任何产品开发 | 任何 AI 任务 | 软件开发 | 文档驱动项目 | ⚠️ 偏 Web 前端 |
| **通用性** | ✅ 高 | ✅ 高 | ✅ 高 | 🟡 中（文档驱动） | 🔴 低（绑定 fitness） |

### 2.2 各方案核心亮点分析

#### Shape Up — "Appetite 机制"最值得借鉴

Shape Up 的核心创新是 **Appetite（胃口）机制**：
- 开始前先确定"愿意投入多少时间"（2 周 / 6 周）
- 然后根据时间约束调整范围
- **不是**"先定范围再估时间"

**对 full-cycle-builder 的启示**：
- 当前 Skill 没有"时间 budget"概念
- 应该在 Phase 0 增加 Appetite 定义：这个项目是 2 天完成（小批量）还是 2 周完成（大批量）？
- 不同 Appetite 对应不同的质量门严格程度

#### Shape Up — "Cool-down 期"对应 Phase 5

Shape Up 在每个周期后有 1-2 周的 Cool-down 期，用于：
- 修 bug
- 探索新想法
- 处理技术债

**对 full-cycle-builder 的启示**：
- 当前 Phase 5 经验沉淀约等于 Cool-down
- 但缺少"技术债处理"和"探索期"的概念

#### CrewAI — "角色驱动"的启示

CrewAI 的核心是给每个 Agent 定义明确的 Role + Goal + Backstory：
- Planner Agent：负责拆解任务
- Executor Agent：负责执行
- Reviewer Agent：负责审查

**对 full-cycle-builder 的启示**：
- 当前 Skill 的角色定义只有"开发指挥官"一个
- 实际上编排过程中涉及多个角色：调研员、规划师、审查员、执行者
- 但在单 Agent 环境下，角色通过调用不同子 Skill 来切换（已实现）

#### AI-SDLC — "声明式控制"

AI-SDLC 的创新是：使用声明式 YAML 定义"期望的开发状态"，然后 Controller 驱动实际状态向期望状态收敛。

**对 full-cycle-builder 的启示**：
- 质量门本身就是"期望状态"的定义
- 但当前的质量门是硬编码（8.5/8.0），不够声明式
- 未来可以让用户在 Phase 0 声明期望标准

#### ADR（我们自己的）— 最核心的信心来源

ADR 方法论是从 Agent Toolchain 和 fitness-muscle-building 两个项目中自然涌现的：
- 7 步质量循环：v1 → 审查 → 修订计划 → 修订 → 再审查 → 执行 → 双重审查
- 递归双循环：调研循环（Loop A）+ 规划循环（Loop B）
- 收敛度量：🔴→0 + 评分提升 + Delta 1:1 映射

**这是当前 Skill 的方法论核心，优化的方向是"提炼其通用性"，而不是替换它。**

---

## 三、反面教材分析

### 3.1 传统瀑布式开发的失败模式

| 失败点 | 在 full-cycle-builder 中的风险 |
|--------|------------------------------|
| 质量门过重导致一个月做不出东西 | 调研 ≥ 8.5 + 规划 ≥ 8.0 对小项目可能过严 |
| 文档比代码多 | 每步都产出文档，可能"文档完美但产品没做" |
| 没有范围弹性 | 当前缺少 "Appetite" 机制 |
| 回退等于返工 | 需要"增量修订"而不是"全部重来" |

### 3.2 "AI 自动化一切"的幻想

很多 AI 开发框架的失败模式：
- 让 AI 同时做计划+执行+审查 → 自我确认偏差
- 不设质量门，让 AI "一口气跑完" → 产出质量不可控
- 不考虑项目类型差异 → one-size-fits-all 失败

**对 full-cycle-builder 的启示**：
- ✅ 当前 Skill 已经避免了这些问题（质量门 + 子 Skill 角色分离）
- 但需要强调这些是"设计选择"而不是"遗漏"

### 3.3 当前 SKILL.md 本身的失败模式分析

通过两个项目的实际使用经验，当前 Skill 暴露的问题：

| 失败模式 | 来源案例 | 影响 |
|---------|---------|------|
| **Firebase 认证白屏**写死在踩坑库 | fitness Phase 5.5 | 非 Firebase 项目完全无用 |
| **CDN 版本错位**写死在踩坑库 | fitness Phase 5.5 | 非 CDN 项目完全无用 |
| **部署阶段绑定 GitHub Pages** | fitness Phase 5.5 | Docker/npm/CLI 项目不适用 |
| **质量门评分硬编码** | fitness 全流程 | 小项目被过严标准卡住 |
| **缺少 deep-research Skill 调用** | agent-os Phase 3.5 | 调研阶段与现有 Skill 生态脱节 |
| **缺少 project-planner Skill 调用** | agent-os Phase 3 | 规划阶段与现有 Skill 生态脱节 |
| **缺少 code-review 环节** | agent-os Phase 8 | 编码后只有浏览器验收，没有代码审查 |
| **缺少 Phase 间价值链检查** | agent-os Phase Value Chain | Phase 产出可能不被下一 Phase 消费 |
| **无项目类型判定** | 通用化需求 | 不同项目类型（Web/后端/CLI/数据）需要不同检查 |
| **无 Skeleton-First 流程** | agent-os Phase 3 | 大型调研/规划前缺少骨架确认 |

---

## 四、差距分析：当前 SKILL vs 通用化版本

### 4.1 需要新增的能力

| 能力 | 来源经验 | 优先级 |
|------|---------|--------|
| **项目类型判定**（Web/后端/CLI/数据/文档） | 通用化必需 | 🔴 必做 |
| **Appetite 机制**（时间 budget） | Shape Up | 🔴 必做 |
| **Skeleton-First 流程** | agent-os Phase 3 | 🔴 必做 |
| **调用 deep-research** | agent-os 生态 | 🟡 应做 |
| **调用 project-planner 模板** | agent-os 生态 | 🟡 应做 |
| **代码审查环节** | agent-os Phase 8 | 🟡 应做 |
| **Phase 间价值链检查** | agent-os Phase Value Chain | 🟡 应做 |
| **质量门阈值可配置** | Shape Up Appetite | 🟡 应做 |
| **踩坑预警库分类化** | 通用化必需 | 🟡 应做 |
| **范围变更控制机制** | 实际开发常见 | 🟢 可选 |
| **agent-orchestrator 协作入口** | agent-os P3 | 🟢 可选（待 P3 完成） |

### 4.2 需要泛化的部分

| 当前写死内容 | 泛化方向 |
|-------------|---------|
| Firebase 认证踩坑 | → 分类踩坑库（Web 类/后端类/通用类） |
| CDN 版本错位 | → "外部依赖版本验证"通用检查 |
| GitHub Pages 部署 | → 部署方式矩阵（按项目类型选择） |
| `Console 零 JS 错误` | → "运行时零错误"泛化（JS/Python/Go...） |
| 移动端 375px 适配 | → "目标环境适配验证"泛化 |

### 4.3 需要保留的核心

| 核心 | 为什么保留 |
|------|-----------|
| 5 Phase 结构（0-5） | 已验证有效，结构合理 |
| 质量门机制 | ADR 方法论核心，不可替代 |
| 子 Skill 调用编排 | 保持 Skill 协作生态 |
| 双循环（调研+规划） | 已验证可防止"调研盲点污染规划" |
| 全局状态追踪 | 项目可视化核心 |
| 反模式清单 | 防止重蹈覆辙 |

---

## 五、技术选型对比（Skill 结构设计）

### 5.1 Skill 内部模块化方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **A：单文件 SKILL.md（当前）** | 简单，一个文件搞定 | 370行已经很长，通用化后可能 600+ 行 |
| **B：SKILL.md + references/ 子文件** | 核心流程在主文件，细节在子文件 | 需要多次文件读取 |
| **C：SKILL.md + templates/ 模板** | 针对不同项目类型有不同模板 | 增加维护成本 |

**选型结论**：**方案 B** — SKILL.md 保持核心流程（~300 行），踩坑预警库、部署检查清单、项目类型模板等放入 `references/` 子目录。

### 5.2 踩坑预警库架构

| 方案 | 优点 | 缺点 |
|------|------|------|
| **A：内嵌 SKILL.md（当前）** | 简单 | 只有 Web/Firebase 场景 |
| **B：分类文件** | 可按项目类型加载 | 需要在 Phase 0 判定项目类型 |
| **C：追加式日志** | 每次踩坑自动追加 | 可能越来越长 |

**选型结论**：**方案 B** — `references/pitfall-library/` 下按类别分文件（web.md, backend.md, cli.md, universal.md），Phase 0 判定项目类型后加载对应文件。

---

## 六、引力陷阱过滤

| 被砍方案 | 为什么砍 |
|---------|---------|
| 改用 YAML 声明式配置（模仿 AI-SDLC） | Markdown 指令已足够，引入 YAML 增加复杂度 |
| 引入多 Agent 角色系统（模仿 CrewAI） | 单 Agent 执行环境下通过子 Skill 切换角色已足够 |
| 做自动化质量门评分 | 评分需要 LLM 理解力，自动化评分不可靠 |
| 引入项目管理看板（Jira/Linear 集成） | 全局状态追踪表已覆盖 80% 需求 |
| 做 CI/CD 集成 | 零基础设施约束，避免 OpenClaw 式的中间件陷阱 |

---

## 七、调研方向结论

### 7.1 优化总方向

**保核心 + 增弹性 + 去绑定 + 补生态**

- **保核心**：5 Phase 结构 + 质量门 + 双循环 + ADR 方法论
- **增弹性**：Appetite 机制 + 可配置质量门 + 项目类型判定
- **去绑定**：踩坑库分类化 + 部署方式矩阵 + 验收泛化
- **补生态**：调用 deep-research + project-planner + code-review

### 7.2 产出物规划

```
skill-optimization/
├── COMPETITIVE-RESEARCH-V1.md    ← 本文档
├── COMPETITIVE-RESEARCH-V2.md    ← 审查后修订版
├── OPTIMIZATION-PLAN-V1.md       ← Phase 2 规划文档
├── OPTIMIZATION-PLAN-V2.md       ← 审查后修订版
└── SKILL.md                      ← 最终优化版（Phase 3 产出）
```

---

## 变更日志

| 日期 | 版本 | 变更 | 审查结果 |
|------|------|------|---------|
| 2026-03-09 | v1 | 初版调研 | 待审查 |
