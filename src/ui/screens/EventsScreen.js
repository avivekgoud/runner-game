/**
 * Limited-Time Events Screen
 * Displays seasonal events, active perks, custom event missions, and milestones.
 */

import { ACTIVE_EVENTS } from '../../config/events.js';

export class EventsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.event = ACTIVE_EVENTS[0];

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen events-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="evt-btn-back">◀ BACK</button>
                    <h2 class="sub-title">SEASONAL EVENT</h2>
                    <div class="event-timer-badge">⏳ <span id="evt-timer">Ends in: 18d 14h</span></div>
                </header>

                <main class="event-body-layout">
                    <!-- EVENT BANNER -->
                    <div class="event-banner-card glass-panel" style="background: ${this.event.bannerGradient}">
                        <div class="event-banner-content">
                            <span class="event-subtitle">${this.event.subtitle}</span>
                            <h1 class="event-title">${this.event.title}</h1>
                            <p class="event-desc">${this.event.description}</p>
                            <div class="event-perk-pills">
                                <span class="perk-pill">⚡ +50% COIN BOOST</span>
                                <span class="perk-pill">🎯 +25% SCORE MULTIPLIER</span>
                            </div>
                        </div>
                    </div>

                    <!-- EVENT MISSIONS -->
                    <div class="event-missions-panel glass-panel">
                        <h3 class="panel-heading">EVENT MISSIONS</h3>
                        <div class="event-missions-list" id="evt-missions-list"></div>
                    </div>
                </main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#evt-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };
    }

    renderEventMissions() {
        const list = this.element.querySelector('#evt-missions-list');
        list.innerHTML = this.event.missions.map(m => `
            <div class="mission-card glass-panel">
                <div class="mission-header-row flex-between">
                    <h4 class="mission-title">${m.title}</h4>
                    <div class="mission-rewards">
                        <span>🪙 ${m.rewardCoins}</span>
                        <span>💎 ${m.rewardGems}</span>
                    </div>
                </div>
                <p class="mission-desc">${m.desc}</p>
                <div class="mission-footer-row flex-between">
                    <span class="progress-ratio">Target: ${m.target.toLocaleString()}</span>
                    <button class="btn btn-primary btn-sm btn-play-event" id="btn-run-event">RUN IN EVENT</button>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.btn-play-event').forEach(b => {
            b.onclick = () => {
                this.ui.audio.playButtonClick();
                this.ui.engine.startNewRun('cyber_2099');
                this.ui.showScreen('hud');
            };
        });
    }

    onShow() {
        this.renderEventMissions();
    }
}
