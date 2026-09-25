/**
 * Customization Items Configuration
 * Hats, Skins, Particle Trails, and Emotes.
 */

export const CUSTOMIZATIONS = {
    HATS: {
        none: {
            id: 'none',
            name: 'No Hat',
            rarity: 'COMMON',
            cost: 0,
            costType: 'free',
            unlocked: true,
            icon: '🧢'
        },
        cyber_cap: {
            id: 'cyber_cap',
            name: 'Cyber Cap',
            rarity: 'COMMON',
            cost: 300,
            costType: 'coins',
            unlocked: false,
            color: '#38bdf8',
            icon: '🧢'
        },
        neon_visor: {
            id: 'neon_visor',
            name: 'Holo Visor',
            rarity: 'RARE',
            cost: 750,
            costType: 'coins',
            unlocked: false,
            color: '#ec4899',
            icon: '🥽'
        },
        cyber_fedora: {
            id: 'cyber_fedora',
            name: 'Noir Fedora',
            rarity: 'RARE',
            cost: 900,
            costType: 'coins',
            unlocked: false,
            color: '#334155',
            icon: '🎩'
        },
        mecha_horns: {
            id: 'mecha_horns',
            name: 'Mecha Horns',
            rarity: 'EPIC',
            cost: 30,
            costType: 'gems',
            unlocked: false,
            color: '#f43f5e',
            icon: '😈'
        },
        plasma_halo: {
            id: 'plasma_halo',
            name: 'Plasma Halo',
            rarity: 'EPIC',
            cost: 45,
            costType: 'gems',
            unlocked: false,
            color: '#a855f7',
            icon: '😇'
        },
        golden_crown: {
            id: 'golden_crown',
            name: 'Solar Crown',
            rarity: 'LEGENDARY',
            cost: 80,
            costType: 'gems',
            unlocked: false,
            color: '#f59e0b',
            icon: '👑'
        }
    },

    SKINS: {
        default: {
            id: 'default',
            name: 'Standard Operative',
            rarity: 'COMMON',
            cost: 0,
            costType: 'free',
            unlocked: true,
            tint: null
        },
        stealth_black: {
            id: 'stealth_black',
            name: 'Stealth Carbon',
            rarity: 'RARE',
            cost: 600,
            costType: 'coins',
            unlocked: false,
            primary: '#1e293b',
            secondary: '#0f172a',
            accent: '#38bdf8'
        },
        neon_glow: {
            id: 'neon_glow',
            name: 'Neon Synth',
            rarity: 'RARE',
            cost: 1000,
            costType: 'coins',
            unlocked: false,
            primary: '#ec4899',
            secondary: '#8b5cf6',
            accent: '#06b6d4'
        },
        fiery_crimson: {
            id: 'fiery_crimson',
            name: 'Infernal Core',
            rarity: 'EPIC',
            cost: 35,
            costType: 'gems',
            unlocked: false,
            primary: '#dc2626',
            secondary: '#ef4444',
            accent: '#f59e0b'
        },
        glitch_matrix: {
            id: 'glitch_matrix',
            name: 'Matrix Code',
            rarity: 'EPIC',
            cost: 50,
            costType: 'gems',
            unlocked: false,
            primary: '#14532d',
            secondary: '#22c55e',
            accent: '#86efac'
        },
        golden_champion: {
            id: 'golden_champion',
            name: 'Golden Apex',
            rarity: 'LEGENDARY',
            cost: 100,
            costType: 'gems',
            unlocked: false,
            primary: '#b45309',
            secondary: '#f59e0b',
            accent: '#fef08a'
        }
    },

    TRAILS: {
        default: {
            id: 'default',
            name: 'Standard Dust',
            rarity: 'COMMON',
            cost: 0,
            costType: 'free',
            unlocked: true,
            particleType: 'dust',
            color: 'rgba(203, 213, 225, 0.4)'
        },
        cyber_ribbon: {
            id: 'cyber_ribbon',
            name: 'Cyber Ribbon',
            rarity: 'RARE',
            cost: 500,
            costType: 'coins',
            unlocked: false,
            particleType: 'line',
            color: 'rgba(6, 182, 212, 0.7)'
        },
        solar_flame: {
            id: 'solar_flame',
            name: 'Solar Embers',
            rarity: 'RARE',
            cost: 900,
            costType: 'coins',
            unlocked: false,
            particleType: 'fire',
            color: 'rgba(249, 115, 22, 0.7)'
        },
        electric_bolt: {
            id: 'electric_bolt',
            name: 'Volt Spark',
            rarity: 'EPIC',
            cost: 40,
            costType: 'gems',
            unlocked: false,
            particleType: 'spark',
            color: 'rgba(234, 179, 8, 0.8)'
        },
        galaxy_stars: {
            id: 'galaxy_stars',
            name: 'Cosmic Stardust',
            rarity: 'LEGENDARY',
            cost: 75,
            costType: 'gems',
            unlocked: false,
            particleType: 'star',
            color: 'rgba(192, 132, 252, 0.9)'
        }
    }
};
