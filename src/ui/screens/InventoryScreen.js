/**
 * Inventory Screen
 * Displays all owned assets (Runners, Skins, Hats, Trails, Consumables)
 * and allows instant equipping and viewing.
 */

import { CHARACTERS } from '../../config/characters.js';
import { CUSTOMIZATIONS } from '../../config/customizations.js';

export class InventoryScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.category = 'all';

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen inventory-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="inv-btn-back">◀ BACK</button>
                    <h2 class="sub-title">RUNNER INVENTORY</h2>
                    <div class="currency-pills-mini">
                        <span class="pill-coins">🪙 <span id="inv-coins">0</span></span>
                    </div>
                </header>

                <main class="inventory-body-container" id="inv-items-container"></main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#inv-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };
    }

    renderInventory() {
        const d = this.ui.save.data;
        this.element.querySelector('#inv-coins').textContent = d.coins.toLocaleString();

        const container = this.element.querySelector('#inv-items-container');
        let html = '';

        // 1. Owned Runners
        html += '<h3 class="inv-section-title">ACTIVE RUNNERS</h3><div class="inv-grid">';
        d.unlockedCharacters.forEach(charId => {
            const c = CHARACTERS[charId];
            if (!c) return;
            const isEquipped = d.selectedCharacter === c.id;
            html += `
                <div class="inv-card glass-panel ${isEquipped ? 'equipped' : ''}">
                    <div class="inv-icon-box" style="background: ${c.visual.primaryColor}">🏃</div>
                    <div class="inv-meta">
                        <span class="item-rarity-pill ${c.rarity.toLowerCase()}">${c.rarity}</span>
                        <h4>${c.name}</h4>
                        <span class="inv-sub">${c.abilityName}</span>
                    </div>
                    <button class="btn btn-sm ${isEquipped ? 'btn-disabled' : 'btn-primary'} btn-equip-char" data-id="${c.id}">
                        ${isEquipped ? 'EQUIPPED' : 'EQUIP'}
                    </button>
                </div>
            `;
        });
        html += '</div>';

        // 2. Consumables
        html += '<h3 class="inv-section-title">STORED CONSUMABLES</h3><div class="inv-grid">';
        html += `
            <div class="inv-card glass-panel">
                <div class="inv-icon-box" style="background: #e11d48">💖</div>
                <div class="inv-meta">
                    <h4>Revive Tokens</h4>
                    <span class="inv-sub">Instant emergency crash revival</span>
                </div>
                <span class="inv-qty">x${d.consumables.revives}</span>
            </div>
            <div class="inv-card glass-panel">
                <div class="inv-icon-box" style="background: #8b5cf6">🚀</div>
                <div class="inv-meta">
                    <h4>Supersonic Headstarts</h4>
                    <span class="inv-sub">500m rocket launch on next run</span>
                </div>
                <span class="inv-qty">x${d.consumables.headstarts}</span>
            </div>
        `;
        html += '</div>';

        container.innerHTML = html;

        container.querySelectorAll('.btn-equip-char').forEach(btn => {
            btn.onclick = () => {
                d.selectedCharacter = btn.getAttribute('data-id');
                this.ui.save.save();
                this.ui.audio.playButtonClick();
                this.renderInventory();
            };
        });
    }

    onShow() {
        this.renderInventory();
    }
}
