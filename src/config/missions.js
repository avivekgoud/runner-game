/**
 * Daily and Weekly Missions Configuration
 * Provides dynamic quest generation and tracking.
 */

export const DAILY_MISSION_POOL = [
    {
        id: 'daily_coins_1',
        title: 'Coin Collector',
        desc: 'Collect 100 coins in single or multiple runs.',
        type: 'coins_collected',
        target: 100,
        rewardCoins: 250,
        rewardXp: 100,
        rewardGems: 2
    },
    {
        id: 'daily_distance_1',
        title: 'Marathon Starter',
        desc: 'Run a cumulative distance of 1,500 meters.',
        type: 'distance_run',
        target: 1500,
        rewardCoins: 300,
        rewardXp: 120,
        rewardGems: 2
    },
    {
        id: 'daily_jumps_1',
        title: 'Gravity Defier',
        desc: 'Perform 25 jumps over obstacles or gaps.',
        type: 'jumps_performed',
        target: 25,
        rewardCoins: 200,
        rewardXp: 80,
        rewardGems: 1
    },
    {
        id: 'daily_slides_1',
        title: 'Low Rider',
        desc: 'Perform 15 slides under hazards or lasers.',
        type: 'slides_performed',
        target: 15,
        rewardCoins: 200,
        rewardXp: 80,
        rewardGems: 1
    },
    {
        id: 'daily_powerups_1',
        title: 'Overclocked',
        desc: 'Collect 4 power-ups during gameplay.',
        type: 'powerups_used',
        target: 4,
        rewardCoins: 350,
        rewardXp: 150,
        rewardGems: 3
    },
    {
        id: 'daily_combo_1',
        title: 'Combo Master',
        desc: 'Reach a combo multiplier of 5x or higher.',
        type: 'combo_reached',
        target: 5,
        rewardCoins: 300,
        rewardXp: 120,
        rewardGems: 2
    },
    {
        id: 'daily_runs_1',
        title: 'Persistent Sprinter',
        desc: 'Complete 3 full runs.',
        type: 'runs_completed',
        target: 3,
        rewardCoins: 250,
        rewardXp: 100,
        rewardGems: 2
    }
];

export const WEEKLY_MISSION_POOL = [
    {
        id: 'weekly_distance_1',
        title: 'Cross-Country Runner',
        desc: 'Run a cumulative distance of 15,000 meters.',
        type: 'distance_run',
        target: 15000,
        rewardCoins: 2500,
        rewardXp: 800,
        rewardGems: 20
    },
    {
        id: 'weekly_coins_1',
        title: 'Treasury Raider',
        desc: 'Gather 2,000 coins across all your runs.',
        type: 'coins_collected',
        target: 2000,
        rewardCoins: 2000,
        rewardXp: 750,
        rewardGems: 15
    },
    {
        id: 'weekly_obstacles_1',
        title: 'Untouchable Phantom',
        desc: 'Dodge 200 obstacles safely.',
        type: 'obstacles_dodged',
        target: 200,
        rewardCoins: 3000,
        rewardXp: 900,
        rewardGems: 25
    },
    {
        id: 'weekly_powerups_1',
        title: 'Tech Hoarder',
        desc: 'Collect 35 power-ups during your runs.',
        type: 'powerups_used',
        target: 35,
        rewardCoins: 2200,
        rewardXp: 700,
        rewardGems: 15
    },
    {
        id: 'weekly_runs_1',
        title: 'Dedication Legend',
        desc: 'Complete 15 total runs.',
        type: 'runs_completed',
        target: 15,
        rewardCoins: 2000,
        rewardXp: 600,
        rewardGems: 15
    }
];
