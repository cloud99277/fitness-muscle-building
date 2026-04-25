/**
 * store.js — 数据持久化层
 * 
 * 职责：
 * - localStorage 读写
 * - 数据 schema 校验
 * - 导出/导入 JSON
 * - 训练模板管理
 */

const STORAGE_KEY = 'muscle-tracker-data';

// ============================================================
// 默认数据（首次打开时初始化）
// ============================================================
const DEFAULT_TRAINING_TEMPLATES = {
  // V3 居家版：推（胸+肩+三头）
  A: [
    { name: '哑铃地板卧推', defaultSets: 4, defaultReps: '8-12', muscle: '胸三头' },
    { name: '俯卧撑', defaultSets: 3, defaultReps: '力竭', muscle: '胸三头核心' },
    { name: '哑铃站姿肩推', defaultSets: 3, defaultReps: '10-12', muscle: '肩' },
    { name: '哑铃侧平举', defaultSets: 3, defaultReps: '12-15', muscle: '三角肌中束' },
    { name: '哑铃颈后臂屈伸', defaultSets: 3, defaultReps: '10-15', muscle: '三头' },
    { name: '钻石俯卧撑', defaultSets: 2, defaultReps: '力竭', muscle: '三头内胸' }
  ],
  // V3 居家版：拉（背+二头）
  B: [
    { name: '哑铃俯身划船', defaultSets: 4, defaultReps: '8-12', muscle: '背阔中背' },
    { name: '哑铃单臂划船', defaultSets: 3, defaultReps: '10-12/侧', muscle: '背阔' },
    { name: '哑铃罗马尼亚硬拉', defaultSets: 3, defaultReps: '8-10', muscle: '腘绳臀下背' },
    { name: '超人式', defaultSets: 3, defaultReps: '12-15', muscle: '竖脊下背' },
    { name: '哑铃弯举', defaultSets: 3, defaultReps: '10-15', muscle: '二头' },
    { name: '哑铃锤式弯举', defaultSets: 3, defaultReps: '10-12', muscle: '肱桡二头' }
  ],
  // V3 居家版：腿+核心
  C: [
    { name: '哑铃高脚杯深蹲', defaultSets: 4, defaultReps: '10-15', muscle: '股四臀' },
    { name: '哑铃箭步蹲', defaultSets: 3, defaultReps: '10/腿', muscle: '股四臀' },
    { name: '哑铃罗马尼亚硬拉', defaultSets: 3, defaultReps: '10-12', muscle: '腘绳臀' },
    { name: '保加利亚分腿蹲', defaultSets: 3, defaultReps: '8-10/腿', muscle: '股四臀' },
    { name: '哑铃提踵', defaultSets: 3, defaultReps: '15-20', muscle: '小腿' },
    { name: '平板支撑', defaultSets: 3, defaultReps: '30-60秒', muscle: '核心' },
    { name: '卷腹', defaultSets: 3, defaultReps: '15-20', muscle: '腹直肌' }
  ]
};

const DEFAULT_DATA = {
  profile: {
    height: 165,
    startWeight: 50,
    targetWeight: 62,
    startDate: new Date().toISOString().split('T')[0],
    age: 28
  },
  weightLog: [],
  trainingLog: [],
  nutritionLog: [],
  weeklyReview: [],
  trainingTemplates: JSON.parse(JSON.stringify(DEFAULT_TRAINING_TEMPLATES))
};

// ============================================================
// Store 对象
// ============================================================
const Store = {
  _data: null,

  // 初始化：从 localStorage 加载或使用默认值
  init() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this._data = JSON.parse(raw);
        // 兼容旧数据：确保所有 key 都存在
        for (const key of Object.keys(DEFAULT_DATA)) {
          if (!(key in this._data)) {
            this._data[key] = JSON.parse(JSON.stringify(DEFAULT_DATA[key]));
          }
        }
      } catch (e) {
        console.error('数据解析失败，使用默认值', e);
        this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      }
    } else {
      this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
    this._save();
  },

  // 写入 localStorage
  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  // ---- Profile ----
  getProfile() {
    return this._data.profile;
  },

  updateProfile(updates) {
    Object.assign(this._data.profile, updates);
    this._save();
  },

  // ---- 体重记录 ----
  getWeightLog() {
    return this._data.weightLog.sort((a, b) => a.date.localeCompare(b.date));
  },

  addWeight(date, weight) {
    // 如果当天已有记录，覆盖
    const idx = this._data.weightLog.findIndex(w => w.date === date);
    if (idx >= 0) {
      this._data.weightLog[idx].weight = weight;
    } else {
      this._data.weightLog.push({ date, weight });
    }
    this._save();
  },

  getLatestWeight() {
    const log = this.getWeightLog();
    return log.length > 0 ? log[log.length - 1].weight : this._data.profile.startWeight;
  },

  // ---- 训练记录 ----
  getTrainingLog() {
    return this._data.trainingLog.sort((a, b) => a.date.localeCompare(b.date));
  },

  addTraining(record) {
    this._data.trainingLog.push(record);
    this._save();
  },

  getTrainingThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // 周日=7
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().split('T')[0];
    
    return this._data.trainingLog.filter(t => t.date >= mondayStr);
  },

  getLastTrainingForExercise(exerciseName) {
    const logs = this.getTrainingLog();
    for (let i = logs.length - 1; i >= 0; i--) {
      const ex = logs[i].exercises.find(e => e.name === exerciseName);
      if (ex && ex.sets.length > 0) {
        return ex.sets;
      }
    }
    return null;
  },

  // ---- 饮食记录 ----
  getNutritionLog() {
    return this._data.nutritionLog.sort((a, b) => a.date.localeCompare(b.date));
  },

  addNutrition(date, calories, protein) {
    const onTarget = calories >= 2300 && protein >= 90;
    const idx = this._data.nutritionLog.findIndex(n => n.date === date);
    if (idx >= 0) {
      Object.assign(this._data.nutritionLog[idx], { calories, protein, onTarget });
    } else {
      this._data.nutritionLog.push({ date, calories, protein, onTarget });
    }
    this._save();
  },

  getProteinDaysThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().split('T')[0];
    
    return this._data.nutritionLog.filter(n => n.date >= mondayStr && n.onTarget).length;
  },

  // ---- 周复盘 ----
  getWeeklyReviews() {
    return this._data.weeklyReview.sort((a, b) => a.weekOf.localeCompare(b.weekOf));
  },

  addWeeklyReview(review) {
    const idx = this._data.weeklyReview.findIndex(r => r.weekOf === review.weekOf);
    if (idx >= 0) {
      this._data.weeklyReview[idx] = review;
    } else {
      this._data.weeklyReview.push(review);
    }
    this._save();
  },

  hasReviewThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().split('T')[0];
    
    return this._data.weeklyReview.some(r => r.weekOf === mondayStr);
  },

  getWeekStartDate() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    return monday.toISOString().split('T')[0];
  },

  getConsecutiveReviewWeeks() {
    const reviews = this.getWeeklyReviews();
    if (reviews.length === 0) return 0;
    
    let count = 0;
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - dayOfWeek + 1);
    
    let checkDate = new Date(thisMonday);
    
    for (let i = 0; i < 52; i++) { // 最多检查52周
      const dateStr = checkDate.toISOString().split('T')[0];
      if (reviews.some(r => r.weekOf === dateStr)) {
        count++;
        checkDate.setDate(checkDate.getDate() - 7);
      } else {
        break;
      }
    }
    return count;
  },

  // ---- 训练模板 ----
  getTemplates() {
    return this._data.trainingTemplates;
  },

  resetTemplates() {
    this._data.trainingTemplates = JSON.parse(JSON.stringify(DEFAULT_TRAINING_TEMPLATES));
    this._save();
  },

  // ---- 导出/导入 ----
  exportData() {
    const blob = new Blob([JSON.stringify(this._data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `muscle-tracker-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importData(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      // 基本校验
      const requiredKeys = ['profile', 'weightLog', 'trainingLog', 'nutritionLog', 'weeklyReview'];
      for (const key of requiredKeys) {
        if (!(key in imported)) {
          throw new Error(`缺少必要字段: ${key}`);
        }
      }
      this._data = imported;
      // 确保 trainingTemplates 存在
      if (!this._data.trainingTemplates) {
        this._data.trainingTemplates = JSON.parse(JSON.stringify(DEFAULT_TRAINING_TEMPLATES));
      }
      this._save();
      return { success: true, summary: this.getDataSummary() };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  getDataSummary() {
    return {
      weightRecords: this._data.weightLog.length,
      trainingRecords: this._data.trainingLog.length,
      nutritionRecords: this._data.nutritionLog.length,
      reviewRecords: this._data.weeklyReview.length
    };
  },

  clearAll() {
    this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this._save();
  },

  // ---- 工具方法 ----
  getWeightChangeThisWeek() {
    const log = this.getWeightLog();
    const today = new Date();
    const dayOfWeek = today.getDay() || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().split('T')[0];
    
    const thisWeekLogs = log.filter(w => w.date >= mondayStr);
    if (thisWeekLogs.length === 0) return null;
    
    // 本周最早记录 vs 上周最后记录
    const firstThisWeek = thisWeekLogs[0].weight;
    const beforeMonday = log.filter(w => w.date < mondayStr);
    if (beforeMonday.length === 0) return null;
    
    const lastBeforeWeek = beforeMonday[beforeMonday.length - 1].weight;
    return +(firstThisWeek - lastBeforeWeek).toFixed(1);
  }
};
