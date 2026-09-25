/**
 * Player Entity & State Machine
 * Sub-pixel physics, dynamic hitboxes for jumping & sliding, coyote time,
 * procedural squash & stretch animations, customizable vector character rendering,
 * and shield / magnet visual effects.
 */

import { GAME_CONFIG } from '../config/constants.js';
import { CHARACTERS } from '../config/characters.js';
import { CUSTOMIZATIONS } from '../config/customizations.js';
import { events } from '../core/EventEmitter.js';

export const PLAYER_STATES = {
    RUNNING: 'running',
    JUMPING: 'jumping',
    DOUBLE_JUMPING: 'double_jumping',
    SLIDING: 'sliding',
    HURT: 'hurt',
    DEAD: 'dead'
};

export class Player {
    constructor(characterId = 'blaze') {
        this.characterId = characterId;
        this.character = CHARACTERS[characterId] || CHARACTERS.blaze;

        // Position & Dimensions
        this.x = 180;
        this.y = GAME_CONFIG.PHYSICS.GROUND_Y;
        this.baseWidth = 44;
        this.baseHeight = 68;
        this.width = this.baseWidth;
        this.height = this.baseHeight;

        // Velocity
        this.vx = 0;
        this.vy = 0;

        // State Machine
        this.state = PLAYER_STATES.RUNNING;
        this.isGrounded = true;
        this.canDoubleJump = this.character.stats.doubleJump;
        this.hasDoubleJumped = false;

        // Timers
        this.slideTimer = 0;
        this.coyoteTimer = 0;
        this.invulnerableTimer = 0;

        // Power-Up States
        this.hasShield = false;
        this.shieldTimer = 0;
        this.hasMagnet = false;
        this.magnetTimer = 0;
        this.hasCoinDoubler = false;
        this.coinDoublerTimer = 0;
        this.hasScoreBoost = false;
        this.scoreBoostTimer = 0;
        this.hasSpeedBoost = false;
        this.speedBoostTimer = 0;
        this.hasSlowMo = false;
        this.slowMoTimer = 0;

        // Procedural Animation
        this.animTime = 0;
        this.squashX = 1.0;
        this.squashY = 1.0;
        this.slideRotation = 0;

        // Customization
        this.skinId = 'default';
        this.hatId = 'none';
        this.trailId = 'default';

        this.applyCharacterPerks();
    }

    setCharacter(characterId) {
        this.characterId = characterId;
        this.character = CHARACTERS[characterId] || CHARACTERS.blaze;
        this.applyCharacterPerks();
    }

    applyCharacterPerks() {
        this.canDoubleJump = this.character.stats.doubleJump;
        if (this.character.id === 'aegis') {
            this.activateShield(GAME_CONFIG.POWERUPS.SHIELD.duration * this.character.stats.shieldBonus);
        }
    }

    setCustomization(skinId, hatId, trailId) {
        this.skinId = skinId || 'default';
        this.hatId = hatId || 'none';
        this.trailId = trailId || 'default';
    }

    jump(audio, particleSystem) {
        if (this.state === PLAYER_STATES.DEAD) return;

        // Ground jump or Coyote jump
        if (this.isGrounded || this.coyoteTimer > 0) {
            this.vy = GAME_CONFIG.PHYSICS.JUMP_FORCE * (this.character.stats.jump / 5);
            this.isGrounded = false;
            this.coyoteTimer = 0;
            this.state = PLAYER_STATES.JUMPING;
            this.hasDoubleJumped = false;

            // Squash & stretch: stretch vertically
            this.squashX = 0.75;
            this.squashY = 1.35;

            if (audio) audio.playJump();
            if (particleSystem) particleSystem.spawnJumpParticles(this.x + this.width / 2, this.y + this.height);
            events.emit('player:action', 'jump');
            return true;
        }

        // Double jump
        if (this.canDoubleJump && !this.hasDoubleJumped) {
            this.vy = GAME_CONFIG.PHYSICS.DOUBLE_JUMP_FORCE * (this.character.stats.jump / 5);
            this.hasDoubleJumped = true;
            this.state = PLAYER_STATES.DOUBLE_JUMPING;

            this.squashX = 0.7;
            this.squashY = 1.4;

            if (audio) audio.playDoubleJump();
            if (particleSystem) particleSystem.spawnDoubleJumpHalo(this.x + this.width / 2, this.y + this.height / 2);
            events.emit('player:action', 'double_jump');
            return true;
        }

        return false;
    }

    slide(audio, particleSystem) {
        if (this.state === PLAYER_STATES.DEAD) return;

        // If in air, perform fast dive
        if (!this.isGrounded) {
            this.vy = Math.max(this.vy, 450);
        }

        this.state = PLAYER_STATES.SLIDING;
        this.slideTimer = GAME_CONFIG.PHYSICS.SLIDE_DURATION;
        this.height = 36; // Lower hitbox

        this.squashX = 1.4;
        this.squashY = 0.6;

        if (audio) audio.playSlide();
        if (particleSystem) particleSystem.spawnSlideSparks(this.x, this.y + this.height);
        events.emit('player:action', 'slide');
    }

    endSlide() {
        this.state = this.isGrounded ? PLAYER_STATES.RUNNING : PLAYER_STATES.JUMPING;
        this.height = this.baseHeight;
        this.slideTimer = 0;
        this.squashX = 1.0;
        this.squashY = 1.0;
    }

    hit(hazard, audio, particleSystem) {
        if (this.invulnerableTimer > 0) return false;

        // If shielded, absorb impact
        if (this.hasShield) {
            this.hasShield = false;
            this.shieldTimer = 0;
            this.invulnerableTimer = 1.5;

            if (audio) audio.playShieldHit();
            if (particleSystem) {
                particleSystem.spawnShieldBreak(this.x + this.width / 2, this.y + this.height / 2);
                particleSystem.addFloatingText('SHIELD BROKEN!', this.x + this.width / 2, this.y - 20, '#34d399', 20);
            }
            events.emit('player:shieldBreak');
            return false;
        }

        // If Speed Boost active, invincible!
        if (this.hasSpeedBoost) {
            return false;
        }

        // Fatal collision
        this.state = PLAYER_STATES.DEAD;
        this.vy = -350; // Death bounce

        if (audio) audio.playCollision();
        if (particleSystem) {
            particleSystem.spawnCollisionExplosion(this.x + this.width / 2, this.y + this.height / 2);
        }
        events.emit('player:died', { hazard });
        return true;
    }

    revive(groundY) {
        this.state = PLAYER_STATES.RUNNING;
        this.y = groundY - this.baseHeight;
        this.vy = 0;
        this.height = this.baseHeight;
        this.invulnerableTimer = GAME_CONFIG.PHYSICS.INVULNERABLE_TIME;
        this.hasDoubleJumped = false;
        this.slideTimer = 0;
        this.activateShield(4.0); // Free brief protective shield on revive
    }

    // --- Power-up activations ---

    activateMagnet(duration) {
        this.hasMagnet = true;
        this.magnetTimer = duration * (this.character.stats.magnetBonus || 1.0);
    }

    activateShield(duration) {
        this.hasShield = true;
        this.shieldTimer = duration * (this.character.stats.shieldBonus || 1.0);
    }

    activateCoinDoubler(duration) {
        this.hasCoinDoubler = true;
        this.coinDoublerTimer = duration;
    }

    activateScoreBoost(duration) {
        this.hasScoreBoost = true;
        this.scoreBoostTimer = duration;
    }

    activateSpeedBoost(duration) {
        this.hasSpeedBoost = true;
        this.speedBoostTimer = duration;
        this.invulnerableTimer = duration;
    }

    activateSlowMo(duration) {
        this.hasSlowMo = true;
        this.slowMoTimer = duration;
    }

    // --- Update Loop ---

    update(dt, currentGroundY, particleSystem) {
        this.animTime += dt;

        // Power-up countdowns
        if (this.hasMagnet) {
            this.magnetTimer -= dt;
            if (this.magnetTimer <= 0) this.hasMagnet = false;
        }
        if (this.hasShield) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) this.hasShield = false;
        }
        if (this.hasCoinDoubler) {
            this.coinDoublerTimer -= dt;
            if (this.coinDoublerTimer <= 0) this.hasCoinDoubler = false;
        }
        if (this.hasScoreBoost) {
            this.scoreBoostTimer -= dt;
            if (this.scoreBoostTimer <= 0) this.hasScoreBoost = false;
        }
        if (this.hasSpeedBoost) {
            this.speedBoostTimer -= dt;
            if (this.speedBoostTimer <= 0) this.hasSpeedBoost = false;
        }
        if (this.hasSlowMo) {
            this.slowMoTimer -= dt;
            if (this.slowMoTimer <= 0) this.hasSlowMo = false;
        }

        // Invulnerability countdown
        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer -= dt;
        }

        // Slide logic
        if (this.state === PLAYER_STATES.SLIDING) {
            this.slideTimer -= dt;
            if (particleSystem && this.isGrounded && Math.random() < 0.6) {
                particleSystem.spawnSlideSparks(this.x, this.y + this.height);
            }
            if (this.slideTimer <= 0) {
                this.endSlide();
            }
        }

        // Particle trail spawn
        if (particleSystem && this.state !== PLAYER_STATES.DEAD) {
            const trailDef = CUSTOMIZATIONS.TRAILS[this.trailId] || CUSTOMIZATIONS.TRAILS.default;
            particleSystem.spawnTrailParticle(this.x + 5, this.y + this.height - 10, trailDef);
        }

        // Physics: Gravity & Vertical movement
        if (this.state !== PLAYER_STATES.DEAD) {
            this.vy += GAME_CONFIG.PHYSICS.GRAVITY * dt;
            this.vy = Math.min(this.vy, GAME_CONFIG.PHYSICS.TERMINAL_VELOCITY);
            this.y += this.vy * dt;

            // Ground Collision
            const targetGround = currentGroundY - this.height;
            if (this.y >= targetGround) {
                this.y = targetGround;
                this.vy = 0;

                if (!this.isGrounded) {
                    // Landing impact squash
                    this.squashX = 1.25;
                    this.squashY = 0.75;
                    if (particleSystem) {
                        particleSystem.spawnDust(this.x + this.width / 2, this.y + this.height, 3);
                    }
                }

                this.isGrounded = true;
                this.coyoteTimer = GAME_CONFIG.PHYSICS.COYOTE_TIME;
                this.hasDoubleJumped = false;

                if (this.state !== PLAYER_STATES.SLIDING) {
                    this.state = PLAYER_STATES.RUNNING;
                }
            } else {
                this.isGrounded = false;
                if (this.coyoteTimer > 0) {
                    this.coyoteTimer -= dt;
                }
            }
        } else {
            // Dead falling physics
            this.vy += GAME_CONFIG.PHYSICS.GRAVITY * 0.8 * dt;
            this.y += this.vy * dt;
        }

        // Spring squash recovery back to 1.0
        this.squashX += (1.0 - this.squashX) * 12 * dt;
        this.squashY += (1.0 - this.squashY) * 12 * dt;

        // Running dust
        if (this.isGrounded && this.state === PLAYER_STATES.RUNNING && particleSystem) {
            if (Math.sin(this.animTime * 18) > 0.8) {
                particleSystem.spawnDust(this.x + 10, this.y + this.height, 1);
            }
        }
    }

    getHitbox() {
        return {
            x: this.x + 6,
            y: this.y + 4,
            width: this.width - 12,
            height: this.height - 8
        };
    }

    // --- Render Vector Character & Customizations ---

    render(ctx) {
        ctx.save();

        // 1. Soft Ground Drop-Shadow beneath the runner
        const groundY = GAME_CONFIG.PHYSICS.GROUND_Y;
        const distFromGround = Math.max(0, groundY - (this.y + this.height));
        const shadowScale = Math.max(0.25, 1.0 - distFromGround / 240);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, groundY + 2, (this.width * 0.5) * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Invulnerability blinking
        if (this.invulnerableTimer > 0 && Math.floor(this.animTime * 15) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height;

        ctx.translate(cx, cy);
        ctx.scale(this.squashX, this.squashY);
        ctx.translate(-cx, -cy);

        // Visual colors from Character + Skin
        const vis = this.character.visual;
        const skinDef = CUSTOMIZATIONS.SKINS[this.skinId] || CUSTOMIZATIONS.SKINS.default;
        const primary = skinDef.primary || vis.primaryColor;
        const secondary = skinDef.secondary || vis.secondaryColor;
        const accent = skinDef.accent || vis.accentColor;

        // 2. Fluttering Scarf / Energy Ribbon (wind animation)
        if (this.state !== PLAYER_STATES.DEAD) {
            const scarfWave = Math.sin(this.animTime * 14) * 8;
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 22);
            ctx.quadraticCurveTo(this.x - 14, this.y + 18 + scarfWave, this.x - 28, this.y + 24 + scarfWave * 1.5);
            ctx.lineTo(this.x - 26, this.y + 32 + scarfWave * 1.5);
            ctx.quadraticCurveTo(this.x - 12, this.y + 26 + scarfWave, this.x + 10, this.y + 28);
            ctx.closePath();
            ctx.fill();
        }

        // 3. Running Legs with clean rounded sneakers
        if (this.state === PLAYER_STATES.RUNNING) {
            const runPhase = this.animTime * 15;
            const legOffset1 = Math.sin(runPhase) * 16;
            const legOffset2 = Math.sin(runPhase + Math.PI) * 16;

            // Back leg
            ctx.fillStyle = secondary;
            ctx.beginPath();
            ctx.roundRect(this.x + 10, this.y + this.height - 24 + legOffset2 * 0.4, 9, 22, 4);
            ctx.fill();
            // Back sneaker
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(this.x + 10, this.y + this.height - 6 + legOffset2 * 0.4, 12, 6, 3);
            ctx.fill();

            // Front leg
            ctx.fillStyle = primary;
            ctx.beginPath();
            ctx.roundRect(this.x + 23, this.y + this.height - 24 + legOffset1 * 0.4, 9, 22, 4);
            ctx.fill();
            // Front sneaker
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(this.x + 23, this.y + this.height - 6 + legOffset1 * 0.4, 12, 6, 3);
            ctx.fill();
        } else if (this.state === PLAYER_STATES.SLIDING) {
            // Low crouch sliding posture
            ctx.fillStyle = primary;
            ctx.beginPath();
            ctx.roundRect(this.x + 2, this.y + this.height - 20, 38, 18, 8);
            ctx.fill();
            // Sneaker back
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(this.x - 4, this.y + this.height - 10, 10, 6, 3);
            ctx.fill();
        } else {
            // Airborne Jump posture
            ctx.fillStyle = primary;
            ctx.beginPath();
            ctx.roundRect(this.x + 11, this.y + this.height - 22, 9, 18, 4);
            ctx.roundRect(this.x + 22, this.y + this.height - 18, 9, 15, 4);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(this.x + 11, this.y + this.height - 7, 11, 5, 2);
            ctx.roundRect(this.x + 22, this.y + this.height - 5, 11, 5, 2);
            ctx.fill();
        }

        // 4. Torso / Jacket
        const bodyY = this.state === PLAYER_STATES.SLIDING ? this.y + 6 : this.y + 20;
        const bodyH = this.state === PLAYER_STATES.SLIDING ? 20 : 30;

        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.roundRect(this.x + 8, bodyY, this.width - 16, bodyH, 10);
        ctx.fill();

        // 5. Head & Sports Visor
        if (this.state !== PLAYER_STATES.SLIDING) {
            const headY = this.y + 3;
            // Round head
            ctx.fillStyle = primary;
            ctx.beginPath();
            ctx.roundRect(this.x + 10, headY, 24, 20, 10);
            ctx.fill();

            // Aerodynamic Visor / Sunglasses
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.roundRect(this.x + 16, headY + 5, 18, 8, 4);
            ctx.fill();

            // Visor bright reflection
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.roundRect(this.x + 20, headY + 6, 12, 5, 2);
            ctx.fill();

            // Render Hat customization
            this.renderHat(ctx, this.x + 22, headY);
        }

        // 6. Soft Energy Shield Visual Bubble
        if (this.hasShield) {
            const pulse = 1.0 + Math.sin(this.animTime * 6) * 0.04;
            ctx.save();
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(cx, cy - this.height / 2, (this.height * 0.62) * pulse, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
            ctx.fill();
            ctx.restore();
        }

        // 7. Soft Magnet Aura Visual
        if (this.hasMagnet) {
            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            ctx.setLineDash([6, 6]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy - this.height / 2, 65 + Math.sin(this.animTime * 8) * 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // 8. Speed Boost Hyper Aura
        if (this.hasSpeedBoost) {
            ctx.save();
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(this.x + 4, this.y, this.width - 8, this.height, 12);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
    }

    renderHat(ctx, headCenterX, headTopY) {
        if (!this.hatId || this.hatId === 'none') return;

        ctx.save();
        if (this.hatId === 'cyber_cap') {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(headCenterX - 14, headTopY - 6, 26, 7);
            ctx.fillRect(headCenterX + 6, headTopY - 2, 12, 3); // visor bill
        } else if (this.hatId === 'cyber_fedora') {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(headCenterX - 18, headTopY - 2, 34, 4); // brim
            ctx.fillRect(headCenterX - 10, headTopY - 12, 20, 10); // crown
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(headCenterX - 10, headTopY - 5, 20, 3); // ribbon
        } else if (this.hatId === 'golden_crown') {
            ctx.fillStyle = '#f59e0b';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(headCenterX - 12, headTopY);
            ctx.lineTo(headCenterX - 12, headTopY - 10);
            ctx.lineTo(headCenterX - 6, headTopY - 5);
            ctx.lineTo(headCenterX, headTopY - 12);
            ctx.lineTo(headCenterX + 6, headTopY - 5);
            ctx.lineTo(headCenterX + 12, headTopY - 10);
            ctx.lineTo(headCenterX + 12, headTopY);
            ctx.closePath();
            ctx.fill();
        } else if (this.hatId === 'mecha_horns') {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.moveTo(headCenterX - 10, headTopY);
            ctx.lineTo(headCenterX - 16, headTopY - 14);
            ctx.lineTo(headCenterX - 6, headTopY - 4);
            ctx.moveTo(headCenterX + 10, headTopY);
            ctx.lineTo(headCenterX + 16, headTopY - 14);
            ctx.lineTo(headCenterX + 6, headTopY - 4);
            ctx.fill();
        } else if (this.hatId === 'plasma_halo') {
            ctx.strokeStyle = '#c084fc';
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 12;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(headCenterX, headTopY - 12, 16, 6, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}
