/**
 * Game Balancing & Configuration Constants
 * Centralized settings for physics, difficulty progression, scoring, and economy.
 */

export const GAME_CONFIG = {
    VERSION: '1.0.0 Pro',
    TITLE: 'CYBER RUNNER: OVERDRIVE',
    TARGET_FPS: 60,
    BASE_WIDTH: 1280,
    BASE_HEIGHT: 720,

    // Physics
    PHYSICS: {
        GRAVITY: 1650,              // pixels/sec^2
        JUMP_FORCE: -620,           // initial jump velocity
        DOUBLE_JUMP_FORCE: -540,    // secondary jump velocity
        TERMINAL_VELOCITY: 900,     // max falling speed
        SLIDE_DURATION: 0.65,       // seconds
        GROUND_Y: 560,              // default ground level
        COYOTE_TIME: 0.12,          // seconds buffer after leaving ledge
        JUMP_BUFFER_TIME: 0.12,     // seconds buffer before landing
        INVULNERABLE_TIME: 2.0,     // seconds of invulnerability after hit/revive
    },

    // Speed & Difficulty Scaling
    SPEED: {
        START_SPEED: 420,           // initial world scrolling speed (px/sec)
        MAX_SPEED: 950,             // maximum speed cap
        ACCELERATION: 4.5,          // px/sec increase per second survived
        SPEED_BOOST_MULTIPLIER: 1.6,// when Speed Boost powerup is active
        SLOW_MO_MULTIPLIER: 0.55,   // when Slow Motion is active
    },

    // Scoring & Combos
    SCORING: {
        DISTANCE_PTS_PER_METER: 10,
        COIN_VALUE: 50,
        GEM_VALUE: 250,
        OBSTACLE_AVOID_PTS: 80,
        COMBO_DECAY_TIME: 3.5,      // seconds before combo counter resets
        MAX_COMBO_MULTIPLIER: 8,
        COMBO_LEVELS: [
            { min: 1, name: 'RUNNER', mult: 1, color: '#38bdf8' },
            { min: 5, name: 'GREAT!', mult: 2, color: '#4ade80' },
            { min: 12, name: 'SUPER!', mult: 3, color: '#facc15' },
            { min: 22, name: 'HYPER!', mult: 4, color: '#fb923c' },
            { min: 35, name: 'ULTRA!', mult: 5, color: '#f43f5e' },
            { min: 50, name: 'UNSTOPPABLE!', mult: 8, color: '#c084fc' }
        ]
    },

    // Power-Up Base Configurations
    POWERUPS: {
        MAGNET: {
            id: 'magnet',
            name: 'Coin Magnet',
            duration: 9.0,          // base duration in seconds
            color: '#38bdf8',
            radius: 340,            // attraction radius in pixels
            pullSpeed: 750,
            icon: '🧲'
        },
        SHIELD: {
            id: 'shield',
            name: 'Energy Shield',
            duration: 12.0,
            color: '#34d399',
            icon: '🛡️'
        },
        COIN_DOUBLER: {
            id: 'coin_doubler',
            name: '2X Coins',
            duration: 10.0,
            color: '#facc15',
            multiplier: 2,
            icon: '🪙'
        },
        SCORE_BOOST: {
            id: 'score_boost',
            name: 'Score Multiplier',
            duration: 10.0,
            color: '#fb923c',
            multiplier: 2,
            icon: '⚡'
        },
        SPEED_BOOST: {
            id: 'speed_boost',
            name: 'Hyper Dash',
            duration: 6.0,
            color: '#e879f9',
            invincible: true,
            icon: '🚀'
        },
        SLOW_MO: {
            id: 'slow_mo',
            name: 'Time Warp',
            duration: 7.0,
            color: '#818cf8',
            icon: '⏳'
        }
    },

    // Player Level & XP Progression
    PROGRESSION: {
        MAX_LEVEL: 60,
        getXpForLevel: (level) => Math.floor(120 * Math.pow(level, 1.45)),
        XP_PER_METER: 0.5,
        XP_PER_COIN: 2,
        XP_PER_OBSTACLE: 4
    },

    // Economy & Currencies
    ECONOMY: {
        STARTING_COINS: 500,
        STARTING_GEMS: 30,
        REVIVE_COST_GEMS: 5,
        DAILY_REWARD_CYCLE_DAYS: 7
    },

    // Rarity Standards
    RARITY: {
        COMMON: { name: 'Common', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.4)' },
        RARE: { name: 'Rare', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.5)' },
        EPIC: { name: 'Epic', color: '#c084fc', glow: 'rgba(192, 132, 252, 0.6)' },
        LEGENDARY: { name: 'Legendary', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.7)' }
    }
};
