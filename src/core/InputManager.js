/**
 * Unified Input Manager
 * Handles Keyboard, Touch Swipes, Virtual Mobile HUD Buttons, and Gamepad.
 * Features input buffering (coyote time / jump buffer) for responsive arcade controls.
 */

export class InputManager {
    constructor() {
        this.keys = new Map();
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.touchStartTime = 0;

        this.jumpPressed = false;
        this.jumpBufferTimer = 0;
        this.slidePressed = false;
        this.slideBufferTimer = 0;
        this.pausePressed = false;

        this.setupKeyboard();
        this.setupTouch();
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            // Prevent default scrolling for game controls
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            if (!this.keys.get(e.code)) {
                this.keys.set(e.code, true);

                if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
                    this.triggerJump();
                } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                    this.triggerSlide();
                } else if (e.code === 'Escape' || e.code === 'KeyP') {
                    this.pausePressed = true;
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.slidePressed = false;
            }
        });
    }

    setupTouch() {
        const threshold = 35; // minimum distance for swipe in pixels
        const maxTime = 400; // max ms for swipe

        window.addEventListener('touchstart', (e) => {
            // Ignore if touching UI buttons directly
            if (e.target.closest('button, input, select, a, .interactive')) return;

            const touch = e.changedTouches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchStartTime = performance.now();
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (e.target.closest('button, input, select, a, .interactive')) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            const deltaTime = performance.now() - this.touchStartTime;

            if (deltaTime <= maxTime) {
                // Determine vertical vs horizontal dominance
                if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
                    if (deltaY < 0) {
                        // Swiped UP
                        this.triggerJump();
                    } else {
                        // Swiped DOWN
                        this.triggerSlide();
                    }
                } else if (Math.abs(deltaX) <= threshold && Math.abs(deltaY) <= threshold) {
                    // Tap on screen -> Jump
                    this.triggerJump();
                }
            }
        }, { passive: true });
    }

    triggerJump() {
        this.jumpPressed = true;
        this.jumpBufferTimer = 0.15; // 150ms buffer window
    }

    triggerSlide() {
        this.slidePressed = true;
        this.slideBufferTimer = 0.15;
    }

    triggerPause() {
        this.pausePressed = true;
    }

    consumeJump() {
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer = 0;
            this.jumpPressed = false;
            return true;
        }
        return false;
    }

    consumeSlide() {
        if (this.slideBufferTimer > 0 || this.slidePressed) {
            this.slideBufferTimer = 0;
            return true;
        }
        return false;
    }

    consumePause() {
        if (this.pausePressed) {
            this.pausePressed = false;
            return true;
        }
        return false;
    }

    update(dt) {
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer -= dt;
            if (this.jumpBufferTimer <= 0) this.jumpPressed = false;
        }
        if (this.slideBufferTimer > 0) {
            this.slideBufferTimer -= dt;
        }

        this.pollGamepad();
    }

    pollGamepad() {
        if (!navigator.getGamepads) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads || !gamepads[0]) return;

        const gp = gamepads[0];
        // Button 0 (A), Button 12 (D-pad Up)
        if (gp.buttons[0]?.pressed || gp.buttons[12]?.pressed) {
            this.triggerJump();
        }
        // Button 1 (B), Button 13 (D-pad Down)
        if (gp.buttons[1]?.pressed || gp.buttons[13]?.pressed) {
            this.triggerSlide();
        }
        // Button 9 (Start)
        if (gp.buttons[9]?.pressed) {
            this.pausePressed = true;
        }
    }

    reset() {
        this.jumpPressed = false;
        this.jumpBufferTimer = 0;
        this.slidePressed = false;
        this.slideBufferTimer = 0;
        this.pausePressed = false;
    }
}
