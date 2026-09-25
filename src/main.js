/**
 * Main Application Bootstrap
 * Initializes subsystems, sets up UI coordinators, and launches the game loop.
 */

import { SaveManager } from './core/SaveManager.js';
import { AudioManager, audio } from './core/AudioManager.js';
import { InputManager } from './core/InputManager.js';
import { GameEngine } from './core/GameEngine.js';
import { UIManager } from './ui/UIManager.js';
import { events } from './core/EventEmitter.js';

class App {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.appContainer = document.getElementById('game-app');

        this.save = new SaveManager();
        this.audio = audio;
        this.input = new InputManager();

        this.engine = new GameEngine(this.canvas, this.save, this.audio, this.input);
        this.ui = new UIManager(this.appContainer, this.engine, this.save, this.audio);

        this.init();
    }

    init() {
        // Start game rendering loop
        this.engine.start();

        // Launch with Splash Screen
        this.ui.showScreen('splash');

        // Continuous UI updates (HUD counters)
        const uiUpdateLoop = () => {
            this.ui.update();
            requestAnimationFrame(uiUpdateLoop);
        };
        requestAnimationFrame(uiUpdateLoop);

        // Global key shortcut for audio debug toggle 'M'
        window.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                const s = this.save.data.settings;
                s.soundMuted = !s.soundMuted;
                this.audio.setMuted(s.soundMuted);
                this.save.save();
                this.ui.showToast(s.soundMuted ? 'Audio Muted' : 'Audio Unmuted', 'info');
            }
        });

        console.log('[Cyber Runner: Overdrive] v1.0.0 Pro Initialized Successfully.');
    }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new App();
});
