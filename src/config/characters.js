/**
 * Playable Characters Configuration
 * Each runner has distinct statistical perks, passive abilities, and vector styling.
 */

export const CHARACTERS = {
    blaze: {
        id: 'blaze',
        name: 'Blaze',
        title: 'The Cyber Nomad',
        rarity: 'COMMON',
        description: 'An agile all-around parkour runner calibrated for maximum responsiveness.',
        costType: 'free',
        cost: 0,
        unlocked: true,
        stats: {
            speed: 5,
            jump: 5,
            magnetBonus: 1.0,
            shieldBonus: 1.0,
            scoreMult: 1.0,
            doubleJump: false
        },
        abilityName: 'Balanced Momentum',
        abilityDesc: 'Standard steady speed growth and balanced recovery.',
        visual: {
            primaryColor: '#0284c7',
            secondaryColor: '#38bdf8',
            accentColor: '#facc15',
            glowColor: 'rgba(56, 189, 248, 0.5)',
            visorColor: '#38bdf8',
            suitPattern: 'circuit'
        }
    },

    sparky: {
        id: 'sparky',
        name: 'Sparky',
        title: 'Neon Velocity',
        rarity: 'RARE',
        description: 'Engineered with overclocked cyber-synapses for thrilling top speeds.',
        costType: 'coins',
        cost: 1500,
        unlocked: false,
        stats: {
            speed: 8,
            jump: 5,
            magnetBonus: 1.0,
            shieldBonus: 0.9,
            scoreMult: 1.25,
            doubleJump: false
        },
        abilityName: 'Hyper Rush',
        abilityDesc: 'Gains 25% extra score multiplier and accelerates faster.',
        visual: {
            primaryColor: '#e11d48',
            secondaryColor: '#fb7185',
            accentColor: '#fef08a',
            glowColor: 'rgba(251, 113, 133, 0.6)',
            visorColor: '#fda4af',
            suitPattern: 'lightning'
        }
    },

    aegis: {
        id: 'aegis',
        name: 'Aegis',
        title: 'Iron Sentinel',
        rarity: 'RARE',
        description: 'Clad in heavy kinetic armor that reinforces shields and absorbs impacts.',
        costType: 'coins',
        cost: 2500,
        unlocked: false,
        stats: {
            speed: 4,
            jump: 4,
            magnetBonus: 0.9,
            shieldBonus: 1.6,
            scoreMult: 1.0,
            doubleJump: false
        },
        abilityName: 'Kinetic Bulwark',
        abilityDesc: 'Starts each run with an Energy Shield and shields last 60% longer.',
        visual: {
            primaryColor: '#059669',
            secondaryColor: '#34d399',
            accentColor: '#6ee7b7',
            glowColor: 'rgba(52, 211, 153, 0.6)',
            visorColor: '#10b981',
            suitPattern: 'armor'
        }
    },

    midas: {
        id: 'midas',
        name: 'Midas',
        title: 'Alloy Tycoon',
        rarity: 'EPIC',
        description: 'Equipped with gravimetric coils designed to vacuum currencies from afar.',
        costType: 'gems',
        cost: 60,
        unlocked: false,
        stats: {
            speed: 5,
            jump: 5,
            magnetBonus: 1.8,
            shieldBonus: 1.0,
            scoreMult: 1.1,
            doubleJump: false
        },
        abilityName: 'Golden Magnetism',
        abilityDesc: 'Permanent +50% magnet attraction radius and 20% bonus coins from runs.',
        visual: {
            primaryColor: '#d97706',
            secondaryColor: '#f59e0b',
            accentColor: '#fef08a',
            glowColor: 'rgba(245, 158, 11, 0.7)',
            visorColor: '#fef08a',
            suitPattern: 'gold'
        }
    },

    luna: {
        id: 'luna',
        name: 'Luna',
        title: 'Gravity Dancer',
        rarity: 'EPIC',
        description: 'Defies planetary gravity with zero-G repulsors for superior aerial control.',
        costType: 'gems',
        cost: 90,
        unlocked: false,
        stats: {
            speed: 6,
            jump: 8,
            magnetBonus: 1.0,
            shieldBonus: 1.0,
            scoreMult: 1.15,
            doubleJump: true
        },
        abilityName: 'Double Leap',
        abilityDesc: 'Innate Double Jump ability unlocked from the start of every run!',
        visual: {
            primaryColor: '#7c3aed',
            secondaryColor: '#a78bfa',
            accentColor: '#c084fc',
            glowColor: 'rgba(192, 132, 252, 0.7)',
            visorColor: '#e9d5ff',
            suitPattern: 'galaxy'
        }
    },

    chronos: {
        id: 'chronos',
        name: 'Chronos',
        title: 'Temporal Warden',
        rarity: 'LEGENDARY',
        description: 'Harnesses tachyon emitters to bend time, prolonging powerups and slowing hazards.',
        costType: 'gems',
        cost: 150,
        unlocked: false,
        stats: {
            speed: 7,
            jump: 7,
            magnetBonus: 1.4,
            shieldBonus: 1.4,
            scoreMult: 1.35,
            doubleJump: true
        },
        abilityName: 'Tachyon Overclock',
        abilityDesc: 'All powerup durations increased by +50%, double jump enabled, and +35% score.',
        visual: {
            primaryColor: '#0f172a',
            secondaryColor: '#06b6d4',
            accentColor: '#f43f5e',
            glowColor: 'rgba(6, 182, 212, 0.9)',
            visorColor: '#f43f5e',
            suitPattern: 'quantum'
        }
    }
};
