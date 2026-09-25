/**
 * Worlds / Environments Configuration
 * 5 distinct, visually clean worlds with vibrant color palettes,
 * smooth parallax backdrops, and synthesized musical scales.
 */

export const WORLDS = {
    neo_city: {
        id: 'neo_city',
        name: 'Neo City',
        theme: 'Twilight Metropolis',
        description: 'A vibrant skyline under evening twilight with sleek skyscrapers and speeding hovercraft.',
        unlockLevel: 1,
        unlockCost: 0,
        skyColors: ['#0f172a', '#1e1b4b', '#312e81', '#4338ca'],
        groundColor: '#1e293b',
        groundAccent: '#38bdf8',
        groundGrid: '#334155',
        particles: {
            type: 'dust',
            color: 'rgba(56, 189, 248, 0.4)',
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
        theme: 'Lush Woodlands',
        description: 'Vibrant mossy woodlands filled with glowing flora, giant canopies, and firefly spores.',
        unlockLevel: 3,
        unlockCost: 600,
        skyColors: ['#022c22', '#064e3b', '#065f46', '#047857'],
        groundColor: '#064e3b',
        groundAccent: '#34d399',
        groundGrid: '#0f766e',
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
        theme: 'Golden Canyon',
        description: 'Warm glowing terracotta sand dunes lit by a massive setting sun and ancient monuments.',
        unlockLevel: 7,
        unlockCost: 1500,
        skyColors: ['#451a03', '#7c2d12', '#c2410c', '#f59e0b'],
        groundColor: '#7c2d12',
        groundAccent: '#fbbf24',
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
        theme: 'Glacial Dawn',
        description: 'Crisp ice peaks and shimmering glaciers under a vibrant arctic morning sky.',
        unlockLevel: 12,
        unlockCost: 3000,
        skyColors: ['#082f49', '#0369a1', '#0284c7', '#38bdf8'],
        groundColor: '#0f172a',
        groundAccent: '#7dd3fc',
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
        name: 'Cyber Horizon',
        theme: 'Midnight Skyway',
        description: 'Sleek orbital roadway suspended over a sea of electric city lights and stars.',
        unlockLevel: 18,
        unlockCost: 6000,
        skyColors: ['#09090b', '#18181b', '#27272a', '#3f3f46'],
        groundColor: '#18181b',
        groundAccent: '#f43f5e',
        groundGrid: '#27272a',
        particles: {
            type: 'warp',
            color: 'rgba(244, 63, 94, 0.6)',
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
