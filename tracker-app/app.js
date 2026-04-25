/**
 * app.js — 主程序：路由 + 初始化 + 事件绑定
 * 
 * 路由方案：hash 路由（#/dashboard, #/weight, #/training, #/more）
 * 页面切换：隐藏所有 section → 显示目标 section
 */

const App = {
    // 当前状态
    _currentPage: 'dashboard',
    _trainingType: null,
    _importData: null,

    // ============================================================
    // 初始化
    // ============================================================
    init() {
        // 初始化数据层
        Store.init();

        // 绑定路由
        window.addEventListener('hashchange', () => this._onRouteChange());

        // 初始路由
        const hash = window.location.hash.slice(2) || 'dashboard';
        this.navigate(hash);

        // 月度备份提醒（每月 1 号）
        this._checkBackupReminder();
    },

    // ============================================================
    // 路由
    // ============================================================
    navigate(page) {
        window.location.hash = `/${page}`;
    },

    _onRouteChange() {
        const hash = window.location.hash.slice(2) || 'dashboard';
        this._currentPage = hash;
        this._render();
        this._updateNav();
        // 滚动到顶部
        window.scrollTo(0, 0);
    },

    _render() {
        const container = document.getElementById('app-content');
        const page = this._currentPage;

        switch (page) {
            case 'dashboard':
                container.innerHTML = Components.renderDashboard();
                break;
            case 'weight':
                container.innerHTML = Components.renderWeight();
                break;
            case 'training':
                if (this._trainingType) {
                    container.innerHTML = Components.renderTrainingForm(this._trainingType);
                    this._trainingType = null;
                } else {
                    container.innerHTML = Components.renderTraining();
                }
                break;
            case 'more':
                container.innerHTML = Components.renderMore();
                break;
            case 'review':
                container.innerHTML = Components.renderReview();
                break;
            case 'diagnosis':
                container.innerHTML = Components.renderDiagnosis();
                break;
            default:
                container.innerHTML = Components.renderDashboard();
        }

        // 添加 page class
        container.className = 'page active';
    },

    _updateNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            const target = item.dataset.page;
            if (target === this._currentPage ||
                (this._currentPage === 'review' && target === 'more') ||
                (this._currentPage === 'diagnosis' && target === 'more')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    // ============================================================
    // 操作方法
    // ============================================================

    // -- 体重 --
    showWeightModal() {
        const modal = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = Components.renderWeightModal();
        modal.classList.add('show');
        // 自动聚焦输入框
        setTimeout(() => {
            const input = document.getElementById('weight-value');
            if (input) input.focus();
        }, 300);
    },

    saveWeight() {
        const date = document.getElementById('weight-date').value;
        const weight = parseFloat(document.getElementById('weight-value').value);

        if (!date || isNaN(weight) || weight <= 0) {
            this.toast('请输入有效的体重', 'error');
            return;
        }

        Store.addWeight(date, weight);
        this.closeModal();
        this.toast(`✅ 已记录 ${weight}kg`, 'success');
        this._render();
    },

    // -- 训练 --
    startTraining(type) {
        this._trainingType = type;
        this.navigate('training');
    },

    saveTraining(type) {
        const date = document.getElementById('training-date').value;
        const notes = document.getElementById('training-notes').value;
        const templates = Store.getTemplates();
        const exercises = templates[type] || [];

        const record = {
            date,
            type,
            exercises: [],
            notes
        };

        let hasData = false;
        exercises.forEach((ex, exIdx) => {
            const sets = [];
            for (let setIdx = 0; setIdx < ex.defaultSets; setIdx++) {
                const weightInput = document.getElementById(`ex${exIdx}-set${setIdx}-weight`);
                const repsInput = document.getElementById(`ex${exIdx}-set${setIdx}-reps`);
                const weight = parseFloat(weightInput?.value);
                const reps = parseInt(repsInput?.value);
                if (!isNaN(weight) && !isNaN(reps) && weight > 0 && reps > 0) {
                    sets.push({ weight, reps });
                    hasData = true;
                }
            }
            record.exercises.push({ name: ex.name, sets });
        });

        if (!hasData) {
            this.toast('请至少填写一组训练数据', 'error');
            return;
        }

        Store.addTraining(record);
        this.toast(`✅ 训练 ${type} 已保存！`, 'success');
        this.navigate('dashboard');
    },

    // -- 饮食 --
    showNutritionModal() {
        const modal = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = Components.renderNutritionModal();
        modal.classList.add('show');
    },

    saveNutrition() {
        const date = document.getElementById('nutrition-date').value;
        const calories = parseInt(document.getElementById('nutrition-calories').value);
        const protein = parseInt(document.getElementById('nutrition-protein').value);

        if (!date || isNaN(calories) || isNaN(protein)) {
            this.toast('请填写完整', 'error');
            return;
        }

        Store.addNutrition(date, calories, protein);
        this.closeModal();
        const onTarget = calories >= 2300 && protein >= 90;
        this.toast(onTarget ? '✅ 今日达标！继续保持' : '📝 已记录，加油补够！', onTarget ? 'success' : '');
        this._render();
    },

    // -- 周复盘 --
    showReviewPage() {
        this.navigate('review');
    },

    submitReview() {
        const weekStart = Store.getWeekStartDate();
        const trainingsThisWeek = Store.getTrainingThisWeek().length;
        const proteinDays = Store.getProteinDaysThisWeek();
        const weekChange = Store.getWeightChangeThisWeek();
        const notes = document.getElementById('review-notes')?.value || '';

        Store.addWeeklyReview({
            weekOf: weekStart,
            trainingSessions: trainingsThisWeek,
            proteinDaysOnTarget: proteinDays,
            weightChange: weekChange,
            notes
        });

        const streak = Store.getConsecutiveReviewWeeks();
        this.toast(`✅ 复盘已提交！${streak > 1 ? `🔥 连续 ${streak} 周` : ''}`, 'success');
        this._render();
    },

    // -- 问题诊断 --
    showDiagnosis() {
        this.navigate('diagnosis');
    },

    // -- 导入/导出 --
    showImportModal() {
        const modal = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = Components.renderImportModal();
        modal.classList.add('show');
    },

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this._importData = e.target.result;

                // 显示预览
                const preview = document.getElementById('import-preview');
                const summary = document.getElementById('import-summary');
                preview.classList.remove('hidden');

                summary.innerHTML = `
          体重记录: ${(data.weightLog || []).length} 条<br>
          训练记录: ${(data.trainingLog || []).length} 条<br>
          饮食记录: ${(data.nutritionLog || []).length} 条<br>
          周复盘: ${(data.weeklyReview || []).length} 次
        `;
            } catch (err) {
                this.toast('文件格式错误', 'error');
            }
        };
        reader.readAsText(file);
    },

    confirmImport() {
        if (!this._importData) return;

        const result = Store.importData(this._importData);
        if (result.success) {
            this.closeModal();
            this.toast('✅ 数据导入成功', 'success');
            this._importData = null;
            this.navigate('dashboard');
        } else {
            this.toast(`导入失败: ${result.error}`, 'error');
        }
    },

    confirmClear() {
        if (confirm('⚠️ 确定要清除所有数据吗？此操作不可恢复！\n\n建议先导出备份。')) {
            Store.clearAll();
            this.toast('已清除所有数据', '');
            this.navigate('dashboard');
        }
    },

    // ============================================================
    // Modal
    // ============================================================
    closeModal() {
        document.getElementById('modal-overlay').classList.remove('show');
    },

    // ============================================================
    // Toast 通知
    // ============================================================
    toast(message, type) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type || ''} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    },

    // ============================================================
    // 备份提醒
    // ============================================================
    _checkBackupReminder() {
        const today = new Date();
        if (today.getDate() === 1) {
            const lastReminder = localStorage.getItem('last-backup-reminder');
            const thisMonth = `${today.getFullYear()}-${today.getMonth()}`;
            if (lastReminder !== thisMonth) {
                setTimeout(() => {
                    this.toast('💾 建议导出数据备份（设置 → 导出数据）', '');
                    localStorage.setItem('last-backup-reminder', thisMonth);
                }, 2000);
            }
        }
    }
};

// ============================================================
// 启动
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// 点击 modal 外部关闭
document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
        App.closeModal();
    }
});
