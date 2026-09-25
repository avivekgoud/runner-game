/**
 * In-Game Shop Screen
 * Handles power-up level upgrades, consumables (revives & boosters),
 * and currency conversions with safe transaction validation.
 */

import { SHOP_ITEMS } from '../../config/shopItems.js';

export class ShopScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.activeCategory = 'upgrades'; // 'upgrades', 'consumables', 'currency'

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen shop-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="shop-btn-back">◀ BACK</button>
                    <div class="tab-pill-group">
                        <button class="tab-pill active" data-tab="upgrades">TECH UPGRADES</button>
                        <button class="tab-pill" data-tab="consumables">CONSUMABLES</button>
                        <button class="tab-pill" data-tab="currency">CURRENCY EXCHANGE</button>
                    </div>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">🪙 <span id="shop-coins">0</span></span>
                        <span class="pill-gems">💎 <span id="shop-gems">0</span></span>
                    </div>
                </header>

                <main class="shop-grid-container" id="shop-items-grid"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#shop-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelectorAll('.tab-pill').forEach(btn => {
            btn.onclick = () => {
                this.element.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeCategory = btn.getAttribute('data-tab');
                this.ui.audio.playButtonClick();
                this.renderContent();
            };
        });
    }

    renderContent() {
        const d = this.ui.save.data;
        this.element.querySelector('#shop-coins').textContent = d.coins.toLocaleString();
        this.element.querySelector('#shop-gems').textContent = d.gems.toLocaleString();

        const grid = this.element.querySelector('#shop-items-grid');

        if (this.activeCategory === 'upgrades') {
            this.renderUpgrades(grid);
        } else if (this.activeCategory === 'consumables') {
            this.renderConsumables(grid);
        } else if (this.activeCategory === 'currency') {
            this.renderCurrency(grid);
        }
    }

    renderUpgrades(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(SHOP_ITEMS.UPGRADES).map(upg => {
            const currentLvl = d.upgrades[upg.powerupId] || 1;
            const isMax = currentLvl >= upg.maxLevel;
            const cost = isMax ? 0 : upg.costs[currentLvl - 1];

            return `
                <div class="shop-card glass-panel">
                    <div class="shop-card-icon-box">
                        <span class="shop-card-emoji">${upg.icon}</span>
                    </div>
                    <div class="shop-card-info">
                        <div class="flex-between">
                            <h3 class="shop-card-title">${upg.name}</h3>
                            <span class="level-indicator">LV. ${currentLvl} / ${upg.maxLevel}</span>
                        </div>
                        <p class="shop-card-desc">${upg.desc}</p>
                        <div class="upgrade-meter">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <span class="meter-pip ${i <= currentLvl ? 'filled' : ''}"></span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="shop-card-action">
                        ${isMax ? `
                            <button class="btn btn-disabled btn-block">MAX LEVEL</button>
                        ` : `
                            <button class="btn btn-primary btn-block btn-buy-upg" data-id="${upg.powerupId}" data-cost="${cost}">
                                UPGRADE (🪙 ${cost.toLocaleString()})
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-buy-upg').forEach(btn => {
            btn.onclick = () => {
                const powerupId = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'), 10);

                if (this.ui.save.spendCoins(cost)) {
                    this.ui.save.data.upgrades[powerupId] = (this.ui.save.data.upgrades[powerupId] || 1) + 1;
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Power-up upgraded successfully!', 'success');
                    this.renderContent();
                } else {
                    this.ui.showToast('Not enough coins for upgrade!', 'error');
                }
            };
        });
    }

    renderConsumables(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(SHOP_ITEMS.CONSUMABLES).map(item => {
            const owned = item.id.includes('revive') ? d.consumables.revives : d.consumables.headstarts;

            return `
                <div class="shop-card glass-panel">
                    <div class="shop-card-icon-box">
                        <span class="shop-card-emoji">${item.icon}</span>
                    </div>
                    <div class="shop-card-info">
                        <div class="flex-between">
                            <h3 class="shop-card-title">${item.name}</h3>
                            <span class="owned-tag">OWNED: ${owned}</span>
                        </div>
                        <p class="shop-card-desc">${item.desc}</p>
                    </div>
                    <div class="shop-card-action">
                        <button class="btn btn-accent btn-block btn-buy-consumable" data-id="${item.id}" data-cost="${item.cost}">
                            PURCHASE (🪙 ${item.cost.toLocaleString()})
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.btn-buy-consumable').forEach(btn => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-id');
                const cost = parseInt(btn.getAttribute('data-cost'), 10);

                if (this.ui.save.spendCoins(cost)) {
                    if (id === 'revive_pack_1') d.consumables.revives += 1;
                    else if (id === 'revive_pack_3') d.consumables.revives += 3;
                    else if (id === 'headstart_booster') d.consumables.headstarts += 1;

                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Item purchased successfully!', 'success');
                    this.renderContent();
                } else {
                    this.ui.showToast('Not enough coins!', 'error');
                }
            };
        });
    }

    renderCurrency(container) {
        const d = this.ui.save.data;
        container.innerHTML = Object.values(SHOP_ITEMS.CURRENCY_EXCHANGE).map(ex => {
            const isFree = ex.costType === 'free';
            const canClaimFree = isFree && (!d.freeGemsLastClaim || (Date.now() - d.freeGemsLastClaim) > 24 * 60 * 60 * 1000);

            return `
                <div class="shop-card glass-panel">
                    <div class="shop-card-icon-box">
                        <span class="shop-card-emoji">${ex.icon}</span>
                    </div>
                    <div class="shop-card-info">
                        <h3 class="shop-card-title">${ex.name}</h3>
                        <p class="shop-card-desc">${ex.desc}</p>
                    </div>
                    <div class="shop-card-action">
                        ${isFree ? `
                            <button class="btn ${canClaimFree ? 'btn-accent' : 'btn-disabled'} btn-block" id="btn-claim-free-gems">
                                ${canClaimFree ? 'CLAIM FREE 💎 10' : 'CLAIMED (24h Cooldown)'}
                            </button>
                        ` : `
                            <button class="btn btn-primary btn-block btn-exchange-coins" data-coins="${ex.givesCoins}" data-cost="${ex.cost}">
                                GET 🪙 ${ex.givesCoins.toLocaleString()} (💎 ${ex.cost})
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

        const freeBtn = container.querySelector('#btn-claim-free-gems');
        if (freeBtn) {
            freeBtn.onclick = () => {
                const canClaim = !d.freeGemsLastClaim || (Date.now() - d.freeGemsLastClaim) > 24 * 60 * 60 * 1000;
                if (canClaim) {
                    d.gems += 10;
                    d.freeGemsLastClaim = Date.now();
                    this.ui.save.save();
                    this.ui.audio.playLevelUp();
                    this.ui.showToast('Claimed 10 free gems!', 'success');
                    this.renderContent();
                }
            };
        }

        container.querySelectorAll('.btn-exchange-coins').forEach(btn => {
            btn.onclick = () => {
                const coins = parseInt(btn.getAttribute('data-coins'), 10);
                const cost = parseInt(btn.getAttribute('data-cost'), 10);

                if (this.ui.save.spendGems(cost)) {
                    this.ui.save.addCoins(coins);
                    this.ui.audio.playLevelUp();
                    this.ui.showToast(`Converted 💎 ${cost} into 🪙 ${coins.toLocaleString()}!`, 'success');
                    this.renderContent();
                } else {
                    this.ui.showToast('Not enough gems!', 'error');
                }
            };
        });
    }

    onShow() {
        this.renderContent();
    }
}
