/**
 * Player Lifetime Statistics Screen
 * Detailed career telemetry tracking runs, distances, jumps, slides, and records.
 */

export class StatsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen stats-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="stats-btn-back">◀ BACK</button>
                    <h2 class="sub-title">CAREER TELEMETRY</h2>
                    <div class="header-dummy"></div>
                </header>

                <main class="stats-grid-container" id="stats-items-grid"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#stats-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };
    }

    renderStats() {
        const s = this.ui.save.data.stats;
        const d = this.ui.save.data;

        const statList = [
            { label: 'Highest Score', val: d.highScore.toLocaleString(), icon: 'SCORE' },
            { label: 'Longest Run', val: `${(s.longestRun || 0).toLocaleString()} m`, icon: 'RUN' },
            { label: 'Total Distance', val: `${(s.totalDistance || 0).toLocaleString()} m`, icon: 'DIST' },
            { label: 'Total Runs Completed', val: (s.totalRuns || 0).toLocaleString(), icon: 'RUNS' },
            { label: 'Total Coins Collected', val: (s.totalCoins || 0).toLocaleString(), icon: 'COINS' },
            { label: 'Obstacles Avoided', val: (s.obstaclesAvoided || 0).toLocaleString(), icon: 'DODGE' },
            { label: 'Power-Ups Picked Up', val: (s.powerupsCollected || 0).toLocaleString(), icon: 'PWR' },
            { label: 'Total Jumps', val: (s.totalJumps || 0).toLocaleString(), icon: 'JUMP' },
            { label: 'Total Slides', val: (s.totalSlides || 0).toLocaleString(), icon: 'SLIDE' },
            { label: 'Runners Unlocked', val: `${d.unlockedCharacters.length} / 6`, icon: 'CREW' },
            { label: 'Daily Streak', val: `${s.dailyStreak || 1} Days`, icon: 'STRK' },
            { label: 'Current Player Level', val: `Level ${d.level}`, icon: 'LVL' }
        ];

        const grid = this.element.querySelector('#stats-items-grid');
        grid.innerHTML = statList.map(st => `
            <div class="stat-card glass-panel">
                <div class="stat-card-icon">${st.icon}</div>
                <div class="stat-card-info">
                    <span class="stat-card-label">${st.label}</span>
                    <span class="stat-card-value">${st.val}</span>
                </div>
            </div>
        `).join('');
    }

    onShow() {
        this.renderStats();
    }
}
