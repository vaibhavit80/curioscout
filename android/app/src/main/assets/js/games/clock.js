// Game 9: Chrono-Clock & Time Traveler
// Teaches analog clock reading, minute/hour hands, elapsed time, and daily routines
class ChronoClockGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.currentRound = 0;
        this.totalRounds = 6;
        this.currentHour = 8;
        this.currentMinute = 0;
        this.targetTime = { hour: 8, minute: 0, period: 'AM', routine: 'School Bus', icon: '🚌' };

        this.routines = [
            { hour: 7, minute: 0, period: 'AM', routine: 'Wake Up & Pancakes', icon: '🥞', tip: 'Set the clock to 7:00 AM!' },
            { hour: 8, minute: 30, period: 'AM', routine: 'School Bus Ride', icon: '🚌', tip: 'Set the clock to 8:30 AM!' },
            { hour: 12, minute: 0, period: 'PM', routine: 'Noon Lunch Time', icon: '🥪', tip: 'Set the clock to 12:00 PM!' },
            { hour: 3, minute: 15, period: 'PM', routine: 'Playground Fun', icon: '⚽', tip: 'Set the clock to 3:15 PM!' },
            { hour: 6, minute: 45, period: 'PM', routine: 'Family Dinner', icon: '🍝', tip: 'Set the clock to 6:45 PM!' },
            { hour: 8, minute: 0, period: 'PM', routine: 'Bedtime Story', icon: '🌙', tip: 'Set the clock to 8:00 PM!' }
        ];
    }

    start() {
        this.score = 0;
        this.currentRound = 0;
        this.shuffledRoutines = [...this.routines].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);
        this.renderShell();
        this.nextRound();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board clock-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="clock-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Time Quest:</span>
                            <span id="clock-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="clock-stars">0</strong></span>
                    </div>
                </div>

                <div class="clock-scene" id="clock-scene-bg">
                    <!-- Left: Day/Night Routine Window -->
                    <div class="routine-window-card">
                        <div class="routine-icon" id="routine-icon">🥞</div>
                        <h3 class="routine-title" id="routine-title">Wake Up & Pancakes</h3>
                        <div class="target-time-badge" id="target-time-display">
                            Target: <strong>7:00 AM</strong>
                        </div>
                        <button class="safari-sound-btn" id="clock-speak-task-btn">
                            🔊 Hear Mission
                        </button>
                    </div>

                    <!-- Center: Interactive Analog Clock -->
                    <div class="analog-clock-container">
                        <div class="clock-face" id="clock-face">
                            <!-- Clock Numerals 1-12 -->
                            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                                const angle = (n * 30) - 90;
                                const rad = (angle * Math.PI) / 180;
                                const x = 120 + 95 * Math.cos(rad);
                                const y = 120 + 95 * Math.sin(rad);
                                return `<span class="clock-numeral" style="left: ${x}px; top: ${y}px;">${n}</span>`;
                            }).join('')}

                            <!-- Hands -->
                            <div class="clock-hand hour-hand" id="hour-hand"></div>
                            <div class="clock-hand minute-hand" id="minute-hand"></div>
                            <div class="clock-center-pin"></div>
                        </div>

                        <!-- Digital Display of User Current Setting -->
                        <div class="current-time-readout">
                            Your Clock: <span id="user-digital-time">8:00</span> 
                            <button class="period-toggle-btn" id="period-toggle-btn">AM</button>
                        </div>

                        <!-- Stepper Adjustment Controls -->
                        <div class="clock-adjust-controls">
                            <div class="adjust-group">
                                <span class="adjust-label">Hour:</span>
                                <button class="stepper-btn" id="hour-down-btn">-1 Hr</button>
                                <button class="stepper-btn" id="hour-up-btn">+1 Hr</button>
                            </div>
                            <div class="adjust-group">
                                <span class="adjust-label">Minutes:</span>
                                <button class="stepper-btn" id="min-down-btn">-15 M</button>
                                <button class="stepper-btn" id="min-up-btn">+15 M</button>
                            </div>
                        </div>

                        <button class="primary-btn check-time-btn" id="check-time-btn">
                            ✅ Check My Clock!
                        </button>
                    </div>

                    <div class="feedback-banner" id="clock-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('clock-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('clock-speak-task-btn').addEventListener('click', () => {
            const minStr = this.targetTime.minute === 0 ? "o'clock" : this.targetTime.minute;
            window.audioEngine.speak(`Can you set the clock to ${this.targetTime.hour} ${minStr} ${this.targetTime.period} for ${this.targetTime.routine}?`);
        });

        document.getElementById('hour-up-btn').addEventListener('click', () => this.adjustTime(1, 0));
        document.getElementById('hour-down-btn').addEventListener('click', () => this.adjustTime(-1, 0));
        document.getElementById('min-up-btn').addEventListener('click', () => this.adjustTime(0, 15));
        document.getElementById('min-down-btn').addEventListener('click', () => this.adjustTime(0, -15));

        document.getElementById('period-toggle-btn').addEventListener('click', () => {
            window.audioEngine.playTick();
            this.currentPeriod = this.currentPeriod === 'AM' ? 'PM' : 'AM';
            document.getElementById('period-toggle-btn').textContent = this.currentPeriod;
            this.updateSkyBackground();
        });

        document.getElementById('check-time-btn').addEventListener('click', () => {
            this.verifyAnswer();
        });
    }

    nextRound() {
        if (this.currentRound >= this.totalRounds) {
            this.finishGame();
            return;
        }

        this.currentRound++;
        document.getElementById('clock-round-indicator').textContent = `${this.currentRound}/${this.totalRounds}`;

        this.targetTime = this.shuffledRoutines[this.currentRound - 1];

        document.getElementById('routine-icon').textContent = this.targetTime.icon;
        document.getElementById('routine-title').textContent = this.targetTime.routine;
        const padMin = this.targetTime.minute < 10 ? `0${this.targetTime.minute}` : this.targetTime.minute;
        document.getElementById('target-time-display').innerHTML = `Target: <strong>${this.targetTime.hour}:${padMin} ${this.targetTime.period}</strong>`;

        // Start user clock at a different time
        this.currentHour = ((this.targetTime.hour + 3) % 12) || 12;
        this.currentMinute = 0;
        this.currentPeriod = 'AM';
        document.getElementById('period-toggle-btn').textContent = this.currentPeriod;

        this.updateClockHands();
        this.updateSkyBackground();

        const minSpoken = this.targetTime.minute === 0 ? "o'clock" : this.targetTime.minute;
        window.audioEngine.speak(`Set the clock to ${this.targetTime.hour} ${minSpoken} ${this.targetTime.period}!`);
    }

    adjustTime(hourDelta, minuteDelta) {
        window.audioEngine.playTick(minuteDelta !== 0);

        this.currentMinute += minuteDelta;
        if (this.currentMinute >= 60) {
            this.currentMinute = 0;
            this.currentHour = (this.currentHour % 12) + 1;
        } else if (this.currentMinute < 0) {
            this.currentMinute = 45;
            this.currentHour = this.currentHour === 1 ? 12 : this.currentHour - 1;
        }

        if (hourDelta !== 0) {
            this.currentHour += hourDelta;
            if (this.currentHour > 12) this.currentHour = 1;
            if (this.currentHour < 1) this.currentHour = 12;
        }

        this.updateClockHands();
        this.updateSkyBackground();
    }

    updateClockHands() {
        const hourDeg = (this.currentHour % 12) * 30 + (this.currentMinute * 0.5);
        const minDeg = this.currentMinute * 6;

        document.getElementById('hour-hand').style.transform = `rotate(${hourDeg}deg)`;
        document.getElementById('minute-hand').style.transform = `rotate(${minDeg}deg)`;

        const padMin = this.currentMinute < 10 ? `0${this.currentMinute}` : this.currentMinute;
        document.getElementById('user-digital-time').textContent = `${this.currentHour}:${padMin}`;
    }

    updateSkyBackground() {
        const bg = document.getElementById('clock-scene-bg');
        if (!bg) return;

        // Visual daytime/sunset/night atmosphere
        const isPM = this.currentPeriod === 'PM';
        let gradient;

        if (!isPM && (this.currentHour >= 5 && this.currentHour <= 8)) {
            gradient = 'linear-gradient(135deg, #FFE29F 0%, #FFA99F 100%)'; // Sunrise
        } else if (!isPM || (this.currentHour <= 4)) {
            gradient = 'linear-gradient(135deg, #74EBD5 0%, #9FACE6 100%)'; // Bright Day
        } else if (isPM && (this.currentHour >= 5 && this.currentHour <= 7)) {
            gradient = 'linear-gradient(135deg, #F3904F 0%, #3B4371 100%)'; // Sunset
        } else {
            gradient = 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'; // Cozy Night
        }

        bg.style.background = gradient;
    }

    verifyAnswer() {
        const isMatch = this.currentHour === this.targetTime.hour &&
                        this.currentMinute === this.targetTime.minute &&
                        this.currentPeriod === this.targetTime.period;

        const feedback = document.getElementById('clock-feedback');

        if (isMatch) {
            window.audioEngine.playCorrect();
            window.appState.addStars(2);
            this.score += 20;
            document.getElementById('clock-stars').textContent = window.appState.data.stars;
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 40);

            feedback.innerHTML = `⏰ <strong>Right on time!</strong> Perfect reading!`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak(`Right on time for ${this.targetTime.routine}!`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextRound();
            }, 2400);
        } else {
            window.audioEngine.playWrong();
            const padMin = this.targetTime.minute < 10 ? `0${this.targetTime.minute}` : this.targetTime.minute;
            feedback.innerHTML = `Look closely! Aim for ${this.targetTime.hour}:${padMin} ${this.targetTime.period}!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`Look closely at the hands and check AM or PM!`);
        }
    }

    finishGame() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.addStars(5);

        const scene = document.querySelector('.clock-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">⏰</div>
                <h2>Time Traveler Graduate!</h2>
                <p class="mission-subtitle">You read analog clocks and mastered daily schedule time!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +5 Clock Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="clock-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="clock-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Time Traveler Graduate! You can tell time like a superstar!`);

        document.getElementById('clock-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('clock-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
