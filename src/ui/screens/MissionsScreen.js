/**
 * Missions Screen (Daily & Weekly Challenges)
 * Tracks player objectives in real time and provides claimable rewards.
 */

export class MissionsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.activeTab = 'daily'; // 'daily', 'weekly'

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen missions-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="missions-btn-back">◀ BACK</button>
                    <div class="tab-pill-group">
                        <button class="tab-pill active" data-tab="daily">DAILY PROTOCOLS</button>
                        <button class="tab-pill" data-tab="weekly">WEEKLY CHALLENGES</button>
                    </div>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">COINS: <span id="missions-coins">0</span></span>
                        <span class="pill-gems">GEMS: <span id="missions-gems">0</span></span>
                    </div>
                </header>

                <main class="missions-list" id="missions-container"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#missions-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelectorAll('.tab-pill').forEach(btn => {
            btn.onclick = () => {
                this.element.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTab = btn.getAttribute('data-tab');
                this.ui.audio.playButtonClick();
                this.renderMissions();
            };
        });
    }

    renderMissions() {
        const d = this.ui.save.data;
        this.element.querySelector('#missions-coins').textContent = d.coins.toLocaleString();
        this.element.querySelector('#missions-gems').textContent = d.gems.toLocaleString();

        const missions = this.activeTab === 'daily' ? d.missions.daily : d.missions.weekly;
        const container = this.element.querySelector('#missions-container');

        container.innerHTML = missions.map(m => {
            const pct = Math.min(100, Math.floor((m.progress / m.target) * 100));

            return `
                <div class="mission-card glass-panel ${m.claimed ? 'claimed' : m.completed ? 'ready' : ''}">
                    <div class="mission-header-row flex-between">
                        <h3 class="mission-title">${m.title}</h3>
                        <div class="mission-rewards">
                            <span>+${m.rewardCoins} COINS</span>
                            <span>+${m.rewardGems} GEMS</span>
                            <span>+${m.rewardXp} XP</span>
                        </div>
                    </div>
                    <p class="mission-desc">${m.desc}</p>
                    <div class="mission-progress-bar-wrapper">
                        <div class="mission-progress-fill" style="width: ${pct}%"></div>
                    </div>
                    <div class="mission-footer-row flex-between">
                        <span class="progress-ratio">${m.progress.toLocaleString()} / ${m.target.toLocaleString()} (${pct}%)</span>
                        <div class="mission-action">
                            ${m.claimed ? `
                                <span class="badge-claimed">CLAIMED</span>
                            ` : m.completed ? `
                                <button class="btn btn-accent btn-sm btn-claim-mission pulse-glow" data-id="${m.id}">CLAIM REWARD</button>
                            ` : `
                                <span class="badge-in-progress">IN PROGRESS</span>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-claim-mission').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const targetMission = missions.find(x => x.id === id);
                if (targetMission && targetMission.completed && !targetMission.claimed) {
                    targetMission.claimed = true;
                    this.ui.save.addCoins(targetMission.rewardCoins);
                    this.ui.save.addGems(targetMission.rewardGems);
                    this.ui.save.addXp(targetMission.rewardXp);
                    this.ui.save.save();

                    this.ui.audio.playLevelUp();
                    this.ui.showToast(`Claimed: ${targetMission.title}!`, 'success');
                    this.renderMissions();
                }
            };
        });
    }

    onShow() {
        this.renderMissions();
    }
}
