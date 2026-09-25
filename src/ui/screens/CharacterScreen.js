/**
 * Character Select & Customization Screen
 * Full character roster with comparative stats, ability spotlights,
 * and live equipment tabs for Skins, Hats, and Particle Trails.
 */

import { CHARACTERS } from '../../config/characters.js';
import { CUSTOMIZATIONS } from '../../config/customizations.js';
import { GAME_CONFIG } from '../../config/constants.js';

export class CharacterScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.activeTab = 'characters'; // 'characters', 'skins', 'hats', 'trails'
        this.selectedCharId = this.ui.save.data.selectedCharacter;

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen character-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="char-btn-back">◀ BACK</button>
                    <div class="tab-pill-group">
                        <button class="tab-pill active" data-tab="characters">RUNNERS</button>
                        <button class="tab-pill" data-tab="skins">SKINS</button>
                        <button class="tab-pill" data-tab="hats">HATS</button>
                        <button class="tab-pill" data-tab="trails">TRAILS</button>
                    </div>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">COINS: <span id="char-coins">0</span></span>
                        <span class="pill-gems">GEMS: <span id="char-gems">0</span></span>
                    </div>
                </header>

                <main class="char-layout-body">
                    <!-- LEFT COLUMN: Character Visualizer & Stat Cards -->
                    <div class="char-preview-panel glass-panel">
                        <div class="char-display-avatar" id="char-preview-avatar">
                            <span class="char-large-badge">CR</span>
                        </div>
                        <div class="char-hero-meta">
                            <span class="rarity-badge" id="char-rarity">COMMON</span>
                            <h2 class="char-name-title" id="char-name">BLAZE</h2>
                            <p class="char-lore" id="char-lore">The agile cyber nomad.</p>
                        </div>

                        <!-- Comparative Stats Meters -->
                        <div class="stat-meters-list">
                            <div class="stat-meter-row">
                                <span>SPEED</span>
                                <div class="meter-bar"><div class="meter-fill" id="meter-speed" style="width: 50%;"></div></div>
                            </div>
                            <div class="stat-meter-row">
                                <span>JUMP / MOBILITY</span>
                                <div class="meter-bar"><div class="meter-fill" id="meter-jump" style="width: 50%;"></div></div>
                            </div>
                            <div class="stat-meter-row">
                                <span>SCORE MULTIPLIER</span>
                                <div class="meter-bar"><div class="meter-fill" id="meter-score" style="width: 50%;"></div></div>
                            </div>
                            <div class="stat-meter-row">
                                <span>SPECIAL TRAIT</span>
                                <span class="trait-highlight" id="char-trait">Double Jump Ready</span>
                            </div>
                        </div>

                        <div class="char-action-footer" id="char-action-box"></div>
                    </div>

                    <!-- RIGHT COLUMN: Grid items based on selected tab -->
                    <div class="char-grid-panel" id="char-grid-content"></div>
                </main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#char-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelectorAll('.tab-pill').forEach(btn => {
            btn.onclick = () => {
                this.element.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTab = btn.getAttribute('data-tab');
                this.ui.audio.playButtonClick();
                this.renderTabContent();
            };
        });
    }

    renderTabContent() {
        const d = this.ui.save.data;
        this.element.querySelector('#char-coins').textContent = d.coins.toLocaleString();
        this.element.querySelector('#char-gems').textContent = d.gems.toLocaleString();

        const grid = this.element.querySelector('#char-grid-content');

        if (this.activeTab === 'characters') {
            this.renderCharactersGrid(grid);
        } else if (this.activeTab === 'skins') {
            this.renderSkinsGrid(grid);
        } else if (this.activeTab === 'hats') {
            this.renderHatsGrid(grid);
        } else if (this.activeTab === 'trails') {
            this.renderTrailsGrid(grid);
        }

        this.updatePreview(this.selectedCharId);
    }

    renderCharactersGrid(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(CHARACTERS).map(c => {
            const isUnlocked = d.unlockedCharacters.includes(c.id);
            const isEquipped = d.selectedCharacter === c.id;
            const isInspecting = this.selectedCharId === c.id;

            return `
                <div class="item-card glass-panel ${isInspecting ? 'inspecting' : ''} ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}" data-id="${c.id}">
                    <div class="item-icon-box" style="background: ${c.visual.primaryColor}">
                        <span class="item-badge">CR</span>
                    </div>
                    <div class="item-info">
                        <span class="item-rarity-pill ${c.rarity.toLowerCase()}">${c.rarity}</span>
                        <h4 class="item-name">${c.name}</h4>
                        <span class="item-sub">${c.abilityName}</span>
                    </div>
                    ${isEquipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
                </div>
            `;
        }).join('');

        container.querySelectorAll('.item-card').forEach(card => {
            card.onclick = () => {
                this.selectedCharId = card.getAttribute('data-id');
                this.ui.audio.playButtonClick();
                this.renderTabContent();
            };
        });
    }

    renderSkinsGrid(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(CUSTOMIZATIONS.SKINS).map(s => {
            const isUnlocked = d.unlockedSkins.includes(s.id);
            const isEquipped = d.customization.skin === s.id;

            return `
                <div class="item-card glass-panel ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
                    <div class="item-icon-box" style="background: ${s.primary || '#38bdf8'}">
                        <span class="item-badge">SKIN</span>
                    </div>
                    <div class="item-info">
                        <span class="item-rarity-pill ${s.rarity.toLowerCase()}">${s.rarity}</span>
                        <h4 class="item-name">${s.name}</h4>
                        ${isEquipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
                    </div>
                    <div class="item-action">
                        ${isEquipped ? `
                            <button class="btn btn-sm btn-disabled">EQUIPPED</button>
                        ` : isUnlocked ? `
                            <button class="btn btn-sm btn-primary btn-equip-skin" data-id="${s.id}">EQUIP</button>
                        ` : `
                            <button class="btn btn-sm btn-accent btn-buy-skin" data-id="${s.id}" data-cost="${s.cost}" data-type="${s.costType}">
                                ${s.costType === 'gems' ? `${s.cost} GEMS` : `${s.cost} COINS`}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-equip-skin').forEach(b => {
            b.onclick = () => {
                d.customization.skin = b.getAttribute('data-id');
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.renderTabContent();
            };
        });

        container.querySelectorAll('.btn-buy-skin').forEach(b => {
            b.onclick = () => {
                const id = b.getAttribute('data-id');
                const cost = parseInt(b.getAttribute('data-cost'), 10);
                const type = b.getAttribute('data-type');

                const success = (type === 'gems') ? this.ui.save.spendGems(cost) : this.ui.save.spendCoins(cost);
                if (success) {
                    d.unlockedSkins.push(id);
                    d.customization.skin = id;
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Skin unlocked & equipped!', 'success');
                    this.renderTabContent();
                } else {
                    this.ui.showToast(`Not enough ${type}!`, 'error');
                }
            };
        });
    }

    renderHatsGrid(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(CUSTOMIZATIONS.HATS).map(h => {
            const isUnlocked = d.unlockedHats.includes(h.id);
            const isEquipped = d.customization.hat === h.id;

            return `
                <div class="item-card glass-panel ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
                    <div class="item-icon-box">
                        <span class="item-emoji">${h.icon}</span>
                    </div>
                    <div class="item-info">
                        <span class="item-rarity-pill ${h.rarity.toLowerCase()}">${h.rarity}</span>
                        <h4 class="item-name">${h.name}</h4>
                        ${isEquipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
                    </div>
                    <div class="item-action">
                        ${isEquipped ? `
                            <button class="btn btn-sm btn-disabled">EQUIPPED</button>
                        ` : isUnlocked ? `
                            <button class="btn btn-sm btn-primary btn-equip-hat" data-id="${h.id}">EQUIP</button>
                        ` : `
                            <button class="btn btn-sm btn-accent btn-buy-hat" data-id="${h.id}" data-cost="${h.cost}" data-type="${h.costType}">
                                ${h.costType === 'gems' ? `${h.cost} GEMS` : `${h.cost} COINS`}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-equip-hat').forEach(b => {
            b.onclick = () => {
                d.customization.hat = b.getAttribute('data-id');
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.renderTabContent();
            };
        });

        container.querySelectorAll('.btn-buy-hat').forEach(b => {
            b.onclick = () => {
                const id = b.getAttribute('data-id');
                const cost = parseInt(b.getAttribute('data-cost'), 10);
                const type = b.getAttribute('data-type');

                const success = (type === 'gems') ? this.ui.save.spendGems(cost) : this.ui.save.spendCoins(cost);
                if (success) {
                    d.unlockedHats.push(id);
                    d.customization.hat = id;
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Hat unlocked & equipped!', 'success');
                    this.renderTabContent();
                } else {
                    this.ui.showToast(`Not enough ${type}!`, 'error');
                }
            };
        });
    }

    renderTrailsGrid(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(CUSTOMIZATIONS.TRAILS).map(t => {
            const isUnlocked = d.unlockedTrails.includes(t.id);
            const isEquipped = d.customization.trail === t.id;

            return `
                <div class="item-card glass-panel ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}">
                    <div class="item-icon-box" style="background: ${t.color}">
                        <span class="item-badge">FX</span>
                    </div>
                    <div class="item-info">
                        <span class="item-rarity-pill ${t.rarity.toLowerCase()}">${t.rarity}</span>
                        <h4 class="item-name">${t.name}</h4>
                        ${isEquipped ? '<span class="badge-equipped">EQUIPPED</span>' : ''}
                    </div>
                    <div class="item-action">
                        ${isEquipped ? `
                            <button class="btn btn-sm btn-disabled">EQUIPPED</button>
                        ` : isUnlocked ? `
                            <button class="btn btn-sm btn-primary btn-equip-trail" data-id="${t.id}">EQUIP</button>
                        ` : `
                            <button class="btn btn-sm btn-accent btn-buy-trail" data-id="${t.id}" data-cost="${t.cost}" data-type="${t.costType}">
                                ${t.costType === 'gems' ? `${t.cost} GEMS` : `${t.cost} COINS`}
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-equip-trail').forEach(b => {
            b.onclick = () => {
                d.customization.trail = b.getAttribute('data-id');
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.renderTabContent();
            };
        });

        container.querySelectorAll('.btn-buy-trail').forEach(b => {
            b.onclick = () => {
                const id = b.getAttribute('data-id');
                const cost = parseInt(b.getAttribute('data-cost'), 10);
                const type = b.getAttribute('data-type');

                const success = (type === 'gems') ? this.ui.save.spendGems(cost) : this.ui.save.spendCoins(cost);
                if (success) {
                    d.unlockedTrails.push(id);
                    d.customization.trail = id;
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Trail unlocked & equipped!', 'success');
                    this.renderTabContent();
                } else {
                    this.ui.showToast(`Not enough ${type}!`, 'error');
                }
            };
        });
    }

    updatePreview(charId) {
        const c = CHARACTERS[charId] || CHARACTERS.blaze;
        const d = this.ui.save.data;
        const isUnlocked = d.unlockedCharacters.includes(c.id);
        const isEquipped = d.selectedCharacter === c.id;

        this.element.querySelector('#char-name').textContent = c.name;
        this.element.querySelector('#char-rarity').textContent = c.rarity;
        this.element.querySelector('#char-rarity').className = `rarity-badge ${c.rarity.toLowerCase()}`;
        this.element.querySelector('#char-lore').textContent = c.description;

        this.element.querySelector('#meter-speed').style.width = `${c.stats.speed * 10}%`;
        this.element.querySelector('#meter-jump').style.width = `${c.stats.jump * 10}%`;
        this.element.querySelector('#meter-score').style.width = `${c.stats.scoreMult * 70}%`;
        this.element.querySelector('#char-trait').textContent = `${c.abilityName}: ${c.abilityDesc}`;

        // Action button
        const actionBox = this.element.querySelector('#char-action-box');
        if (isEquipped) {
            actionBox.innerHTML = `<button class="btn btn-disabled btn-block">ACTIVE RUNNER</button>`;
        } else if (isUnlocked) {
            actionBox.innerHTML = `<button class="btn btn-primary btn-block" id="btn-select-runner">SELECT RUNNER</button>`;
            actionBox.querySelector('#btn-select-runner').onclick = () => {
                d.selectedCharacter = c.id;
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.ui.showToast(`Selected runner: ${c.name}`, 'info');
                this.renderTabContent();
            };
        } else {
            actionBox.innerHTML = `
                <button class="btn btn-accent btn-block" id="btn-buy-runner">
                    UNLOCK RUNNER (${c.costType === 'gems' ? `${c.cost} GEMS` : `${c.cost} COINS`})
                </button>
            `;
            actionBox.querySelector('#btn-buy-runner').onclick = () => {
                const success = (c.costType === 'gems') ? this.ui.save.spendGems(c.cost) : this.ui.save.spendCoins(c.cost);
                if (success) {
                    d.unlockedCharacters.push(c.id);
                    d.selectedCharacter = c.id;
                    this.ui.save.updateStat('charactersOwned', 1);
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast(`Unlocked ${c.name}!`, 'success');
                    this.renderTabContent();
                } else {
                    this.ui.showToast(`Not enough ${c.costType}!`, 'error');
                }
            };
        }
    }

    onShow() {
        this.selectedCharId = this.ui.save.data.selectedCharacter;
        this.renderTabContent();
    }
}
