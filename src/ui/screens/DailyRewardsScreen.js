/**
 * Daily Login Rewards Screen
 * 7-Day login calendar tracking consecutive streaks with escalating rewards.
 */

export class DailyRewardsScreen {
    constructor(uiManager) {
        this.ui = uiManager;
        this.rewards = [
            { day: 1, title: 'Day 1', reward: '250 Coins', coins: 250, gems: 0, xp: 0, icon: 'COINS' },
            { day: 2, title: 'Day 2', reward: '200 XP', coins: 0, gems: 0, xp: 200, icon: 'XP' },
            { day: 3, title: 'Day 3', reward: '400 Coins + 1 Revive', coins: 400, gems: 0, xp: 0, revives: 1, icon: 'REVIVE' },
            { day: 4, title: 'Day 4', reward: '600 Coins', coins: 600, gems: 0, xp: 0, icon: 'COINS' },
            { day: 5, title: 'Day 5', reward: '20 Gems', coins: 0, gems: 20, xp: 0, icon: 'GEMS' },
            { day: 6, title: 'Day 6', reward: '2 Revive Tokens', coins: 0, gems: 0, xp: 0, revives: 2, icon: 'REVIVE' },
            { day: 7, title: 'Day 7', reward: 'Solar Crown + 1,500 Coins + 35 Gems', coins: 1500, gems: 35, xp: 300, hat: 'golden_crown', icon: 'CROWN' }
        ];

        this.element = document.createElement('div');
        this.element.className = 'screen sub-screen daily-rewards-screen';
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="sub-screen-container">
                <header class="sub-header flex-between">
                    <button class="btn btn-outline btn-back" id="daily-btn-back">◀ BACK</button>
                    <h2 class="sub-title">DAILY LOGIN REWARDS</h2>
                    <div class="streak-tag-badge"><span id="daily-streak-badge">Streak: 1</span></div>
                </header>

                <main class="daily-calendar-grid" id="daily-calendar"></main>

                <div class="daily-action-box">
                    <button class="btn btn-primary btn-block btn-lg" id="btn-claim-today">CLAIM REWARD</button>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        this.element.querySelector('#daily-btn-back').onclick = () => {
            this.ui.audio.playButtonClick();
            this.ui.showScreen('main_menu');
        };

        this.element.querySelector('#btn-claim-today').onclick = () => {
            this.claimCurrentReward();
        };
    }

    claimCurrentReward() {
        const d = this.ui.save.data;
        const streak = d.dailyReward.currentStreak || 0;
        const dayIndex = streak % 7;
        const todayReward = this.rewards[dayIndex];

        if (todayReward.coins) this.ui.save.addCoins(todayReward.coins);
        if (todayReward.gems) this.ui.save.addGems(todayReward.gems);
        if (todayReward.xp) this.ui.save.addXp(todayReward.xp);
        if (todayReward.revives) d.consumables.revives += todayReward.revives;
        if (todayReward.hat && !d.unlockedHats.includes(todayReward.hat)) {
            d.unlockedHats.push(todayReward.hat);
            d.customization.hat = todayReward.hat;
        }

        d.dailyReward.currentStreak = streak + 1;
        d.dailyReward.lastClaimDate = new Date().toISOString();
        this.ui.save.updateStat('dailyStreak', d.dailyReward.currentStreak, false);
        this.ui.save.save();

        this.ui.audio.playLevelUp();
        this.ui.showToast(`Claimed ${todayReward.title}: ${todayReward.reward}!`, 'success');
        this.renderCalendar();
    }

    renderCalendar() {
        const d = this.ui.save.data;
        const streak = d.dailyReward.currentStreak || 0;
        const activeDayIndex = streak % 7;

        const lastClaim = d.dailyReward.lastClaimDate;
        let isClaimedToday = false;
        if (lastClaim) {
            isClaimedToday = new Date(lastClaim).toDateString() === new Date().toDateString();
        }

        this.element.querySelector('#daily-streak-badge').textContent = `Streak: ${streak} Days`;

        const grid = this.element.querySelector('#daily-calendar');
        grid.innerHTML = this.rewards.map((r, i) => {
            const isPast = i < activeDayIndex || (i === activeDayIndex && isClaimedToday);
            const isToday = i === activeDayIndex && !isClaimedToday;
            const isFuture = i > activeDayIndex;

            return `
                <div class="calendar-card glass-panel ${isPast ? 'claimed' : ''} ${isToday ? 'current-day' : ''} ${r.day === 7 ? 'grand-day' : ''}">
                    <div class="day-number">${r.title}</div>
                    <div class="reward-icon">${r.icon}</div>
                    <div class="reward-desc">${r.reward}</div>
                    <div class="claim-status">
                        ${isPast ? 'CLAIMED' : isToday ? 'READY' : 'LOCKED'}
                    </div>
                </div>
            `;
        }).join('');

        const claimBtn = this.element.querySelector('#btn-claim-today');
        if (isClaimedToday) {
            claimBtn.disabled = true;
            claimBtn.textContent = 'COME BACK TOMORROW';
            claimBtn.className = 'btn btn-disabled btn-block btn-lg';
        } else {
            claimBtn.disabled = false;
            claimBtn.textContent = `CLAIM ${this.rewards[activeDayIndex].title.toUpperCase()} REWARD`;
            claimBtn.className = 'btn btn-accent btn-block btn-lg pulse-glow';
        }
    }

    onShow() {
        this.renderCalendar();
    }
}
