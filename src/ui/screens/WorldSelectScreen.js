/**
 * World Select Screen
 * Showcases all 5 unique environments with unlock requirements,
 * high score records, theme descriptions, and direct world selection.
 */

import { WORLDS } from '../../config/worlds.js';

export class WorldSelectScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen world-select-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="world-btn-back">◀ BACK</button>
                    <h2 class="sub-title">SELECT ENVIRONMENT</h2>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">🪙 <span id="ws-coins">0</span></span>
                    </div>
                </header>

                <main class="worlds-grid" id="worlds-container"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#world-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };
    }

    renderWorldCards() {
        const d = this.ui.save.data;
        const container = this.element.querySelector('#worlds-container');
        this.element.querySelector('#ws-coins').textContent = d.coins.toLocaleString();

        container.innerHTML = Object.values(WORLDS).map(w => {
            const isUnlocked = d.unlockedWorlds.includes(w.id);
            const isSelected = d.selectedWorld === w.id;
            const canAfford = d.coins >= w.unlockCost || d.level >= w.unlockLevel;

            return `
                <div class="world-card glass-panel ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}">
                    <div class="world-card-preview" style="background: linear-gradient(180deg, ${w.skyColors[0]} 0%, ${w.groundColor} 100%)">
                        <span class="world-theme-tag">${w.theme}</span>
                        ${!isUnlocked ? '<div class="lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
                    </div>

                    <div class="world-card-body">
                        <div class="flex-between">
                            <h3 class="world-name">${w.name}</h3>
                            ${isSelected ? '<span class="status-badge active">SELECTED</span>' : ''}
                        </div>
                        <p class="world-desc">${w.description}</p>

                        <div class="world-meta-row">
                            <span>🎵 ${w.music.style.toUpperCase()} (${w.music.bpm} BPM)</span>
                            <span>⚡ Lv. ${w.unlockLevel} Required</span>
                        </div>

                        <div class="world-action-box">
                            ${isSelected ? `
                                <button class="btn btn-disabled btn-block">ACTIVE WORLD</button>
                            ` : isUnlocked ? `
                                <button class="btn btn-primary btn-block btn-select-world" data-id="${w.id}">SELECT WORLD</button>
                            ` : `
                                <button class="btn btn-accent btn-block btn-unlock-world" data-id="${w.id}" data-cost="${w.unlockCost}">
                                    UNLOCK (${w.unlockCost} COINS)
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Select buttons
        container.querySelectorAll('.btn-select-world').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                this.ui.save.data.selectedWorld = id;
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.ui.showToast(`Selected world: ${WORLDS[id].name}`, 'info');
                this.renderWorldCards();
            };
        });

        // Bind Unlock buttons
        container.querySelectorAll('.btn-unlock-world').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'), 10);

                if (this.ui.save.spendCoins(cost)) {
                    this.ui.save.data.unlockedWorlds.push(id);
                    this.ui.save.data.selectedWorld = id;
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast(`Unlocked ${WORLDS[id].name}!`, 'success');
                    this.renderWorldCards();
                } else {
                    this.ui.showToast('Not enough coins to unlock this world.', 'error');
                }
            };
        });
    }

    onShow() {
        this.renderWorldCards();
    }
}
