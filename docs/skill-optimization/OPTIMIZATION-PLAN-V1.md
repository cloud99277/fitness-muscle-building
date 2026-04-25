# full-cycle-builder Skill 通用化优化方案

> **所属项目**：full-cycle-builder Skill 优化
> **目标**：将 full-cycle-builder 从"fitness 项目绑定版"优化为"通用项目开发 Skill"
> **启动日期**：2026-03-09
> **状态**：v1
> **调研来源**：`COMPETITIVE-RESEARCH-V2.md`（8.9/10 通过）

---

## 一、定位

### 一句话

将 `full-cycle-builder` 从绑定 fitness-muscle-building 项目场景的专用 Skill，优化为**可适配任何项目类型的通用全周期开发编排 Skill**。

### 优化前后对比

| 维度 | 优化前（v1） | 优化后（v2） |
|------|------------|------------|
| 项目适用范围 | Web 前端（fitness tracker） | 任何项目类型 |
| 调研阶段 | 竞品/技术调研 | 领域调研（竞品/技术/知识均可） |
| 质量门 | 硬编码 8.5/8.0 | 按项目规模可配 |
| 踩坑预警库 | Firebase/CDN/OAuth 固定列表 | 分类架构 + references/ 子文件 |
| 部署阶段 | GitHub Pages 固定 | 部署方式矩阵 + 可选跳过 |
| Skill 生态 | 调用 3 个子 Skill | 调用 5+ 个子 Skill |
| 编码验收 | 浏览器验收 only | 浏览器/脚本/审查 + code-review |
| 经验沉淀 | 调用 retrospective | 调用 retrospective + Methodology-to-Skill 检查 |

### Phase 间价值链

| 前序产出 | 本方案如何使用 |
|---------|-------------|
| 调研 v2 第三节：项目类型路径分析 | Phase 0 项目类型判定表的设计依据 |
| 调研 v2 第四节：内部案例偏差 | 发现 3 个关键缺失（Skeleton-First / 调研泛化 / M2S 闭环） |
| 调研 v2 第七节：借鉴清单 | 每个修改点的来源和实现复杂度 |
| 调研 v2 第八节：文件结构 | references/ 目录规划 |

---

## 二、任务清单

```
T0: SKILL.md 结构重构（保核心 + 增弹性框架）
 ↓
T1: Phase 0 升级（项目类型/规模判定 + Skeleton-First）
 ↓
T2: Phase 1 泛化（领域调研 + deep-research 调用 + 调研维度通用化）
 ↓
T3: Phase 2 补强（project-planner 模板 + Phase 价值链检查）
 ↓
T4: Phase 3 扩展（code-review 环节 + 验收分支 + 踩坑预警泛化）
 ↓
T5: Phase 4 泛化（部署方式矩阵 + 可选标记）
 ↓
T6: Phase 5 补闭环（Methodology-to-Skill 检查点）
 ↓
T7: 全局元素更新（质量门表 / 反模式 / 状态追踪模板 / 互斥边界）
 ↓
T8: references/ 子文件创建
 ↓
T9: 自审查验收
```

---

## 三、各任务详细设计

### T0: SKILL.md 结构重构

保留当前 5 Phase 的流程骨架，调整以下结构：

**保留不变**：
- frontmatter 格式
- 角色定义（开发指挥官）
- 触发条件
- 执行流程总览图
- 全局状态追踪模板结构

**需要修改**：
- Skill 协作关系图：增加 deep-research、project-planner、code-review
- 互斥边界表：增加 project-planner 的边界说明
- 质量门阈值表：增加"规模"列
- 反模式表：泛化具体案例描述
- 踩坑预警库：从内嵌改为 references/ 引用

### T1: Phase 0 升级

当前 Phase 0 只确认 5 个项目：目标/约束/用户/现有资产/部署目标。

**新增 3 个确认项**：

```markdown
| 项目 | 需要确认的内容 |
|------|--------------|
| 目标 | 一句话定义 |
| 约束 | 技术栈限制 |
| 用户 | 谁用？什么环境？ |
| 现有资产 | 有 V1 吗？有调研吗？ |
| 部署目标 | 部署到哪里？（或无需部署） |
| 🆕 项目类型 | Web 前端 / 后端 API / CLI 工具 / 文档型 / 数据分析 / 其他 |
| 🆕 项目规模 | Small（1天）/ Medium（3天）/ Large（1周+） |
| 🆕 骨架确认 | 产出 Phase 1-5 的骨架大纲，等用户确认后再展开 |
```

**Skeleton-First 流程**：

```markdown
Phase 0 产出骨架（≤20 行），格式：
  Phase 1: [一句话调研方向]
  Phase 2: [一句话规划要点]
  Phase 3: [一句话核心编码目标]
  Phase 4: [部署方式] 或 [标记：无需部署]
  Phase 5: [沉淀重点]

→ 用户确认骨架 → 才开始 Phase 1
```

### T2: Phase 1 泛化

**修改点**：

1. "竞品/技术调研" → "领域调研"
   - 描述改为：产出领域调研文档。根据项目性质，调研内容可以是竞品分析、技术选型、领域知识研究或方法论对比

2. 增加 deep-research Skill 调用指令（可选）：
   - Large 项目：建议调用 `deep-research`（Full Mode）
   - Medium 项目：可选调用 `deep-research`（Quick Mode）
   - Small 项目：可跳过正式调研

3. 调研审查维度泛化：
   - 保留：选品偏差、引力陷阱、反面教材、场景倒推
   - 泛化"目标环境约束"为通用表述

### T3: Phase 2 补强

**修改点**：

1. 规划文档可参考 `project-planner` 的 Phase 级执行文档模板
2. 每个 Phase 启动时增加价值链检查：
   ```
   Phase 间价值链检查：
   □ 前序 Phase 产出了什么？本 Phase 如何使用？
   □ 本 Phase 产出什么？下一 Phase 如何消费？
   ```

### T4: Phase 3 扩展

**修改点**：

1. 编码完成后增加 code-review 步骤（Medium/Large 项目）：
   ```
   3.2 代码审查（Medium/Large 项目）
   调用 code-review 审查关键代码文件。重点关注：
   - Layer 1（架构）— 是否符合 Phase 2 规划？
   - Layer 2（逻辑）— 边界条件是否覆盖？
   - Layer 5（安全）— 硬编码凭据？未校验输入？
   ```

2. 踩坑预警检查改为分层引用：
   ```
   3.3 踩坑预警检查
   根据 Phase 0 判定的项目类型，阅读对应踩坑预警文件：
   - 所有项目：references/pitfalls/universal.md
   - Web 前端：另读 references/pitfalls/web-frontend.md
   - 后端 API：另读 references/pitfalls/backend-api.md
   - CLI 工具：另读 references/pitfalls/cli-tool.md
   ```

3. 质量门 C 按项目类型分支：
   ```
   质量门 C（按项目类型）：
   - Web 前端：浏览器验收（页面渲染 + 零 JS 错误 + 移动适配）
   - 后端 API：运行时测试（API 响应 + 错误处理 + 数据持久化）
   - CLI 工具：终端测试（命令执行 + 参数解析 + 错误信息）
   - 文档型：审查通过（project-audit 评分 ≥ 阈值）
   - 通用：核心功能可操作 + 运行时零错误
   ```

### T5: Phase 4 泛化

**修改点**：

1. Phase 4 标题改为 "Phase 4: 部署上线（如适用）"
2. 增加可选跳过标记：
   ```
   如果 Phase 0 判定无需部署（文档型/内部工具），直接跳到 Phase 5。
   ```
3. 部署检查清单泛化 + 部署方式矩阵引用 references/deployment-matrix.md
4. GitHub Pages 的具体 Actions workflow 移入 references/

### T6: Phase 5 补闭环

**修改点**：

1. 保留调用 project-retrospective
2. 新增 Methodology-to-Skill 检查点：
   ```
   Methodology-to-Skill 检查：
   □ 本项目中发现了新的可复用模式吗？
   □ 这个模式是否已经在现有 Skill 中被覆盖？
   □ 如果没有：是否值得提炼为新的 Skill？（做三次就自动化）
   □ 如果是：更新现有 Skill 还是创建新 Skill？
   ```
3. 增加踩坑预警库更新指令：
   ```
   踩坑库更新：
   如果本项目遇到了新的踩坑场景，追加到对应的 references/pitfalls/ 文件中。
   ```

### T7: 全局元素更新

1. **质量门阈值表增加"规模"列**：
   ```
   | 质量门 | Small | Medium | Large | 最大循环 | 回退到 |
   |--------|-------|--------|-------|---------|-------|
   | A 调研 | 跳过  | 8.0    | 8.5   | 3       | 修订调研 |
   | B 规划 | 7.5   | 8.0    | 8.0   | 3       | 修订规划 |
   | C 编码 | 零错误| 零错误+CR | 零错误+CR+安全 | 不限 | 修复 |
   | D 部署 | 可选  | 目标环境验收 | 目标环境验收 | 不限 | hotfix |
   ```

2. **反模式表泛化**：
   - "不要凭记忆写第三方版本号" → "不要凭记忆写外部依赖版本号"
   - "不要在 init() 里只处理正常路径" → "不要在初始化逻辑中只处理正常路径"
   - 保留原始案例来源列，但措辞通用化

3. **状态追踪模板**：改为变量化模板（不写死具体 Phase 编号和内容）

4. **互斥边界表**：增加 project-planner 行

5. **Skill 协作关系图**：增加 deep-research 和 code-review

### T8: references/ 子文件创建

创建以下文件：

1. `references/pitfalls/universal.md` — 通用踩坑（来源：WORKFLOW 模式 + 当前 SKILL.md 泛化）
2. `references/pitfalls/web-frontend.md` — Web 专用（来源：当前 SKILL.md 的 Firebase/CDN/OAuth 条目）
3. `references/deployment-matrix.md` — 部署方式矩阵
4. `references/quality-gate-presets.md` — 质量门预设方案

### T9: 自审查验收

1. 通读优化后的 SKILL.md，确认所有修改点都已落地
2. 检查与调研 v2 结论的一致性
3. 确认 references/ 文件都可被正常引用

---

## 四、验收标准

| # | 验收项 | 判定方式 |
|---|--------|---------|
| 1 | SKILL.md 不包含任何 fitness/Firebase/CDN 硬编码引用 | 全文搜索 |
| 2 | Phase 0 包含项目类型 + 规模判定 + Skeleton-First | 审查 |
| 3 | Phase 1 描述为"领域调研"而非"竞品调研" | 审查 |
| 4 | 质量门表有 Small/Medium/Large 三列 | 审查 |
| 5 | Phase 3 包含 code-review 调用指令 | 审查 |
| 6 | Phase 4 标记为"如适用" | 审查 |
| 7 | Phase 5 包含 Methodology-to-Skill 检查点 | 审查 |
| 8 | references/ 子文件 ≥ 4 个 | 文件检查 |
| 9 | 互斥边界表包含 project-planner 行 | 审查 |
| 10 | Skill 协作关系图包含 deep-research 和 code-review | 审查 |

---

## 五、不在范围

| ❌ 不做 | 原因 |
|--------|------|
| 写自动化脚本 | 这是 Markdown 指令型 Skill，无 scripts/ |
| agent-orchestrator 集成 | 待 agent-os P3 完成后再考虑 |
| 多语言版本 | 当前中文为主，需求触发再翻译 |
| 增加 io: frontmatter 声明 | 编排层 Skill 的 IO 是"项目"，类型不在 type-registry 中 |

---

## 变更日志

| 日期 | 版本 | 变更 | 审查结果 |
|------|------|------|---------|
| 2026-03-09 | v1 | 初版方案 | 待审查 |
