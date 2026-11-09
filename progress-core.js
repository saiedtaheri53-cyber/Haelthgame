/**
 * progress-core.js
 * مدیریت پیشرفت، امتیازات، تم و زبان برای پروژه طب و علم سلامتی
 * طراحی شده توسط GapGPT (مدیر پروژه)
 */

const ProgressManager = {
    // کلیدهای اصلی در LocalStorage
    KEYS: {
        SCORES: 'gap_health_scores',
        MEDALS: 'gap_health_medals',
        SETTINGS: 'gap_health_settings',
        PROGRESS: 'gap_health_progress'
    },

    // ۱. مدیریت تنظیمات (تم، فونت، زبان)
    saveSettings(settings) {
        // settings: { theme: 'theme-emerald', font: 'font-vazir', lang: 'fa' }
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        this.applySettings(settings);
    },

    loadSettings() {
        const saved = localStorage.getItem(this.KEYS.SETTINGS);
        return saved ? JSON.parse(saved) : {
            theme: 'theme-emerald',
            font: 'font-vazir',
            lang: 'fa'
        };
    },

    applySettings(settings) {
        document.body.className = `${settings.theme} ${settings.font}`;
        // در اینجا می‌توان منطق تغییر زبان را هم اضافه کرد
    },

    // ۲. مدیریت امتیازات و مدال‌ها
    saveScore(gameId, score) {
        let scores = this.getAllScores();
        scores[gameId] = score;
        localStorage.setItem(this.KEYS.SCORES, JSON.stringify(scores));
        
        // چک کردن برای اعطای مدال (مثال ساده)
        this.checkMedals(gameId, score);
    },

    getAllScores() {
        const scores = localStorage.getItem(this.KEYS.SCORES);
        return scores ? JSON.parse(scores) : {};
    },

    checkMedals(gameId, score) {
        // منطق اعطای مدال (مثلاً اگر امتیاز از ۹۰ بیشتر شد)
        if (score >= 90) {
            this.addMedal(`Gold - ${gameId}`);
        }
    },

    addMedal(medalName) {
        let medals = this.getAllMedals();
        if (!medals.includes(medalName)) {
            medals.push(medalName);
            localStorage.setItem(this.KEYS.MEDALS, JSON.stringify(medals));
        }
    },

    getAllMedals() {
        const medals = localStorage.getItem(this.KEYS.MEDALS);
        return medals ? JSON.parse(medals) : [];
    },

    // ۳. متد کمکی برای نمایش وضعیت در پورتال (Vault)
    getVaultSummary() {
        const scores = this.getAllScores();
        const medals = this.getAllMedals();
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        
        return {
            totalScore: totalScore,
            medalCount: medals.length,
            recentMedals: medals.slice(-5) // ۵ مدال آخر
        };
    }
};

// در دسترس قرار دادن برای تمام فایل‌ها
window.ProgressManager = ProgressManager;
