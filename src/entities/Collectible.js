/**
 * Collectible Entity (Coins & Gems)
 * Animated spinning, glow effects, magnet homing, and formation generators.
 */

export const COLLECTIBLE_TYPES = {
    COIN: 'coin',
    GEM: 'gem'
};

export class Collectible {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.baseY = y;

        this.width = type === COLLECTIBLE_TYPES.GEM ? 28 : 24;
        this.height = type === COLLECTIBLE_TYPES.GEM ? 32 : 24;

        this.animTime = Math.random() * Math.PI * 2;
        this.collected = false;
        this.active = true;

        // Magnet attraction velocity
        this.isBeingMagnetPulled = false;
    }

    update(dt, scrollSpeed, player = null) {
        this.animTime += dt;

        // Standard scrolling movement if not being sucked in rapidly
        if (!this.isBeingMagnetPulled) {
            this.x -= scrollSpeed * dt;
        }

        // Bobbing floating motion
        this.y = this.baseY + Math.sin(this.animTime * 4) * 5;

        // Magnet attraction logic
        if (player && player.hasMagnet && !this.collected) {
            const px = player.x + player.width / 2;
            const py = player.y + player.height / 2;
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;

            const dx = px - cx;
            const dy = py - cy;
            const dist = Math.hypot(dx, dy);

            const magnetRadius = 380 * (player.character.stats.magnetBonus || 1.0);
            if (dist < magnetRadius) {
                this.isBeingMagnetPulled = true;
                const pullSpeed = 820 * dt;
                this.x += (dx / dist) * pullSpeed;
                this.baseY += (dy / dist) * pullSpeed;
            }
        }

        // Deactivate when off screen
        if (this.x + this.width < -80) {
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

        // Soft ground drop-shadow beneath floating collectible
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(cx, 560 + 2, 10, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const spinScale = Math.cos(this.animTime * 5.5);

        ctx.translate(cx, cy);
        ctx.scale(spinScale, 1.0);

        if (this.type === COLLECTIBLE_TYPES.COIN) {
            this.renderCoin(ctx);
        } else {
            this.renderGem(ctx);
        }

        ctx.restore();
    }

    renderCoin(ctx) {
        // Outer rim
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(0, 0, 13, 0, Math.PI * 2);
        ctx.fill();

        // Inner golden face
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Embossed star
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 10px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 0.5);

        // Specular highlight glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-4, -4, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    renderGem(ctx) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(13, -5);
        ctx.lineTo(9, 14);
        ctx.lineTo(-9, 14);
        ctx.lineTo(-13, -5);
        ctx.closePath();
        ctx.fill();

        // Top facet reflection
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(6, -5);
        ctx.lineTo(0, 5);
        ctx.lineTo(-6, -5);
        ctx.closePath();
        ctx.fill();
    }

    // --- Static Formation Generators ---

    static createLine(startX, startY, count = 5, spacing = 45, type = COLLECTIBLE_TYPES.COIN) {
        const items = [];
        for (let i = 0; i < count; i++) {
            items.push(new Collectible(type, startX + i * spacing, startY));
        }
        return items;
    }

    static createArc(startX, groundY, count = 7, width = 280, height = 140, type = COLLECTIBLE_TYPES.COIN) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = startX + t * width;
            // Parabolic jump arc: 4 * h * t * (1 - t)
            const y = groundY - 40 - Math.sin(t * Math.PI) * height;
            items.push(new Collectible(type, x, y));
        }
        return items;
    }

    static createZigZag(startX, centerY, count = 6, spacing = 40, amplitude = 40) {
        const items = [];
        for (let i = 0; i < count; i++) {
            const y = centerY + (i % 2 === 0 ? -amplitude : amplitude);
            items.push(new Collectible(COLLECTIBLE_TYPES.COIN, startX + i * spacing, y));
        }
        return items;
    }
}
