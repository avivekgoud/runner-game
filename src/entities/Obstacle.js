/**
 * Obstacle Entity
 * Modern, clean hazard types (smooth spikes, hurdles, overhead laser barriers, patrol drones),
 * animations, collision detection, and near-miss dodge detection for combos.
 */

export const OBSTACLE_TYPES = {
    SPIKES: 'spikes',
    CRATE: 'crate',
    LASER_BARRIER: 'laser_barrier',
    PATROL_DRONE: 'patrol_drone',
    TALL_BARRIER: 'tall_barrier'
};

export class Obstacle {
    constructor(type, x, y, options = {}) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.options = options;

        this.animTime = Math.random() * 10;
        this.dodged = false;
        this.active = true;

        this.setupDimensions();
    }

    setupDimensions() {
        switch (this.type) {
            case OBSTACLE_TYPES.SPIKES:
                this.width = 46;
                this.height = 36;
                break;
            case OBSTACLE_TYPES.CRATE:
                this.width = 44;
                this.height = 44;
                break;
            case OBSTACLE_TYPES.LASER_BARRIER:
                this.width = 40;
                this.height = 70;
                this.bottomClearance = 38; // clearance to slide under
                break;
            case OBSTACLE_TYPES.PATROL_DRONE:
                this.width = 44;
                this.height = 36;
                this.baseY = this.y;
                this.bobSpeed = 3.2;
                this.bobRange = 26;
                break;
            case OBSTACLE_TYPES.TALL_BARRIER:
                this.width = 40;
                this.height = 80;
                break;
            default:
                this.width = 40;
                this.height = 40;
        }
    }

    update(dt, scrollSpeed) {
        this.animTime += dt;
        this.x -= scrollSpeed * dt;

        if (this.type === OBSTACLE_TYPES.PATROL_DRONE) {
            this.y = this.baseY + Math.sin(this.animTime * this.bobSpeed) * this.bobRange;
        }

        // Deactivate when off-screen to the left
        if (this.x + this.width < -100) {
            this.active = false;
        }
    }

    getHitbox() {
        if (this.type === OBSTACLE_TYPES.LASER_BARRIER) {
            return {
                x: this.x + 4,
                y: this.y,
                width: this.width - 8,
                height: this.height - this.bottomClearance
            };
        }

        if (this.type === OBSTACLE_TYPES.SPIKES) {
            return {
                x: this.x + 6,
                y: this.y + 8,
                width: this.width - 12,
                height: this.height - 8
            };
        }

        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 8
        };
    }

    checkCollision(playerHitbox) {
        const box = this.getHitbox();
        return (
            playerHitbox.x < box.x + box.width &&
            playerHitbox.x + playerHitbox.width > box.x &&
            playerHitbox.y < box.y + box.height &&
            playerHitbox.y + playerHitbox.height > box.y
        );
    }

    checkDodge(playerX) {
        if (!this.dodged && this.x + this.width < playerX) {
            this.dodged = true;
            return true;
        }
        return false;
    }

    render(ctx, worldTheme = 'neo_city') {
        ctx.save();

        // Soft ground shadow for grounded obstacles
        if (this.type !== OBSTACLE_TYPES.PATROL_DRONE) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.ellipse(this.x + this.width / 2, this.y + this.height + 2, this.width * 0.5, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        switch (this.type) {
            case OBSTACLE_TYPES.SPIKES:
                this.renderSpikes(ctx, worldTheme);
                break;
            case OBSTACLE_TYPES.CRATE:
                this.renderCrate(ctx, worldTheme);
                break;
            case OBSTACLE_TYPES.LASER_BARRIER:
                this.renderLaserBarrier(ctx, worldTheme);
                break;
            case OBSTACLE_TYPES.PATROL_DRONE:
                this.renderDrone(ctx, worldTheme);
                break;
            case OBSTACLE_TYPES.TALL_BARRIER:
                this.renderTallBarrier(ctx, worldTheme);
                break;
            default:
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }

    renderSpikes(ctx, worldTheme) {
        const color = (worldTheme === 'frost_peak') ? '#38bdf8' :
                      (worldTheme === 'sunset_desert') ? '#ea580c' :
                      (worldTheme === 'emerald_forest') ? '#10b981' : '#f43f5e';

        const spikeCount = 3;
        const w = this.width / spikeCount;

        for (let i = 0; i < spikeCount; i++) {
            const sx = this.x + i * w;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(sx + 2, this.y + this.height);
            ctx.lineTo(sx + w / 2, this.y);
            ctx.lineTo(sx + w - 2, this.y + this.height);
            ctx.closePath();
            ctx.fill();

            // Crisp highlight on left edge
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(sx + 2, this.y + this.height);
            ctx.lineTo(sx + w / 2, this.y);
            ctx.stroke();
        }
    }

    renderCrate(ctx, worldTheme) {
        // Rounded sleek hurdle/crate
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // Accent border
        const accent = (worldTheme === 'cyber_2099') ? '#f43f5e' :
                       (worldTheme === 'frost_peak') ? '#38bdf8' :
                       (worldTheme === 'sunset_desert') ? '#f59e0b' : '#38bdf8';
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner icon/slash
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + this.width - 10, this.y + this.height - 10);
        ctx.moveTo(this.x + this.width - 10, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + this.height - 10);
        ctx.stroke();
    }

    renderLaserBarrier(ctx, worldTheme) {
        const solidHeight = this.height - this.bottomClearance;

        // Top emitter node
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, 16, 6);
        ctx.fill();

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Laser beam
        const pulse = 0.8 + Math.sin(this.animTime * 8) * 0.2;
        ctx.fillStyle = `rgba(244, 63, 94, ${pulse})`;
        ctx.fillRect(this.x + 8, this.y + 16, this.width - 16, solidHeight - 16);

        // Friendly slide indicator pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.beginPath();
        ctx.roundRect(this.x - 6, this.y + this.height - 18, this.width + 12, 16, 8);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('▼ SLIDE', this.x + this.width / 2, this.y + this.height - 6);
    }

    renderDrone(ctx, worldTheme) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Soft drop shadow below flying drone onto ground
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.beginPath();
        ctx.ellipse(cx, this.baseY + 120, 20, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Drone sleek body
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Glowing visor / eye
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx + 4, cy, 5, 0, Math.PI * 2);
        ctx.fill();

        // Sleek rotor bar
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 8);
        ctx.lineTo(cx + 18, cy - 8);
        ctx.stroke();

        // Spinning rotor blades
        const offset = Math.sin(this.animTime * 24) * 12;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 18 - offset, cy - 11);
        ctx.lineTo(cx - 18 + offset, cy - 11);
        ctx.moveTo(cx + 18 - offset, cy - 11);
        ctx.lineTo(cx + 18 + offset, cy - 11);
        ctx.stroke();
    }

    renderTallBarrier(ctx, worldTheme) {
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 10);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Modern glowing vertical strip
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + 12, 4, this.height - 24);
    }
}
