# Phase 5.5 — tracker-app V2（数据互通 + UI 升级）

> **所属项目**：165/50 零基础增肌项目
> **Phase 目标**：在保留 V1 不动的前提下，构建 V2 版本——实现 Firebase 实时数据同步 + 全面 UI 升级
> **启动日期**：2026-03-09
> **状态**：v2 — 审查通过，可执行
> **调研来源**：`COMPETITIVE-RESEARCH-V2.md` v2（审查通过）

---

## 一、定位

### 一句话

在 V1 MVP 基础上升级为**支持多设备实时同步、视觉效果高级**的增肌追踪 Web 应用。

### V1 → V2 核心变化

| 维度 | V1 | V2 |
|---|---|---|
| 数据存储 | localStorage（单设备） | Firebase Realtime DB（云同步） |
| 认证 | 无 | Google 一键登录 |
| 离线 | 天然离线 | Firebase Persistence + localStorage 降级 |
| 部署 | file:// 直接打开 | HTTPS（Firebase Hosting / GitHub Pages） |
| UI 卡片 | 实色背景 | 双区设计：展示区 Glassmorphism / 操作区高对比度 |
| 进度展示 | 线性进度条 | SVG 三环进度环 |
| 图表 | CSS 柱状图 | CSS 柱状图 + SVG 进度环 |
| 动效 | fadeIn | 数字 count-up + 进度环动画 + 按钮波纹效果 |
| 新功能 | — | 围度追踪 + 同步状态指示器 + V1 数据迁移 |

### Phase 间价值链

| 前序产出 | 本 Phase 如何使用 |
|---|---|
| V1 代码（tracker-app/）| 功能逻辑参考，但 V2 代码独立在 tracker-app-v2/ |
| 竞品调研 v2 | Firebase 方案 + 双区 UI 设计 + 反面教材规避 |
| V2 方案（增肌计划-V2.md） | 训练模板 A/B/C + 追踪指标定义 |

---

## 二、核心用户场景（继承自调研 v2）

### 场景 A：训练中记录（最高频，每次 15+ 交互）

```
打开 V2（手机浏览器，已登录）
  → 仪表盘：三环进度（体重/训练/蛋白）一目了然
  → 点「记录训练」
  → 选 A 类型 → 动作列表加载，显示「上次：40kg × 10」
  → 大数字输入框 → 输入 42.5 和 10 → 自动跳到下一组
  → 完成所有动作 → 点「完成训练」
  → 数据自动同步到云端 → 电脑上实时刷新看到更新
全程 < 3 分钟
```

### 场景 B：每日体重（30 秒）

```
打开 V2 → 仪表盘提示「今日未记录」
  → 点「记录体重」→ 底部弹出 → 输入 51.2
  → 保存 → 进度环动画更新 → 柱状图多一个柱子
  → 数据实时同步 → 电脑上看到最新体重
```

### 场景 C：跨设备查看（V2 新增核心场景）

```
手机上记录完训练
  → 回家打开电脑浏览器 → 同一个 URL
  → Google 账号已登录 → 自动加载最新数据
  → 仪表盘显示今天手机上录入的训练数据
  → 零手动操作
```

---

## 三、任务清单

```
T0: 项目初始化 + Firebase POC
 ↓
T1: Firebase 数据层（替代 localStorage 的 store.js）
 ↓
T2: UI 设计系统 V2（Glassmorphism + 深色渐变 + 微动画）
 ↓
T3: SVG 三环进度组件 + 数字 count-up 动画
 ↓
T4: 仪表盘 V2（三环 + 趋势图 + 同步状态）
 ↓
T5: 体重追踪 V2（围度追踪新增）
 ↓
T6: 训练记录 V2（高对比度操作区 + 快速录入优化）
 ↓
T7: 饮食 + 周复盘 + 问题诊断 + 设置页
 ↓
T8: V1 数据迁移功能
 ↓
T9: 部署（Firebase Hosting 或 GitHub Pages）
 ↓
T10: 浏览器验收测试
```

---

## 四、各任务详细设计

### T0: 项目初始化 + Firebase POC

- 创建 `tracker-app-v2/` 目录（V1 不动）
- 目录结构：
  ```
  tracker-app-v2/
  ├── index.html
  ├── css/
  │   └── style.css
  ├── js/
  │   ├── firebase-config.js   # Firebase 初始化配置
  │   ├── auth.js              # 认证（Google 登录）
  │   ├── store.js             # 数据读写（Firebase CRUD）
  │   ├── components.js        # UI 组件
  │   ├── app.js               # 路由 + 初始化
  │   └── animations.js        # SVG 进度环 + count-up 动画
  └── favicon.svg
  ```
- Firebase 项目创建（v1→v2 注释，来源：审查 🔴1）：
  > 需要用户操作 Firebase Console 一次。代码中预写 firebase-config.js 模板，
  > 配置项用占位符标注。用户按步骤指南填入即可。
  1. 使用 Firebase Console 创建项目
  2. 启用 Authentication（Google 登录）
  3. 启用 Realtime Database
  4. 获取 firebaseConfig 配置 → 填入 firebase-config.js
  5. CDN 引入 Firebase SDK（不用 npm）

### T1: Firebase 数据层

**数据结构**（Firebase Realtime Database JSON 路径）：

```
users/
  {uid}/
    profile/
      height: 165
      startWeight: 50
      targetWeight: 62
      startDate: "2026-03-09"
    weightLog/
      {pushId}/
        date: "2026-03-09"
        weight: 51.2
    measurementLog/
      {pushId}/
        date: "2026-03-09"
        waist: 68
        chest: 85
        armLeft: 26
        armRight: 26
    trainingLog/
      {pushId}/
        date: "2026-03-10"
        type: "A"
        exercises: [...]
    nutritionLog/
      {pushId}/
        date: "2026-03-09"
        calories: 2350
        protein: 98
    weeklyReview/
      {pushId}/
        weekOf: "2026-03-09"
        ...
    trainingTemplates/
      A: [...]
      B: [...]
      C: [...]
```

**安全规则**：
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

**Store API 设计**（与 V1 接口兼容）：

```javascript
// V2 的 Store 保持与 V1 相同的方法名，内部改为 Firebase 操作
Store.init()           // Firebase 初始化 + 监听认证状态
Store.addWeight(date, weight)   // firebase.database().ref(`users/${uid}/weightLog`).push(...)
Store.getWeightLog()            // 返回实时监听的本地缓存
```

**降级策略**：
- try-catch 包裹 Firebase 操作
- 失败时退回 localStorage（V1 方式）
- UI 显示「离线模式」标识

### T2: UI 设计系统 V2

**设计令牌**：

```css
/* 背景渐变 */
--bg-gradient: linear-gradient(180deg, #0a0a1a 0%, #1a1035 100%);

/* Glassmorphism 卡片（展示区） */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.08);
--glass-blur: blur(20px);
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

/* 高对比度卡片（操作区） */
--solid-bg: #1a1a2e;
--solid-border: rgba(255, 255, 255, 0.1);
```

**微动画系统**：
- 页面切换：slide + fade（200ms）
- 数字变化：count-up（600ms，ease-out）
- 进度环：描边动画（800ms，ease-out）
- 按钮点击：波纹效果（ripple，300ms）
- Toast：slide-down（300ms）
- 卡片加载：stagger fade-in（每张延迟 50ms）

### T3: SVG 三环进度组件

三个同心圆环显示三个核心指标：

```
外环（蓝）— 体重进度（当前 51.2kg → 目标 62kg = 10%）
中环（绿）— 本周训练（2/3 = 67%）
内环（紫）— 本周蛋白达标（5/7 = 71%）
```

实现：SVG `<circle>` + `stroke-dasharray` + `stroke-dashoffset` 动画
每次数据更新时逐环展开动画。

### T4: 仪表盘 V2

布局：
```
┌──────────────────────────┐
│  💪 增肌追踪    [✅已同步] │  ← 顶栏 + 同步状态
├──────────────────────────┤
│                          │
│     ┌──────────────┐     │
│     │   三环进度     │     │  ← SVG 三环
│     │  中间：51.2kg  │     │
│     └──────────────┘     │
│                          │
│  体重 10%  训练 2/3  蛋白 5/7 │ ← 环下标签
├──────────────────────────┤
│  [glassmorphism 卡片]     │
│  📊 最近 7 天体重趋势     │  ← CSS 柱状图
│  ▐  ▐  █  █  █  █  █    │
├──────────────────────────┤
│  [+ 记录体重] [+ 记录训练] │  ← 快捷操作
└──────────────────────────┘
│ 📊  │  ⚖️  │  🏋️  │  ⚙️  │  ← 底部导航
```

### T5: 体重 + 围度追踪

- 体重：继承 V1 功能 + UI 升级
- 围度（V2 新增）：
  - 输入：腰围/胸围/左臂/右臂（cm）
  - 建议每月记录一次
  - 历史对比表格

### T6: 训练记录 V2（高对比度操作区）

**关键 UI 改进**：
- 输入框高 52px（V1 是 36px），字号 1.2rem
- 自动调出数字键盘（inputmode="decimal"）
- 每完成一组自动高亮下一组（焦点管理）
- 上次记录更醒目：左侧彩色竖线标记
- 渐进超负荷提示更明显：「💪 上次 40kg，挑战 42.5kg？」

### T7: 饮食 + 复盘 + 诊断 + 设置

从 V1 功能继承，UI 升级为双区设计。

设置页面新增：
- Google 账号信息显示
- 同步状态
- V1 数据迁移入口
- 导出/导入（保留 JSON 备份功能）
- 重置训练模板
- 登出

### T8: V1 数据迁移

1. 设置页 → 点「从 V1 迁移数据」
2. 读取 localStorage 中的 V1 数据（key: `muscle-tracker-data`）
3. 显示预览：「发现 V1 数据：N 条体重记录 / M 条训练记录」
4. 确认 → 上传到 Firebase
5. 完成 → 提示「迁移成功，V1 数据已保留不受影响」

### T9: 部署（v1→v2 变更，来源：审查 🟡2）

> 优先使用 GitHub Pages（无需 npm），Firebase Hosting 作为备选。

- **方案 A（推荐）**：GitHub Pages — `git push` 到 gh-pages 分支 → 自动 HTTPS
- **方案 B**：Firebase Hosting — 需在 WSL 中安装 firebase-tools CLI
- 结果：一个 HTTPS URL，手机和电脑都能访问

### T10: 验收测试

| # | 场景 | 判定 |
|---|---|---|
| 1 | 训练日场景：手机录入 → 电脑实时看到 | 手动 |
| 2 | 体重场景：输入体重 → 三环动画更新 | 手动 |
| 3 | 跨设备：手机记录 → 电脑刷新看到最新数据 | 两设备 |
| 4 | 离线模式：断网 → 录入 → 恢复网络 → 自动同步 | 手动 |
| 5 | V1 迁移：迁移 V1 数据 → Firebase 中数据完整 | 手动 |
| 6 | 移动适配：375px 宽度正常 | DevTools |
| 7 | Glassmorphism 渲染正确 | 视觉检查 |
| 8 | 零 JS 错误 | Console |

---

## 五、不在范围

| ❌ 不做 | 原因 |
|---|---|
| npm / 框架 | 保持零 npm 约束 |
| AI 训练推荐 | 初学者不需要 |
| 社交功能 | 个人工具 |
| 视频指导 | 存储/带宽成本 |
| 多用户支持 | 个人使用 |

---

## 六、技术约束

| 约束 | 值 |
|---|---|
| 外部依赖 | Firebase SDK（CDN）+ Google Fonts |
| 文件数 | 8 个（html + css + 5 × js + favicon） |
| npm | 零 |
| 图表 | CSS + SVG（零第三方库） |
| 路由 | hash 路由 |
| 部署 | Firebase Hosting 或 GitHub Pages（HTTPS） |

---

## 变更日志

| 日期 | 版本 | 变更 | 审查结果 |
|---|---|---|---|
| 2026-03-09 | v1 | 初版 | 🔴×1 🟡×3，8.2/10 |
| 2026-03-09 | v2 | 修订：Firebase 步骤指南 + GitHub Pages 优先 + 审查注释 | ✅ 8.7/10 通过 |

## v2 审查对照表

| # | 审查意见 | 类型 | v2 修订 | 状态 |
|---|---|---|---|---|
| 1 | Firebase Console 需要用户操作 | 🔴 | 代码预写模板 + 步骤指南，执行中解决 | ✅ 已修 |
| 2 | firebase deploy 需要 npm | 🟡 | 优先 GitHub Pages（git push），无需 npm | ✅ 已修 |
| 3 | 8 个文件无模块加载器 | 🟡 | script 按依赖顺序加载（与 V1 一致） | ✅ 已修 |
| 4 | 围度追踪 UI 未详细描述 | 🟡 | 简单输入表单 + 历史表格，执行中细化 | ✅ 已修 |
