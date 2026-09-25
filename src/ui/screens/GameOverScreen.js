/**
 * Game Over / Run Summary Screen
 * Displays performance metrics, new record celebrations, animated XP bar,
 * emergency revive actions, and score sharing.
 */

import { GAME_CONFIG } from '../../config/constants.js';

export class GameOverScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.runData = null;

        this.element = document.createElement('div');
        this.element.className = 'screen game-over-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="gameover-card glass-panel">
                <div class="gameover-header">
                    <span class="record-badge" id="go-record-badge" style="display:none;">🎉 NEW HIGH SCORE!</span>
                    <h2 class="gameover-title">MISSION COMPLETED</h2>
                </div>

                <!-- MAIN SCORE BANNER -->
                <div class="go-score-banner">
                    <span class="go-score-label">FINAL SCORE</span>
                    <h1 class="go-score-value" id="go-score">0</h1>
                </div>

                <!-- RUN STATS GRID -->
                <div class="go-stats-grid">
                    <div class="go-stat-item">
                        <span class="go-stat-lbl">DISTANCE</span>
                        <span class="go-stat-val" id="go-distance">0 m</span>
                    </div>
                    <div class="go-stat-item">
                        <span class="go-stat-lbl">COINS EARNED</span>
                        <span class="go-stat-val text-gold" id="go-coins">+0</span>
                    </div>
                    <div class="go-stat-item">
                        <span class="go-stat-lbl">GEMS EARNED</span>
                        <span class="go-stat-val text-cyan" id="go-gems">+0</span>
                    </div>
                    <div class="go-stat-item">
                        <span class="go-stat-lbl">BEST RECORD</span>
                        <span class="go-stat-val" id="go-best-score">0</span>
                    </div>
                </div>

                <!-- XP PROGRESSION BAR -->
                <div class="go-xp-section">
                    <div class="flex-between">
                        <span class="xp-level-tag" id="go-xp-level">LEVEL 1</span>
                        <span class="xp-earned-tag text-cyan" id="go-xp-earned">+0 XP</span>
                    </div>
                    <div class="go-xp-bar-bg">
                        <div class="go-xp-bar-fill" id="go-xp-fill"></div>
                    </div>
                </div>

                <!-- EMERGENCY REVIVE BOX -->
                <div class="go-revive-box" id="go-revive-box">
                    <button class="btn btn-accent btn-block btn-lg pulse-glow" id="btn-revive-run">
                        💖 EMERGENCY REVIVE (<span id="go-revive-cost">1 TOKEN</span>)
                    </button>
                </div>

                <!-- ACTION BUTTONS -->
                <div class="go-actions-row">
                    <button class="btn btn-primary btn-lg flex-1" id="btn-play-again">PLAY AGAIN</button>
                    <button class="btn btn-secondary btn-lg flex-1" id="btn-return-home">HOME</button>
                    <button class="btn btn-outline" id="btn-share-score" title="Share Score">📤</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#btn-play-again').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.engine.startNewRun();
            this.ui.showScreen('hud');
        };

        this.element.querySelector('#btn-return-home').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelector('#btn-share-score').onclick = () => {
            const score = this.element.querySelector('#go-score').textContent;
            const dist = this.element.querySelector('#go-distance').textContent;
            const text = `I just scored ${score} pts across ${dist} in Cyber Runner: Overdrive! Can you beat my record?`;

            if (navigator.share) {
                navigator.share({ title: 'Cyber Runner: Overdrive', text }).catch(() => {});
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    this.ui.showToast('Score copied to clipboard!', 'success');
                });
            }
        };

        this.element.querySelector('#btn-revive-run').onclick = () => {
            const d = this.ui.save.data;
            if (d.consumables.revives > 0) {
                d.consumables.revives--;
                this.ui.save.save();
                this.ui.engine.revivePlayer();
                this.ui.showScreen('hud');
            } else if (d.gems >= GAME_CONFIG.ECONOMY.REVIVE_COST_GEMS) {
                this.ui.save.spendGems(GAME_CONFIG.ECONOMY.REVIVE_COST_GEMS);
                this.ui.engine.revivePlayer();
                this.ui.showScreen('hud');
            } else {
                this.ui.showToast('Not enough revive tokens or gems!', 'error');
            }
        };
    }

    setRunData(data) {
        this.runData = data;
        const d = this.ui.save.data;

        this.element.querySelector('#go-score').textContent = data.score.toLocaleString();
        this.element.querySelector('#go-distance').textContent = `${data.distance.toLocaleString()} m`;
        this.element.querySelector('#go-coins').textContent = `+${data.coins.toLocaleString()}`;
        this.element.querySelector('#go-gems').textContent = `+${data.gems.toLocaleString()}`;
        this.element.querySelector('#go-best-score').textContent = d.highScore.toLocaleString();
        this.element.querySelector('#go-xp-earned').textContent = `+${data.earnedXp.toLocaleString()} XP`;

        // Record celebration
        const recordBadge = this.element.querySelector('#go-record-badge');
        if (data.isNewHigh && data.score > 0) {
            recordBadge.style.display = 'inline-block';
            this.ui.audio.playLevelUp();
            this.ui.engine.particles.spawnConfetti(window.innerWidth, window.innerHeight);
        } else {
            recordBadge.style.display = 'none';
        }

        // XP Bar
        const needed = GAME_CONFIG.PROGRESSION.getXpForLevel(d.level);
        const xpPct = Math.min(100, (d.xp / needed) * 100);
        this.element.querySelector('#go-xp-level').textContent = `LEVEL ${d.level}`;
        this.element.querySelector('#go-xp-fill').style.width = `${xpPct}%`;

        // Revive button availability (allow up to 2 revives per run)
        const reviveBox = this.element.querySelector('#go-revive-box');
        const reviveCostLabel = this.element.querySelector('#go-revive-cost');

        if (this.ui.engine.revivesUsedInRun < 2 && (d.consumables.revives > 0 || d.gems >= GAME_CONFIG.ECONOMY.REVIVE_COST_GEMS)) {
            reviveBox.style.display = 'block';
            if (d.consumables.revives > 0) {
                reviveCostLabel.textContent = `${d.consumables.revives} TOKEN(S) LEFT`;
            } else {
                reviveCostLabel.textContent = `💎 ${GAME_CONFIG.ECONOMY.REVIVE_COST_GEMS} GEMS`;
            }
        } else {
            reviveBox.style.display = 'none';
        }
    }

    onShow() {}
}
