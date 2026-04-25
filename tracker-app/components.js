/**
 * components.js — 所有 UI 组件和模块渲染
 * 
 * 职责：
 * - 渲染各页面的 HTML
 * - 从 Store 读取数据并展示
 * - 生成 CSS 柱状图
 */

const Components = {

    // ============================================================
    // 仪表盘（T3）
    // ============================================================
    renderDashboard() {
        const profile = Store.getProfile();
        const currentWeight = Store.getLatestWeight();
        const targetWeight = profile.targetWeight;
        const startWeight = profile.startWeight;
        const progress = Math.max(0, Math.min(100, ((currentWeight - startWeight) / (targetWeight - startWeight)) * 100));
        const remaining = +(targetWeight - currentWeight).toFixed(1);

        const trainingsThisWeek = Store.getTrainingThisWeek().length;
        const proteinDays = Store.getProteinDaysThisWeek();
        const hasReview = Store.hasReviewThisWeek();

        // 本周训练状态颜色
        const trainClass = trainingsThisWeek >= 3 ? 'success' : trainingsThisWeek >= 1 ? 'warning' : '';
        const proteinClass = proteinDays >= 5 ? 'success' : proteinDays >= 3 ? 'warning' : '';
        const reviewClass = hasReview ? 'success' : '';

        // 体重趋势 mini chart
        const weightLog = Store.getWeightLog();
        const recentWeights = weightLog.slice(-7);
        const chartHTML = this._renderBarChart(recentWeights, 'weight', '最近 7 次');

        // 今日是否已记录体重
        const today = new Date().toISOString().split('T')[0];
        const todayWeight = weightLog.find(w => w.date === today);
        const weightPrompt = todayWeight
            ? ''
            : '<div class="card" style="background:var(--warning-soft);border-color:rgba(245,158,11,0.3)"><span>⚖️ 今日体重未记录</span></div>';

        return `
      <div class="page-header">
        <span class="emoji">💪</span>
        <h1>增肌追踪</h1>
      </div>

      ${weightPrompt}

      <div class="card">
        <div class="card-title">体重进度</div>
        <div style="display:flex;align-items:baseline;gap:8px">
          <span class="card-value gradient">${currentWeight}kg</span>
          <span class="text-secondary" style="font-size:0.9rem">→ ${targetWeight}kg</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width:${progress}%"></div>
        </div>
        <div class="card-subtitle">
          ${remaining > 0 ? `距目标还差 ${remaining}kg · 已完成 ${Math.round(progress)}%` : '🎉 已达到目标！'}
        </div>
      </div>

      ${recentWeights.length > 0 ? `
        <div class="card">
          <div class="card-title">📊 体重趋势</div>
          ${chartHTML}
        </div>
      ` : ''}

      <div class="stats-grid">
        <div class="stat-card ${trainClass}">
          <span class="stat-emoji">🏋️</span>
          <span class="stat-value">${trainingsThisWeek}/3</span>
          <span class="stat-label">本周训练</span>
        </div>
        <div class="stat-card ${proteinClass}">
          <span class="stat-emoji">🥩</span>
          <span class="stat-value">${proteinDays}/7</span>
          <span class="stat-label">蛋白达标</span>
        </div>
        <div class="stat-card ${reviewClass}">
          <span class="stat-emoji">📋</span>
          <span class="stat-value">${hasReview ? '✅' : '❌'}</span>
          <span class="stat-label">周复盘</span>
        </div>
      </div>

      <div class="quick-actions">
        <button class="btn btn-primary" onclick="App.showWeightModal()">
          ⚖️ 记录体重
        </button>
        <button class="btn btn-secondary" onclick="App.navigate('training')">
          🏋️ 记录训练
        </button>
      </div>
    `;
    },

    // ============================================================
    // 体重追踪（T4）
    // ============================================================
    renderWeight() {
        const weightLog = Store.getWeightLog();
        const profile = Store.getProfile();

        // 图表
        const chartData = weightLog.slice(-30);
        const chartHTML = chartData.length > 0
            ? this._renderBarChart(chartData, 'weight', '最近 30 次')
            : '<div class="empty-state"><span class="empty-emoji">📊</span><p class="empty-text">记录体重后这里会显示趋势图</p></div>';

        // 周变化
        const weekChange = Store.getWeightChangeThisWeek();
        const weekChangeHTML = weekChange !== null
            ? `<span class="record-badge ${weekChange >= 0 ? 'up' : 'down'}">${weekChange >= 0 ? '↑' : '↓'} ${Math.abs(weekChange)}kg</span>`
            : '';

        // 历史记录（倒序，最多显示 20 条）
        const recentRecords = [...weightLog].reverse().slice(0, 20);
        const recordsHTML = recentRecords.length > 0
            ? `<ul class="record-list">${recentRecords.map((r, i) => {
                const prev = recentRecords[i + 1];
                const diff = prev ? +(r.weight - prev.weight).toFixed(1) : null;
                const badge = diff !== null
                    ? `<span class="record-badge ${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '+' : ''}${diff}</span>`
                    : '';
                return `<li class="record-item">
            <span class="record-date">${this._formatDate(r.date)}</span>
            <span>
              <span class="record-value">${r.weight}kg</span>
              ${badge}
            </span>
          </li>`;
            }).join('')}</ul>`
            : '<div class="empty-state"><span class="empty-emoji">⚖️</span><p class="empty-text">还没有体重记录</p></div>';

        return `
      <div class="page-header">
        <span class="emoji">⚖️</span>
        <h1>体重追踪</h1>
      </div>

      <button class="btn btn-primary btn-full mb-md" onclick="App.showWeightModal()">
        + 记录体重
      </button>

      <div class="card">
        <div class="card-title">
          趋势图 ${weekChangeHTML}
        </div>
        ${chartHTML}
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div style="padding:var(--space-md);padding-bottom:0">
          <div class="card-title">历史记录</div>
        </div>
        ${recordsHTML}
      </div>
    `;
    },

    // ============================================================
    // 训练记录（T5）
    // ============================================================
    renderTraining() {
        const templates = Store.getTemplates();
        const today = new Date().toISOString().split('T')[0];

        // 检查今天是否已有训练记录
        const todayLog = Store.getTrainingLog().find(t => t.date === today);

        const typeDescs = {
            A: '胸肩三头+腿',
            B: '背二头+后链',
            C: '全身综合'
        };

        // 最近训练历史
        const recentTraining = [...Store.getTrainingLog()].reverse().slice(0, 10);
        const historyHTML = recentTraining.length > 0
            ? `<div class="card" style="padding:0;overflow:hidden">
          <div style="padding:var(--space-md);padding-bottom:0">
            <div class="card-title">最近训练</div>
          </div>
          <ul class="record-list">${recentTraining.map(t => {
                const totalSets = t.exercises.reduce((sum, e) => sum + e.sets.length, 0);
                return `<li class="record-item">
              <span>
                <span class="record-value" style="font-size:1rem">训练 ${t.type}</span>
                <span class="record-date" style="display:block">${this._formatDate(t.date)}</span>
              </span>
              <span class="text-secondary">${totalSets} 组</span>
            </li>`;
            }).join('')}</ul>
        </div>`
            : '';

        return `
      <div class="page-header">
        <span class="emoji">🏋️</span>
        <h1>训练记录</h1>
      </div>

      <div class="card-title mb-sm">选择训练类型</div>
      <div class="type-selector">
        ${['A', 'B', 'C'].map(type => `
          <button class="type-btn" onclick="App.startTraining('${type}')">
            <span class="type-label">${type}</span>
            <span class="type-desc">${typeDescs[type]}</span>
          </button>
        `).join('')}
      </div>

      ${todayLog ? `
        <div class="card" style="background:var(--success-soft);border-color:rgba(16,185,129,0.3)">
          <span>✅ 今天已完成训练 ${todayLog.type}</span>
        </div>
      ` : ''}

      ${historyHTML}
    `;
    },

    renderTrainingForm(type) {
        const templates = Store.getTemplates();
        const exercises = templates[type] || [];

        const typeDescs = { A: '胸肩三头+腿', B: '背二头+后链', C: '全身综合' };
        const typeColors = { A: '#4f7df7', B: '#10b981', C: '#f59e0b' };

        const exercisesHTML = exercises.map((ex, exIdx) => {
            const prevSets = Store.getLastTrainingForExercise(ex.name);
            const prevHint = prevSets
                ? `上次: ${prevSets.map(s => `${s.weight}kg×${s.reps}`).join(', ')}`
                : '';

            const setsHTML = Array(ex.defaultSets).fill(0).map((_, setIdx) => {
                const prevSet = prevSets ? prevSets[setIdx] : null;
                const suggestedWeight = prevSet ? prevSet.weight : '';
                const suggestedReps = prevSet ? prevSet.reps : '';
                return `
          <div class="set-row">
            <span class="set-label">第${setIdx + 1}组</span>
            <input type="number" class="set-input" placeholder="kg" 
                   id="ex${exIdx}-set${setIdx}-weight" 
                   value="${suggestedWeight}" 
                   inputmode="decimal" step="0.5">
            <input type="number" class="set-input" placeholder="次" 
                   id="ex${exIdx}-set${setIdx}-reps" 
                   value="${suggestedReps}" 
                   inputmode="numeric">
          </div>
        `;
            }).join('');

            return `
        <div class="exercise-card">
          <div class="exercise-header">
            <span class="exercise-name">${ex.name}</span>
            <span class="exercise-muscle">${ex.muscle}</span>
          </div>
          ${prevHint ? `<div class="exercise-prev">📌 ${prevHint}</div>` : ''}
          <div class="card-title">${ex.defaultReps} · ${ex.defaultSets}组</div>
          ${setsHTML}
        </div>
      `;
        }).join('');

        return `
      <div class="page-header">
        <span class="emoji">🏋️</span>
        <h1>训练 ${type} · ${typeDescs[type]}</h1>
      </div>

      <div class="form-group">
        <label class="form-label">训练日期</label>
        <input type="date" class="form-input" id="training-date" 
               value="${new Date().toISOString().split('T')[0]}">
      </div>

      ${exercisesHTML}

      <div class="form-group mt-lg">
        <label class="form-label">训练备注（可选）</label>
        <input type="text" class="form-input" id="training-notes" 
               placeholder="例如：今天状态不错，深蹲加了2.5kg">
      </div>

      <div class="quick-actions mt-lg">
        <button class="btn btn-secondary" onclick="App.navigate('training')">取消</button>
        <button class="btn btn-primary" onclick="App.saveTraining('${type}')">✅ 完成训练</button>
      </div>
    `;
    },

    // ============================================================
    // 更多页面（T6 — 饮食 + 复盘 + 设置）
    // ============================================================
    renderMore() {
        const summary = Store.getDataSummary();
        const streak = Store.getConsecutiveReviewWeeks();

        return `
      <div class="page-header">
        <span class="emoji">⚙️</span>
        <h1>更多</h1>
      </div>

      <ul class="menu-list">
        <li class="menu-item" onclick="App.showNutritionModal()">
          <span class="menu-emoji">🍽️</span>
          <div class="menu-text">
            <h3>记录饮食</h3>
            <p>记录今日热量和蛋白质</p>
          </div>
          <span class="menu-arrow">›</span>
        </li>
        <li class="menu-item" onclick="App.showReviewPage()">
          <span class="menu-emoji">📋</span>
          <div class="menu-text">
            <h3>周复盘</h3>
            <p>${streak > 0 ? `🔥 已连续 ${streak} 周` : '本周还没有复盘'}</p>
          </div>
          <span class="menu-arrow">›</span>
        </li>
        <li class="menu-item" onclick="App.showDiagnosis()">
          <span class="menu-emoji">🔧</span>
          <div class="menu-text">
            <h3>问题诊断</h3>
            <p>体重停滞？力量不涨？来这里找答案</p>
          </div>
          <span class="menu-arrow">›</span>
        </li>
      </ul>

      <div class="divider"></div>

      <div class="card">
        <div class="card-title">📊 数据概要</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          <div class="text-secondary">体重记录</div><div class="fw-bold">${summary.weightRecords} 条</div>
          <div class="text-secondary">训练记录</div><div class="fw-bold">${summary.trainingRecords} 条</div>
          <div class="text-secondary">饮食记录</div><div class="fw-bold">${summary.nutritionRecords} 条</div>
          <div class="text-secondary">周复盘</div><div class="fw-bold">${summary.reviewRecords} 次</div>
        </div>
      </div>

      <div class="quick-actions">
        <button class="btn btn-secondary" onclick="Store.exportData(); App.toast('✅ 数据已导出', 'success')">
          📥 导出数据
        </button>
        <button class="btn btn-secondary" onclick="App.showImportModal()">
          📤 导入数据
        </button>
      </div>

      <button class="btn btn-danger btn-full btn-sm mt-md" onclick="App.confirmClear()">
        🗑️ 清除所有数据
      </button>
    `;
    },

    // ============================================================
    // 周复盘页面
    // ============================================================
    renderReview() {
        const trainingsThisWeek = Store.getTrainingThisWeek().length;
        const proteinDays = Store.getProteinDaysThisWeek();
        const weekChange = Store.getWeightChangeThisWeek();
        const streak = Store.getConsecutiveReviewWeeks();
        const hasReview = Store.hasReviewThisWeek();
        const weekStart = Store.getWeekStartDate();

        // 历史复盘
        const reviews = [...Store.getWeeklyReviews()].reverse().slice(0, 8);
        const historyHTML = reviews.length > 0
            ? `<div class="card-title mt-lg mb-sm">历史复盘</div>
         <ul class="record-list">${reviews.map(r => `
           <li class="record-item">
             <span>
               <span class="record-date">${this._formatDate(r.weekOf)} 周</span>
             </span>
             <span class="text-secondary">
               训练${r.trainingSessions}次 · 蛋白${r.proteinDaysOnTarget}天
               ${r.weightChange !== null ? ` · ${r.weightChange >= 0 ? '+' : ''}${r.weightChange}kg` : ''}
             </span>
           </li>
         `).join('')}</ul>`
            : '';

        if (hasReview) {
            return `
        <div class="page-header">
          <span class="emoji">📋</span>
          <h1>周复盘</h1>
        </div>
        <div class="card" style="background:var(--success-soft);border-color:rgba(16,185,129,0.3);text-align:center;padding:var(--space-xl)">
          <span style="font-size:3rem;display:block;margin-bottom:8px">✅</span>
          <div class="fw-bold" style="font-size:1.1rem">本周复盘已完成！</div>
          ${streak > 0 ? `<div class="text-success mt-sm">🔥 已连续 ${streak} 周</div>` : ''}
        </div>
        ${historyHTML}
        <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
      `;
        }

        return `
      <div class="page-header">
        <span class="emoji">📋</span>
        <h1>周复盘</h1>
      </div>

      <p class="text-secondary mb-md">每周五花 5 分钟回顾本周表现</p>

      <div class="review-check">
        <span class="check-icon">${trainingsThisWeek >= 3 ? '✅' : '⚠️'}</span>
        <div class="check-text">
          <div>本周训练 3 次完成了吗？</div>
          <div class="check-value">${trainingsThisWeek} / 3 次</div>
        </div>
      </div>

      <div class="review-check">
        <span class="check-icon">${proteinDays >= 5 ? '✅' : '⚠️'}</span>
        <div class="check-text">
          <div>蛋白质达标（90g+）几天？</div>
          <div class="check-value">${proteinDays} / 7 天</div>
        </div>
      </div>

      <div class="review-check">
        <span class="check-icon">📊</span>
        <div class="check-text">
          <div>体重变化</div>
          <div class="check-value">${weekChange !== null ? `${weekChange >= 0 ? '+' : ''}${weekChange}kg` : '数据不足'}</div>
        </div>
      </div>

      <div class="form-group mt-lg">
        <label class="form-label">本周备注（可选）</label>
        <input type="text" class="form-input" id="review-notes" 
               placeholder="例如：这周三缺了一次训练，下周补上">
      </div>

      <button class="btn btn-primary btn-full mt-md" onclick="App.submitReview()">
        ✅ 提交复盘
      </button>

      ${historyHTML}

      <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
    `;
    },

    // ============================================================
    // 问题诊断页面（简化版 — V2 第九部分）
    // ============================================================
    renderDiagnosis() {
        return `
      <div class="page-header">
        <span class="emoji">🔧</span>
        <h1>问题诊断</h1>
      </div>

      <p class="text-secondary mb-md">增肌过程中一定会遇到障碍，这不代表计划失败。</p>

      <div class="card">
        <div class="card-title">🍽️ 体重停滞（连续 3 周不涨）</div>
        <div class="text-secondary" style="font-size:0.85rem;line-height:1.8">
          1. 查薄荷 App 平均热量<br>
          2. < 2300 大卡？→ <strong>每天加 1 杯牛奶 + 1 个蛋（+200卡）</strong><br>
          3. ≥ 2300 大卡？→ 训练有没有加重量？<br>
          4. 没加 → <strong>下次训练加 1-2.5kg</strong><br>
          5. 加了 → <strong>再等 2 周，外胚型增速慢</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-title">💪 力量停滞（连续 2 周不涨）</div>
        <div class="text-secondary" style="font-size:0.85rem;line-height:1.8">
          1. 睡够 7h 了吗？← <strong>最常见原因</strong><br>
          2. 训练前 2-3h 吃了碳水吗？<br>
          3. 重量太重动作变形了？→ <strong>降 10%</strong><br>
          4. 上次训练隔了 48h+ 吗？
        </div>
      </div>

      <div class="card">
        <div class="card-title">🤕 肌肉酸痛</div>
        <div class="text-secondary" style="font-size:0.85rem;line-height:1.8">
          • 训练后 24-48h 酸痛 → <strong class="text-success">正常</strong>，该练照练<br>
          • 酸痛超 4 天 → <strong class="text-warning">训练量过大</strong>，延后 1-2 天<br>
          • 关节尖锐刺痛 → <strong class="text-danger">⚠️ 停练就医</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🚨 受伤了</div>
        <div class="text-secondary" style="font-size:0.85rem;line-height:1.8">
          • 局部受伤 → 停伤处，练其他部位<br>
          • 严重疼/肿 → 全停，就医<br>
          • 恢复期 → 先用 <strong>50% 重量</strong>起步
        </div>
      </div>

      <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
    `;
    },

    // ============================================================
    // 饮食记录 Modal
    // ============================================================
    renderNutritionModal() {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = Store.getNutritionLog().find(n => n.date === today);

        return `
      <div class="modal-title">
        🍽️ 记录饮食
        <button class="modal-close" onclick="App.closeModal()">×</button>
      </div>
      
      <div class="form-group">
        <label class="form-label">日期</label>
        <input type="date" class="form-input" id="nutrition-date" value="${today}">
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">热量（大卡）</label>
          <input type="number" class="form-input" id="nutrition-calories" 
                 placeholder="目标 2400" value="${todayLog ? todayLog.calories : ''}"
                 inputmode="numeric">
        </div>
        <div class="form-group">
          <label class="form-label">蛋白质（g）</label>
          <input type="number" class="form-input" id="nutrition-protein" 
                 placeholder="目标 100" value="${todayLog ? todayLog.protein : ''}"
                 inputmode="numeric">
        </div>
      </div>

      <div class="card" style="background:var(--accent-gradient-soft)">
        <div class="card-title">🎯 今日目标</div>
        <div class="text-secondary" style="font-size:0.85rem">
          热量 ≥ 2300 大卡 + 蛋白质 ≥ 90g = ✅ 达标
        </div>
      </div>

      <button class="btn btn-primary btn-full mt-md" onclick="App.saveNutrition()">
        ✅ 保存
      </button>
    `;
    },

    // ============================================================
    // 体重记录 Modal
    // ============================================================
    renderWeightModal() {
        const today = new Date().toISOString().split('T')[0];
        const lastWeight = Store.getLatestWeight();

        return `
      <div class="modal-title">
        ⚖️ 记录体重
        <button class="modal-close" onclick="App.closeModal()">×</button>
      </div>
      
      <div class="form-group">
        <label class="form-label">日期</label>
        <input type="date" class="form-input" id="weight-date" value="${today}">
      </div>

      <div class="form-group">
        <label class="form-label">体重（kg）</label>
        <input type="number" class="form-input" id="weight-value" 
               placeholder="${lastWeight}" step="0.1" inputmode="decimal"
               style="font-size:1.5rem;text-align:center;font-weight:700">
      </div>

      <p class="text-secondary text-center" style="font-size:0.85rem">
        上次记录：${lastWeight}kg
      </p>

      <button class="btn btn-primary btn-full mt-md" onclick="App.saveWeight()">
        ✅ 保存
      </button>
    `;
    },

    // ============================================================
    // 导入 Modal
    // ============================================================
    renderImportModal() {
        return `
      <div class="modal-title">
        📤 导入数据
        <button class="modal-close" onclick="App.closeModal()">×</button>
      </div>

      <p class="text-secondary mb-md">选择之前导出的 JSON 文件，导入后将覆盖当前所有数据。</p>

      <input type="file" id="import-file" accept=".json" class="form-input" 
             onchange="App.handleImportFile(event)">

      <div id="import-preview" class="hidden mt-md">
        <div class="card" style="background:var(--warning-soft);border-color:rgba(245,158,11,0.3)">
          <div class="card-title">⚠️ 确认导入</div>
          <div id="import-summary" class="text-secondary" style="font-size:0.85rem"></div>
          <button class="btn btn-primary btn-full mt-md" onclick="App.confirmImport()">
            确认覆盖当前数据
          </button>
        </div>
      </div>
    `;
    },

    // ============================================================
    // CSS 柱状图辅助
    // ============================================================
    _renderBarChart(data, valueKey, title) {
        if (data.length === 0) return '';

        const values = data.map(d => d[valueKey]);
        const min = Math.min(...values) - 0.5;
        const max = Math.max(...values) + 0.5;
        const range = max - min || 1;

        const today = new Date().toISOString().split('T')[0];

        const barsHTML = data.map(d => {
            const pct = ((d[valueKey] - min) / range) * 100;
            const isToday = d.date === today;
            const dayLabel = this._formatShortDate(d.date);
            return `
        <div class="bar-wrapper">
          <span class="bar-value">${d[valueKey]}</span>
          <div class="bar ${isToday ? 'today' : ''}" style="height:${Math.max(4, pct)}%"></div>
          <span class="bar-label">${dayLabel}</span>
        </div>
      `;
        }).join('');

        return `<div class="bar-chart">${barsHTML}</div>`;
    },

    // ============================================================
    // 日期格式化辅助
    // ============================================================
    _formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return `${d.getMonth() + 1}/${d.getDate()}`;
    },

    _formatShortDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return days[d.getDay()];
    }
};
