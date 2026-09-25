/**
 * Core Game Engine
 * Orchestrates the main update & render loop, state transitions,
 * collision resolution, scoring, combo tracking, and run sessions.
 */

import { GAME_CONFIG } from '../config/constants.js';
import { Player, PLAYER_STATES } from '../entities/Player.js';
import { WorldManager } from '../world/WorldManager.js';
import { ParallaxBackground } from '../world/ParallaxBackground.js';
import { ParticleSystem } from '../entities/ParticleSystem.js';
import { COLLECTIBLE_TYPES } from '../entities/Collectible.js';
import { events } from './EventEmitter.js';

export const ENGINE_STATES = {
    SPLASH: 'splash',
    AUTH: 'auth',
    TUTORIAL: 'tutorial',
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAMEOVER: 'gameover'
};

export class GameEngine {
    constructor(canvas, saveManager, audioManager, inputManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.save = saveManager;
        this.audio = audioManager;
        this.input = inputManager;

        // Engine State
        this.state = ENGINE_STATES.SPLASH;
        this.lastTime = 0;
        this.isRunning = false;

        // Subsystems
        this.player = new Player(this.save.data.selectedCharacter);
        this.world = new WorldManager(this.save.data.selectedWorld);
        this.parallax = new ParallaxBackground();
        this.particles = new ParticleSystem();

        // Run Metrics
        this.score = 0;
        this.coinsInRun = 0;
        this.gemsInRun = 0;
        this.distanceInRun = 0;
        this.combo = 1;
        this.comboTimer = 0;
        this.highestComboInRun = 1;
        this.obstaclesDodgedInRun = 0;
        this.powerupsUsedInRun = 0;
        this.jumpsInRun = 0;
        this.slidesInRun = 0;
        this.revivesUsedInRun = 0;

        // Screen Shake
        this.shakeTimer = 0;
        this.shakeIntensity = 0;

        this.setupEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    setupEventListeners() {
        events.on('player:action', (action) => {
            if (this.state !== ENGINE_STATES.PLAYING) return;
            if (action === 'jump' || action === 'double_jump') {
                this.jumpsInRun++;
                this.save.updateStat('totalJumps', 1);
            } else if (action === 'slide') {
                this.slidesInRun++;
                this.save.updateStat('totalSlides', 1);
            }
        });

        events.on('player:leveledUp', (data) => {
            this.audio.playLevelUp();
            this.particles.spawnConfetti(this.canvas.width, this.canvas.height);
        });
    }

    resize() {
        const container = this.canvas.parentElement;
        if (!container) return;

        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;

        this.canvas.width = GAME_CONFIG.BASE_WIDTH;
        this.canvas.height = GAME_CONFIG.BASE_HEIGHT;
    }

    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        events.emit('engine:stateChanged', { from: oldState, to: newState });

        if (newState === ENGINE_STATES.PLAYING) {
            this.audio.startMusic(this.save.data.selectedWorld);
        } else if (newState === ENGINE_STATES.MENU || newState === ENGINE_STATES.AUTH) {
            this.audio.switchWorldMusic('neo_city');
        }
    }

    startNewRun(worldId = null, characterId = null) {
        const activeWorld = worldId || this.save.data.selectedWorld;
        const activeChar = characterId || this.save.data.selectedCharacter;

        this.world.setWorld(activeWorld);
        this.world.reset();
        this.parallax.setWorld(activeWorld);

        this.player.setCharacter(activeChar);
        this.player.setCustomization(
            this.save.data.customization.skin,
            this.save.data.customization.hat,
            this.save.data.customization.trail
        );
        this.player.revive(this.world.groundY);

        this.particles.clear();
        this.input.reset();

        // Reset metrics
        this.score = 0;
        this.coinsInRun = 0;
        this.gemsInRun = 0;
        this.distanceInRun = 0;
        this.combo = 1;
        this.comboTimer = 0;
        this.highestComboInRun = 1;
        this.obstaclesDodgedInRun = 0;
        this.powerupsUsedInRun = 0;
        this.jumpsInRun = 0;
        this.slidesInRun = 0;
        this.revivesUsedInRun = 0;

        // Apply Headstart booster if selected
        if (this.save.data.consumables.headstarts > 0 && this.useHeadstartPrompt) {
            this.save.data.consumables.headstarts--;
            this.world.distanceTravelled = 500;
            this.player.activateSpeedBoost(6.0);
            this.particles.addFloatingText('SUPERSONIC HEADSTART!', this.player.x + 80, this.player.y - 40, '#e879f9', 24);
        }

        this.save.updateStat('totalRuns', 1);
        this.setState(ENGINE_STATES.PLAYING);
        events.emit('run:started');
    }

    revivePlayer() {
        if (this.player.state !== PLAYER_STATES.DEAD) return;

        this.player.revive(this.world.groundY);
        this.revivesUsedInRun++;
        this.particles.spawnConfetti(this.canvas.width, this.canvas.height);
        this.particles.addFloatingText('REVIVED!', this.player.x + 60, this.player.y - 30, '#4ade80', 26);
        this.setState(ENGINE_STATES.PLAYING);
    }

    pauseGame() {
        if (this.state === ENGINE_STATES.PLAYING) {
            this.setState(ENGINE_STATES.PAUSED);
        }
    }

    resumeGame() {
        if (this.state === ENGINE_STATES.PAUSED) {
            this.setState(ENGINE_STATES.PLAYING);
        }
    }

    triggerScreenShake(intensity = 6, duration = 0.25) {
        if (!this.save.data.settings.screenShake) return;
        this.shakeIntensity = intensity;
        this.shakeTimer = duration;
    }

    // --- Main Game Loop ---

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        let dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Clamp delta time to avoid large jumps if tab loses focus
        if (dt > 0.1) dt = 0.1;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.input.update(dt);

        // Pause hotkey
        if (this.input.consumePause()) {
            if (this.state === ENGINE_STATES.PLAYING) {
                this.pauseGame();
            } else if (this.state === ENGINE_STATES.PAUSED) {
                this.resumeGame();
            }
        }

        // Screen Shake update
        if (this.shakeTimer > 0) {
            this.shakeTimer -= dt;
        }

        if (this.state === ENGINE_STATES.PLAYING) {
            this.updateGameplay(dt);
        } else if (this.state === ENGINE_STATES.MENU || this.state === ENGINE_STATES.SPLASH) {
            // Idle background scrolling
            this.parallax.update(dt, 80);
            this.particles.update(dt);
        }
    }

    updateGameplay(dt) {
        // Handle Player Controls
        if (this.input.consumeJump()) {
            this.player.jump(this.audio, this.particles);
        }
        if (this.input.consumeSlide()) {
            this.player.slide(this.audio, this.particles);
        }

        // World & Entity Updates
        const isSlowMo = this.player.hasSlowMo;
        const isSpeed = this.player.hasSpeedBoost;
        this.world.update(dt, this.player, this.particles, this.audio, isSlowMo, isSpeed);
        this.parallax.update(dt, this.world.scrollSpeed);
        this.player.update(dt, this.world.groundY, this.particles);
        this.particles.update(dt);

        // Track Distance
        this.distanceInRun = Math.floor(this.world.distanceTravelled);
        this.save.updateStat('totalDistance', Math.floor(this.world.scrollSpeed * dt / 10));
        this.save.updateStat('longestRun', this.distanceInRun, false);

        // Combo Timer Decay
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 1;
                events.emit('combo:reset');
            }
        }

        // Real-time Score Calculation
        const distScore = this.distanceInRun * GAME_CONFIG.SCORING.DISTANCE_PTS_PER_METER;
        const charMult = this.player.character.stats.scoreMult || 1.0;
        const boostMult = this.player.hasScoreBoost ? 2.0 : 1.0;
        this.score = Math.floor((distScore + this.coinsInRun * GAME_CONFIG.SCORING.COIN_VALUE + this.gemsInRun * GAME_CONFIG.SCORING.GEM_VALUE) * charMult * boostMult * this.combo);

        if (this.score > this.save.data.highScore) {
            this.save.data.highScore = this.score;
        }
        this.save.updateStat('highestScore', this.score, false);

        // --- Collision Detection ---
        const playerBox = this.player.getHitbox();

        // 1. Collectibles
        for (const col of this.world.collectibles) {
            if (!col.collected && col.checkCollision(playerBox)) {
                col.collected = true;
                col.active = false;

                if (col.type === COLLECTIBLE_TYPES.COIN) {
                    const coinBonus = this.player.hasCoinDoubler ? 2 : 1;
                    this.coinsInRun += coinBonus;
                    this.save.addCoins(coinBonus);
                    this.save.updateMissionProgress('coins_collected', coinBonus);
                    this.audio.playCoin();
                    this.particles.spawnCoinSparkle(col.x + col.width / 2, col.y + col.height / 2);
                    this.addComboProgress(1);
                } else {
                    this.gemsInRun += 1;
                    this.save.addGems(1);
                    this.audio.playGem();
                    this.particles.spawnGemSparkle(col.x + col.width / 2, col.y + col.height / 2);
                    this.particles.addFloatingText('+1 GEM!', col.x + col.width / 2, col.y - 20, '#38bdf8', 22);
                    this.addComboProgress(3);
                }
            }
        }

        // 2. Power-Ups
        for (const pu of this.world.powerups) {
            if (!pu.collected && pu.checkCollision(playerBox)) {
                pu.collected = true;
                pu.active = false;
                this.powerupsUsedInRun++;
                this.save.updateStat('powerupsCollected', 1);
                this.save.updateMissionProgress('powerups_used', 1);

                this.audio.playPowerUp();
                this.particles.spawnCoinSparkle(pu.x + pu.width / 2, pu.y + pu.height / 2);
                this.particles.addFloatingText(pu.config.name.toUpperCase(), pu.x + pu.width / 2, pu.y - 25, pu.config.color, 22);

                const upgLevel = this.save.data.upgrades[pu.type] || 1;
                const bonusDuration = (upgLevel - 1) * 2.0;
                const totalDuration = pu.config.duration + bonusDuration;

                if (pu.type === 'magnet') this.player.activateMagnet(totalDuration);
                else if (pu.type === 'shield') this.player.activateShield(totalDuration);
                else if (pu.type === 'coin_doubler') this.player.activateCoinDoubler(totalDuration);
                else if (pu.type === 'score_boost') this.player.activateScoreBoost(totalDuration);
                else if (pu.type === 'speed_boost') this.player.activateSpeedBoost(totalDuration);
                else if (pu.type === 'slow_mo') this.player.activateSlowMo(totalDuration);

                this.addComboProgress(2);
                events.emit('powerup:collected', pu);
            }
        }

        // 3. Obstacles
        for (const obs of this.world.obstacles) {
            if (obs.checkCollision(playerBox)) {
                const fatal = this.player.hit(obs, this.audio, this.particles);
                if (fatal) {
                    this.triggerScreenShake(12, 0.45);
                    this.onPlayerDied();
                    break;
                } else {
                    this.triggerScreenShake(6, 0.2);
                    this.combo = 1; // shield break drops combo
                }
            }
        }

        // XP Progression over distance
        this.save.addXp(dt * 4);
    }

    addComboProgress(amount) {
        this.combo = Math.min(GAME_CONFIG.SCORING.MAX_COMBO_MULTIPLIER, this.combo + amount * 0.2);
        this.comboTimer = GAME_CONFIG.SCORING.COMBO_DECAY_TIME;
        const intCombo = Math.floor(this.combo);
        if (intCombo > this.highestComboInRun) {
            this.highestComboInRun = intCombo;
            this.save.updateStat('highestCombo', intCombo, false);
            this.save.updateMissionProgress('combo_reached', intCombo);
        }
        events.emit('combo:updated', { combo: this.combo, level: intCombo });
    }

    onPlayerDied() {
        this.setState(ENGINE_STATES.GAMEOVER);

        // Grant XP for run summary
        const earnedXp = Math.floor(this.distanceInRun * 0.4 + this.coinsInRun * 2);
        this.save.addXp(earnedXp);

        events.emit('run:ended', {
            score: this.score,
            distance: this.distanceInRun,
            coins: this.coinsInRun,
            gems: this.gemsInRun,
            highestCombo: this.highestComboInRun,
            earnedXp: earnedXp,
            isNewHigh: this.score >= this.save.data.highScore
        });
    }

    // --- Render Pipeline ---

    render() {
        this.ctx.save();

        // Screen Shake offset
        if (this.shakeTimer > 0) {
            const rx = (Math.random() - 0.5) * this.shakeIntensity;
            const ry = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(rx, ry);
        }

        // 1. Background
        this.parallax.render(this.ctx, this.canvas.width, this.canvas.height, this.world.groundY);

        // 2. World Elements (Obstacles, Coins, PowerUps)
        if (this.state === ENGINE_STATES.PLAYING || this.state === ENGINE_STATES.PAUSED || this.state === ENGINE_STATES.GAMEOVER) {
            this.world.render(this.ctx);
            this.player.render(this.ctx);
        }

        // 3. Particles & Floating Combat Texts
        this.particles.render(this.ctx);

        this.ctx.restore();
    }
}
