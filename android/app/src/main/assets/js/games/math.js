// Game 1: Math Galaxy - Counting, Addition, Subtraction & Space Math
class MathGalaxyGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.streak = 0;
        this.currentRound = 0;
        this.totalRounds = 8;
        this.currentProblem = null;
        this.mode = 'auto'; // 'counting', 'addition', 'subtraction', 'multiplication'
    }

    start() {
        this.score = 0;
        this.streak = 0;
        this.currentRound = 0;
        this.renderShell();
        this.nextRound();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board math-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="math-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Mission:</span>
                            <div class="progress-track">
                                <div class="progress-fill" id="math-progress" style="width: 0%"></div>
                            </div>
                            <span id="math-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="math-stars">0</strong></span>
                        <span class="stat-badge flame">🔥 <strong id="math-streak">0</strong></span>
                    </div>
                </div>

                <div class="space-scene">
                    <div class="twinkling-stars"></div>
                    <div class="rocket-ship" id="player-rocket">🚀</div>
                    
                    <div class="math-question-card" id="math-card">
                        <div class="question-header">
                            <span class="mode-tag" id="math-mode-tag">Counting Stars</span>
                            <button class="speech-repeat-btn" id="math-speaker-btn" title="Hear Question">🔊</button>
                        </div>
                        <div class="question-content" id="math-prompt-area"></div>
                        <div class="math-options-grid" id="math-options-grid"></div>
                    </div>

                    <div class="feedback-banner" id="math-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('math-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('math-speaker-btn').addEventListener('click', () => {
            if (this.currentProblem) {
                window.audioEngine.speak(this.currentProblem.spokenPrompt);
            }
        });
    }

    generateProblem() {
        const ageGroup = window.appState.data.ageGroup;
        let type = 'counting';

        if (ageGroup === 'toddler') {
            type = Math.random() > 0.3 ? 'counting' : 'word_toddler';
        } else if (ageGroup === 'explorer') {
            const rand = Math.random();
            type = rand < 0.35 ? 'addition' : (rand < 0.7 ? 'subtraction' : 'word_explorer');
        } else {
            // Master mode (9+)
            const rand = Math.random();
            type = rand < 0.3 ? 'addition_hard' : (rand < 0.6 ? 'subtraction_hard' : (rand < 0.8 ? 'multiplication' : 'word_master'));
        }

        const emojis = ['⭐', '🪐', '🚀', '👽', '🍎', '🍓', '🎈', '🐠'];
        const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        if (type.startsWith('word_')) {
            const wordStories = {
                word_toddler: [
                    { q: 'Leo has 3 shiny stars ⭐. He finds 2 more. How many stars in all?', a: 5, v: '⭐⭐⭐ + ⭐⭐' },
                    { q: 'There are 4 friendly ducks 🦆 swimming. 1 duck waddles away. How many remain?', a: 3, v: '🦆🦆🦆🦆 - 🦆' },
                    { q: 'A space puppy has 2 bones 🦴. His friend gives him 2 more. How many total?', a: 4, v: '🦴🦴 + 🦴🦴' },
                    { q: '5 colorful balloons 🎈 float in the sky. 2 pop! How many balloons are left?', a: 3, v: '🎈🎈🎈🎈🎈 - 🎈🎈' }
                ],
                word_explorer: [
                    { q: 'An astronaut has 8 energy crystals 💎 on Mars. She discovers 6 more inside a crater. How many crystals does she have?', a: 14, v: '8 💎 + 6 💎 = ?' },
                    { q: '15 space monkeys 🐒 were playing on the space station. 7 took a mini-shuttle to Earth. How many are still on the station?', a: 8, v: '15 🐒 - 7 🐒 = ?' },
                    { q: 'A robot factory builds 4 robot dogs 🤖 every hour. How many robot dogs will they build in 3 hours?', a: 12, v: '4 × 3 = ?' },
                    { q: 'A rocket has 20 fuel canisters. It burns 11 canisters on liftoff. How many canisters are left for the journey?', a: 9, v: '20 - 11 = ?' }
                ],
                word_master: [
                    { q: 'A galaxy shuttle travels 8 light-years every hour. How many light-years will it travel in 7 hours of hyperdrive?', a: 56, v: '8 × 7 = ?' },
                    { q: 'Commander Zara has 48 solar batteries 🔋. She splits them equally among 6 exploration rovers. How many batteries does each rover get?', a: 8, v: '48 ÷ 6 = ?' },
                    { q: 'A space farm harvests 35 cosmic apples 🍏 on Monday and 28 on Tuesday. How many cosmic apples did they harvest in total?', a: 63, v: '35 + 28 = ?' },
                    { q: 'A spacecraft started with 75 oxygen tanks. After a long mission, 39 tanks remain. How many tanks were used?', a: 36, v: '75 - 39 = ?' }
                ]
            };

            const pool = wordStories[type] || wordStories.word_explorer;
            const chosen = pool[Math.floor(Math.random() * pool.length)];

            const options = new Set([chosen.a]);
            while (options.size < 4) {
                const opt = Math.max(1, chosen.a + Math.floor(Math.random() * 9) - 4);
                options.add(opt);
            }

            return {
                type: 'word_problem',
                tag: 'Space Story Math',
                spokenPrompt: chosen.q,
                htmlContent: `
                    <div class="prompt-text story-math-text" style="font-size: 1.15rem; line-height: 1.5; font-weight: 800; color: #1E293B;">${chosen.q}</div>
                    <div class="visual-hint" style="margin-top: 10px; font-weight: 700; color: #6366F1;">Hint: ${chosen.v}</div>
                `,
                answer: chosen.a,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            };
        }

        if (type === 'counting') {
            const count = Math.floor(Math.random() * 8) + 1; // 1 to 8
            const promptVisual = Array(count).fill(`<span class="bounce-item" style="animation-delay: ${Math.random()*0.5}s">${chosenEmoji}</span>`).join('');
            
            // Generate options
            const options = new Set([count]);
            while (options.size < 4) {
                const opt = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
                options.add(opt);
            }

            return {
                type: 'counting',
                tag: 'Count the Items!',
                spokenPrompt: `How many are there? Count them!`,
                htmlContent: `
                    <div class="visual-items-container">${promptVisual}</div>
                    <div class="prompt-text">How many can you count?</div>
                `,
                answer: count,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            };
        } 
        
        if (type === 'addition') {
            const a = Math.floor(Math.random() * 9) + 1;
            const b = Math.floor(Math.random() * 9) + 1;
            const ans = a + b;

            const visualA = Array(a).fill(chosenEmoji).join(' ');
            const visualB = Array(b).fill(chosenEmoji).join(' ');

            const options = new Set([ans]);
            while (options.size < 4) {
                const opt = Math.max(1, ans + Math.floor(Math.random() * 7) - 3);
                options.add(opt);
            }

            return {
                type: 'addition',
                tag: 'Space Addition',
                spokenPrompt: `What is ${a} plus ${b}?`,
                htmlContent: `
                    <div class="math-equation">${a} + ${b} = ?</div>
                    <div class="visual-hint">(${visualA}) + (${visualB})</div>
                `,
                answer: ans,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            };
        }

        if (type === 'subtraction') {
            const b = Math.floor(Math.random() * 8) + 1;
            const a = b + Math.floor(Math.random() * 8) + 1; // ensures a > b
            const ans = a - b;

            const options = new Set([ans]);
            while (options.size < 4) {
                const opt = Math.max(0, ans + Math.floor(Math.random() * 7) - 3);
                options.add(opt);
            }

            return {
                type: 'subtraction',
                tag: 'Space Subtraction',
                spokenPrompt: `What is ${a} minus ${b}?`,
                htmlContent: `
                    <div class="math-equation">${a} - ${b} = ?</div>
                    <div class="prompt-text">If you have ${a} and take away ${b}, how many are left?</div>
                `,
                answer: ans,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            };
        }

        if (type === 'multiplication') {
            const a = Math.floor(Math.random() * 8) + 2;
            const b = Math.floor(Math.random() * 8) + 2;
            const ans = a * b;

            const options = new Set([ans]);
            while (options.size < 4) {
                const opt = Math.max(2, ans + (Math.floor(Math.random() * 9) - 4) * (Math.random() > 0.5 ? a : b));
                options.add(opt);
            }

            return {
                type: 'multiplication',
                tag: 'Asteroid Multiplication',
                spokenPrompt: `What is ${a} times ${b}?`,
                htmlContent: `
                    <div class="math-equation">${a} × ${b} = ?</div>
                    <div class="prompt-text">${a} groups of ${b}</div>
                `,
                answer: ans,
                options: Array.from(options).sort(() => Math.random() - 0.5)
            };
        }

        // Harder addition/subtraction for Master level
        const a = Math.floor(Math.random() * 30) + 10;
        const b = Math.floor(Math.random() * 25) + 5;
        const ans = a + b;
        const options = new Set([ans]);
        while (options.size < 4) {
            const opt = Math.max(1, ans + Math.floor(Math.random() * 11) - 5);
            options.add(opt);
        }

        return {
            type: 'addition_hard',
            tag: 'Cosmic Mental Math',
            spokenPrompt: `What is ${a} plus ${b}?`,
            htmlContent: `
                <div class="math-equation">${a} + ${b} = ?</div>
            `,
            answer: ans,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        };
    }

    nextRound() {
        if (this.currentRound >= this.totalRounds) {
            this.finishMission();
            return;
        }

        this.currentRound++;
        document.getElementById('math-round-indicator').textContent = `${this.currentRound}/${this.totalRounds}`;
        const pct = ((this.currentRound - 1) / this.totalRounds) * 100;
        document.getElementById('math-progress').style.width = `${pct}%`;

        this.currentProblem = this.generateProblem();
        document.getElementById('math-mode-tag').textContent = this.currentProblem.tag;
        document.getElementById('math-prompt-area').innerHTML = this.currentProblem.htmlContent;

        const optionsGrid = document.getElementById('math-options-grid');
        optionsGrid.innerHTML = '';

        this.currentProblem.options.forEach(optVal => {
            const btn = document.createElement('button');
            btn.className = 'math-choice-btn bounce-hover';
            btn.textContent = optVal;
            btn.onclick = () => this.handleAnswer(optVal, btn);
            optionsGrid.appendChild(btn);
        });

        // Speak question if speech is enabled
        window.audioEngine.speak(this.currentProblem.spokenPrompt);
    }

    handleAnswer(selectedVal, btnElement) {
        const isCorrect = selectedVal === this.currentProblem.answer;
        const feedback = document.getElementById('math-feedback');
        const rocket = document.getElementById('player-rocket');

        // Disable all option buttons momentarily
        const allBtns = document.querySelectorAll('.math-choice-btn');
        allBtns.forEach(b => b.disabled = true);

        if (isCorrect) {
            btnElement.classList.add('correct-choice');
            window.audioEngine.playCorrect();
            this.score += 10;
            this.streak++;
            window.appState.addStars(1);

            // Animate rocket boost
            rocket.classList.add('rocket-boost');
            setTimeout(() => rocket.classList.remove('rocket-boost'), 800);

            const cheers = ['Awesome!', 'Super!', 'Brilliant!', 'Great Job!', 'Rocket Power!'];
            const cheer = cheers[Math.floor(Math.random() * cheers.length)];
            feedback.innerHTML = `🌟 <strong>${cheer}</strong> +1 Star!`;
            feedback.className = 'feedback-banner show-success';

            window.audioEngine.speak(cheer);

            // Confetti burst for streaks
            if (this.streak >= 3) {
                const rect = btnElement.getBoundingClientRect();
                window.confettiEngine.burst(rect.x + rect.width / 2, rect.y + rect.height / 2, 25);
            }
        } else {
            btnElement.classList.add('wrong-choice');
            window.audioEngine.playWrong();
            this.streak = 0;

            // Highlight the right answer
            allBtns.forEach(b => {
                if (parseInt(b.textContent, 10) === this.currentProblem.answer) {
                    b.classList.add('reveal-correct');
                }
            });

            feedback.innerHTML = `Keep going! The answer is <strong>${this.currentProblem.answer}</strong>`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`It is ${this.currentProblem.answer}! Try the next one!`);
        }

        document.getElementById('math-stars').textContent = window.appState.data.stars;
        document.getElementById('math-streak').textContent = this.streak;

        setTimeout(() => {
            feedback.className = 'feedback-banner';
            this.nextRound();
        }, 1800);
    }

    finishMission() {
        document.getElementById('math-progress').style.width = '100%';
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.unlockBadge('math_wizard');
        window.appState.updateHighScore('math', this.score);
        const bonusStars = Math.max(3, Math.floor(this.score / 15));
        window.appState.addStars(bonusStars);

        const card = document.getElementById('math-card');
        card.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🚀</div>
                <h2>Mission Accomplished!</h2>
                <p class="mission-subtitle">You traveled through Math Galaxy like a superstar!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +${bonusStars} Bonus Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="math-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="math-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Mission accomplished! You scored ${this.score} points and earned bonus stars!`);

        document.getElementById('math-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('math-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
