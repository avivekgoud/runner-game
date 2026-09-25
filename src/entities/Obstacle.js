/**
 * Obstacle Entity
 * Handles multiple hazard types (spikes, crates, overhead laser beams, flying patrol drones),
 * animations, collision detection with the player, and near-miss dodge detection for combos.
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
                this.width = 38;
                this.height = 68;
                // Laser is suspended in the air; bottom clearance allows sliding under
                this.bottomClearance = 38;
                break;
            case OBSTACLE_TYPES.PATROL_DRONE:
                this.width = 46;
                this.height = 36;
                this.baseY = this.y;
                this.bobSpeed = 3.5;
                this.bobRange = 30;
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

        // Deactivate when well off-screen to the left
        if (this.x + this.width < -100) {
            this.active = false;
        }
    }

    getHitbox() {
        if (this.type === OBSTACLE_TYPES.LASER_BARRIER) {
            // Only top portion is solid! Bottom 38px is clear for sliding
            return {
                x: this.x + 4,
                y: this.y,
                width: this.width - 8,
                height: this.height - this.bottomClearance
            };
        }

        if (this.type === OBSTACLE_TYPES.SPIKES) {
            // Triangle hitbox approximation
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
        // Player has successfully passed this obstacle without colliding
        if (!this.dodged && this.x + this.width < playerX) {
            this.dodged = true;
            return true;
        }
        return false;
    }

    render(ctx, worldTheme = 'neo_city') {
        ctx.save();

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
        ctx.fillStyle = (worldTheme === 'frost_peak') ? '#38bdf8' :
                        (worldTheme === 'sunset_desert') ? '#ea580c' :
                        (worldTheme === 'emerald_forest') ? '#10b981' : '#f43f5e';

        const spikeCount = 3;
        const w = this.width / spikeCount;

        for (let i = 0; i < spikeCount; i++) {
            const sx = this.x + i * w;
            ctx.beginPath();
            ctx.moveTo(sx, this.y + this.height);
            ctx.lineTo(sx + w / 2, this.y);
            ctx.lineTo(sx + w, this.y + this.height);
            ctx.closePath();
            ctx.fill();

            // Highlight edge
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    renderCrate(ctx, worldTheme) {
        ctx.fillStyle = (worldTheme === 'cyber_2099') ? '#4c1d95' :
                        (worldTheme === 'frost_peak') ? '#0c4a6e' : '#334155';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Border & X cross
        ctx.strokeStyle = (worldTheme === 'cyber_2099') ? '#ec4899' :
                          (worldTheme === 'frost_peak') ? '#7dd3fc' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        ctx.beginPath();
        ctx.moveTo(this.x + 6, this.y + 6);
        ctx.lineTo(this.x + this.width - 6, this.y + this.height - 6);
        ctx.moveTo(this.x + this.width - 6, this.y + 6);
        ctx.lineTo(this.x + 6, this.y + this.height - 6);
        ctx.stroke();
    }

    renderLaserBarrier(ctx, worldTheme) {
        const solidHeight = this.height - this.bottomClearance;

        // Top emitter block
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(this.x, this.y, this.width, 16);

        // Pulsing red/cyan laser beam
        const pulse = 0.7 + Math.sin(this.animTime * 12) * 0.3;
        ctx.fillStyle = (worldTheme === 'cyber_2099') ? `rgba(236, 72, 153, ${pulse})` : `rgba(244, 63, 94, ${pulse})`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x + 6, this.y + 16, this.width - 12, solidHeight - 16);
        ctx.shadowBlur = 0;

        // Warning striped bottom indicator
        ctx.fillStyle = '#facc15';
        ctx.fillRect(this.x, this.y + solidHeight - 6, this.width, 6);

        // "SLIDE" arrow indicator underneath
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = 'bold 11px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('▼ SLIDE', this.x + this.width / 2, this.y + this.height - 12);
    }

    renderDrone(ctx, worldTheme) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Drone central body
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();

        // Glowing scanning eye
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Rotor arms & spinning blades
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy - 8);
        ctx.lineTo(cx + 20, cy - 8);
        ctx.stroke();

        const bladeOffset = Math.sin(this.animTime * 28) * 14;
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 20 - bladeOffset, cy - 12);
        ctx.lineTo(cx - 20 + bladeOffset, cy - 12);
        ctx.moveTo(cx + 20 - bladeOffset, cy - 12);
        ctx.lineTo(cx + 20 + bladeOffset, cy - 12);
        ctx.stroke();
    }

    renderTallBarrier(ctx, worldTheme) {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Neon outline
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

        // Danger hazard stripes
        ctx.fillStyle = '#facc15';
        for (let i = 0; i < this.height; i += 16) {
            ctx.fillRect(this.x + 6, this.y + i, this.width - 12, 6);
        }
    }
}
