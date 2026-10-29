// Game 14: AI Pattern Detective (Inductive AI Sequence Extrapolator)
// Teaches pattern recognition, sequential logic, geometric rotation, and algorithmic thinking!
class AIPatternDetectiveGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 6;
        this.currentChallenge = null;
        this.streak = 0;

        this.challengePool = {
            toddler: [
                {
                    ruleName: 'Alternating Color Pattern (AB-AB)',
                    sequence: ['🔴', '🔵', '🔴', '🔵', '❓'],
                    answer: '🔴',
                    distractors: ['🔵', '🟡', '🟢'],
                    hint: 'Red, Blue, Red, Blue... what comes next?',
                    aiInsight: 'Scout AI recognized an AB-AB alternating color sequence with 98% confidence!'
                },
                {
                    ruleName: 'Fruit Repetition Pattern (AAB-AAB)',
                    sequence: ['🍎', '🍎', '🍌', '🍎', '🍎', '❓'],
                    answer: '🍌',
                    distractors: ['🍎', '🍇', '🍓'],
                    hint: 'Two apples, one banana... two apples, then...?',
                    aiInsight: 'Scout AI identified an AAB grouping pattern!'
                },
                {
                    ruleName: 'Day & Night Pattern (AB-AB)',
                    sequence: ['☀️', '🌙', '☀️', '🌙', '❓'],
                    answer: '☀️',
                    distractors: ['🌙', '⭐', '☁️'],
                    hint: 'Sun, Moon, Sun, Moon... what rises next?',
                    aiInsight: 'Scout AI modeled the diurnal Earth rotation cycle!'
                },
                {
                    ruleName: 'Animal Chorus Pattern (ABC-ABC)',
                    sequence: ['🐱', '🐶', '🐸', '🐱', '🐶', '❓'],
                    answer: '🐸',
                    distractors: ['🐱', '🐶', '🦁'],
                    hint: 'Cat, Dog, Frog... Cat, Dog, then...?',
                    aiInsight: 'Scout AI tracked a 3-element cyclic permutation!'
                },
                {
                    ruleName: 'Simple Counting Growth (1, 2, 3, 4)',
                    sequence: ['⭐', '⭐⭐', '⭐⭐⭐', '❓'],
                    answer: '⭐⭐⭐⭐',
                    distractors: ['⭐', '⭐⭐', '⭐⭐⭐⭐⭐'],
                    hint: '1 star, 2 stars, 3 stars... count the next step!',
                    aiInsight: 'Scout AI detected a linear +1 arithmetic progression!'
                }
            ],
            explorer: [
                {
                    ruleName: 'Geometric Direction Rotation (90° CW)',
                    sequence: ['⬆️', '➡️', '⬇️', '❓'],
                    answer: '⬅️',
                    distractors: ['⬆️', '↗️', '⬇️'],
                    hint: 'The arrow is turning clockwise like a clock hand!',
                    aiInsight: 'Scout AI computed angular rotation matrix (+90 degrees clockwise)!'
                },
                {
                    ruleName: 'Arithmetic Step Pattern (+3)',
                    sequence: ['3', '6', '9', '12', '❓'],
                    answer: '15',
                    distractors: ['14', '16', '18'],
                    hint: 'Skip counting by 3s: 3, 6, 9, 12...?',
                    aiInsight: 'Scout AI identified constant step function f(n) = 3n!'
                },
                {
                    ruleName: 'Growing Nested Pattern (A-B-AA-BB-AAA)',
                    sequence: ['🔵', '🔺', '🔵🔵', '🔺🔺', '🔵🔵🔵', '❓'],
                    answer: '🔺🔺🔺',
                    distractors: ['🔺', '🔵', '🔺🔺'],
                    hint: '1 circle, 1 triangle, 2 circles, 2 triangles, 3 circles...?',
                    aiInsight: 'Scout AI extrapolated inductive nested cardinality!'
                },
                {
                    ruleName: 'Shape Side Progression (3, 4, 5, 6 sides)',
                    sequence: ['🔺 (3)', '🟦 (4)', '⬠ (5)', '❓'],
                    answer: '⬡ (6)',
                    distractors: ['⭕ (0)', '🔺 (3)', '⭐ (10)'],
                    hint: 'Triangle (3 sides), Square (4 sides), Pentagon (5 sides)... next has 6 sides!',
                    aiInsight: 'Scout AI detected geometric polygon edge incrementation!'
                },
                {
                    ruleName: 'Even Number Sequence (+2)',
                    sequence: ['4', '6', '8', '10', '❓'],
                    answer: '12',
                    distractors: ['11', '13', '14'],
                    hint: 'Even numbers hopping by 2!',
                    aiInsight: 'Scout AI verified even parity continuation modulo 2 = 0!'
                },
                {
                    ruleName: 'Color Spectrum Flow',
                    sequence: ['🔴 Red', '🟠 Orange', '🟡 Yellow', '🟢 Green', '❓'],
                    answer: '🔵 Blue',
                    distractors: ['🟣 Purple', '⚫ Black', '⚪ White'],
                    hint: 'Colors of the rainbow: Red, Orange, Yellow, Green... what comes next?',
                    aiInsight: 'Scout AI recognized optical wavelength frequency ordering!'
                }
            ],
            master: [
                {
                    ruleName: 'Exponential Doubling Progression (2^n)',
                    sequence: ['2', '4', '8', '16', '32', '❓'],
                    answer: '64',
                    distractors: ['48', '56', '60'],
                    hint: 'Each number doubles! 32 × 2 = ?',
                    aiInsight: 'Scout AI verified geometric exponential series f(n) = 2^n with 100% confidence!'
                },
                {
                    ruleName: 'Fibonacci Sequence (Sum of Previous Two)',
                    sequence: ['1', '1', '2', '3', '5', '8', '❓'],
                    answer: '13',
                    distractors: ['11', '12', '14'],
                    hint: 'Add the last two numbers: 5 + 8 = ?',
                    aiInsight: 'Scout AI identified the famous natural Fibonacci recurrence relation!'
                },
                {
                    ruleName: 'Square Numbers Sequence (n²)',
                    sequence: ['1', '4', '9', '16', '25', '❓'],
                    answer: '36',
                    distractors: ['30', '35', '49'],
                    hint: '1×1, 2×2, 3×3, 4×4, 5×5... next is 6×6!',
                    aiInsight: 'Scout AI calculated quadratic second-degree polynomial difference Δ²=2!'
                },
                {
                    ruleName: 'Alternating Operation (+5, -2, +5, -2)',
                    sequence: ['5', '10', '8', '13', '11', '16', '❓'],
                    answer: '14',
                    distractors: ['15', '21', '18'],
                    hint: 'Add 5, then minus 2... 16 minus 2 = ?',
                    aiInsight: 'Scout AI solved dual-phase oscillating step algorithm!'
                },
                {
                    ruleName: 'Prime Numbers Sequence',
                    sequence: ['2', '3', '5', '7', '11', '13', '❓'],
                    answer: '17',
                    distractors: ['15', '19', '21'],
                    hint: 'Numbers that can only be divided by 1 and themselves!',
                    aiInsight: 'Scout AI verified prime distribution sieve theory!'
                }
            ]
        };
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.streak = 0;
        const tier = window.appState.data.ageGroup;
        const pool = this.challengePool[tier] || this.challengePool.explorer;
        this.selectedChallenges = [...pool].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);

        this.renderShell();
        this.nextChallenge();
    }

    destroy() {
        // Cleanup if any timers exist
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board ai-pattern-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="pattern-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Pattern Detective:</span>
                            <span id="pattern-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge flame">🔥 <strong id="pattern-streak">0</strong></span>
                        <span class="stat-badge">⭐ <strong id="pattern-stars">${window.appState.data.stars}</strong></span>
                    </div>
                </div>

                <div class="pattern-scene">
                    <div class="pattern-ai-header">
                        <div class="pattern-bot-icon">🔍🤖</div>
                        <div class="pattern-ai-info">
                            <span class="pattern-model-tag">Scout AI Neural Pattern Recognizer</span>
                            <h2 class="pattern-rule-title" id="pattern-rule-title">Detecting Sequence Logic...</h2>
                        </div>
                        <button class="speech-repeat-btn" id="pattern-speak-btn" title="Hear Pattern">🔊</button>
                    </div>

                    <!-- Main Sequence Display Box -->
                    <div class="sequence-display-card" id="sequence-display-card">
                        <div class="sequence-items-row" id="sequence-items-row">
                            <!-- Items injected dynamically -->
                        </div>
                        <div class="ai-rule-scanner" id="ai-rule-scanner">
                            <span class="scanner-dot"></span>
                            <span id="scanner-status-text">AI Scanner Analyzing Sequence Vector...</span>
                        </div>
                    </div>

                    <!-- Options Grid -->
                    <div class="pattern-options-area">
                        <div class="options-prompt">Tap the missing piece that completes the pattern:</div>
                        <div class="pattern-options-grid" id="pattern-options-grid">
                            <!-- Options injected dynamically -->
                        </div>
                    </div>

                    <div class="feedback-banner" id="pattern-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('pattern-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('pattern-speak-btn').addEventListener('click', () => {
            if (this.currentChallenge) {
                window.audioEngine.speak(`${this.currentChallenge.hint} What piece comes next?`);
            }
        });
    }

    nextChallenge() {
        if (this.round >= this.totalRounds) {
            this.finishMission();
            return;
        }

        this.round++;
        this.currentChallenge = this.selectedChallenges[this.round - 1];

        document.getElementById('pattern-round-indicator').textContent = `${this.round}/${this.totalRounds}`;
        document.getElementById('pattern-rule-title').textContent = this.currentChallenge.ruleName;

        const seqRow = document.getElementById('sequence-items-row');
        seqRow.innerHTML = this.currentChallenge.sequence.map((item, idx) => `
            <div class="sequence-node ${item === '❓' ? 'target-node' : ''}" style="animation-delay: ${idx * 0.1}s">
                <span class="node-content">${item}</span>
                <span class="node-index">Step ${idx + 1}</span>
            </div>
        `).join('');

        const scannerText = document.getElementById('scanner-status-text');
        scannerText.textContent = `Scout AI: "${this.currentChallenge.hint}"`;

        // Generate choices
        const allOptions = [this.currentChallenge.answer, ...this.currentChallenge.distractors].sort(() => Math.random() - 0.5);

        const optionsGrid = document.getElementById('pattern-options-grid');
        optionsGrid.innerHTML = allOptions.map(opt => `
            <button class="pattern-option-btn bounce-hover" data-value="${opt}">
                <span class="option-text">${opt}</span>
            </button>
        `).join('');

        optionsGrid.querySelectorAll('.pattern-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChoice(btn.dataset.value, btn);
            });
        });

        window.audioEngine.speak(this.currentChallenge.hint);
    }

    handleChoice(chosen, buttonElement) {
        const isCorrect = chosen === this.currentChallenge.answer;
        const feedback = document.getElementById('pattern-feedback');

        if (isCorrect) {
            window.audioEngine.playCorrect();
            window.audioEngine.playDing();
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 45);

            this.score += 25;
            this.streak++;
            window.appState.addStars(3);

            document.getElementById('pattern-streak').textContent = this.streak;
            document.getElementById('pattern-stars').textContent = window.appState.data.stars;

            // Update target node with solved answer
            const targetNode = document.querySelector('.target-node .node-content');
            if (targetNode) {
                targetNode.textContent = chosen;
                targetNode.parentElement.classList.add('solved-node');
            }

            buttonElement.classList.add('correct-glow');

            feedback.innerHTML = `🌟 <strong>Pattern Decoded!</strong> ${this.currentChallenge.aiInsight}`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak(`Pattern solved! ${this.currentChallenge.aiInsight}`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextChallenge();
            }, 2400);
        } else {
            window.audioEngine.playWrong();
            this.streak = 0;
            document.getElementById('pattern-streak').textContent = this.streak;

            buttonElement.classList.add('wrong-shake');
            setTimeout(() => buttonElement.classList.remove('wrong-shake'), 600);

            feedback.innerHTML = `Not quite! ${this.currentChallenge.hint}`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`Not quite! Remember: ${this.currentChallenge.hint}`);
        }
    }

    finishMission() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
        window.appState.addStars(6);

        const scene = document.querySelector('.pattern-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🔍🤖</div>
                <h2>AI Pattern Master!</h2>
                <p class="mission-subtitle">You solved complex visual and mathematical sequences with Scout AI!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +6 Pattern Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                    <div class="reward-item">🧠 IQ Logic Bonus Unlocked!</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="pattern-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="pattern-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Outstanding detective work! You decoded all pattern sequences!`);

        document.getElementById('pattern-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('pattern-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
