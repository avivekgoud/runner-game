/**
 * Worlds / Environments Configuration
 * 5 unique, visually rich worlds with distinct color palettes, obstacles,
 * parallax backdrops, and synthesized musical scales.
 */

export const WORLDS = {
    neo_city: {
        id: 'neo_city',
        name: 'Neo City',
        theme: 'Cyberpunk Metropolis',
        description: 'A neon-drenched metropolis with towering skyscrapers and speeding hovercars.',
        unlockLevel: 1,
        unlockCost: 0,
        skyColors: ['#090919', '#171233', '#2d1b4e'],
        groundColor: '#1e1b4b',
        groundAccent: '#06b6d4',
        groundGrid: '#312e81',
        particles: {
            type: 'dust',
            color: 'rgba(6, 182, 212, 0.4)',
            rate: 2
        },
        decorations: ['billboard', 'streetlight', 'cyber_building', 'hologram'],
        obstacleThemes: ['laser_gate', 'crate', 'spikes', 'patrol_drone'],
        music: {
            bpm: 128,
            scale: 'minor',
            baseFreq: 110, // A2
            style: 'synthwave',
            arpeggioNotes: [110, 130.81, 164.81, 220, 261.63, 329.63]
        }
    },

    emerald_forest: {
        id: 'emerald_forest',
        name: 'Emerald Forest',
        theme: 'Enchanted Woodlands',
        description: 'Bioluminescent ancient woods with ancient ruins, giant mossy branches, and glowing spores.',
        unlockLevel: 3,
        unlockCost: 600,
        skyColors: ['#022c22', '#064e3b', '#065f46'],
        groundColor: '#042f2e',
        groundAccent: '#10b981',
        groundGrid: '#134e4a',
        particles: {
            type: 'firefly',
            color: 'rgba(52, 211, 153, 0.6)',
            rate: 3
        },
        decorations: ['giant_tree', 'moss_stone', 'ancient_ruin', 'mushrooms'],
        obstacleThemes: ['thorn_spikes', 'moss_log', 'spider_drone', 'falling_vine'],
        music: {
            bpm: 116,
            scale: 'pentatonic',
            baseFreq: 130.81, // C3
            style: 'folk_ambient',
            arpeggioNotes: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63]
        }
    },

    sunset_desert: {
        id: 'sunset_desert',
        name: 'Sunset Dunes',
        theme: 'Golden Wasteland',
        description: 'Vast red-sand dunes lit by twin setting suns, ancient pyramids, and swirling sandstorms.',
        unlockLevel: 7,
        unlockCost: 1500,
        skyColors: ['#451a03', '#78350f', '#b45309', '#f59e0b'],
        groundColor: '#7c2d12',
        groundAccent: '#f59e0b',
        groundGrid: '#9a3412',
        particles: {
            type: 'sand',
            color: 'rgba(245, 158, 11, 0.4)',
            rate: 4
        },
        decorations: ['pyramid', 'cactus', 'ruined_pillar', 'sand_dune'],
        obstacleThemes: ['cactus_cluster', 'sand_spikes', 'rolling_boulder', 'heat_beam'],
        music: {
            bpm: 124,
            scale: 'phrygian',
            baseFreq: 123.47, // B2
            style: 'oriental_synth',
            arpeggioNotes: [123.47, 130.81, 164.81, 185.00, 196.00, 246.94]
        }
    },

    frost_peak: {
        id: 'frost_peak',
        name: 'Frost Peak',
        theme: 'Glacial Caverns',
        description: 'Treacherous glaciers and jagged ice caves with frozen crystals and blowing blizzards.',
        unlockLevel: 12,
        unlockCost: 3000,
        skyColors: ['#082f49', '#0c4a6e', '#0369a1'],
        groundColor: '#0f172a',
        groundAccent: '#38bdf8',
        groundGrid: '#1e293b',
        particles: {
            type: 'snow',
            color: 'rgba(255, 255, 255, 0.8)',
            rate: 5
        },
        decorations: ['ice_stalagmite', 'snow_pine', 'glacier_crest', 'frozen_crystal'],
        obstacleThemes: ['ice_spikes', 'snow_crate', 'icicle_trap', 'frost_barrier'],
        music: {
            bpm: 132,
            scale: 'dorian',
            baseFreq: 146.83, // D3
            style: 'chime_techno',
            arpeggioNotes: [146.83, 164.81, 174.61, 220.00, 246.94, 293.66]
        }
    },

    cyber_2099: {
        id: 'cyber_2099',
        name: 'Cyberpunk 2099',
        theme: 'Orbital Skyway',
        description: 'High-altitude mag-lev expressway over an infinite hyper-city of lasers and chrome.',
        unlockLevel: 18,
        unlockCost: 6000,
        skyColors: ['#18022b', '#3b0764', '#581c87'],
        groundColor: '#2e1065',
        groundAccent: '#ec4899',
        groundGrid: '#4c1d95',
        particles: {
            type: 'warp',
            color: 'rgba(236, 72, 153, 0.6)',
            rate: 4
        },
        decorations: ['maglev_rail', 'floating_drone', 'holographic_orb', 'plasma_pylon'],
        obstacleThemes: ['plasma_laser', 'cyber_barrier', 'hover_mine', 'energy_spikes'],
        music: {
            bpm: 140,
            scale: 'cyber_minor',
            baseFreq: 110, // A2
            style: 'high_octane',
            arpeggioNotes: [110, 138.59, 164.81, 207.65, 220, 277.18]
        }
    }
};
