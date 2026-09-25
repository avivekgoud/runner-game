/**
 * Procedural Endless World Generator & Chunk Manager
 * Manages obstacles, coin formations, rare gems, power-ups,
 * difficulty scaling, and fair pattern combinations.
 */

import { GAME_CONFIG } from '../config/constants.js';
import { Obstacle, OBSTACLE_TYPES } from '../entities/Obstacle.js';
import { Collectible, COLLECTIBLE_TYPES } from '../entities/Collectible.js';
import { PowerUp } from '../entities/PowerUp.js';

export class WorldManager {
    constructor(worldId = 'neo_city') {
        this.worldId = worldId;
        this.groundY = GAME_CONFIG.PHYSICS.GROUND_Y;

        this.scrollSpeed = GAME_CONFIG.SPEED.START_SPEED;
        this.distanceTravelled = 0; // meters
        this.timeSurvived = 0; // seconds

        this.obstacles = [];
        this.collectibles = [];
        this.powerups = [];

        this.nextSpawnX = 700;
        this.chunkCount = 0;
    }

    setWorld(worldId) {
        this.worldId = worldId;
    }

    reset() {
        this.scrollSpeed = GAME_CONFIG.SPEED.START_SPEED;
        this.distanceTravelled = 0;
        this.timeSurvived = 0;
        this.obstacles = [];
        this.collectibles = [];
        this.powerups = [];
        this.nextSpawnX = 750;
        this.chunkCount = 0;
    }

    update(dt, player, particleSystem, audio, isSlowMo = false, isSpeedBoost = false) {
        this.timeSurvived += dt;

        // Difficulty Acceleration
        let targetSpeed = Math.min(
            GAME_CONFIG.SPEED.MAX_SPEED,
            GAME_CONFIG.SPEED.START_SPEED + this.distanceTravelled * 0.28
        );

        if (isSlowMo) {
            targetSpeed *= GAME_CONFIG.SPEED.SLOW_MO_MULTIPLIER;
        } else if (isSpeedBoost) {
            targetSpeed *= GAME_CONFIG.SPEED.SPEED_BOOST_MULTIPLIER;
        }

        this.scrollSpeed += (targetSpeed - this.scrollSpeed) * 4 * dt;
        const currentMeters = (this.scrollSpeed * dt) / 10;
        this.distanceTravelled += currentMeters;

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update(dt, this.scrollSpeed);

            // Check dodge bonus for combos
            if (obs.checkDodge(player.x)) {
                if (particleSystem) {
                    particleSystem.addFloatingText('DODGE! +80', obs.x + 20, obs.y - 15, '#38bdf8', 16);
                }
            }

            if (!obs.active) {
                this.obstacles.splice(i, 1);
            }
        }

        // Update collectibles (coins & gems)
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const col = this.collectibles[i];
            col.update(dt, this.scrollSpeed, player);
            if (!col.active) {
                this.collectibles.splice(i, 1);
            }
        }

        // Update power-ups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const pu = this.powerups[i];
            pu.update(dt, this.scrollSpeed);
            if (!pu.active) {
                this.powerups.splice(i, 1);
            }
        }

        // Procedural Chunk Spawner
        this.nextSpawnX -= this.scrollSpeed * dt;
        if (this.nextSpawnX < 1350) {
            this.generateNextChunk();
        }
    }

    generateNextChunk() {
        this.chunkCount++;
        const spawnX = Math.max(1400, this.nextSpawnX);

        // Difficulty factor (0.0 to 1.0) based on distance
        const diff = Math.min(1.0, this.distanceTravelled / 3000);

        // Fair interval between obstacle hazards (minimum reaction window)
        const minGap = Math.max(340, 520 - diff * 160);
        const randGap = Math.random() * 120;
        const chunkSpacing = minGap + randGap;

        // Choose hazard archetype
        const roll = Math.random();

        if (roll < 0.28) {
            // Archetype 1: Spikes on ground + High coin arc
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.SPIKES, spawnX, this.groundY - 36));
            const arcCoins = Collectible.createArc(spawnX - 60, this.groundY, 7, 240, 130);
            this.collectibles.push(...arcCoins);
        } else if (roll < 0.52) {
            // Archetype 2: Overhead Laser Barrier (Must Slide) + Low coin line
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.LASER_BARRIER, spawnX, this.groundY - 68));
            const lineCoins = Collectible.createLine(spawnX - 40, this.groundY - 20, 5, 40);
            this.collectibles.push(...lineCoins);
        } else if (roll < 0.72) {
            // Archetype 3: Crates / Barrier (Must Jump) + Coin line above
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.CRATE, spawnX, this.groundY - 44));
            const lineCoins = Collectible.createLine(spawnX - 20, this.groundY - 110, 4, 38);
            this.collectibles.push(...lineCoins);
        } else if (roll < 0.88) {
            // Archetype 4: Patrol Drone (flying enemy hovering up and down)
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.PATROL_DRONE, spawnX, this.groundY - 130));
            const zigCoins = Collectible.createZigZag(spawnX - 40, this.groundY - 50, 5, 45, 25);
            this.collectibles.push(...zigCoins);
        } else {
            // Archetype 5: Double Hazard (Spikes followed by Laser Barrier, fair separation)
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.SPIKES, spawnX, this.groundY - 36));
            this.obstacles.push(new Obstacle(OBSTACLE_TYPES.LASER_BARRIER, spawnX + 220, this.groundY - 68));
            const arcCoins = Collectible.createArc(spawnX - 40, this.groundY, 5, 180, 110);
            this.collectibles.push(...arcCoins);
        }

        // Rare Gem Spawn (5% chance per chunk)
        if (Math.random() < 0.07) {
            this.collectibles.push(new Collectible(COLLECTIBLE_TYPES.GEM, spawnX + chunkSpacing * 0.5, this.groundY - 90));
        }

        // Power-Up Spawn (8% chance per chunk)
        if (Math.random() < 0.09) {
            const types = ['magnet', 'shield', 'coin_doubler', 'score_boost', 'speed_boost', 'slow_mo'];
            const chosenType = types[Math.floor(Math.random() * types.length)];
            this.powerups.push(new PowerUp(chosenType, spawnX + chunkSpacing * 0.55, this.groundY - 120));
        }

        this.nextSpawnX = spawnX + chunkSpacing;
    }

    render(ctx) {
        // Render Collectibles
        for (const col of this.collectibles) {
            col.render(ctx);
        }

        // Render Power-Ups
        for (const pu of this.powerups) {
            pu.render(ctx);
        }

        // Render Obstacles
        for (const obs of this.obstacles) {
            obs.render(ctx, this.worldId);
        }
    }
}
