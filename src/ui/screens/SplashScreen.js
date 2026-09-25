/**
 * Splash & Loading Screen
 * Displays animated game title, cyberpunk logo, loading progress bar,
 * and version number before transitioning smoothly into authentication or main menu.
 */

export class SplashScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.element = document.createElement('div');
        this.element.className = 'screen splash-screen';
        this.element.innerHTML = `
            <div class="splash-content">
                <div class="splash-logo-wrapper">
                    <div class="splash-icon">⚡</div>
                    <h1 class="splash-title">CYBER RUNNER</h1>
                    <div class="splash-subtitle">OVERDRIVE</div>
                </div>

                <div class="splash-loader-container">
                    <div class="splash-progress-bar">
                        <div class="splash-progress-fill" id="splash-progress"></div>
                    </div>
                    <div class="splash-loading-text" id="splash-status">INITIALIZING SYSTEM ENGINES...</div>
                </div>

                <div class="splash-footer">
                    <span class="version-tag">VERSION 1.0.0 PRO</span>
                    <span class="copyright-tag">© 2026 CYBERNETIC STUDIOS</span>
                </div>
            </div>
        `;
    }

    onShow() {
        const fill = this.element.querySelector('#splash-progress');
        const status = this.element.querySelector('#splash-status');

        let progress = 0;
        const steps = [
            { pct: 25, text: 'LOADING RETRO SYNTH AUDIO ENGINES...' },
            { pct: 55, text: 'GENERATING PROCEDURAL NEON WORLDS...' },
            { pct: 85, text: 'SYNCHRONIZING SECURE PLAYER PROFILES...' },
            { pct: 100, text: 'SYSTEM READY. LAUNCHING OVERDRIVE...' }
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                progress = steps[stepIndex].pct;
                fill.style.width = `${progress}%`;
                status.textContent = steps[stepIndex].text;
                stepIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    if (this.ui.save.data.settings.onboardingComplete) {
                        this.ui.showScreen('main_menu');
                    } else {
                        this.ui.showScreen('auth');
                    }
                }, 400);
            }
        }, 320);
    }
}
