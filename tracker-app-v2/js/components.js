/**
 * components.js — V4 所有 UI 组件
 * 双区设计：展示区 Glassmorphism / 操作区高对比度
 * V4 新增：睡眠追踪 / 习惯打卡 / 凯格尔 / 水合
 */

const Components = {

    // ============================================================
    // 登录页
    // ============================================================
    renderLogin() {
        return `
      <div class="login-page">
        <div class="login-logo">💪</div>
        <div class="login-title" style="background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent">身体管理 V4</div>
        <div class="login-subtitle">全栈健康追踪 · 多设备同步 · 科学量化</div>
        ${isFirebaseReady ? `
          <button class="btn btn-login btn-full" onclick="App.login()" style="max-width:280px">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="">
            使用 Google 账号登录
          </button>
          <button class="btn btn-secondary btn-sm" onclick="App.skipLogin()">
            跳过，使用离线模式
          </button>
        ` : `
          <div class="glass-card" style="max-width:300px">
            <p class="text-secondary" style="font-size:0.85rem">
              ⚠️ Firebase 未配置，使用离线模式<br>
              <span class="text-muted">数据仅存储在本设备</span>
            </p>
          </div>
          <button class="btn btn-primary btn-full" onclick="App.skipLogin()" style="max-width:280px">
            进入离线模式
          </button>
        `}
      </div>
    `;
    },

    // ============================================================
    // 仪表盘
    // ============================================================
    renderDashboard() {
        const profile = Store.getProfile();
        const current = Store.getLatestWeight();
        const target = profile.targetWeight;
        const start = profile.startWeight;
        const weightPct = Math.max(0, Math.min(100, ((current - start) / (target - start)) * 100));
        const remaining = +(target - current).toFixed(1);

        const trainCount = Store.getTrainingThisWeek().length;
        const proteinDays = Store.getProteinDaysThisWeek();
        const hasReview = Store.hasReviewThisWeek();
        const syncStatus = Store.getSyncStatus();

        const trainPct = Math.min(100, (trainCount / 3) * 100);
        const proteinPct = Math.min(100, (proteinDays / 7) * 100);

        const trainClass = trainCount >= 3 ? 'success' : trainCount >= 1 ? 'warning' : '';
        const proteinClass = proteinDays >= 5 ? 'success' : proteinDays >= 3 ? 'warning' : '';
        const reviewClass = hasReview ? 'success' : '';

        // V4 新增指标
        const avgSleep = Store.getAvgSleepThisWeek();
        const habitScore = Store.getHabitScoreThisWeek();
        const kegelStreak = Store.getKegelStreak();
        const today = new Date().toISOString().split('T')[0];
        const todayHydra = Store.getHydrationLog().find(h => h.date === today);
        const waterL = todayHydra ? todayHydra.liters : 0;

        const sleepClass = avgSleep !== null ? (avgSleep >= 7.5 ? 'success' : avgSleep >= 6.5 ? 'warning' : '') : '';
        const habitClass = habitScore >= 80 ? 'success' : habitScore >= 50 ? 'warning' : '';

        // 趋势图
        const weights = Store.getWeightLog().slice(-7);
        const chartHTML = weights.length > 0 ? this._renderBarChart(weights, 'weight') : '';

        // 今日体重提示
        const todayW = Store.getWeightLog().find(w => w.date === today);
        const prompt = !todayW ? `<div class="glass-card" style="border-color:rgba(245,158,11,0.3)"><span>⚖️ 今日体重未记录</span></div>` : '';

        return `
      <div class="page-header">
        <div class="title-group">
          <span class="emoji">💪</span>
          <h1>身体管理</h1>
        </div>
        ${Animations.renderSyncBadge(syncStatus)}
      </div>

      ${prompt}

      <div class="glass-card">
        ${Animations.createProgressRings(weightPct, trainPct, proteinPct, `${current}kg`)}
        <div class="text-center text-secondary" style="font-size:0.85rem;margin-top:4px">
          ${remaining > 0 ? `距目标 ${target}kg 还差 ${remaining}kg` : '🎉 已达目标！'}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card ${trainClass}">
          <span class="stat-emoji">🏋️</span>
          <span class="stat-value">${trainCount}/3</span>
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

      <div class="stats-grid">
        <div class="stat-card ${sleepClass}">
          <span class="stat-emoji">🌙</span>
          <span class="stat-value">${avgSleep !== null ? avgSleep + 'h' : '—'}</span>
          <span class="stat-label">平均睡眠</span>
        </div>
        <div class="stat-card ${habitClass}">
          <span class="stat-emoji">✅</span>
          <span class="stat-value">${habitScore}%</span>
          <span class="stat-label">习惯达标</span>
        </div>
        <div class="stat-card ${waterL >= 2.0 ? 'success' : ''}">
          <span class="stat-emoji">💧</span>
          <span class="stat-value">${waterL > 0 ? waterL + 'L' : '—'}</span>
          <span class="stat-label">今日饮水</span>
        </div>
      </div>

      ${kegelStreak > 0 ? `<div class="glass-card" style="display:flex;align-items:center;gap:var(--s-md);border-color:rgba(16,185,129,0.3)"><span style="font-size:1.5rem">🧘</span><div><div class="fw-bold">凯格尔 🔥 连续 ${kegelStreak} 天</div><div class="text-secondary" style="font-size:0.8rem">保持每日3组打卡</div></div></div>` : ''}

      ${chartHTML ? `<div class="glass-card"><div class="card-title">📊 体重趋势</div>${chartHTML}</div>` : ''}

      <div class="quick-actions">
        <button class="btn btn-primary" onclick="App.showWeightModal()">⚖️ 记录体重</button>
        <button class="btn btn-secondary" onclick="App.navigate('training')">🏋️ 记录训练</button>
      </div>
      <div class="quick-actions">
        <button class="btn btn-secondary" onclick="App.showSleepModal()">🌙 记录睡眠</button>
        <button class="btn btn-secondary" onclick="App.showHydrationModal()">💧 记录饮水</button>
      </div>
    `;
    },

    // ============================================================
    // 体重追踪
    // ============================================================
    renderWeight() {
        const log = Store.getWeightLog();
        const chartData = log.slice(-30);
        const chartHTML = chartData.length > 0 ? this._renderBarChart(chartData, 'weight') : '<div class="empty-state"><span class="empty-emoji">📊</span><p class="empty-text">记录体重后显示趋势</p></div>';
        const weekChange = Store.getWeightChangeThisWeek();
        const weekBadge = weekChange !== null ? `<span class="record-badge ${weekChange >= 0 ? 'up' : 'down'}">${weekChange >= 0 ? '↑' : '↓'} ${Math.abs(weekChange)}kg</span>` : '';

        const records = [...log].reverse().slice(0, 20);
        const listHTML = records.length > 0 ? `<ul class="record-list">${records.map((r, i) => {
            const prev = records[i + 1];
            const diff = prev ? +(r.weight - prev.weight).toFixed(1) : null;
            const badge = diff !== null ? `<span class="record-badge ${diff >= 0 ? 'up' : 'down'}">${diff >= 0 ? '+' : ''}${diff}</span>` : '';
            return `<li class="record-item"><span class="record-date">${this._fmtDate(r.date)}</span><span><span class="record-value">${r.weight}kg</span> ${badge}</span></li>`;
        }).join('')}</ul>` : '<div class="empty-state"><span class="empty-emoji">⚖️</span><p>还没有记录</p></div>';

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">⚖️</span><h1>体重追踪</h1></div></div>
      <button class="btn btn-primary btn-full mb-md" onclick="App.showWeightModal()">+ 记录体重</button>
      <div class="glass-card"><div class="card-title">趋势 ${weekBadge}</div>${chartHTML}</div>
      <div class="glass-card" style="padding:0;overflow:hidden">
        <div style="padding:var(--s-md);padding-bottom:0"><div class="card-title">历史记录</div></div>
        ${listHTML}
      </div>
    `;
    },

    // ============================================================
    // 训练页
    // ============================================================
    renderTraining() {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = Store.getTrainingLog().find(t => t.date === today);
        const typeDescs = { A: '推 胸肩三头', B: '拉 背二头', C: '腿+核心', GA: '下肢前+推', GB: '下肢后+拉' };

        const recent = [...Store.getTrainingLog()].reverse().slice(0, 10);
        const histHTML = recent.length > 0 ? `<div class="glass-card" style="padding:0;overflow:hidden"><div style="padding:var(--s-md);padding-bottom:0"><div class="card-title">最近训练</div></div><ul class="record-list">${recent.map(t => {
            const sets = t.exercises.reduce((s, e) => s + (e.sets ? e.sets.length : 0), 0);
            return `<li class="record-item"><span><span class="record-value" style="font-size:1rem">训练 ${t.type}</span><span class="record-date" style="display:block">${this._fmtDate(t.date)}</span></span><span class="text-secondary">${sets} 组</span></li>`;
        }).join('')}</ul></div>` : '';

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">🏋️</span><h1>训练记录</h1></div></div>
      <div class="card-title mb-sm">🏠 居家哑铃（轨道A）</div>
      <div class="type-selector">
        ${['A', 'B', 'C'].map(t => `<button class="type-btn" onclick="App.startTraining('${t}')"><span class="type-label">${t}</span><span class="type-desc">${typeDescs[t]}</span></button>`).join('')}
      </div>
      <div class="card-title mb-sm mt-md">🏋️ 健身房极简（轨道B）</div>
      <div class="type-selector" style="grid-template-columns:1fr 1fr">
        ${['GA', 'GB'].map(t => `<button class="type-btn" onclick="App.startTraining('${t}')"><span class="type-label">${t.replace('G','')}</span><span class="type-desc">${typeDescs[t]}</span></button>`).join('')}
      </div>
      ${todayLog ? `<div class="glass-card" style="border-color:rgba(16,185,129,0.3)">✅ 今天已完成训练 ${todayLog.type}</div>` : ''}
      ${histHTML}
    `;
    },

    renderTrainingForm(type) {
        const templates = Store.getTemplates();
        const exercises = templates[type] || [];
        const typeDescs = { A: '推 胸肩三头', B: '拉 背二头', C: '腿+核心', GA: '下肢前+推', GB: '下肢后+拉' };

        const exHTML = exercises.map((ex, ei) => {
            const prev = Store.getLastTrainingForExercise(ex.name);
            const hint = prev ? `📌 上次: ${prev.map(s => `${s.weight}kg×${s.reps}`).join(', ')}` : '';
            const sets = Array(ex.defaultSets).fill(0).map((_, si) => {
                const ps = prev ? prev[si] : null;
                return `<div class="set-row"><span class="set-label">第${si + 1}组</span><input type="number" class="set-input" placeholder="kg" id="ex${ei}-s${si}-w" value="${ps ? ps.weight : ''}" inputmode="decimal" step="0.5"><input type="number" class="set-input" placeholder="次" id="ex${ei}-s${si}-r" value="${ps ? ps.reps : ''}" inputmode="numeric"></div>`;
            }).join('');
            return `<div class="exercise-card"><div class="exercise-header"><span class="exercise-name">${ex.name}</span><span class="exercise-muscle">${ex.muscle}</span></div>${hint ? `<div class="exercise-prev">${hint}</div>` : ''}<div class="card-title">${ex.defaultReps} · ${ex.defaultSets}组</div>${sets}</div>`;
        }).join('');

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">🏋️</span><h1>训练 ${type}</h1></div></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="training-date" value="${new Date().toISOString().split('T')[0]}"></div>
      ${exHTML}
      <div class="form-group mt-lg"><label class="form-label">备注（可选）</label><input type="text" class="form-input" id="training-notes" placeholder="今天状态如何？"></div>
      <div class="quick-actions mt-lg"><button class="btn btn-secondary" onclick="App.navigate('training')">取消</button><button class="btn btn-primary" onclick="App.saveTraining('${type}')">✅ 完成训练</button></div>
    `;
    },

    // ============================================================
    // 更多页面
    // ============================================================
    renderMore() {
        const summary = Store.getDataSummary();
        const streak = Store.getConsecutiveReviewWeeks();
        const user = Auth.getUser();
        const isOnline = Auth.isOnlineMode();

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">⚙️</span><h1>更多</h1></div></div>
      ${isOnline ? `<div class="glass-card" style="display:flex;align-items:center;gap:var(--s-md)"><div style="width:40px;height:40px;border-radius:50%;background:var(--gradient);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.2rem">${(user.displayName || 'U')[0]}</div><div><div class="fw-bold">${user.displayName || '用户'}</div><div class="text-secondary" style="font-size:0.8rem">${user.email || ''}</div></div></div>` : ''}
      <ul class="menu-list">
        <li class="menu-item" onclick="App.showSleepModal()"><span class="menu-emoji">🌙</span><div class="menu-text"><h3>记录睡眠</h3><p>入睡/起床时间</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.showNutritionModal()"><span class="menu-emoji">🍽️</span><div class="menu-text"><h3>记录饮食</h3><p>热量 + 蛋白质</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.showHydrationModal()"><span class="menu-emoji">💧</span><div class="menu-text"><h3>记录饮水</h3><p>目标 2-2.5L/天</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.showKegelModal()"><span class="menu-emoji">🧘</span><div class="menu-text"><h3>凯格尔训练</h3><p>${Store.getKegelStreak() > 0 ? `🔥 连续 ${Store.getKegelStreak()} 天` : '今日未打卡'}</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.navigate('habits')"><span class="menu-emoji">✅</span><div class="menu-text"><h3>习惯打卡</h3><p>每日 5 项健康习惯</p></div><span class="menu-arrow">›</span></li>
      </ul>
      <div class="divider"></div>
      <ul class="menu-list">
        <li class="menu-item" onclick="App.showReviewPage()"><span class="menu-emoji">📋</span><div class="menu-text"><h3>周复盘</h3><p>${streak > 0 ? `🔥 连续 ${streak} 周` : '本周未复盘'}</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.showMeasurementModal()"><span class="menu-emoji">📏</span><div class="menu-text"><h3>围度记录</h3><p>腰围/胸围/臂围</p></div><span class="menu-arrow">›</span></li>
        <li class="menu-item" onclick="App.navigate('diagnosis')"><span class="menu-emoji">🔧</span><div class="menu-text"><h3>问题诊断</h3><p>体重停滞？力量不涨？</p></div><span class="menu-arrow">›</span></li>
      </ul>
      <div class="divider"></div>
      <div class="glass-card"><div class="card-title">📊 数据概要</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;font-size:0.9rem"><div class="text-secondary">体重记录</div><div class="fw-bold">${summary.weightRecords} 条</div><div class="text-secondary">围度记录</div><div class="fw-bold">${summary.measurementRecords} 条</div><div class="text-secondary">训练记录</div><div class="fw-bold">${summary.trainingRecords} 条</div><div class="text-secondary">饮食记录</div><div class="fw-bold">${summary.nutritionRecords} 条</div><div class="text-secondary">睡眠记录</div><div class="fw-bold">${summary.sleepRecords} 条</div><div class="text-secondary">凯格尔</div><div class="fw-bold">${summary.kegelRecords} 条</div><div class="text-secondary">饮水</div><div class="fw-bold">${summary.hydrationRecords} 条</div><div class="text-secondary">周复盘</div><div class="fw-bold">${summary.reviewRecords} 次</div></div></div>
      <div class="quick-actions">
        <button class="btn btn-secondary" onclick="Store.exportData();App.toast('✅ 已导出','success')">📥 导出</button>
        <button class="btn btn-secondary" onclick="App.showImportModal()">📤 导入</button>
      </div>
      ${Store.hasV1Data() ? `<button class="btn btn-secondary btn-full btn-sm mt-sm" onclick="App.migrateV1()">🔄 从 V1 迁移数据</button>` : ''}
      <button class="btn btn-danger btn-full btn-sm mt-md" onclick="App.confirmClear()">🗑️ 清除所有数据</button>
      ${isOnline ? `<button class="btn btn-secondary btn-full btn-sm mt-sm" onclick="App.logout()">🚪 退出登录</button>` : ''}
    `;
    },

    // ============================================================
    // 周复盘
    // ============================================================
    renderReview() {
        const train = Store.getTrainingThisWeek().length;
        const protein = Store.getProteinDaysThisWeek();
        const wc = Store.getWeightChangeThisWeek();
        const streak = Store.getConsecutiveReviewWeeks();
        const hasR = Store.hasReviewThisWeek();
        const sleepDays = Store.getSleepDaysOnTargetThisWeek();
        const kegelDays = Store.getKegelDaysThisWeek();
        const detoxDays = Store.getDetoxDaysThisWeek();

        const reviews = [...Store.getWeeklyReviews()].reverse().slice(0, 8);
        const hist = reviews.length > 0 ? `<div class="card-title mt-lg mb-sm">历史复盘</div><ul class="record-list">${reviews.map(r => `<li class="record-item"><span class="record-date">${this._fmtDate(r.weekOf)} 周</span><span class="text-secondary">训练${r.trainingSessions}次 · 蛋白${r.proteinDaysOnTarget}天${r.sleepDaysOnTarget !== undefined ? ` · 睡眠${r.sleepDaysOnTarget}天` : ''}${r.kegelDays !== undefined ? ` · 凯格尔${r.kegelDays}天` : ''}${r.weightChange !== null ? ` · ${r.weightChange >= 0 ? '+' : ''}${r.weightChange}kg` : ''}</span></li>`).join('')}</ul>` : '';

        if (hasR) return `<div class="page-header"><div class="title-group"><span class="emoji">📋</span><h1>周复盘</h1></div></div><div class="glass-card" style="border-color:rgba(16,185,129,0.3);text-align:center;padding:var(--s-2xl)"><span style="font-size:3rem;display:block;margin-bottom:8px">✅</span><div class="fw-bold" style="font-size:1.1rem">本周复盘已完成！</div>${streak > 0 ? `<div class="text-success mt-sm">🔥 连续 ${streak} 周</div>` : ''}</div>${hist}<button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>`;

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">📋</span><h1>周复盘</h1></div></div>
      <p class="text-secondary mb-md">每周花 5 分钟回顾，覆盖 6 个维度</p>
      <div class="card-title mb-sm" style="font-size:0.85rem;color:var(--text-secondary)">💪 训练与营养</div>
      <div class="review-check"><span class="check-icon">${train >= 3 ? '✅' : '⚠️'}</span><div class="check-text"><div>本周训练 3 次？</div><div class="check-value">${train}/3</div></div></div>
      <div class="review-check"><span class="check-icon">${protein >= 5 ? '✅' : '⚠️'}</span><div class="check-text"><div>蛋白质达标？</div><div class="check-value">${protein}/7 天</div></div></div>
      <div class="review-check"><span class="check-icon">📊</span><div class="check-text"><div>体重变化</div><div class="check-value">${wc !== null ? `${wc >= 0 ? '+' : ''}${wc}kg` : '数据不足'}</div></div></div>
      <div class="card-title mt-md mb-sm" style="font-size:0.85rem;color:var(--text-secondary)">🌙 作息与健康</div>
      <div class="review-check"><span class="check-icon">${sleepDays >= 5 ? '✅' : '⚠️'}</span><div class="check-text"><div>睡眠达标？(23:30前+≥7.5h)</div><div class="check-value">${sleepDays}/7 天</div></div></div>
      <div class="review-check"><span class="check-icon">${kegelDays >= 5 ? '✅' : '⚠️'}</span><div class="check-text"><div>凯格尔打卡？(≥3组/天)</div><div class="check-value">${kegelDays}/7 天</div></div></div>
      <div class="review-check"><span class="check-icon">${detoxDays >= 5 ? '✅' : '⚠️'}</span><div class="check-text"><div>数字戒断？(=睡眠达标)</div><div class="check-value">${detoxDays}/7 天</div></div></div>
      <div class="form-group mt-lg"><label class="form-label">备注</label><input type="text" class="form-input" id="review-notes" placeholder="本周经验总结"></div>
      <button class="btn btn-primary btn-full mt-md" onclick="App.submitReview()">✅ 提交复盘</button>
      ${hist}
      <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
    `;
    },

    // ============================================================
    // 问题诊断
    // ============================================================
    renderDiagnosis() {
        return `
      <div class="page-header"><div class="title-group"><span class="emoji">🔧</span><h1>问题诊断</h1></div></div>
      <p class="text-secondary mb-md">遇到障碍不代表失败</p>
      <div class="glass-card"><div class="card-title">🍽️ 体重停滞</div><div class="text-secondary" style="font-size:0.85rem;line-height:1.8">1. 查平均热量<br>2. < 2300 → <strong>加 1 杯牛奶 + 1 蛋</strong><br>3. ≥ 2300 → 训练加重量了吗？<br>4. 没加 → <strong>下次 +1-2.5kg</strong><br>5. 加了 → <strong>再等 2 周</strong></div></div>
      <div class="glass-card"><div class="card-title">💪 力量停滞</div><div class="text-secondary" style="font-size:0.85rem;line-height:1.8">1. 睡够 7h？<br>2. 训练前吃了碳水？<br>3. 动作变形？→ <strong>降 10%</strong><br>4. 间隔够 48h？</div></div>
      <div class="glass-card"><div class="card-title">🤕 肌肉酸痛</div><div class="text-secondary" style="font-size:0.85rem;line-height:1.8">• 24-48h → <strong class="text-success">正常</strong><br>• 超 4 天 → <strong class="text-warning">训练量大</strong><br>• 关节刺痛 → <strong class="text-danger">⚠️ 停练就医</strong></div></div>
      <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
    `;
    },

    // ============================================================
    // Modals
    // ============================================================
    renderWeightModal() {
        const today = new Date().toISOString().split('T')[0];
        const last = Store.getLatestWeight();
        return `<div class="modal-title">⚖️ 记录体重<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="weight-date" value="${today}"></div>
      <div class="form-group"><label class="form-label">体重（kg）</label><input type="number" class="form-input" id="weight-value" placeholder="${last}" step="0.1" inputmode="decimal" style="font-size:1.8rem;text-align:center;font-weight:800;padding:20px"></div>
      <p class="text-secondary text-center" style="font-size:0.85rem">上次：${last}kg</p>
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveWeight()">✅ 保存</button>`;
    },

    renderNutritionModal() {
        const today = new Date().toISOString().split('T')[0];
        const tLog = Store.getNutritionLog().find(n => n.date === today);
        return `<div class="modal-title">🍽️ 记录饮食<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="nut-date" value="${today}"></div>
      <div class="form-row"><div class="form-group"><label class="form-label">热量（大卡）</label><input type="number" class="form-input" id="nut-cal" placeholder="目标 2400" value="${tLog ? tLog.calories : ''}" inputmode="numeric"></div><div class="form-group"><label class="form-label">蛋白质（g）</label><input type="number" class="form-input" id="nut-pro" placeholder="目标 100" value="${tLog ? tLog.protein : ''}" inputmode="numeric"></div></div>
      <div class="glass-card" style="background:var(--gradient-soft)"><div class="card-title">🎯 达标线</div><div class="text-secondary" style="font-size:0.85rem">热量 ≥ 2300 + 蛋白 ≥ 90g = ✅</div></div>
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveNutrition()">✅ 保存</button>`;
    },

    renderMeasurementModal() {
        const today = new Date().toISOString().split('T')[0];
        const last = Store.getMeasurementLog();
        const prev = last.length > 0 ? last[last.length - 1] : null;
        return `<div class="modal-title">📏 记录围度<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="meas-date" value="${today}"></div>
      <div class="form-row"><div class="form-group"><label class="form-label">腰围 cm${prev ? ` (上次:${prev.waist})` : ''}</label><input type="number" class="form-input" id="meas-waist" inputmode="decimal" step="0.5"></div><div class="form-group"><label class="form-label">胸围 cm${prev ? ` (上次:${prev.chest})` : ''}</label><input type="number" class="form-input" id="meas-chest" inputmode="decimal" step="0.5"></div></div>
      <div class="form-row"><div class="form-group"><label class="form-label">左臂 cm${prev ? ` (上次:${prev.armLeft})` : ''}</label><input type="number" class="form-input" id="meas-armL" inputmode="decimal" step="0.5"></div><div class="form-group"><label class="form-label">右臂 cm${prev ? ` (上次:${prev.armRight})` : ''}</label><input type="number" class="form-input" id="meas-armR" inputmode="decimal" step="0.5"></div></div>
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveMeasurement()">✅ 保存</button>`;
    },

    renderImportModal() {
        return `<div class="modal-title">📤 导入数据<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <p class="text-secondary mb-md">选择 JSON 文件，导入后覆盖当前数据。</p>
      <input type="file" id="import-file" accept=".json" class="form-input" onchange="App.handleImport(event)">
      <div id="import-preview" class="hidden mt-md"><div class="glass-card" style="border-color:rgba(245,158,11,0.3)"><div class="card-title">⚠️ 确认导入</div><div id="import-summary" class="text-secondary" style="font-size:0.85rem"></div><button class="btn btn-primary btn-full mt-md" onclick="App.confirmImport()">确认覆盖</button></div></div>`;
    },

    // ============================================================
    // V4: 睡眠记录 Modal
    // ============================================================
    renderSleepModal() {
        const today = new Date().toISOString().split('T')[0];
        const lastSleep = Store.getSleepLog();
        const prev = lastSleep.length > 0 ? lastSleep[lastSleep.length - 1] : null;
        return `<div class="modal-title">🌙 记录睡眠<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="sleep-date" value="${today}"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">入睡时间</label><input type="time" class="form-input" id="sleep-bed" value="${prev ? prev.bedTime : '23:30'}" style="font-size:1.4rem;text-align:center;padding:16px"></div>
        <div class="form-group"><label class="form-label">起床时间</label><input type="time" class="form-input" id="sleep-wake" value="${prev ? prev.wakeTime : '07:30'}" style="font-size:1.4rem;text-align:center;padding:16px"></div>
      </div>
      <div class="glass-card" style="background:var(--gradient-soft)">
        <div class="card-title">🎯 达标线</div>
        <div class="text-secondary" style="font-size:0.85rem">23:30 前入睡 + 睡满 7.5h = ✅</div>
      </div>
      ${prev ? `<p class="text-secondary text-center" style="font-size:0.85rem">上次：${prev.bedTime} → ${prev.wakeTime}（${prev.duration}h）</p>` : ''}
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveSleep()">✅ 保存</button>`;
    },

    // ============================================================
    // V4: 凯格尔 Modal
    // ============================================================
    renderKegelModal() {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = Store.getKegelLog().find(k => k.date === today);
        const streak = Store.getKegelStreak();
        return `<div class="modal-title">🧘 凯格尔训练<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="kegel-date" value="${today}"></div>
      <div class="form-group">
        <label class="form-label">完成组数（目标 3 组）</label>
        <div style="display:flex;gap:12px;justify-content:center;margin:16px 0">
          ${[1,2,3].map(n => `<button class="btn ${todayLog && todayLog.sets >= n ? 'btn-primary' : 'btn-secondary'}" style="width:64px;height:64px;font-size:1.5rem;border-radius:50%" onclick="document.getElementById('kegel-sets').value=${n}">${n}</button>`).join('')}
        </div>
        <input type="number" class="form-input" id="kegel-sets" value="${todayLog ? todayLog.sets : 3}" min="1" max="10" style="text-align:center;font-size:1.4rem">
      </div>
      <div class="glass-card" style="text-align:center">
        <div style="font-size:0.85rem;color:var(--text-secondary)">每组：收缩5秒 → 放松5秒 × 10次</div>
        ${streak > 0 ? `<div class="text-success mt-sm">🔥 连续 ${streak} 天</div>` : ''}
      </div>
      ${todayLog ? '<div class="glass-card" style="border-color:rgba(16,185,129,0.3);text-align:center">✅ 今日已完成</div>' : ''}
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveKegel()">✅ 打卡</button>`;
    },

    // ============================================================
    // V4: 饮水 Modal
    // ============================================================
    renderHydrationModal() {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = Store.getHydrationLog().find(h => h.date === today);
        const currentCups = todayLog ? todayLog.cups : 0;
        return `<div class="modal-title">💧 记录饮水<button class="modal-close" onclick="App.closeModal()">×</button></div>
      <div class="form-group"><label class="form-label">日期</label><input type="date" class="form-input" id="hydra-date" value="${today}"></div>
      <div style="text-align:center;margin:20px 0">
        <div style="font-size:3rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent" id="hydra-display">${currentCups}</div>
        <div class="text-secondary">杯（每杯约 250ml）</div>
        <div class="text-secondary" style="font-size:0.85rem;margin-top:4px">${(currentCups * 0.25).toFixed(1)}L / 目标 2.0L</div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;margin:16px 0">
        <button class="btn btn-secondary" style="width:56px;height:56px;font-size:1.5rem;border-radius:50%" onclick="App.adjustWater(-1)">−</button>
        <input type="number" class="form-input" id="hydra-cups" value="${currentCups}" min="0" max="20" style="width:80px;text-align:center;font-size:1.4rem" oninput="document.getElementById('hydra-display').textContent=this.value">
        <button class="btn btn-primary" style="width:56px;height:56px;font-size:1.5rem;border-radius:50%" onclick="App.adjustWater(1)">+</button>
      </div>
      <div class="glass-card" style="background:var(--gradient-soft)">
        <div class="card-title">🎯 达标线</div>
        <div class="text-secondary" style="font-size:0.85rem">≥ 8 杯（2.0L）= ✅</div>
      </div>
      <button class="btn btn-primary btn-full mt-md" onclick="App.saveHydration()">✅ 保存</button>`;
    },

    // ============================================================
    // V4: 习惯打卡页面
    // ============================================================
    renderHabits() {
        const today = new Date().toISOString().split('T')[0];
        const habits = Store.getHabitsForDate(today);
        const score = Store.getHabitScoreForDate(today);
        const weekScore = Store.getHabitScoreThisWeek();

        const items = [
            { key: 'sleep', emoji: '🌙', label: '23:30前入睡', done: habits.sleep, action: 'App.showSleepModal()', auto: true },
            { key: 'kegel', emoji: '🧘', label: '凯格尔3组', done: habits.kegel, action: 'App.showKegelModal()', auto: false },
            { key: 'water', emoji: '💧', label: '饮水≥2L', done: habits.water, action: 'App.showHydrationModal()', auto: true },
            { key: 'protein', emoji: '🥩', label: '蛋白≥75g', done: habits.protein, action: 'App.showNutritionModal()', auto: true },
            { key: 'detox', emoji: '📱', label: '数字戒断', done: habits.detox, action: 'App.showSleepModal()', auto: true }
        ];

        return `
      <div class="page-header"><div class="title-group"><span class="emoji">✅</span><h1>今日习惯</h1></div></div>
      <div class="glass-card" style="text-align:center">
        <div style="font-size:3rem;font-weight:800;background:var(--gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${score.completed}/${score.total}</div>
        <div class="text-secondary">今日完成率 ${score.percentage}%</div>
        <div class="text-secondary" style="font-size:0.8rem;margin-top:4px">本周平均 ${weekScore}%</div>
        <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:4px;margin-top:12px;overflow:hidden">
          <div style="width:${score.percentage}%;height:100%;background:var(--gradient);border-radius:4px;transition:width 0.5s ease"></div>
        </div>
      </div>
      <div class="habit-list">
        ${items.map(item => `
          <div class="habit-item ${item.done ? 'done' : ''}" onclick="${item.action}">
            <span class="habit-emoji">${item.emoji}</span>
            <div class="habit-info">
              <span class="habit-label">${item.label}</span>
              <span class="habit-tag">${item.auto ? '自动' : '手动'}</span>
            </div>
            <span class="habit-status">${item.done ? '✅' : '○'}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-full mt-lg" onclick="App.navigate('more')">← 返回</button>
    `;
    },

    // ============================================================
    // 辅助
    // ============================================================
    _renderBarChart(data, key) {
        if (!data.length) return '';
        const vals = data.map(d => d[key]);
        const min = Math.min(...vals) - 0.5;
        const max = Math.max(...vals) + 0.5;
        const range = max - min || 1;
        const today = new Date().toISOString().split('T')[0];
        return `<div class="bar-chart">${data.map(d => {
            const pct = ((d[key] - min) / range) * 100;
            const isToday = d.date === today;
            const days = ['日', '一', '二', '三', '四', '五', '六'];
            const dd = new Date(d.date + 'T00:00:00');
            return `<div class="bar-wrapper"><span class="bar-value">${d[key]}</span><div class="bar ${isToday ? 'today' : ''}" style="height:${Math.max(4, pct)}%"></div><span class="bar-label">${days[dd.getDay()]}</span></div>`;
        }).join('')}</div>`;
    },

    _fmtDate(s) { const d = new Date(s + 'T00:00:00'); return `${d.getMonth() + 1}/${d.getDate()}`; }
};
