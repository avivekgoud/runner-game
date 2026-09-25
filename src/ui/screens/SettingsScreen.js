/**
 * Settings Screen
 * Full configuration for Audio, Controls, Graphics Quality,
 * Screen Shake, Haptic Feedback, Backup/Restore, and Reset Progress.
 */

export class SettingsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen settings-screen';
        this.render();
    }

    render() {
        const s = this.ui.save.data.settings;

        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="settings-btn-back">◀ BACK</button>
                    <h2 class="sub-title">SYSTEM SETTINGS</h2>
                    <div class="header-dummy"></div>
                </header>

                <main class="settings-body-panel glass-panel">
                    <!-- AUDIO CONTROLS -->
                    <section class="settings-group">
                        <h3 class="group-title">AUDIO & ACOUSTICS</h3>
                        <div class="setting-item flex-between">
                            <span>Mute All Audio</span>
                            <input type="checkbox" id="set-mute" ${s.soundMuted ? 'checked' : ''}>
                        </div>
                        <div class="setting-item flex-between">
                            <span>Sound FX Volume</span>
                            <input type="range" id="set-sfx-vol" min="0" max="1" step="0.05" value="${s.sfxVolume}">
                        </div>
                        <div class="setting-item flex-between">
                            <span>Music Volume</span>
                            <input type="range" id="set-music-vol" min="0" max="1" step="0.05" value="${s.musicVolume}">
                        </div>
                    </section>

                    <!-- GRAPHICS & IMMERSION -->
                    <section class="settings-group">
                        <h3 class="group-title">VISUALS & HAPTICS</h3>
                        <div class="setting-item flex-between">
                            <span>Screen Shake on Impact</span>
                            <input type="checkbox" id="set-shake" ${s.screenShake ? 'checked' : ''}>
                        </div>
                        <div class="setting-item flex-between">
                            <span>Graphics Quality (Particles)</span>
                            <select id="set-quality" class="select-field">
                                <option value="high" ${s.graphicsQuality === 'high' ? 'selected' : ''}>High (600 Particles)</option>
                                <option value="medium" ${s.graphicsQuality === 'medium' ? 'selected' : ''}>Medium (300 Particles)</option>
                                <option value="low" ${s.graphicsQuality === 'low' ? 'selected' : ''}>Low (150 Particles)</option>
                            </select>
                        </div>
                        <div class="setting-item flex-between">
                            <span>Mobile Vibration / Haptics</span>
                            <input type="checkbox" id="set-vibration" ${s.vibration ? 'checked' : ''}>
                        </div>
                    </section>

                    <!-- CONTROLS REFERENCE -->
                    <section class="settings-group">
                        <h3 class="group-title">CONTROLS SCHEME</h3>
                        <div class="controls-reference-grid">
                            <div class="ctrl-row"><span>Jump / Double Jump:</span> <strong>SPACE / UP ARROW / W / SWIPE UP</strong></div>
                            <div class="ctrl-row"><span>Slide under Lasers:</span> <strong>DOWN ARROW / S / SWIPE DOWN</strong></div>
                            <div class="ctrl-row"><span>Pause Game:</span> <strong>ESC / P KEY</strong></div>
                        </div>
                    </section>

                    <!-- DATA BACKUP & RESET -->
                    <section class="settings-group">
                        <h3 class="group-title">DATA & PROFILE</h3>
                        <div class="setting-actions-row">
                            <button class="btn btn-outline" id="btn-export-save">EXPORT SAVE (JSON)</button>
                            <button class="btn btn-outline" id="btn-import-save">IMPORT SAVE</button>
                            <button class="btn btn-secondary" id="btn-switch-account">SWITCH ACCOUNT / LOGOUT</button>
                            <button class="btn btn-danger" id="btn-reset-data">RESET PROGRESS</button>
                        </div>
                    </section>
                </main>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const s = this.ui.save.data.settings;

        this.element.querySelector('#settings-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        // Audio controls
        this.element.querySelector('#set-mute').onchange = (e) => {
            s.soundMuted = e.target.checked;
            this.ui.audio.setMuted(s.soundMuted);
            this.ui.save.save();
        };

        this.element.querySelector('#set-sfx-vol').oninput = (e) => {
            s.sfxVolume = parseFloat(e.target.value);
            this.ui.audio.setSfxVolume(s.sfxVolume);
            this.ui.save.save();
        };

        this.element.querySelector('#set-music-vol').oninput = (e) => {
            s.musicVolume = parseFloat(e.target.value);
            this.ui.audio.setMusicVolume(s.musicVolume);
            this.ui.save.save();
        };

        // Screen shake & graphics
        this.element.querySelector('#set-shake').onchange = (e) => {
            s.screenShake = e.target.checked;
            this.ui.save.save();
        };

        this.element.querySelector('#set-quality').onchange = (e) => {
            s.graphicsQuality = e.target.value;
            this.ui.engine.particles.setQuality(s.graphicsQuality);
            this.ui.save.save();
        };

        this.element.querySelector('#set-vibration').onchange = (e) => {
            s.vibration = e.target.checked;
            this.ui.save.save();
        };

        // Export Save
        this.element.querySelector('#btn-export-save').onclick = () => {
            const json = this.ui.save.exportSaveData();
            navigator.clipboard.writeText(json).then(() => {
                this.ui.showToast('Save JSON copied to clipboard!', 'success');
            }).catch(() => {
                prompt('Copy your save data JSON:', json);
            });
        };

        // Import Save
        this.element.querySelector('#btn-import-save').onclick = () => {
            const json = prompt('Paste your save data JSON:');
            if (json) {
                const res = this.ui.save.importSaveData(json);
                if (res.success) {
                    this.ui.showToast(res.message, 'success');
                    this.ui.showScreen('main_menu');
                } else {
                    this.ui.showToast(res.message, 'error');
                }
            }
        };

        // Switch account
        this.element.querySelector('#btn-switch-account').onclick = () => {
            this.ui.showConfirmDialog('Are you sure you want to log out?', () => {
                this.ui.save.logout();
                this.ui.showScreen('auth');
            });
        };

        // Reset progress
        this.element.querySelector('#btn-reset-data').onclick = () => {
            this.ui.showConfirmDialog('Reset all progression, unlocked characters, and high scores? This action cannot be undone!', () => {
                this.ui.save.resetAllData();
                this.ui.showToast('Progress has been reset.', 'info');
                this.ui.showScreen('main_menu');
            });
        };
    }

    onShow() {
        // Sync toggles with current settings
        const s = this.ui.save.data.settings;
        this.element.querySelector('#set-mute').checked = s.soundMuted;
        this.element.querySelector('#set-sfx-vol').value = s.sfxVolume;
        this.element.querySelector('#set-music-vol').value = s.musicVolume;
        this.element.querySelector('#set-shake').checked = s.screenShake;
        this.element.querySelector('#set-quality').value = s.graphicsQuality;
        this.element.querySelector('#set-vibration').checked = s.vibration;
    }
}
