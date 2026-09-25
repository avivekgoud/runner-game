/**
 * Player Onboarding & Interactive Tutorial
 * Step-by-step walkthrough covering controls, jumping, sliding,
 * coin collection, power-ups, and mission objectives.
 */

export class OnboardingScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.currentStep = 0;
        this.steps = [
            {
                title: 'LOCOMOTION & AUTO-RUN',
                icon: 'RUN',
                text: 'Your runner sprints forward automatically, gathering momentum as you survive longer. Stay alert and watch for obstacles ahead!',
                controls: 'Keyboard: Arrow Keys / WASD • Mobile: Swipes & Virtual Buttons'
            },
            {
                title: 'LEAP OVER HAZARDS',
                icon: 'JUMP',
                text: 'Press Space, Up Arrow, or Swipe Up to jump over ground spikes, crates, and deep pits. Some characters can even Double Jump mid-air!',
                controls: 'SPACE / UP ARROW / SWIPE UP'
            },
            {
                title: 'SLIDE UNDER LASERS',
                icon: 'SLIDE',
                text: 'Overhead laser barriers and low ceiling hazards will crash your run! Slide low under them to clear safely.',
                controls: 'DOWN ARROW / S KEY / SWIPE DOWN'
            },
            {
                title: 'HARVEST COINS & POWER-UPS',
                icon: 'BONUS',
                text: 'Collect golden credits and blue gems. Grab power-ups like the Coin Magnet, Energy Shield, and Hyper Dash to supercharge your score multiplier!',
                controls: 'Combos multiply score when you chain coins without getting hit!'
            }
        ];

        this.element = document.createElement('div');
        this.element.className = 'screen onboarding-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="onboarding-card glass-panel">
                <div class="onboarding-step-indicator" id="step-dots"></div>

                <div class="onboarding-icon" id="step-icon">RUN</div>
                <h2 class="onboarding-title" id="step-title">ACADEMY TRAINING</h2>
                <p class="onboarding-text" id="step-text"></p>

                <div class="onboarding-controls-box">
                    <span class="controls-label">COMMAND:</span>
                    <span class="controls-text" id="step-controls"></span>
                </div>

                <div class="onboarding-actions">
                    <button class="btn btn-outline" id="btn-skip-tutorial">SKIP TUTORIAL</button>
                    <button class="btn btn-primary" id="btn-next-step">NEXT</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#btn-next-step').onclick = () => {
            this.ui.audio.playButtonClick();
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.updateStep();
            } else {
                this.finishOnboarding();
            }
        };

        this.element.querySelector('#btn-skip-tutorial').onclick = () => {
            this.ui.audio.playButtonClick();
            this.finishOnboarding();
        };
    }

    updateStep() {
        const step = this.steps[this.currentStep];
        this.element.querySelector('#step-icon').textContent = step.icon;
        this.element.querySelector('#step-title').textContent = step.title;
        this.element.querySelector('#step-text').textContent = step.text;
        this.element.querySelector('#step-controls').textContent = step.controls;

        // Update Dots
        const dotsContainer = this.element.querySelector('#step-dots');
        dotsContainer.innerHTML = this.steps.map((_, i) => `
            <span class="dot ${i === this.currentStep ? 'active' : ''}"></span>
        `).join('');

        const nextBtn = this.element.querySelector('#btn-next-step');
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.textContent = 'START FIRST RUN!';
            nextBtn.className = 'btn btn-accent';
        } else {
            nextBtn.textContent = 'NEXT';
            nextBtn.className = 'btn btn-primary';
        }
    }

    finishOnboarding() {
        this.ui.save.data.settings.onboardingComplete = true;
        this.ui.save.save();
        this.ui.showToast('Tutorial complete! Let\'s run!', 'success');
        this.ui.showScreen('main_menu');
    }

    onShow() {
        this.currentStep = 0;
        this.updateStep();
    }
}
