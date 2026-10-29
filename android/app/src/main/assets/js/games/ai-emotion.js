// Game 13: AI Emotion Bot - Facial Landmark Recognition & Empathy Vision
// Upgraded with authentic Computer Vision face-mesh tracking dots, geometric landmark angles, and Softmax classification!
class AIEmotionBotGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 5;
        this.currentDilemma = null;

        // Current Face State
        this.faceState = {
            eyebrows: 'neutral', // 'neutral', 'raised', 'angry', 'sad'
            eyes: 'normal',      // 'normal', 'wide', 'sparkle'
            mouth: 'smile'       // 'smile', 'grin', 'frown', 'surprised'
        };

        this.dilemmas = [
            {
                scenario: "Leo spent an hour building a tall block tower, but the wind blew it down! How does Leo feel?",
                targetEmotion: 'Sad',
                targetState: { eyebrows: 'sad', mouth: 'frown' },
                aiInsight: "Drooping eyebrow corners (+25°) and a downturned mouth (-30px) are universal indicators of sadness."
            },
            {
                scenario: "Maya heard a sudden loud pop and saw a surprise puppy burst out of a birthday gift box!",
                targetEmotion: 'Surprised',
                targetState: { eyebrows: 'raised', mouth: 'surprised' },
                aiInsight: "High raised eyebrows (+15°) and an open circular mouth signal surprise and astonishment!"
            },
            {
                scenario: "Sam practiced soccer every single day and just scored the winning goal in the championship!",
                targetEmotion: 'Happy',
                targetState: { eyebrows: 'neutral', mouth: 'grin' },
                aiInsight: "Deep upturned mouth curvature (+45px) and bright eyes indicate triumphant joy and pride!"
            },
            {
                scenario: "Someone snatched Clara's favorite colored markers without asking while she was drawing!",
                targetEmotion: 'Frustrated',
                targetState: { eyebrows: 'angry', mouth: 'frown' },
                aiInsight: "Sharp V-angled eyebrows (-25°) and tense downturned lips signal frustration and anger."
            },
            {
                scenario: "Grandma gave Ethan a warm blanket, a cozy hug, and read him a peaceful bedtime story.",
                targetEmotion: 'Peaceful',
                targetState: { eyebrows: 'neutral', mouth: 'smile' },
                aiInsight: "Relaxed horizontal eyebrows (0°) and a gentle upturned smile (+25px) show contentment and peaceful love."
            }
        ];
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.shuffled = [...this.dilemmas].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);
        this.renderShell();
        this.nextDilemma();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board ai-emotion-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="emotion-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Empathy & Vision AI:</span>
                            <span id="emotion-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="emotion-stars">${window.appState.data.stars}</strong></span>
                    </div>
                </div>

                <div class="ai-emotion-scene">
                    <!-- Scenario Card -->
                    <div class="emotion-scenario-card" id="scenario-card">
                        <div class="scenario-text" id="scenario-text">Loading scenario...</div>
                        <button class="safari-sound-btn" id="speak-scenario-btn">🔊 Hear Story</button>
                    </div>

                    <!-- Center Area: Face with Landmark Mesh + AI Neural Scanner -->
                    <div class="emotion-lab-workspace">
                        <!-- Left: Face Stage with Mesh Points -->
                        <div class="robot-face-stage">
                            <div class="face-scanner-beam" id="scanner-beam"></div>
                            
                            <svg viewBox="0 0 200 200" class="interactive-face-svg" id="emotion-svg">
                                <!-- Head Base -->
                                <circle cx="100" cy="100" r="85" fill="#FFE0B2" stroke="#FFB74D" stroke-width="5"/>

                                <!-- Eyebrows -->
                                <g id="svg-eyebrows">
                                    <path class="eb-neutral" d="M50 65 Q70 60 85 65 M115 65 Q130 60 150 65" stroke="#5D4037" stroke-width="6" fill="none" stroke-linecap="round"/>
                                    <path class="eb-raised hidden" d="M50 48 Q70 38 85 48 M115 48 Q130 38 150 48" stroke="#5D4037" stroke-width="6" fill="none" stroke-linecap="round"/>
                                    <path class="eb-angry hidden" d="M50 55 L85 70 M115 70 L150 55" stroke="#5D4037" stroke-width="6" fill="none" stroke-linecap="round"/>
                                    <path class="eb-sad hidden" d="M50 70 L85 55 M115 55 L150 70" stroke="#5D4037" stroke-width="6" fill="none" stroke-linecap="round"/>
                                </g>

                                <!-- Eyes -->
                                <g id="svg-eyes">
                                    <circle class="eye-normal" cx="70" cy="85" r="9" fill="#2E7D32"/>
                                    <circle class="eye-normal" cx="130" cy="85" r="9" fill="#2E7D32"/>
                                    
                                    <circle class="eye-wide hidden" cx="70" cy="85" r="14" fill="#2E7D32"/>
                                    <circle class="eye-wide hidden" cx="130" cy="85" r="14" fill="#2E7D32"/>
                                    
                                    <text class="eye-sparkle hidden" x="58" y="94" font-size="24">✨</text>
                                    <text class="eye-sparkle hidden" x="118" y="94" font-size="24">✨</text>
                                </g>

                                <!-- Rosy Cheeks -->
                                <circle cx="50" cy="115" r="12" fill="#FF8A80" opacity="0.6"/>
                                <circle cx="150" cy="115" r="12" fill="#FF8A80" opacity="0.6"/>

                                <!-- Mouth Expressions -->
                                <g id="svg-mouth">
                                    <path class="mouth-smile" d="M65 130 Q100 160 135 130" stroke="#C2185B" stroke-width="7" fill="none" stroke-linecap="round"/>
                                    <path class="mouth-grin hidden" d="M60 125 Q100 175 140 125 Z" fill="#C2185B" stroke="#880E4F" stroke-width="4"/>
                                    <path class="mouth-frown hidden" d="M65 152 Q100 120 135 152" stroke="#C2185B" stroke-width="7" fill="none" stroke-linecap="round"/>
                                    <ellipse class="mouth-surprised hidden" cx="100" cy="140" rx="14" ry="20" fill="#C2185B"/>
                                </g>

                                <!-- Computer Vision Neural Mesh Landmark Dots -->
                                <g id="vision-mesh-dots" opacity="0.85">
                                    <circle cx="50" cy="65" r="3.5" fill="#00E676"/>
                                    <circle cx="85" cy="65" r="3.5" fill="#00E676"/>
                                    <circle cx="115" cy="65" r="3.5" fill="#00E676"/>
                                    <circle cx="150" cy="65" r="3.5" fill="#00E676"/>
                                    <circle cx="70" cy="85" r="3.5" fill="#00E676"/>
                                    <circle cx="130" cy="85" r="3.5" fill="#00E676"/>
                                    <circle cx="65" cy="130" r="3.5" fill="#00E676"/>
                                    <circle cx="100" cy="145" r="3.5" fill="#00E676"/>
                                    <circle cx="135" cy="130" r="3.5" fill="#00E676"/>
                                </g>
                            </svg>
                        </div>

                        <!-- Right: AI Vision Neural Classifier Readout -->
                        <div class="ai-classifier-card">
                            <h3 class="classifier-title">🤖 AI Landmark Neural Classifier</h3>
                            <div class="detection-result-pill" id="ai-detected-label">
                                Detected: <strong id="detected-emotion-name">Happy (85%) 😊</strong>
                            </div>

                            <!-- Live Landmark Metrics -->
                            <div class="landmark-metrics-row" id="landmark-metrics-row">
                                <span class="metric-tag" id="m-mouth">Mouth: +25px (Smile)</span>
                                <span class="metric-tag" id="m-brow">Brow: 0° (Neutral)</span>
                            </div>

                            <!-- Softmax Confidence Bars -->
                            <div class="confidence-bars-list" id="confidence-bars"></div>

                            <div class="ai-explain-box" id="ai-vision-explanation">
                                Upward curved mouth + neutral eyebrows indicate happiness!
                            </div>

                            <button class="primary-btn verify-emotion-btn" id="verify-emotion-btn">
                                🔍 Check Empathy Match!
                            </button>
                        </div>
                    </div>

                    <!-- Face Expression Controls -->
                    <div class="face-controls-palette">
                        <div class="feature-picker-group">
                            <span class="picker-label">Eyebrows:</span>
                            <div class="picker-btn-row">
                                <button class="f-pill-btn active" data-feature="eyebrows" data-val="neutral">Neutral 😐</button>
                                <button class="f-pill-btn" data-feature="eyebrows" data-val="raised">Raised 😲</button>
                                <button class="f-pill-btn" data-feature="eyebrows" data-val="angry">V-Shaped 😠</button>
                                <button class="f-pill-btn" data-feature="eyebrows" data-val="sad">Drooping 🥺</button>
                            </div>
                        </div>

                        <div class="feature-picker-group">
                            <span class="picker-label">Eyes:</span>
                            <div class="picker-btn-row">
                                <button class="f-pill-btn active" data-feature="eyes" data-val="normal">Normal 👀</button>
                                <button class="f-pill-btn" data-feature="eyes" data-val="wide">Wide 👁️</button>
                                <button class="f-pill-btn" data-feature="eyes" data-val="sparkle">Sparkle ✨</button>
                            </div>
                        </div>

                        <div class="feature-picker-group">
                            <span class="picker-label">Mouth:</span>
                            <div class="picker-btn-row">
                                <button class="f-pill-btn active" data-feature="mouth" data-val="smile">Smile 🙂</button>
                                <button class="f-pill-btn" data-feature="mouth" data-val="grin">Big Grin 😄</button>
                                <button class="f-pill-btn" data-feature="mouth" data-val="frown">Frown 🙁</button>
                                <button class="f-pill-btn" data-feature="mouth" data-val="surprised">Open O 😮</button>
                            </div>
                        </div>
                    </div>

                    <div class="feedback-banner" id="emotion-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('emotion-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('speak-scenario-btn').addEventListener('click', () => {
            if (this.currentDilemma) {
                window.audioEngine.speak(this.currentDilemma.scenario);
            }
        });

        document.querySelectorAll('.f-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const feat = e.currentTarget.dataset.feature;
                const val = e.currentTarget.dataset.val;
                window.audioEngine.playPop();

                this.faceState[feat] = val;

                btn.parentElement.querySelectorAll('.f-pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                this.updateSVG();
                this.runAIScanner();
            });
        });

        document.getElementById('verify-emotion-btn').addEventListener('click', () => {
            this.verifyEmotionMatch();
        });
    }

    nextDilemma() {
        if (this.round >= this.totalRounds) {
            this.finishGame();
            return;
        }

        this.round++;
        document.getElementById('emotion-round-indicator').textContent = `${this.round}/${this.totalRounds}`;
        this.currentDilemma = this.shuffled[this.round - 1];

        document.getElementById('scenario-text').textContent = this.currentDilemma.scenario;

        // Reset face to neutral
        this.faceState = { eyebrows: 'neutral', eyes: 'normal', mouth: 'smile' };
        document.querySelectorAll('.f-pill-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.f-pill-btn[data-val="neutral"], .f-pill-btn[data-val="normal"], .f-pill-btn[data-val="smile"]').forEach(b => b.classList.add('active'));

        this.updateSVG();
        this.runAIScanner();

        window.audioEngine.speak(`${this.currentDilemma.scenario} How does this character feel? Adjust the eyebrows and mouth!`);
    }

    updateSVG() {
        // Eyebrows
        document.querySelectorAll('#svg-eyebrows path').forEach(p => p.classList.add('hidden'));
        const activeEB = document.querySelector(`.eb-${this.faceState.eyebrows}`);
        if (activeEB) activeEB.classList.remove('hidden');

        // Eyes
        document.querySelectorAll('#svg-eyes .eye-normal, #svg-eyes .eye-wide, #svg-eyes .eye-sparkle').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll(`.eye-${this.faceState.eyes}`).forEach(el => el.classList.remove('hidden'));

        // Mouth
        document.querySelectorAll('#svg-mouth .mouth-smile, #svg-mouth .mouth-grin, #svg-mouth .mouth-frown, #svg-mouth .mouth-surprised').forEach(m => m.classList.add('hidden'));
        const activeMouth = document.querySelector(`.mouth-${this.faceState.mouth}`);
        if (activeMouth) activeMouth.classList.remove('hidden');
    }

    runAIScanner() {
        // Animate scanner beam
        const beam = document.getElementById('scanner-beam');
        if (beam) {
            beam.classList.add('beam-sweep');
            setTimeout(() => beam.classList.remove('beam-sweep'), 600);
        }

        // Call the mathematical landmark classifier in ScoutAI engine
        const analysis = window.scoutAI.analyzeFacialLandmarks(this.faceState);

        const labelEl = document.getElementById('detected-emotion-name');
        labelEl.textContent = `${analysis.primaryEmotion} (${analysis.confidence}%)`;

        // Update live metrics tags
        const mouthMetric = document.getElementById('m-mouth');
        const browMetric = document.getElementById('m-brow');
        if (mouthMetric && browMetric) {
            mouthMetric.textContent = `Mouth Arc: ${analysis.landmarks.mouthCurvePx > 0 ? '+' : ''}${analysis.landmarks.mouthCurvePx}px`;
            browMetric.textContent = `Brow Slope: ${analysis.landmarks.browAngleDeg}°`;
        }

        // Render calibrated Softmax probability bars
        const barsList = document.getElementById('confidence-bars');
        barsList.innerHTML = analysis.probabilities.map(p => `
            <div class="c-bar-row">
                <span class="c-bar-label">${p.emotion}</span>
                <div class="c-bar-track">
                    <div class="c-bar-fill" style="width: ${p.pct}%"></div>
                </div>
                <span class="c-bar-pct">${p.pct}%</span>
            </div>
        `).join('');

        // Explanation text
        const reasonBox = document.getElementById('ai-vision-explanation');
        reasonBox.innerHTML = `💡 <strong>Vision Analysis:</strong> ${analysis.explanation}`;
    }

    verifyEmotionMatch() {
        const target = this.currentDilemma.targetState;
        const matchEB = this.faceState.eyebrows === target.eyebrows;
        const matchMouth = (this.faceState.mouth === target.mouth) || 
                           (target.mouth === 'grin' && this.faceState.mouth === 'smile');

        const feedback = document.getElementById('emotion-feedback');

        if (matchEB && matchMouth) {
            window.audioEngine.playCorrect();
            window.appState.addStars(3);
            this.score += 25;
            document.getElementById('emotion-stars').textContent = window.appState.data.stars;
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 45);

            feedback.innerHTML = `💖 <strong>Empathy Match!</strong> ${this.currentDilemma.aiInsight}`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak(`Empathy match! ${this.currentDilemma.aiInsight}`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextDilemma();
            }, 2800);
        } else {
            window.audioEngine.playWrong();
            feedback.innerHTML = `Not quite! Check the eyebrows and mouth to match how the character feels!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Try adjusting the eyebrows or mouth to match the scenario feelings!');
        }
    }

    finishGame() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.addStars(6);

        const scene = document.querySelector('.ai-emotion-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">💖</div>
                <h2>Empathy & AI Vision Champion!</h2>
                <p class="mission-subtitle">You understood character feelings and mastered how AI recognizes facial emotion!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +6 Empathy Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="emotion-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="emotion-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Empathy and AI Vision Champion! You have great emotional intelligence!`);

        document.getElementById('emotion-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('emotion-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
