/**
 * Pause Menu Screen
 * In-game pause overlay with Resume, Restart, Settings, and Quit Run options.
 */

export class PauseScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen pause-overlay-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="pause-card glass-panel">
                <div class="pause-icon">⏸</div>
                <h2 class="pause-title">MISSION PAUSED</h2>

                <div class="pause-actions-list">
                    <button class="btn btn-primary btn-block btn-lg mb-3" id="pause-btn-resume">RESUME RUN</button>
                    <button class="btn btn-secondary btn-block mb-3" id="pause-btn-restart">RESTART RUN</button>
                    <button class="btn btn-outline btn-block mb-3" id="pause-btn-settings">SETTINGS</button>
                    <button class="btn btn-danger btn-block" id="pause-btn-quit">ABORT MISSION</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#pause-btn-resume').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.engine.resumeGame();
            this.ui.showScreen('hud');
        };

        this.element.querySelector('#pause-btn-restart').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.engine.startNewRun();
            this.ui.showScreen('hud');
        };

        this.element.querySelector('#pause-btn-settings').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('settings');
        };

        this.element.querySelector('#pause-btn-quit').onclick = () => {
            this.ui.showConfirmDialog('Abort this mission? Any uncollected rewards in this run will be banked.', () => {
                this.ui.engine.onPlayerDied();
            });
        };
    }

    onShow() {}
}
