/**
 * Achievements Screen
 * Showcases 20+ unlockable achievement badges, criteria, and rewards.
 */

import { ACHIEVEMENTS } from '../../config/achievements.js';

export class AchievementsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen achievements-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="ach-btn-back">◀ BACK</button>
                    <h2 class="sub-title">ACHIEVEMENT BADGES</h2>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">🪙 <span id="ach-coins">0</span></span>
                        <span class="pill-gems">💎 <span id="ach-gems">0</span></span>
                    </div>
                </header>

                <main class="achievements-grid" id="ach-grid-container"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#ach-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };
    }

    renderAchievements() {
        const d = this.ui.save.data;
        this.element.querySelector('#ach-coins').textContent = d.coins.toLocaleString();
        this.element.querySelector('#ach-gems').textContent = d.gems.toLocaleString();

        const container = this.element.querySelector('#ach-grid-container');

        container.innerHTML = ACHIEVEMENTS.map(ach => {
            const userAch = d.achievements[ach.id] || { unlocked: false, progress: 0, claimed: false };
            const currentVal = userAch.unlocked ? ach.target : (userAch.progress || 0);
            const pct = Math.min(100, Math.floor((currentVal / ach.target) * 100));

            return `
                <div class="achievement-card glass-panel ${userAch.unlocked ? 'unlocked' : 'locked'} ${userAch.claimed ? 'claimed' : ''}">
                    <div class="ach-icon-box">
                        <span class="ach-emoji">${ach.icon}</span>
                    </div>
                    <div class="ach-info">
                        <div class="flex-between">
                            <h3 class="ach-title">${ach.title}</h3>
                            <div class="ach-rewards">
                                <span>🪙 ${ach.rewardCoins}</span>
                                <span>💎 ${ach.rewardGems}</span>
                            </div>
                        </div>
                        <p class="ach-desc">${ach.desc}</p>
                        <div class="ach-progress-bar-wrapper">
                            <div class="ach-progress-fill" style="width: ${pct}%"></div>
                        </div>
                        <div class="ach-footer-row flex-between">
                            <span class="ach-ratio">${currentVal.toLocaleString()} / ${ach.target.toLocaleString()}</span>
                            <div class="ach-action">
                                ${userAch.claimed ? `
                                    <span class="badge-claimed">CLAIMED</span>
                                ` : userAch.unlocked ? `
                                    <button class="btn btn-accent btn-sm btn-claim-ach pulse-glow" data-id="${ach.id}">CLAIM</button>
                                ` : `
                                    <span class="badge-locked">LOCKED</span>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-claim-ach').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                if (this.ui.save.claimAchievement(id)) {
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Achievement reward claimed!', 'success');
                    this.renderAchievements();
                }
            };
        });
    }

    onShow() {
        this.renderAchievements();
    }
}
