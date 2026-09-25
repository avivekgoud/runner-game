/**
 * Home / Main Menu Screen
 * Comprehensive arcade hub displaying player profile, level XP bar,
 * currency tallies, mission preview, active event banner, and full navigation grid.
 */

import { GAME_CONFIG } from '../../config/constants.js';
import { CHARACTERS } from '../../config/characters.js';
import { WORLDS } from '../../config/worlds.js';

export class MainMenuScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen main-menu-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="menu-layout">
                <!-- TOP HEADER BAR: Profile & Currencies -->
                <header class="menu-header glass-panel">
                    <div class="profile-summary" id="btn-view-stats">
                        <div class="player-avatar-badge" id="menu-avatar">⚡</div>
                        <div class="player-info-meta">
                            <div class="player-name-row">
                                <span class="player-username" id="menu-username">Runner</span>
                                <span class="player-level-badge" id="menu-level">LV. 1</span>
                            </div>
                            <div class="player-xp-bar-wrapper">
                                <div class="player-xp-fill" id="menu-xp-fill"></div>
                            </div>
                        </div>
                    </div>

                    <div class="currency-tally-group">
                        <div class="currency-pill coins-pill">
                            <span class="currency-icon">🪙</span>
                            <span class="currency-value" id="menu-coins">0</span>
                        </div>
                        <div class="currency-pill gems-pill">
                            <span class="currency-icon">💎</span>
                            <span class="currency-value" id="menu-gems">0</span>
                        </div>
                        <button class="icon-btn" id="menu-btn-settings" title="Settings">⚙️</button>
                    </div>
                </header>

                <!-- MIDDLE SECTION: Active Runner Showcase & Quick Run Banner -->
                <main class="menu-main-content">
                    <div class="runner-stage-card glass-panel">
                        <div class="selected-world-badge" id="menu-world-badge">NEO CITY</div>
                        <div class="stage-character-visual">
                            <div class="character-preview-stand" id="menu-char-stand">
                                <span class="character-emoji" id="menu-char-icon">🏃</span>
                            </div>
                            <div class="character-title-meta">
                                <h3 id="menu-char-name">BLAZE</h3>
                                <p id="menu-char-perk">Balanced Momentum</p>
                            </div>
                        </div>

                        <!-- BIG PLAY BUTTON -->
                        <button class="btn btn-play-huge pulse-glow" id="menu-btn-play">
                            <span class="play-icon">▶</span>
                            <span class="play-text">RUN NOW</span>
                        </button>
                    </div>

                    <!-- QUICK EVENT & MISSION SUMMARY CARD -->
                    <div class="menu-sidebar-cards">
                        <!-- High Score Display -->
                        <div class="card-mini glass-panel">
                            <div class="stat-mini-header">🏆 HIGH SCORE</div>
                            <div class="stat-mini-value" id="menu-high-score">0</div>
                            <div class="stat-mini-sub" id="menu-best-dist">Best: 0 m</div>
                        </div>

                        <!-- Daily Reward / Streak Banner -->
                        <div class="card-mini glass-panel interactive" id="menu-streak-card">
                            <div class="flex-between">
                                <div class="stat-mini-header">🔥 DAILY STREAK</div>
                                <span class="badge-dot" id="menu-reward-dot" style="display:none;"></span>
                            </div>
                            <div class="stat-mini-value" id="menu-streak-count">Day 1</div>
                            <div class="stat-mini-sub text-cyan">Tap to Claim Rewards</div>
                        </div>

                        <!-- Active Mission Preview -->
                        <div class="card-mini glass-panel interactive" id="menu-mission-preview">
                            <div class="flex-between">
                                <div class="stat-mini-header">🎯 DAILY MISSION</div>
                                <span class="badge-dot" id="menu-mission-dot" style="display:none;"></span>
                            </div>
                            <div class="mission-mini-desc" id="menu-mission-title">Loading mission...</div>
                            <div class="mission-mini-bar">
                                <div class="mission-mini-fill" id="menu-mission-fill"></div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- BOTTOM DOCK NAVIGATION -->
                <footer class="menu-bottom-dock glass-panel">
                    <button class="dock-btn" id="dock-worlds">
                        <span class="dock-icon">🌍</span>
                        <span class="dock-label">WORLDS</span>
                    </button>
                    <button class="dock-btn" id="dock-character">
                        <span class="dock-icon">👤</span>
                        <span class="dock-label">RUNNERS</span>
                    </button>
                    <button class="dock-btn" id="dock-shop">
                        <span class="dock-icon">🛍️</span>
                        <span class="dock-label">SHOP</span>
                    </button>
                    <button class="dock-btn" id="dock-missions">
                        <span class="dock-icon">📋</span>
                        <span class="dock-label">MISSIONS</span>
                    </button>
                    <button class="dock-btn" id="dock-achievements">
                        <span class="dock-icon">🏅</span>
                        <span class="dock-label">BADGES</span>
                    </button>
                    <button class="dock-btn" id="dock-leaderboard">
                        <span class="dock-icon">🏆</span>
                        <span class="dock-label">RANKS</span>
                    </button>
                    <button class="dock-btn" id="dock-inventory">
                        <span class="dock-icon">🎒</span>
                        <span class="dock-label">INVENTORY</span>
                    </button>
                    <button class="dock-btn" id="dock-events">
                        <span class="dock-icon">⚡</span>
                        <span class="dock-label">EVENT</span>
                    </button>
                </footer>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const nav = (btnId, screenId) => {
            const btn = this.element.querySelector(btnId);
            if (btn) {
                btn.onclick = () => {
                    this.ui.audio.playButtonClick();
                    this.ui.showScreen(screenId);
                };
            }
        };

        // Big Play Button
        this.element.querySelector('#menu-btn-play').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.engine.startNewRun();
            this.ui.showScreen('hud');
        };

        // Navigations
        nav('#btn-view-stats', 'stats');
        nav('#menu-btn-settings', 'settings');
        nav('#menu-streak-card', 'daily_rewards');
        nav('#menu-mission-preview', 'missions');
        nav('#dock-worlds', 'world_select');
        nav('#dock-character', 'character');
        nav('#dock-shop', 'shop');
        nav('#dock-missions', 'missions');
        nav('#dock-achievements', 'achievements');
        nav('#dock-leaderboard', 'leaderboard');
        nav('#dock-inventory', 'inventory');
        nav('#dock-events', 'events');
    }

    updateData() {
        const d = this.ui.save.data;
        const char = CHARACTERS[d.selectedCharacter] || CHARACTERS.blaze;
        const world = WORLDS[d.selectedWorld] || WORLDS.neo_city;

        // User info
        this.element.querySelector('#menu-username').textContent = d.username || 'Runner';
        this.element.querySelector('#menu-level').textContent = `LV. ${d.level}`;

        const xpNeeded = GAME_CONFIG.PROGRESSION.getXpForLevel(d.level);
        const xpPct = Math.min(100, (d.xp / xpNeeded) * 100);
        this.element.querySelector('#menu-xp-fill').style.width = `${xpPct}%`;

        // Currencies
        this.element.querySelector('#menu-coins').textContent = d.coins.toLocaleString();
        this.element.querySelector('#menu-gems').textContent = d.gems.toLocaleString();

        // High Score
        this.element.querySelector('#menu-high-score').textContent = d.highScore.toLocaleString();
        this.element.querySelector('#menu-best-dist').textContent = `Best: ${d.bestDistance.toLocaleString()} m`;

        // Character Showcase
        this.element.querySelector('#menu-char-name').textContent = char.name.toUpperCase();
        this.element.querySelector('#menu-char-perk').textContent = char.abilityDesc;
        this.element.querySelector('#menu-world-badge').textContent = world.name.toUpperCase();

        // Streak
        const streak = d.dailyReward.currentStreak || 0;
        this.element.querySelector('#menu-streak-count').textContent = `Day ${streak % 7 + 1} Streak`;

        // Mission preview
        const firstDaily = d.missions.daily[0];
        if (firstDaily) {
            this.element.querySelector('#menu-mission-title').textContent = firstDaily.title;
            const mPct = Math.min(100, (firstDaily.progress / firstDaily.target) * 100);
            this.element.querySelector('#menu-mission-fill').style.width = `${mPct}%`;
        }

        // Notification Badges
        const rewardDot = this.element.querySelector('#menu-reward-dot');
        const hasReward = this.checkDailyRewardAvailable();
        rewardDot.style.display = hasReward ? 'inline-block' : 'none';

        const missionDot = this.element.querySelector('#menu-mission-dot');
        const hasClaimableMission = [...d.missions.daily, ...d.missions.weekly].some(m => m.completed && !m.claimed);
        missionDot.style.display = hasClaimableMission ? 'inline-block' : 'none';
    }

    checkDailyRewardAvailable() {
        const lastClaim = this.ui.save.data.dailyReward.lastClaimDate;
        if (!lastClaim) return true;
        const lastDate = new Date(lastClaim).toDateString();
        const today = new Date().toDateString();
        return lastDate !== today;
    }

    onShow() {
        this.updateData();
    }
}
