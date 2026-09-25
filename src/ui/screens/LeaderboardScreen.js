/**
 * Leaderboard Screen
 * Displays Global, Friends, and Weekly rankings with dynamic player scoring.
 */

export class LeaderboardScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.activeCategory = 'global'; // 'global', 'friends', 'weekly'

        this.mockRunners = [
            { name: 'Vortex_X', score: 184200, dist: 6420, avatar: '🤖' },
            { name: 'CyberKitsune', score: 142500, dist: 5120, avatar: '🦊' },
            { name: 'NeonSamurai', score: 112000, dist: 4300, avatar: '⚔️' },
            { name: 'Ghost_Shift', score: 98400, dist: 3890, avatar: '👻' },
            { name: 'PulseRider', score: 76000, dist: 3100, avatar: '🏍️' },
            { name: 'GlitchRunner', score: 54300, dist: 2450, avatar: '👾' },
            { name: 'SkyDrifter', score: 32100, dist: 1720, avatar: '🦅' },
            { name: 'AeroZero', score: 18500, dist: 1100, avatar: '💨' }
        ];

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen leaderboard-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="lb-btn-back">◀ BACK</button>
                    <div class="tab-pill-group">
                        <button class="tab-pill active" data-tab="global">GLOBAL</button>
                        <button class="tab-pill" data-tab="friends">SYNDICATE FRIENDS</button>
                        <button class="tab-pill" data-tab="weekly">WEEKLY SURGE</button>
                    </div>
                    <div class="lb-header-placeholder"></div>
                </header>

                <main class="leaderboard-table-panel glass-panel">
                    <div class="lb-table-header">
                        <span class="col-rank">RANK</span>
                        <span class="col-runner">RUNNER</span>
                        <span class="col-distance">DISTANCE</span>
                        <span class="col-score">HIGH SCORE</span>
                    </div>
                    <div class="lb-table-rows" id="lb-rows-container"></div>
                </main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#lb-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelectorAll('.tab-pill').forEach(btn => {
            btn.onclick = () => {
                this.element.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeCategory = btn.getAttribute('data-tab');
                this.ui.audio.playButtonClick();
                this.renderLeaderboard();
            };
        });
    }

    renderLeaderboard() {
        const d = this.ui.save.data;
        const playerEntry = {
            name: `${d.username} (YOU)`,
            score: d.highScore || 0,
            dist: d.bestDistance || 0,
            avatar: '⚡',
            isPlayer: true
        };

        let list = [...this.mockRunners, playerEntry];
        list.sort((a, b) => b.score - a.score);

        const container = this.element.querySelector('#lb-rows-container');
        container.innerHTML = list.map((entry, idx) => {
            const rank = idx + 1;
            const rankBadge = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

            return `
                <div class="lb-row ${entry.isPlayer ? 'player-row' : ''}">
                    <span class="col-rank">${rankBadge}</span>
                    <div class="col-runner">
                        <span class="runner-avatar">${entry.avatar}</span>
                        <span class="runner-name">${entry.name}</span>
                    </div>
                    <span class="col-distance">${entry.dist.toLocaleString()} m</span>
                    <span class="col-score text-gold">${entry.score.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    }

    onShow() {
        this.renderLeaderboard();
    }
}
