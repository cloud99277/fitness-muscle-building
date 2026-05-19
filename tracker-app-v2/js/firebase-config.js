/**
 * firebase-config.js — Firebase 初始化配置
 * 
 * ⚠️ 使用前需要：
 * 1. 去 https://console.firebase.google.com/ 创建项目
 * 2. 启用 Authentication → Google 登录
 * 3. 启用 Realtime Database
 * 4. 将下方 firebaseConfig 中的占位符替换为你的项目配置
 */

const firebaseConfig = (typeof FIREBASE_CONFIG !== 'undefined') ? FIREBASE_CONFIG : {
    apiKey: "AIzaSyDxvkipoUvCtRvVh82lGQY_Ffk0b76z5-U",
    authDomain: "muscle-tracker-cloud927.firebaseapp.com",
    databaseURL: "https://muscle-tracker-cloud927-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "muscle-tracker-cloud927",
    storageBucket: "muscle-tracker-cloud927.firebasestorage.app",
    messagingSenderId: "494655013393",
    appId: "1:494655013393:web:4542f6571eb2c018fa27b0"
};

// 初始化 Firebase
let firebaseApp, firebaseAuth, firebaseDB;
let isFirebaseReady = false;

function initFirebase() {
    try {
        // 检查配置是否已填写
        if (firebaseConfig.apiKey === "") {
            console.warn('⚠️ Firebase 配置未填写，将使用离线模式（localStorage）');
            return false;
        }

        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseDB = firebase.database();

        // 启用离线持久化
        firebaseDB.goOnline();

        isFirebaseReady = true;
        console.log('✅ Firebase 初始化成功');
        return true;
    } catch (e) {
        console.error('Firebase 初始化失败，使用离线模式', e);
        return false;
    }
}
