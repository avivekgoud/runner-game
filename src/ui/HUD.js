/**
 * In-Game HUD (Heads-Up Display)
 * Real-time indicators for score, distance, coins, multiplier,
 * combo progress bar, active power-up duration badges, and mobile controls.
 */

import { GAME_CONFIG } from '../config/constants.js';
import { events } from '../core/EventEmitter.js';

export class HUD {
    constructor(container, engine, audio) {
        this.container = container;
        this.engine = engine;
        this.audio = audio;

        this.element = document.createElement('div');
        this.element.className = 'game-hud';
        this.element.innerHTML = this.getTemplate();
        this.container.appendChild(this.element);

        this.cacheDom();
        this.bindEvents();
        this.hide();
    }

    getTemplate() {
        return `
            <div class="hud-top-bar">
                <div class="hud-stat-box score-box">
                    <span class="hud-label">SCORE</span>
                    <span class="hud-value" id="hud-score">0</span>
                </div>
                <div class="hud-stat-box distance-box">
                    <span class="hud-label">DISTANCE</span>
                    <span class="hud-value" id="hud-distance">0 m</span>
                </div>
                <div class="hud-stat-box coins-box">
                    <span class="hud-icon">🪙</span>
                    <span class="hud-value" id="hud-coins">0</span>
                </div>
                <button class="hud-btn pause-btn" id="hud-pause-btn" title="Pause Game">⏸</button>
            </div>

            <!-- Combo Multiplier Gauge -->
            <div class="hud-combo-wrapper" id="hud-combo-container">
                <div class="hud-combo-badge" id="hud-combo-badge">RUNNER x1</div>
                <div class="hud-combo-bar-bg">
                    <div class="hud-combo-bar-fill" id="hud-combo-fill"></div>
                </div>
            </div>

            <!-- Active Power-Up Timers Bar -->
            <div class="hud-powerups-container" id="hud-powerups"></div>

            <!-- Mobile / Touch Virtual Controls -->
            <div class="mobile-controls-overlay" id="mobile-controls">
                <button class="virtual-btn slide-btn interactive" id="vbtn-slide">
                    <span>▼ SLIDE</span>
                </button>
                <button class="virtual-btn jump-btn interactive" id="vbtn-jump">
                    <span>▲ JUMP</span>
                </button>
            </div>
        `;
    }

    cacheDom() {
        this.scoreEl = this.element.querySelector('#hud-score');
        this.distanceEl = this.element.querySelector('#hud-distance');
        this.coinsEl = this.element.querySelector('#hud-coins');
        this.pauseBtn = this.element.querySelector('#hud-pause-btn');
        this.comboBadge = this.element.querySelector('#hud-combo-badge');
        this.comboFill = this.element.querySelector('#hud-combo-fill');
        this.powerupsContainer = this.element.querySelector('#hud-powerups');

        this.vbtnSlide = this.element.querySelector('#vbtn-slide');
        this.vbtnJump = this.element.querySelector('#vbtn-jump');
    }

    bindEvents() {
        this.pauseBtn.addEventListener('click', () => {
            this.audio.playButtonClick();
            this.engine.pauseGame();
        });

        // Mobile touch buttons
        this.vbtnJump.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.engine.input.triggerJump();
        });
        this.vbtnJump.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.engine.input.triggerJump();
        });

        this.vbtnSlide.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.engine.input.triggerSlide();
        });
        this.vbtnSlide.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.engine.input.triggerSlide();
        });
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    update() {
        if (this.element.style.display === 'none') return;

        // Update stats
        this.scoreEl.textContent = this.engine.score.toLocaleString();
        this.distanceEl.textContent = `${this.engine.distanceInRun.toLocaleString()} m`;
        this.coinsEl.textContent = this.engine.coinsInRun.toLocaleString();

        // Update Combo Gauge
        const combo = this.engine.combo;
        const comboTier = this.getComboTier(combo);
        this.comboBadge.textContent = `${comboTier.name} x${Math.floor(combo)}`;
        this.comboBadge.style.color = comboTier.color;

        const fillPct = (this.engine.comboTimer / GAME_CONFIG.SCORING.COMBO_DECAY_TIME) * 100;
        this.comboFill.style.width = `${Math.max(0, Math.min(100, fillPct))}%`;
        this.comboFill.style.backgroundColor = comboTier.color;

        // Update Active Power-Ups
        this.updatePowerUps();
    }

    getComboTier(combo) {
        const tiers = GAME_CONFIG.SCORING.COMBO_LEVELS;
        for (let i = tiers.length - 1; i >= 0; i--) {
            if (combo >= tiers[i].min) return tiers[i];
        }
        return tiers[0];
    }

    updatePowerUps() {
        const p = this.engine.player;
        const activeList = [];

        if (p.hasShield) activeList.push({ name: 'Shield', icon: '🛡️', time: p.shieldTimer, max: 12, col: '#34d399' });
        if (p.hasMagnet) activeList.push({ name: 'Magnet', icon: '🧲', time: p.magnetTimer, max: 10, col: '#38bdf8' });
        if (p.hasCoinDoubler) activeList.push({ name: '2x Coins', icon: '🪙', time: p.coinDoublerTimer, max: 10, col: '#facc15' });
        if (p.hasScoreBoost) activeList.push({ name: 'Score x2', icon: '⚡', time: p.scoreBoostTimer, max: 10, col: '#fb923c' });
        if (p.hasSpeedBoost) activeList.push({ name: 'Dash', icon: '🚀', time: p.speedBoostTimer, max: 6, col: '#e879f9' });
        if (p.hasSlowMo) activeList.push({ name: 'Slow-Mo', icon: '⏳', time: p.slowMoTimer, max: 7, col: '#818cf8' });

        this.powerupsContainer.innerHTML = activeList.map(item => `
            <div class="hud-pu-badge" style="border-color: ${item.col}">
                <span class="hud-pu-icon">${item.icon}</span>
                <span class="hud-pu-time">${Math.ceil(item.time)}s</span>
            </div>
        `).join('');
    }
}
