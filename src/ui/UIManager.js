/**
 * Master UI Manager
 * Coordinates navigation router, screen transitions, HUD overlay,
 * interactive modal dialogs, and toast notifications.
 */

import { HUD } from './HUD.js';
import { SplashScreen } from './screens/SplashScreen.js';
import { AuthScreen } from './screens/AuthScreen.js';
import { OnboardingScreen } from './screens/OnboardingScreen.js';
import { MainMenuScreen } from './screens/MainMenuScreen.js';
import { WorldSelectScreen } from './screens/WorldSelectScreen.js';
import { CharacterScreen } from './screens/CharacterScreen.js';
import { ShopScreen } from './screens/ShopScreen.js';
import { DailyRewardsScreen } from './screens/DailyRewardsScreen.js';
import { MissionsScreen } from './screens/MissionsScreen.js';
import { AchievementsScreen } from './screens/AchievementsScreen.js';
import { LeaderboardScreen } from './screens/LeaderboardScreen.js';
import { EventsScreen } from './screens/EventsScreen.js';
import { InventoryScreen } from './screens/InventoryScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { StatsScreen } from './screens/StatsScreen.js';
import { GameOverScreen } from './screens/GameOverScreen.js';
import { PauseScreen } from './screens/PauseScreen.js';
import { events } from '../core/EventEmitter.js';

export class UIManager {
    constructor(rootContainer, gameEngine, saveManager, audioManager) {
        this.container = rootContainer;
        this.engine = gameEngine;
        this.save = saveManager;
        this.audio = audioManager;

        this.screens = {};
        this.currentScreen = null;

        this.setupDomStructure();
        this.initScreens();
        this.bindEngineEvents();
    }

    setupDomStructure() {
        this.screenWrapper = document.createElement('div');
        this.screenWrapper.className = 'screens-wrapper';
        this.container.appendChild(this.screenWrapper);

        // Toast container
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        this.container.appendChild(this.toastContainer);

        // Confirm modal dialog container
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'modal-overlay';
        this.modalOverlay.style.display = 'none';
        this.modalOverlay.innerHTML = `
            <div class="modal-card glass-panel">
                <h3 class="modal-title" id="modal-title">CONFIRM ACTION</h3>
                <p class="modal-message" id="modal-msg"></p>
                <div class="modal-actions-row">
                    <button class="btn btn-outline" id="modal-btn-cancel">CANCEL</button>
                    <button class="btn btn-danger" id="modal-btn-confirm">CONFIRM</button>
                </div>
            </div>
        `;
        this.container.appendChild(this.modalOverlay);

        this.modalCancelBtn = this.modalOverlay.querySelector('#modal-btn-cancel');
        this.modalConfirmBtn = this.modalOverlay.querySelector('#modal-btn-confirm');
        this.modalCancelBtn.onclick = () => this.hideConfirmDialog();
    }

    initScreens() {
        this.hud = new HUD(this.container, this.engine, this.audio);

        this.screens = {
            splash: new SplashScreen(this),
            auth: new AuthScreen(this),
            onboarding: new OnboardingScreen(this),
            main_menu: new MainMenuScreen(this),
            world_select: new WorldSelectScreen(this),
            character: new CharacterScreen(this),
            shop: new ShopScreen(this),
            daily_rewards: new DailyRewardsScreen(this),
            missions: new MissionsScreen(this),
            achievements: new AchievementsScreen(this),
            leaderboard: new LeaderboardScreen(this),
            events: new EventsScreen(this),
            inventory: new InventoryScreen(this),
            settings: new SettingsScreen(this),
            stats: new StatsScreen(this),
            game_over: new GameOverScreen(this),
            pause: new PauseScreen(this)
        };

        // Attach screen elements to wrapper
        for (const [id, screen] of Object.entries(this.screens)) {
            screen.element.id = `screen-${id}`;
            screen.element.style.display = 'none';
            this.screenWrapper.appendChild(screen.element);
        }
    }

    bindEngineEvents() {
        events.on('run:ended', (runData) => {
            this.screens.game_over.setRunData(runData);
            this.showScreen('game_over');
        });

        events.on('engine:stateChanged', ({ to }) => {
            if (to === 'playing') {
                this.hud.show();
                this.hideAllScreens();
            } else if (to === 'paused') {
                this.showScreen('pause');
            }
        });

        events.on('achievement:unlocked', (ach) => {
            this.showToast(`🏆 Achievement Unlocked: ${ach.title}!`, 'success');
            this.audio.playLevelUp();
        });

        events.on('mission:completed', (mission) => {
            this.showToast(`🎯 Protocol Complete: ${mission.title}!`, 'info');
        });
    }

    showScreen(screenId) {
        if (screenId === 'hud') {
            this.hideAllScreens();
            this.hud.show();
            this.currentScreen = 'hud';
            return;
        }

        const screen = this.screens[screenId];
        if (!screen) {
            console.error(`Screen "${screenId}" not found`);
            return;
        }

        // Hide HUD when navigating full screens
        if (screenId !== 'pause') {
            this.hud.hide();
        }

        for (const [id, s] of Object.entries(this.screens)) {
            if (id === screenId) {
                s.element.style.display = 'flex';
                if (s.onShow) s.onShow();
            } else if (screenId === 'pause' && id === 'game_over') {
                // Keep background
            } else {
                s.element.style.display = 'none';
            }
        }

        this.currentScreen = screenId;
    }

    hideAllScreens() {
        for (const s of Object.values(this.screens)) {
            s.element.style.display = 'none';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `game-toast toast-${type}`;
        toast.textContent = message;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }

    showConfirmDialog(message, onConfirm) {
        this.modalOverlay.querySelector('#modal-msg').textContent = message;
        this.modalOverlay.style.display = 'flex';

        this.modalConfirmBtn.onclick = () => {
            this.audio.playButtonClick();
            this.hideConfirmDialog();
            if (onConfirm) onConfirm();
        };
    }

    hideConfirmDialog() {
        this.modalOverlay.style.display = 'none';
    }

    update() {
        if (this.currentScreen === 'hud' || this.engine.state === 'playing') {
            this.hud.update();
        }
    }
}
