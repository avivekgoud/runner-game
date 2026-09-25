/**
 * In-game Shop Configuration
 * Power-up upgrades, consumables, currency exchanges, and special bundles.
 */

export const SHOP_ITEMS = {
    UPGRADES: {
        magnet_upgrade: {
            id: 'magnet_upgrade',
            name: 'Magnet Duration',
            powerupId: 'magnet',
            desc: 'Increases Coin Magnet duration by +2s and pull radius by +15%.',
            icon: '🧲',
            maxLevel: 5,
            costs: [300, 750, 1500, 3000, 6000],
            costType: 'coins',
            bonusPerLevel: 2.0
        },
        shield_upgrade: {
            id: 'shield_upgrade',
            name: 'Shield Duration',
            powerupId: 'shield',
            desc: 'Increases Energy Shield duration by +3s and invulnerability window.',
            icon: '🛡️',
            maxLevel: 5,
            costs: [350, 800, 1600, 3200, 6500],
            costType: 'coins',
            bonusPerLevel: 3.0
        },
        coin_doubler_upgrade: {
            id: 'coin_doubler_upgrade',
            name: '2X Coins Duration',
            powerupId: 'coin_doubler',
            desc: 'Increases 2X Coin multiplier active duration by +2s.',
            icon: '🪙',
            maxLevel: 5,
            costs: [400, 900, 1800, 3500, 7000],
            costType: 'coins',
            bonusPerLevel: 2.0
        },
        score_boost_upgrade: {
            id: 'score_boost_upgrade',
            name: 'Score Boost Duration',
            powerupId: 'score_boost',
            desc: 'Increases Score Boost active duration by +2s.',
            icon: '⚡',
            maxLevel: 5,
            costs: [450, 1000, 2000, 4000, 8000],
            costType: 'coins',
            bonusPerLevel: 2.0
        },
        speed_boost_upgrade: {
            id: 'speed_boost_upgrade',
            name: 'Hyper Dash Duration',
            powerupId: 'speed_boost',
            desc: 'Increases Hyper Dash invincibility sprint duration by +1.5s.',
            icon: '🚀',
            maxLevel: 5,
            costs: [500, 1200, 2400, 4800, 9000],
            costType: 'coins',
            bonusPerLevel: 1.5
        },
        slow_mo_upgrade: {
            id: 'slow_mo_upgrade',
            name: 'Time Warp Duration',
            powerupId: 'slow_mo',
            desc: 'Increases Time Warp slow-motion duration by +1.5s.',
            icon: '⏳',
            maxLevel: 5,
            costs: [350, 850, 1700, 3400, 6800],
            costType: 'coins',
            bonusPerLevel: 1.5
        }
    },

    CONSUMABLES: {
        revive_pack_1: {
            id: 'revive_pack_1',
            name: '1x Revive Token',
            desc: 'Continue your run instantly when you collide with a hazard.',
            icon: '💖',
            count: 1,
            cost: 500,
            costType: 'coins'
        },
        revive_pack_3: {
            id: 'revive_pack_3',
            name: '3x Revive Tokens',
            desc: 'A bundle of 3 emergency revive capsules at a 15% discount.',
            icon: '💖',
            count: 3,
            cost: 1250,
            costType: 'coins'
        },
        headstart_booster: {
            id: 'headstart_booster',
            name: '1x Supersonic Headstart',
            desc: 'Start your next run with an instant 500m rocket launch!',
            icon: '🚀',
            count: 1,
            cost: 600,
            costType: 'coins'
        }
    },

    CURRENCY_EXCHANGE: {
        daily_free_gems: {
            id: 'daily_free_gems',
            name: 'Daily Free Gems',
            desc: 'Free gift from the Cyber Syndicate every 24 hours!',
            icon: '💎',
            givesGems: 10,
            cost: 0,
            costType: 'free',
            cooldownHours: 24
        },
        coin_pouch: {
            id: 'coin_pouch',
            name: 'Coin Pouch',
            desc: 'Quick cash injection for upgrades.',
            icon: '💰',
            givesCoins: 600,
            cost: 6,
            costType: 'gems'
        },
        coin_chest: {
            id: 'coin_chest',
            name: 'Coin Chest',
            desc: 'Great value bundle of credits.',
            icon: '🧰',
            givesCoins: 2000,
            cost: 18,
            costType: 'gems'
        },
        coin_vault: {
            id: 'coin_vault',
            name: 'Coin Vault',
            desc: 'Massive vault of credits with 25% bonus value.',
            icon: '🏦',
            givesCoins: 5000,
            cost: 40,
            costType: 'gems'
        }
    }
};
