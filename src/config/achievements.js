/**
 * Achievements Configuration
 * 20+ unique milestones with badges, tracking metrics, and claimable rewards.
 */

export const ACHIEVEMENTS = [
    {
        id: 'first_run',
        title: 'First Step',
        desc: 'Complete your very first run in any world.',
        icon: '👟',
        statKey: 'totalRuns',
        target: 1,
        rewardCoins: 100,
        rewardGems: 2
    },
    {
        id: 'dist_500',
        title: 'Speed Novice',
        desc: 'Survive a single run past 500 meters.',
        icon: '🏃',
        statKey: 'longestRun',
        target: 500,
        rewardCoins: 200,
        rewardGems: 3
    },
    {
        id: 'dist_2000',
        title: 'Highway Sprinter',
        desc: 'Survive a single run past 2,000 meters.',
        icon: '⚡',
        statKey: 'longestRun',
        target: 2000,
        rewardCoins: 500,
        rewardGems: 10
    },
    {
        id: 'dist_5000',
        title: 'Apex Nomad',
        desc: 'Reach an incredible 5,000 meters in a single run.',
        icon: '🌟',
        statKey: 'longestRun',
        target: 5000,
        rewardCoins: 1500,
        rewardGems: 25
    },
    {
        id: 'total_dist_25000',
        title: 'Globe Trotter',
        desc: 'Accumulate 25,000 meters total across all runs.',
        icon: '🌍',
        statKey: 'totalDistance',
        target: 25000,
        rewardCoins: 2000,
        rewardGems: 30
    },
    {
        id: 'coins_500',
        title: 'Pocket Change',
        desc: 'Collect 500 total coins.',
        icon: '🪙',
        statKey: 'totalCoins',
        target: 500,
        rewardCoins: 250,
        rewardGems: 5
    },
    {
        id: 'coins_3000',
        title: 'Coin Collector',
        desc: 'Collect 3,000 total coins.',
        icon: '💰',
        statKey: 'totalCoins',
        target: 3000,
        rewardCoins: 1000,
        rewardGems: 15
    },
    {
        id: 'coins_10000',
        title: 'Cyber Tycoon',
        desc: 'Collect 10,000 total coins.',
        icon: '🏦',
        statKey: 'totalCoins',
        target: 10000,
        rewardCoins: 3500,
        rewardGems: 50
    },
    {
        id: 'score_10000',
        title: 'Score Climber',
        desc: 'Achieve a score of 10,000 in a single run.',
        icon: '🎯',
        statKey: 'highestScore',
        target: 10000,
        rewardCoins: 400,
        rewardGems: 5
    },
    {
        id: 'score_50000',
        title: 'Arcade Champion',
        desc: 'Achieve a score of 50,000 in a single run.',
        icon: '🏆',
        statKey: 'highestScore',
        target: 50000,
        rewardCoins: 1200,
        rewardGems: 20
    },
    {
        id: 'score_150000',
        title: 'Score Master',
        desc: 'Score over 150,000 in a legendary run.',
        icon: '👑',
        statKey: 'highestScore',
        target: 150000,
        rewardCoins: 4000,
        rewardGems: 60
    },
    {
        id: 'jumps_100',
        title: 'Spring Loaded',
        desc: 'Perform 100 successful jumps.',
        icon: '🦘',
        statKey: 'totalJumps',
        target: 100,
        rewardCoins: 300,
        rewardGems: 5
    },
    {
        id: 'slides_50',
        title: 'Slide Specialist',
        desc: 'Perform 50 slides under obstacles.',
        icon: '🛹',
        statKey: 'totalSlides',
        target: 50,
        rewardCoins: 300,
        rewardGems: 5
    },
    {
        id: 'dodges_100',
        title: 'Agile Reflexes',
        desc: 'Successfully dodge 100 obstacles.',
        icon: '🛡️',
        statKey: 'obstaclesAvoided',
        target: 100,
        rewardCoins: 500,
        rewardGems: 10
    },
    {
        id: 'powerups_25',
        title: 'Overcharged',
        desc: 'Pick up 25 power-ups during gameplay.',
        icon: '⚡',
        statKey: 'powerupsCollected',
        target: 25,
        rewardCoins: 400,
        rewardGems: 8
    },
    {
        id: 'combo_6',
        title: 'Combo Prodigy',
        desc: 'Reach a 6x Combo Multiplier.',
        icon: '🔥',
        statKey: 'highestCombo',
        target: 6,
        rewardCoins: 500,
        rewardGems: 10
    },
    {
        id: 'level_5',
        title: 'Rising Star',
        desc: 'Reach Player Level 5.',
        icon: '⭐',
        statKey: 'level',
        target: 5,
        rewardCoins: 600,
        rewardGems: 10
    },
    {
        id: 'level_15',
        title: 'Veteran Runner',
        desc: 'Reach Player Level 15.',
        icon: '🌠',
        statKey: 'level',
        target: 15,
        rewardCoins: 2000,
        rewardGems: 30
    },
    {
        id: 'characters_3',
        title: 'Squad Builder',
        desc: 'Unlock at least 3 playable characters.',
        icon: '👥',
        statKey: 'charactersOwned',
        target: 3,
        rewardCoins: 1000,
        rewardGems: 15
    },
    {
        id: 'streak_3',
        title: 'Consistent Sprinter',
        desc: 'Maintain a 3-day daily login streak.',
        icon: '📅',
        statKey: 'dailyStreak',
        target: 3,
        rewardCoins: 500,
        rewardGems: 10
    }
];
