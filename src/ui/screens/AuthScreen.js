/**
 * Authentication Screen
 * Comprehensive authentication flow: Welcome, Login, Sign Up,
 * Forgot Password, Password Visibility Toggle, Validation, and Guest Mode.
 */

export class AuthScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.currentTab = 'welcome'; // 'welcome', 'login', 'signup', 'forgot'
        this.element = document.createElement('div');
        this.element.className = 'screen auth-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="auth-card glass-panel">
                <div class="auth-header">
                    <div class="auth-brand-logo">CR</div>
                    <h2 class="auth-title" id="auth-title">WELCOME RUNNER</h2>
                    <p class="auth-subtitle" id="auth-desc">Sign in to save your progression, records, and cosmetics.</p>
                </div>

                <div class="auth-error-banner" id="auth-error" style="display:none;"></div>

                <!-- WELCOME VIEW -->
                <div class="auth-view" id="view-welcome">
                    <button class="btn btn-primary btn-block mb-3" id="btn-goto-login">LOG IN</button>
                    <button class="btn btn-secondary btn-block mb-3" id="btn-goto-signup">CREATE NEW ACCOUNT</button>
                    <div class="auth-divider"><span>OR</span></div>
                    <button class="btn btn-outline btn-block" id="btn-guest-mode">CONTINUE AS GUEST</button>
                </div>

                <!-- LOGIN VIEW -->
                <div class="auth-view" id="view-login" style="display:none;">
                    <form id="form-login">
                        <div class="form-group mb-3">
                            <label>USERNAME</label>
                            <input type="text" class="input-field" id="login-username" placeholder="Enter runner username" required autocomplete="username">
                        </div>
                        <div class="form-group mb-3">
                            <label>PASSWORD</label>
                            <div class="input-wrapper">
                                <input type="password" class="input-field" id="login-password" placeholder="Enter password" required autocomplete="current-password">
                                <button type="button" class="btn-toggle-pwd" data-target="login-password">SHOW</button>
                            </div>
                        </div>
                        <div class="form-row mb-3 flex-between">
                            <label class="checkbox-label">
                                <input type="checkbox" id="login-remember" checked> Remember Me
                            </label>
                            <a href="#" class="auth-link" id="link-forgot-pwd">Forgot Password?</a>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block mb-2" id="btn-submit-login">SIGN IN</button>
                        <button type="button" class="btn btn-text btn-block" id="btn-back-welcome-1">BACK</button>
                    </form>
                </div>

                <!-- SIGN UP VIEW -->
                <div class="auth-view" id="view-signup" style="display:none;">
                    <form id="form-signup">
                        <div class="form-group mb-2">
                            <label>USERNAME</label>
                            <input type="text" class="input-field" id="signup-username" placeholder="Choose username (3+ chars)" required autocomplete="username">
                        </div>
                        <div class="form-group mb-2">
                            <label>EMAIL</label>
                            <input type="email" class="input-field" id="signup-email" placeholder="runner@domain.com" required autocomplete="email">
                        </div>
                        <div class="form-group mb-2">
                            <label>PASSWORD</label>
                            <div class="input-wrapper">
                                <input type="password" class="input-field" id="signup-password" placeholder="Min 6 characters" required autocomplete="new-password">
                                <button type="button" class="btn-toggle-pwd" data-target="signup-password">SHOW</button>
                            </div>
                        </div>
                        <div class="form-group mb-3">
                            <label>CONFIRM PASSWORD</label>
                            <div class="input-wrapper">
                                <input type="password" class="input-field" id="signup-confirm-password" placeholder="Re-enter password" required autocomplete="new-password">
                                <button type="button" class="btn-toggle-pwd" data-target="signup-confirm-password">SHOW</button>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-accent btn-block mb-2" id="btn-submit-signup">CREATE ACCOUNT</button>
                        <button type="button" class="btn btn-text btn-block" id="btn-back-welcome-2">BACK</button>
                    </form>
                </div>

                <!-- FORGOT PASSWORD VIEW -->
                <div class="auth-view" id="view-forgot" style="display:none;">
                    <form id="form-forgot">
                        <div class="form-group mb-3">
                            <label>REGISTERED EMAIL</label>
                            <input type="email" class="input-field" id="forgot-email" placeholder="Enter your account email" required>
                        </div>
                        <div class="form-group mb-3">
                            <label>NEW PASSWORD</label>
                            <input type="password" class="input-field" id="forgot-new-pwd" placeholder="Enter new password (6+ chars)" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block mb-2">UPDATE PASSWORD</button>
                        <button type="button" class="btn btn-text btn-block" id="btn-back-login">BACK TO LOGIN</button>
                    </form>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const errorEl = this.element.querySelector('#auth-error');
        const showError = (msg) => {
            errorEl.textContent = msg;
            errorEl.style.display = 'block';
        };
        const clearError = () => {
            errorEl.style.display = 'none';
        };

        // Navigation between views
        this.element.querySelector('#btn-goto-login').onclick = () => this.switchView('login');
        this.element.querySelector('#btn-goto-signup').onclick = () => this.switchView('signup');
        this.element.querySelector('#btn-back-welcome-1').onclick = () => this.switchView('welcome');
        this.element.querySelector('#btn-back-welcome-2').onclick = () => this.switchView('welcome');
        this.element.querySelector('#link-forgot-pwd').onclick = (e) => {
            e.preventDefault();
            this.switchView('forgot');
        };
        this.element.querySelector('#btn-back-login').onclick = () => this.switchView('login');

        // Continue as Guest
        this.element.querySelector('#btn-guest-mode').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.save.loginAsGuest();
            this.proceedAfterAuth();
        };

        // Password visibility toggles
        this.element.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
            btn.onclick = (e) => {
                const targetId = btn.getAttribute('data-target');
                const input = this.element.querySelector(`#${targetId}`);
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = 'HIDE';
                } else {
                    input.type = 'password';
                    btn.textContent = 'SHOW';
                }
            };
        });

        // Login submit
        this.element.querySelector('#form-login').onsubmit = (e) => {
            e.preventDefault();
            clearError();
            const u = this.element.querySelector('#login-username').value;
            const p = this.element.querySelector('#login-password').value;
            const rem = this.element.querySelector('#login-remember').checked;

            const res = this.ui.save.login(u, p, rem);
            if (!res.success) {
                showError(res.message);
            } else {
                this.ui.audio.playLevelUp();
                this.proceedAfterAuth();
            }
        };

        // Sign Up submit
        this.element.querySelector('#form-signup').onsubmit = (e) => {
            e.preventDefault();
            clearError();
            const u = this.element.querySelector('#signup-username').value;
            const em = this.element.querySelector('#signup-email').value;
            const p = this.element.querySelector('#signup-password').value;
            const cp = this.element.querySelector('#signup-confirm-password').value;

            if (p !== cp) {
                showError('Passwords do not match.');
                return;
            }

            const res = this.ui.save.signUp(u, em, p);
            if (!res.success) {
                showError(res.message);
            } else {
                this.ui.audio.playLevelUp();
                this.proceedAfterAuth();
            }
        };

        // Forgot Password submit
        this.element.querySelector('#form-forgot').onsubmit = (e) => {
            e.preventDefault();
            clearError();
            const em = this.element.querySelector('#forgot-email').value;
            const p = this.element.querySelector('#forgot-new-pwd').value;

            const res = this.ui.save.resetPassword(em, p);
            if (!res.success) {
                showError(res.message);
            } else {
                this.ui.showToast(res.message, 'success');
                this.switchView('login');
            }
        };
    }

    switchView(viewName) {
        this.ui.audio.playButtonClick();
        const views = ['welcome', 'login', 'signup', 'forgot'];
        views.forEach(v => {
            const el = this.element.querySelector(`#view-${v}`);
            if (el) el.style.display = (v === viewName) ? 'block' : 'none';
        });

        const errorEl = this.element.querySelector('#auth-error');
        if (errorEl) errorEl.style.display = 'none';

        const titleEl = this.element.querySelector('#auth-title');
        const descEl = this.element.querySelector('#auth-desc');

        if (viewName === 'welcome') {
            titleEl.textContent = 'WELCOME RUNNER';
            descEl.textContent = 'Sign in to save your progression, records, and cosmetics.';
        } else if (viewName === 'login') {
            titleEl.textContent = 'RUNNER LOGIN';
            descEl.textContent = 'Access your persistent profile and cloud leaderboard rank.';
        } else if (viewName === 'signup') {
            titleEl.textContent = 'JOIN THE SYNDICATE';
            descEl.textContent = 'Create your cyber runner ID and receive 500 bonus coins!';
        } else if (viewName === 'forgot') {
            titleEl.textContent = 'PASSWORD RECOVERY';
            descEl.textContent = 'Reset your password securely via registered email.';
        }
    }

    proceedAfterAuth() {
        if (!this.ui.save.data.settings.onboardingComplete) {
            this.ui.showScreen('onboarding');
        } else {
            this.ui.showScreen('main_menu');
        }
    }

    onShow() {
        this.switchView('welcome');
    }
}
