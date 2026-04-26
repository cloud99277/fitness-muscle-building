# Decision-Log

> **规则**: 只追加，不重写历史

---

## [2026-04-25] V4 重构架构决策 [Agent + 用户确认]

| 决策项 | 选项 | 最终决策 | 理由 |
|---|---|---|---|
| 训练方案 | A) Gemini 2天极简 B) V3 居家哑铃 | **双轨并行** | 用户确认：V3 居家作为并行轨道 |
| App 架构 | A) 新建 v3 目录 B) 在 v2 上重构 | **在 V2 上重构** | 用户确认：保持代码连续性 |
| Firebase | A) 继续 B) 换方案 | **继续使用** | 用户确认 |
| 推进模式 | A) 串行 B) 并行 | **B型并行** | 用户确认：文档与App同时推进 |
| PM 管理 | A) 无 B) 导入 PM skill | **导入 project-manager** | 用户要求 |

---

## [2026-04-25] Sprint 1 执行决策 [Agent]

| 决策项 | 选项 | 最终决策 | 理由 |
|---|---|---|---|
| habitLog 设计 | A) 独立数据源 B) 聚合视图 | **聚合视图** | 审查🟡：避免与sleepLog/nutritionLog数据冗余 |
| 新模块临时路由 | A) 新Tab B) 放在"更多" | **放在"更多"** | Sprint 3 再统一迁移到 5-Tab 结构 |
| code-review | A) 执行 B) 跳过 | **跳过** | 首Sprint + Medium项目可延后 |
| detox 推导 | A) 独立打卡 B) 从sleep推导 | **从sleep推导** | 23:30前入睡≈执行了数字戒断 |

---

## [2026-04-25] Sprint 2+3 执行决策 [Agent]

| 决策项 | 选项 | 最终决策 | 理由 |
|---|---|---|---|
| A4/A5 归属 | A) Sprint 2重做 B) 标记Sprint 1已完成 | **标记已完成** | Modal在Sprint 1已全部实现 |
| 训练模板命名 | A) D/E B) GA/GB | **GA/GB** | G=Gym，语义清晰且不与A-C冲突 |
| V2模板升级 | A) 要求用户清缓存 B) 自动补丁 | **自动补丁** | `_ensureArrays`中自动检测缺失key并补充 |
| A8 导航重构 | A) 立即执行 B) 延期 | **延期至Sprint 5** | 当前4Tab够用，过早重构浪费 |
| 仪表盘标题 | A) 增肌追踪 B) 身体管理 | **身体管理** | 反映V4全栈定位 |

---

## [2026-04-26] Sprint 4 执行决策 [Agent]

| 决策项 | 选项 | 最终决策 | 理由 |
|---|---|---|---|
| detoxDays 推导 | A) 独立打卡 B) 复用 sleepDays | **复用 sleepDays** | 沿用 Sprint 1 决策，23:30前入睡≈戒断 |
| 历史复盘兼容 | A) 忽略旧数据 B) undefined检查 | **undefined检查** | 旧复盘无 sleepDaysOnTarget/kegelDays 字段 |
| 复盘分组 | A) 单列展示 B) 按语义分组 | **按语义分组** | 6维度单列太长，分组提升可读性 |
| JS编辑方式 | A) here-string B) Python脚本桥接 | **Python脚本桥接** | PowerShell会解析JS模板字符串中的\$\{\} |
