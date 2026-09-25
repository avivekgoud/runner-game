/**
 * Limited-Time Events Framework
 * Data-driven seasonal events with custom modifiers, milestones, and exclusive rewards.
 */

export const ACTIVE_EVENTS = [
    {
        id: 'neon_overdrive_2026',
        title: 'NEON OVERDRIVE',
        subtitle: 'Cyber Surge Season',
        theme: 'cyber',
        description: 'The city power grid has supercharged! Earn +50% extra coins and score during this limited-time surge.',
        bannerGradient: 'linear-gradient(135deg, #4c1d95 0%, #06b6d4 100%)',
        icon: 'SURGE',
        startDate: '2026-09-01T00:00:00Z',
        endDate: '2026-10-31T23:59:59Z',
        coinBonusMultiplier: 1.5,
        scoreBonusMultiplier: 1.25,
        missions: [
            {
                id: 'evt_neon_run_1',
                title: 'Grid Surfer',
                desc: 'Run 5,000 meters during the Neon Overdrive event.',
                target: 5000,
                type: 'distance_run',
                rewardCoins: 1200,
                rewardGems: 15
            },
            {
                id: 'evt_neon_coins_1',
                title: 'Data Harvester',
                desc: 'Collect 800 coins during event runs.',
                target: 800,
                type: 'coins_collected',
                rewardCoins: 1000,
                rewardGems: 12
            },
            {
                id: 'evt_neon_speed_1',
                title: 'Overclocked Sprint',
                desc: 'Use the Hyper Dash power-up 5 times.',
                target: 5,
                type: 'powerups_used',
                rewardCoins: 1500,
                rewardGems: 20
            }
        ],
        milestones: [
            { score: 10000, rewardDesc: '300 Coins + 5 Gems', claimed: false },
            { score: 35000, rewardDesc: 'Exclusive Cyber Cap + 10 Gems', claimed: false },
            { score: 75000, rewardDesc: 'Epic Skin: Neon Synth + 25 Gems', claimed: false }
        ]
    }
];
