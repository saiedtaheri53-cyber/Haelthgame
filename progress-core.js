/* ==========================================
   PROGRESS CORE - Portal Engine & Storage
   ========================================== */

const PortalProgress = {
    STORAGE_KEY: 'tibb_games_progress_v1',

    // لیست کامل بازی‌های ثبت‌شده در پورتال
    games: [
        { id: 'game1', title: 'ارکان اربعه (طبع‌ها و عناصر)', file: 'game1.html', category: 'tibb', icon: '🌿' },
        { id: 'game2', title: 'سیت‌های ضروری (ستة ضروریة)', file: 'game2.html', category: 'tibb', icon: '⚖️' },
        { id: 'game3', title: 'مزاج‌شناسی کاربردی', file: 'game3.html', category: 'tibb', icon: '🔥' },
        { id: 'game4', title: 'اصول تغذیه سالم در طب سنتی', file: 'game4.html', category: 'tibb', icon: '🍎' }
    ],

    // دریافت اطلاعات پیشرفت کل
    getProgress() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : { totalScore: 0, medals: 0, completedGames: {} };
        } catch (e) {
            return { totalScore: 0, medals: 0, completedGames: {} };
        }
    },

    // ذخیره امتیاز یک بازی خاص
    saveGameScore(gameId, score, stars) {
        const progress = this.getProgress();
        progress.completedGames[gameId] = { score: score, stars: stars, date: new Date().toISOString() };
        
        // محاسبه مجموع امتیازات و مدال‌ها
        let totalScore = 0;
        let totalStars = 0;
        for (let key in progress.completedGames) {
            totalScore += progress.completedGames[key].score || 0;
            totalStars += progress.completedGames[key].stars || 0;
        }
        progress.totalScore = totalScore;
        progress.medals = totalStars;

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.error('Storage error:', e);
        }
        return progress;
    },

    // رندر کردن لیست بازی‌ها در صفحه اصلی پورتال (index.html)
    renderGamesGrid(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const progress = this.getProgress();
        let html = '';

        this.games.forEach((game, index) => {
            const isCompleted = progress.completedGames[game.id];
            const statusClass = isCompleted ? 'completed' : '';
            const statusText = isCompleted ? '✅ تکمیل شده' : '🔓 آماده شروع';
            const scoreText = isCompleted ? `امتیاز: ${isCompleted.score}` : 'هنوز بازی نشده';

            html += `
                <div class="game-card ${statusClass}" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s;">
                    <div>
                        <div style="font-size: 2rem; margin-bottom: 10px;">${game.icon}</div>
                        <h3 style="font-size: 1.1rem; color: #166534; margin-bottom: 8px;">بازی ${index + 1}: ${game.title}</h3>
                        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 15px;">${statusText} | ${scoreText}</p>
                    </div>
                    <a href="${game.file}" style="display: inline-block; background: #16a34a; color: white; text-align: center; padding: 10px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">ورود به بازی</a>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // به‌روزرسانی صندوقچه طلایی در هدر یا صفحه اصلی
    updateGoldenVaultUI() {
        const progress = this.getProgress();
        const scoreEl = document.getElementById('totalScoreDisplay');
        const medalsEl = document.getElementById('totalMedalsDisplay');

        if (scoreEl) scoreEl.innerText = progress.totalScore;
        if (medalsEl) medalsEl.innerText = progress.medals;
    }
};

// اجرای خودکار هنگام لود شدن صفحه
document.addEventListener('DOMContentLoaded', () => {
    PortalProgress.updateGoldenVaultUI();
    PortalProgress.renderGamesGrid('gamesGridContainer');
});
