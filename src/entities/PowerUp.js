/**
 * Power-Up Entity
 * World pickup capsules that grant Magnet, Shield, 2x Coins, Score Multiplier,
 * Hyper Dash, and Time Warp.
 */

import { GAME_CONFIG } from '../config/constants.js';

export class PowerUp {
    constructor(type, x, y) {
        this.type = type;
        this.config = GAME_CONFIG.POWERUPS[type.toUpperCase()] || GAME_CONFIG.POWERUPS.MAGNET;
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.width = 36;
        this.height = 36;

        this.animTime = Math.random() * Math.PI;
        this.collected = false;
        this.active = true;
    }

    update(dt, scrollSpeed) {
        this.animTime += dt;
        this.x -= scrollSpeed * dt;
        this.y = this.baseY + Math.sin(this.animTime * 3) * 8;

        if (this.x + this.width < -100) {
            this.active = false;
        }
    }

    checkCollision(playerHitbox) {
        if (this.collected) return false;
        return (
            playerHitbox.x < this.x + this.width &&
            playerHitbox.x + playerHitbox.width > this.x &&
            playerHitbox.y < this.y + this.height &&
            playerHitbox.y + playerHitbox.height > this.y
        );
    }

    render(ctx) {
        ctx.save();

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const pulse = 1.0 + Math.sin(this.animTime * 4.5) * 0.08;

        // Soft ground drop-shadow beneath floating power-up
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.ellipse(cx, 560 + 2, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glowing outer circle
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(cx, cy, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Capsule boundary
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Icon inside
        ctx.font = '16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.config.icon, cx, cy);

        ctx.restore();
    }
}
