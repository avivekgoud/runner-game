/**
 * SaveManager & Account System
 * Manages player authentication, profiles, guest accounts, and persistent progress.
 */

import { GAME_CONFIG } from '../config/constants.js';
import { DAILY_MISSION_POOL, WEEKLY_MISSION_POOL } from '../config/missions.js';
import { ACHIEVEMENTS } from '../config/achievements.js';
import { events } from './EventEmitter.js';

const STORAGE_KEYS = {
    CURRENT_USER: 'cr_current_user_v1',
    USERS_DB: 'cr_users_db_v1',
    GUEST_SAVE: 'cr_guest_save_v1'
};

export class SaveManager {
    constructor() {
        this.currentUser = null;
        this.isGuest = true;
        this.data = this.getDefaultSaveData('Guest Runner');
        this.loadInitialSession();
    }

    getDefaultSaveData(username = 'Runner') {
        const defaultAchievements = {};
        for (const ach of ACHIEVEMENTS) {
            defaultAchievements[ach.id] = {
                unlocked: false,
                progress: 0,
                claimed: false
            };
        }

        return {
            version: GAME_CONFIG.VERSION,
            username: username,
            coins: GAME_CONFIG.ECONOMY.STARTING_COINS,
            gems: GAME_CONFIG.ECONOMY.STARTING_GEMS,
            level: 1,
            xp: 0,
            highScore: 0,
            bestDistance: 0,
            bestCoins: 0,
            selectedWorld: 'neo_city',
            unlockedWorlds: ['neo_city'],
            selectedCharacter: 'blaze',
            unlockedCharacters: ['blaze'],
            customization: {
                hat: 'none',
                skin: 'default',
                trail: 'default'
            },
            unlockedHats: ['none'],
            unlockedSkins: ['default'],
            unlockedTrails: ['default'],
            upgrades: {
                magnet: 1,
                shield: 1,
                coin_doubler: 1,
                score_boost: 1,
                speed_boost: 1,
                slow_mo: 1
            },
            consumables: {
                revives: 2,
                headstarts: 1
            },
            dailyReward: {
                currentStreak: 0,
                lastClaimDate: null,
                claimCycle: 0
            },
            freeGemsLastClaim: null,
            missions: {
                daily: this.generateDailyMissions(),
                weekly: this.generateWeeklyMissions(),
                lastDailyRefresh: new Date().toDateString(),
                lastWeeklyRefresh: this.getWeekId()
            },
            achievements: defaultAchievements,
            stats: {
                totalRuns: 0,
                totalDistance: 0,
                totalCoins: 0,
                highestScore: 0,
                longestRun: 0,
                obstaclesAvoided: 0,
                powerupsCollected: 0,
                totalJumps: 0,
                totalSlides: 0,
                highestCombo: 0,
                dailyStreak: 0,
                charactersOwned: 1
            },
            settings: {
                sfxVolume: 0.8,
                musicVolume: 0.6,
                soundMuted: false,
                screenShake: true,
                graphicsQuality: 'high', // 'high', 'medium', 'low'
                vibration: true,
                onboardingComplete: false
            }
        };
    }

    generateDailyMissions() {
        // Return 3 daily missions
        return DAILY_MISSION_POOL.slice(0, 3).map(m => ({
            id: m.id,
            title: m.title,
            desc: m.desc,
            type: m.type,
            target: m.target,
            progress: 0,
            rewardCoins: m.rewardCoins,
            rewardXp: m.rewardXp,
            rewardGems: m.rewardGems,
            completed: false,
            claimed: false
        }));
    }

    generateWeeklyMissions() {
        return WEEKLY_MISSION_POOL.slice(0, 2).map(m => ({
            id: m.id,
            title: m.title,
            desc: m.desc,
            type: m.type,
            target: m.target,
            progress: 0,
            rewardCoins: m.rewardCoins,
            rewardXp: m.rewardXp,
            rewardGems: m.rewardGems,
            completed: false,
            claimed: false
        }));
    }

    getWeekId() {
        const d = new Date();
        const oneJan = new Date(d.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
        return `${d.getFullYear()}_W${week}`;
    }

    // --- Authentication & Account Management ---

    loadInitialSession() {
        try {
            const savedSession = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            if (savedSession) {
                const session = JSON.parse(savedSession);
                if (session.username && !session.isGuest) {
                    const userDb = this.getUsersDb();
                    if (userDb[session.username]) {
                        this.currentUser = session.username;
                        this.isGuest = false;
                        this.data = this.mergeWithDefault(userDb[session.username].saveData, session.username);
                        this.checkMissionsRefresh();
                        return;
                    }
                }
            }

            // Fallback or guest session
            const guestSave = localStorage.getItem(STORAGE_KEYS.GUEST_SAVE);
            if (guestSave) {
                this.data = this.mergeWithDefault(JSON.parse(guestSave), 'Guest Runner');
            } else {
                this.data = this.getDefaultSaveData('Guest Runner');
                this.save();
            }
            this.currentUser = 'Guest';
            this.isGuest = true;
            this.checkMissionsRefresh();
        } catch (err) {
            console.error('Failed to load session, creating fallback profile:', err);
            this.data = this.getDefaultSaveData('Guest Runner');
        }
    }

    getUsersDb() {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    saveUsersDb(db) {
        localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db));
    }

    signUp(username, email, password) {
        if (!username || username.trim().length < 3) {
            return { success: false, message: 'Username must be at least 3 characters.' };
        }
        if (!email || !email.includes('@')) {
            return { success: false, message: 'Please enter a valid email address.' };
        }
        if (!password || password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters.' };
        }

        const db = this.getUsersDb();
        const cleanUser = username.trim();
        if (db[cleanUser]) {
            return { success: false, message: 'Username is already taken.' };
        }

        // Migrate current guest data if any progress was made
        const newSaveData = this.mergeWithDefault(this.data, cleanUser);
        newSaveData.username = cleanUser;

        db[cleanUser] = {
            username: cleanUser,
            email: email.trim().toLowerCase(),
            password: password, // In production web-app, bcrypt/backend is used
            createdAt: new Date().toISOString(),
            saveData: newSaveData
        };

        this.saveUsersDb(db);
        this.login(cleanUser, password, true);
        return { success: true, message: 'Account created successfully!' };
    }

    login(username, password, remember = true) {
        const db = this.getUsersDb();
        const user = db[username.trim()];
        if (!user || user.password !== password) {
            return { success: false, message: 'Invalid username or password.' };
        }

        this.currentUser = user.username;
        this.isGuest = false;
        this.data = this.mergeWithDefault(user.saveData, user.username);
        this.checkMissionsRefresh();

        if (remember) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
                username: user.username,
                isGuest: false
            }));
        }
        this.save();
        events.emit('auth:stateChanged', { user: this.currentUser, isGuest: false });
        return { success: true, user: this.currentUser };
    }

    loginAsGuest() {
        this.currentUser = 'Guest';
        this.isGuest = true;
        const guestSave = localStorage.getItem(STORAGE_KEYS.GUEST_SAVE);
        if (guestSave) {
            this.data = this.mergeWithDefault(JSON.parse(guestSave), 'Guest Runner');
        } else {
            this.data = this.getDefaultSaveData('Guest Runner');
        }
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify({
            username: 'Guest',
            isGuest: true
        }));
        this.save();
        events.emit('auth:stateChanged', { user: 'Guest', isGuest: true });
        return { success: true };
    }

    logout() {
        this.save();
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.loginAsGuest();
    }

    resetPassword(email, newPassword) {
        if (!email || !newPassword || newPassword.length < 6) {
            return { success: false, message: 'Enter a valid email and 6+ character password.' };
        }
        const db = this.getUsersDb();
        const foundKey = Object.keys(db).find(k => db[k].email === email.trim().toLowerCase());
        if (!foundKey) {
            return { success: false, message: 'No account found with this email address.' };
        }
        db[foundKey].password = newPassword;
        this.saveUsersDb(db);
        return { success: true, message: 'Password has been updated! You can now log in.' };
    }

    // --- Persistence & Migrations ---

    save() {
        try {
            if (this.isGuest) {
                localStorage.setItem(STORAGE_KEYS.GUEST_SAVE, JSON.stringify(this.data));
            } else if (this.currentUser) {
                const db = this.getUsersDb();
                if (db[this.currentUser]) {
                    db[this.currentUser].saveData = this.data;
                    this.saveUsersDb(db);
                }
            }
            events.emit('save:updated', this.data);
        } catch (e) {
            console.error('Save failed:', e);
        }
    }

    mergeWithDefault(saved, username) {
        const def = this.getDefaultSaveData(username);
        if (!saved || typeof saved !== 'object') return def;

        const merged = { ...def, ...saved };
        merged.customization = { ...def.customization, ...(saved.customization || {}) };
        merged.upgrades = { ...def.upgrades, ...(saved.upgrades || {}) };
        merged.consumables = { ...def.consumables, ...(saved.consumables || {}) };
        merged.stats = { ...def.stats, ...(saved.stats || {}) };
        merged.settings = { ...def.settings, ...(saved.settings || {}) };
        merged.dailyReward = { ...def.dailyReward, ...(saved.dailyReward || {}) };

        // Ensure achievements structure
        merged.achievements = { ...def.achievements };
        if (saved.achievements) {
            for (const [k, v] of Object.entries(saved.achievements)) {
                if (merged.achievements[k]) {
                    merged.achievements[k] = { ...merged.achievements[k], ...v };
                }
            }
        }

        // Ensure arrays
        merged.unlockedWorlds = Array.from(new Set(saved.unlockedWorlds || def.unlockedWorlds));
        merged.unlockedCharacters = Array.from(new Set(saved.unlockedCharacters || def.unlockedCharacters));
        merged.unlockedHats = Array.from(new Set(saved.unlockedHats || def.unlockedHats));
        merged.unlockedSkins = Array.from(new Set(saved.unlockedSkins || def.unlockedSkins));
        merged.unlockedTrails = Array.from(new Set(saved.unlockedTrails || def.unlockedTrails));

        return merged;
    }

    checkMissionsRefresh() {
        const today = new Date().toDateString();
        const currentWeek = this.getWeekId();

        if (this.data.missions.lastDailyRefresh !== today) {
            this.data.missions.daily = this.generateDailyMissions();
            this.data.missions.lastDailyRefresh = today;
            this.save();
        }

        if (this.data.missions.lastWeeklyRefresh !== currentWeek) {
            this.data.missions.weekly = this.generateWeeklyMissions();
            this.data.missions.lastWeeklyRefresh = currentWeek;
            this.save();
        }
    }

    // --- Currencies & Progression Helpers ---

    addCoins(amount) {
        if (amount <= 0) return;
        this.data.coins += Math.floor(amount);
        this.data.stats.totalCoins += Math.floor(amount);
        this.checkAchievement('totalCoins', this.data.stats.totalCoins);
        this.save();
        events.emit('currency:coinsChanged', this.data.coins);
    }

    spendCoins(amount) {
        if (amount <= 0) return true;
        if (this.data.coins < amount) return false;
        this.data.coins -= Math.floor(amount);
        this.save();
        events.emit('currency:coinsChanged', this.data.coins);
        return true;
    }

    addGems(amount) {
        if (amount <= 0) return;
        this.data.gems += Math.floor(amount);
        this.save();
        events.emit('currency:gemsChanged', this.data.gems);
    }

    spendGems(amount) {
        if (amount <= 0) return true;
        if (this.data.gems < amount) return false;
        this.data.gems -= Math.floor(amount);
        this.save();
        events.emit('currency:gemsChanged', this.data.gems);
        return true;
    }

    addXp(amount) {
        if (amount <= 0) return;
        this.data.xp += Math.floor(amount);
        let leveledUp = false;

        let needed = GAME_CONFIG.PROGRESSION.getXpForLevel(this.data.level);
        while (this.data.xp >= needed && this.data.level < GAME_CONFIG.PROGRESSION.MAX_LEVEL) {
            this.data.xp -= needed;
            this.data.level += 1;
            leveledUp = true;
            needed = GAME_CONFIG.PROGRESSION.getXpForLevel(this.data.level);

            // Grant level up rewards
            const bonusCoins = this.data.level * 100;
            const bonusGems = (this.data.level % 5 === 0) ? 10 : 2;
            this.data.coins += bonusCoins;
            this.data.gems += bonusGems;

            events.emit('player:leveledUp', {
                level: this.data.level,
                bonusCoins,
                bonusGems
            });
            this.checkAchievement('level', this.data.level);
        }

        this.save();
        events.emit('player:xpChanged', {
            level: this.data.level,
            xp: this.data.xp,
            needed: needed,
            leveledUp
        });
    }

    updateStat(key, value, isCumulative = true) {
        if (this.data.stats[key] === undefined) {
            this.data.stats[key] = 0;
        }

        if (isCumulative) {
            this.data.stats[key] += value;
        } else {
            this.data.stats[key] = Math.max(this.data.stats[key], value);
        }

        this.checkAchievement(key, this.data.stats[key]);
        this.updateMissionProgress(key, value);
    }

    updateMissionProgress(type, amount) {
        let changed = false;
        const checkList = [...this.data.missions.daily, ...this.data.missions.weekly];

        for (const mission of checkList) {
            if (mission.type === type && !mission.completed) {
                mission.progress = Math.min(mission.target, mission.progress + amount);
                if (mission.progress >= mission.target) {
                    mission.completed = true;
                    events.emit('mission:completed', mission);
                }
                changed = true;
            }
        }

        if (changed) {
            this.save();
            events.emit('missions:updated', this.data.missions);
        }
    }

    checkAchievement(statKey, currentValue) {
        for (const ach of ACHIEVEMENTS) {
            if (ach.statKey === statKey) {
                const userAch = this.data.achievements[ach.id];
                if (userAch && !userAch.unlocked) {
                    userAch.progress = currentValue;
                    if (currentValue >= ach.target) {
                        userAch.unlocked = true;
                        events.emit('achievement:unlocked', ach);
                    }
                }
            }
        }
    }

    claimAchievement(achId) {
        const achDef = ACHIEVEMENTS.find(a => a.id === achId);
        const userAch = this.data.achievements[achId];
        if (!achDef || !userAch || !userAch.unlocked || userAch.claimed) {
            return false;
        }

        userAch.claimed = true;
        this.addCoins(achDef.rewardCoins);
        this.addGems(achDef.rewardGems);
        this.save();
        return true;
    }

    exportSaveData() {
        return JSON.stringify(this.data, null, 2);
    }

    importSaveData(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON format');
            this.data = this.mergeWithDefault(parsed, this.data.username);
            this.save();
            return { success: true, message: 'Game data imported successfully!' };
        } catch (e) {
            return { success: false, message: 'Failed to import: ' + e.message };
        }
    }

    resetAllData() {
        this.data = this.getDefaultSaveData(this.data.username);
        this.save();
        events.emit('save:reset');
    }
}
