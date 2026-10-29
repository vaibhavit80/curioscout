// Game 11: AI Quick Draw - Neural Sketch Guesser
// Uses real-time geometric computer vision & AI classification to guess what kids draw!
class AISketchGuesserGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 5;
        this.targetCategory = null;
        this.isDrawing = false;
        this.isEraser = false;
        this.brushSize = 10;
        this.currentColor = '#1E293B';
        this.strokes = [];
        this.currentStroke = [];
        this.timer = 30;
        this.timerInterval = null;
        this.isRoundWon = false;
        this.classifyDebounceTimer = null;
        this.idleCheckTimer = null;
        this.autoAdvanceTimer = null;
        this._windowMouseUp = null;
        this._windowTouchEnd = null;

        this.challengePool = [
            { id: 'sun', name: 'Sun', emoji: '☀️', hint: 'Draw a circle with warm rays sticking out all around!' },
            { id: 'star', name: 'Star', emoji: '⭐', hint: 'Draw 5 sharp points or criss-cross lines!' },
            { id: 'flower', name: 'Flower', emoji: '🌸', hint: 'Draw pretty petals around a center with a stem!' },
            { id: 'fish', name: 'Fish', emoji: '🐟', hint: 'Draw an oval body pointing sideways with a pointy tail!' },
            { id: 'face', name: 'Smiley Face', emoji: '😊', hint: 'Draw a round head, two eyes, and a big happy smile!' },
            { id: 'tree', name: 'Tree', emoji: '🌲', hint: 'Draw a tall narrow trunk and leafy branches on top!' },
            { id: 'house', name: 'House', emoji: '🏠', hint: 'Draw a square wall with a pointy triangular roof!' },
            { id: 'heart', name: 'Heart', emoji: '💖', hint: 'Draw two round curves at the top that meet in a point at the bottom!' },
            { id: 'apple', name: 'Apple', emoji: '🍎', hint: 'Draw a round apple body with a little stem or leaf on top!' },
            { id: 'car', name: 'Car', emoji: '🚗', hint: 'Draw a boxy car cabin with two round wheels at the bottom!' },
            { id: 'butterfly', name: 'Butterfly', emoji: '🦋', hint: 'Draw a center body with two big fluttering wings on the sides!' },
            { id: 'sailboat', name: 'Sailboat', emoji: '⛵', hint: 'Draw a curved boat hull with a tall triangular sail!' },
            { id: 'moon', name: 'Crescent Moon', emoji: '🌙', hint: 'Draw a curved banana crescent shape shining in the night!' },
            { id: 'icecream', name: 'Ice Cream', emoji: '🍦', hint: 'Draw a pointy cone at the bottom and a round scoop of ice cream on top!' },
            { id: 'glasses', name: 'Glasses', emoji: '👓', hint: 'Draw two round circles side-by-side with a nose bridge connecting them!' }
        ];
    }

    start() {
        this.destroy();
        this.score = 0;
        this.round = 0;
        this.shuffledChallenges = [...this.challengePool].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);
        this.renderShell();
        this.initCanvas();
        this.nextChallenge();
    }

    destroy() {
        clearInterval(this.timerInterval);
        clearTimeout(this.classifyDebounceTimer);
        clearTimeout(this.idleCheckTimer);
        clearTimeout(this.autoAdvanceTimer);
        if (this._windowMouseUp) {
            window.removeEventListener('mouseup', this._windowMouseUp);
            this._windowMouseUp = null;
        }
        if (this._windowTouchEnd) {
            window.removeEventListener('touchend', this._windowTouchEnd);
            this._windowTouchEnd = null;
        }
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board ai-sketch-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="ai-sketch-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">AI Vision Challenge:</span>
                            <span id="sketch-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⏱️ <strong id="sketch-timer">30s</strong></span>
                        <span class="stat-badge">⭐ <strong id="sketch-stars">${window.appState.data.stars}</strong></span>
                    </div>
                </div>

                <div class="ai-sketch-scene">
                    <!-- AI Live Guessing Console -->
                    <div class="ai-guesser-card">
                        <div class="ai-bot-avatar" id="ai-bot-avatar">🤖</div>
                        <div class="ai-speech-bubble" id="ai-speech-bubble">
                            "Draw for me! I'll try to guess what you're making!"
                        </div>
                        <div class="ai-confidence-meter" id="ai-radar-box">
                            <span class="radar-label">AI Neural Radar:</span>
                            <div class="guesses-pill-row" id="ai-guesses-row">
                                <span class="guess-chip waiting">Waiting for sketch...</span>
                            </div>
                        </div>
                    </div>

                    <!-- Target Prompt Banner -->
                    <div class="sketch-mission-banner">
                        <div class="mission-info">
                            <span class="mission-label">Target Challenge:</span>
                            <span class="target-name" id="sketch-target-name">Draw a Sun ☀️</span>
                        </div>
                        <div class="mission-actions">
                            <button class="sketch-hint-btn" id="sketch-tip-btn" title="AI Drawing Tip">💡 Hint</button>
                        </div>
                    </div>

                    <!-- Canvas Area with Kids Creative Toolbar -->
                    <div class="sketch-canvas-container" id="sketch-canvas-wrapper">
                        <div class="sketch-toolbar">
                            <div class="sketch-tool-group">
                                <button class="sketch-tool-btn active" id="tool-sketch-pencil">✏️ Pencil</button>
                                <button class="sketch-tool-btn" id="tool-sketch-eraser">🧼 Eraser</button>
                                <button class="sketch-tool-btn" id="clear-sketch-btn">🗑️ Clear</button>
                            </div>

                            <div class="sketch-colors-row" id="sketch-colors-palette">
                                <button class="sketch-color-dot active" data-color="#1E293B" style="background:#1E293B;" title="Black"></button>
                                <button class="sketch-color-dot" data-color="#3B82F6" style="background:#3B82F6;" title="Blue"></button>
                                <button class="sketch-color-dot" data-color="#F97316" style="background:#F97316;" title="Orange"></button>
                                <button class="sketch-color-dot" data-color="#10B981" style="background:#10B981;" title="Green"></button>
                                <button class="sketch-color-dot" data-color="#8B5CF6" style="background:#8B5CF6;" title="Purple"></button>
                                <button class="sketch-color-dot" data-color="#EF4444" style="background:#EF4444;" title="Red"></button>
                            </div>

                            <div class="sketch-action-group">
                                <button class="scout-guess-btn bounce-hover" id="scout-guess-now-btn">
                                    ✨ Scout, Guess Now! ✨
                                </button>
                                <button class="sketch-next-btn hidden" id="sketch-next-round-btn">
                                    Next Challenge ▶
                                </button>
                            </div>
                        </div>

                        <canvas id="neural-canvas"></canvas>
                    </div>

                    <div class="feedback-banner" id="sketch-feedback"></div>
                </div>
            </div>
        `;

        // Hub Navigation
        document.getElementById('ai-sketch-back-btn').addEventListener('click', () => {
            this.destroy();
            window.audioEngine.playClick();
            window.app.showHub();
        });

        // Drawing Tools
        const pencilBtn = document.getElementById('tool-sketch-pencil');
        const eraserBtn = document.getElementById('tool-sketch-eraser');

        pencilBtn.addEventListener('click', () => {
            this.isEraser = false;
            pencilBtn.classList.add('active');
            eraserBtn.classList.remove('active');
            window.audioEngine.playClick();
        });

        eraserBtn.addEventListener('click', () => {
            this.isEraser = true;
            eraserBtn.classList.add('active');
            pencilBtn.classList.remove('active');
            window.audioEngine.playClick();
        });

        // Colors
        document.querySelectorAll('.sketch-color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                document.querySelectorAll('.sketch-color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                this.currentColor = dot.dataset.color;
                this.isEraser = false;
                pencilBtn.classList.add('active');
                eraserBtn.classList.remove('active');
                window.audioEngine.playClick();
            });
        });

        // Clear
        document.getElementById('clear-sketch-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.clearCanvas();
        });

        // Tip
        document.getElementById('sketch-tip-btn').addEventListener('click', () => {
            if (this.targetCategory) {
                window.audioEngine.speak(this.targetCategory.hint);
                const bubble = document.getElementById('ai-speech-bubble');
                bubble.innerHTML = `💡 <em>"${this.targetCategory.hint}"</em>`;
            }
        });

        // Guess Now Button
        document.getElementById('scout-guess-now-btn').addEventListener('click', () => {
            this.checkDrawing();
        });

        // Next Round Button
        document.getElementById('sketch-next-round-btn').addEventListener('click', () => {
            clearTimeout(this.autoAdvanceTimer);
            const feedback = document.getElementById('sketch-feedback');
            if (feedback) feedback.className = 'feedback-banner';
            this.nextChallenge();
        });
    }

    initCanvas() {
        this.canvas = document.getElementById('neural-canvas');
        this.ctx = this.canvas.getContext('2d');

        const wrapper = document.getElementById('sketch-canvas-wrapper');
        const rect = wrapper ? wrapper.getBoundingClientRect() : null;
        const availableWidth = rect && rect.width > 240 ? rect.width - 32 : 640;
        this.canvas.width = Math.min(680, Math.max(340, availableWidth));
        this.canvas.height = 360;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const getPos = (e) => {
            const r = this.canvas.getBoundingClientRect();
            const sx = (r.width > 0) ? (this.canvas.width / r.width) : 1;
            const sy = (r.height > 0) ? (this.canvas.height / r.height) : 1;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: (clientX - r.left) * sx,
                y: (clientY - r.top) * sy
            };
        };

        const onDown = (e) => {
            if (e.touches && e.touches.length > 1) return;
            e.preventDefault();
            this.isDrawing = true;
            this.currentStroke = [];
            const pos = getPos(e);
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.currentStroke.push(pos);

            // Draw crisp contact point
            const radius = (this.isEraser ? this.brushSize * 1.8 : this.brushSize) / 2;
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.isEraser ? '#FFFFFF' : this.currentColor;
            this.ctx.fill();
        };

        const onMove = (e) => {
            if (!this.isDrawing) return;
            e.preventDefault();
            const pos = getPos(e);

            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.lineWidth = this.isEraser ? this.brushSize * 2 : this.brushSize;
            this.ctx.strokeStyle = this.isEraser ? '#FFFFFF' : this.currentColor;
            this.ctx.stroke();

            this.lastX = pos.x;
            this.lastY = pos.y;
            this.currentStroke.push(pos);

            // Throttled live radar update (never interrupts drawing!)
            if (this.currentStroke.length % 10 === 0) {
                clearTimeout(this.classifyDebounceTimer);
                this.classifyDebounceTimer = setTimeout(() => {
                    this.updateLiveRadar([...this.strokes, this.currentStroke]);
                }, 140);
            }
        };

        const onUp = () => {
            if (this.isDrawing) {
                this.isDrawing = false;
                clearTimeout(this.classifyDebounceTimer);
                if (this.currentStroke.length > 0) {
                    this.strokes.push(this.currentStroke);
                    this.updateLiveRadar(this.strokes);
                    this.triggerIdleDetection();
                }
            }
        };

        this.canvas.addEventListener('mousedown', onDown);
        this.canvas.addEventListener('mousemove', onMove);
        this.canvas.addEventListener('touchstart', onDown, { passive: false });
        this.canvas.addEventListener('touchmove', onMove, { passive: false });

        this._windowMouseUp = onUp;
        this._windowTouchEnd = onUp;
        window.addEventListener('mouseup', this._windowMouseUp);
        window.addEventListener('touchend', this._windowTouchEnd);
    }

    clearCanvas() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.strokes = [];
        this.currentStroke = [];
        this.isDrawing = false;
        document.getElementById('ai-speech-bubble').textContent = `"Draw for me! I'm watching your strokes!"`;
        document.getElementById('ai-guesses-row').innerHTML = `
            <span class="guess-chip waiting">✏️ Waiting for sketch...</span>
            <span class="guess-chip waiting">🤖 Scout AI watching</span>
        `;
        const nextBtn = document.getElementById('sketch-next-round-btn');
        if (nextBtn) nextBtn.classList.add('hidden');
        const guessBtn = document.getElementById('scout-guess-now-btn');
        if (guessBtn) guessBtn.classList.remove('hidden');
    }

    nextChallenge() {
        if (this.round >= this.totalRounds) {
            this.finishGame();
            return;
        }

        this.round++;
        this.isRoundWon = false;
        this.targetCategory = this.shuffledChallenges[this.round - 1];

        document.getElementById('sketch-round-indicator').textContent = `${this.round}/${this.totalRounds}`;
        document.getElementById('sketch-target-name').textContent = `Draw a ${this.targetCategory.name} ${this.targetCategory.emoji}`;
        document.getElementById('ai-speech-bubble').textContent = `"Can you draw a ${this.targetCategory.name}? I'm watching your strokes in real time!"`;

        const nextBtn = document.getElementById('sketch-next-round-btn');
        if (nextBtn) nextBtn.classList.add('hidden');
        const guessBtn = document.getElementById('scout-guess-now-btn');
        if (guessBtn) guessBtn.classList.remove('hidden');

        this.clearCanvas();
        this.startTimer();

        window.audioEngine.speak(`Can you draw a ${this.targetCategory.name}? ${this.targetCategory.hint}`);
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timer = 30;
        document.getElementById('sketch-timer').textContent = `${this.timer}s`;

        this.timerInterval = setInterval(() => {
            this.timer--;
            const timerEl = document.getElementById('sketch-timer');
            if (timerEl) timerEl.textContent = `${this.timer}s`;

            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeout();
            }
        }, 1000);
    }

    updateLiveRadar(strokeData = this.strokes) {
        if (!strokeData || strokeData.length === 0) return;

        const result = window.scoutAI.classifyDrawing(strokeData, this.canvas.width, this.canvas.height, this.targetCategory.id);
        const bubble = document.getElementById('ai-speech-bubble');
        const guessesRow = document.getElementById('ai-guesses-row');
        if (!guessesRow) return;

        // Render AI Top 2 Guesses with live confidence
        guessesRow.innerHTML = result.guesses.slice(0, 2).map((g, idx) => `
            <span class="guess-chip ${g.name === this.targetCategory.name ? 'target-match' : (idx === 0 ? 'top-guess' : '')}">
                ${g.emoji} ${g.name} (${g.confidence}%)
            </span>
        `).join('');

        // Conversational guidance based on what's visible
        if (bubble && !this.isRoundWon) {
            if (!result.id || result.confidence === 0) {
                bubble.textContent = `"Keep drawing! Scout AI is analyzing your strokes... ✏️"`;
            } else if (this.targetCategory.id === 'sun' && strokeData.length === 1) {
                bubble.innerHTML = `"I see a circle! Add rays around it so I know it's a Sun! ☀️"`;
            } else if (this.targetCategory.id === 'face' && strokeData.length < 3) {
                bubble.innerHTML = `"I see the head! Don't forget two eyes and a smile! 😊"`;
            } else if (this.targetCategory.id === 'tree' && strokeData.length === 1) {
                bubble.innerHTML = `"I see the trunk or top! Add both trunk and leaves! 🌲"`;
            } else if (result.confidence >= 65 && result.id === this.targetCategory.id) {
                bubble.innerHTML = `🌟 <strong>Looking like a ${this.targetCategory.name}!</strong> Tap "Scout, Guess Now!" when you're done!`;
            } else {
                const remarks = [
                    `"I see strokes... is it a ${result.label}?"`,
                    `"Looking like a ${result.label} (${result.confidence}%)! Keep going!"`,
                    `"Interesting lines... maybe a ${result.label}?"`
                ];
                bubble.textContent = remarks[Math.floor(Math.random() * remarks.length)];
            }
        }
    }

    triggerIdleDetection() {
        clearTimeout(this.idleCheckTimer);
        // If the child draws a very high confidence target (>= 75%) and pauses for 2.4s, prompt gently
        this.idleCheckTimer = setTimeout(() => {
            if (this.isRoundWon || this.strokes.length === 0) return;
            const result = window.scoutAI.classifyDrawing(this.strokes, this.canvas.width, this.canvas.height, this.targetCategory.id);
            if (result.id === this.targetCategory.id && result.confidence >= 75) {
                this.handleAIWin(result);
            }
        }, 2400);
    }

    checkDrawing() {
        if (this.strokes.length === 0) {
            window.audioEngine.speak("Draw something on the canvas first!");
            const bubble = document.getElementById('ai-speech-bubble');
            if (bubble) bubble.textContent = `"Draw something first! I'm ready to guess! ✏️"`;
            return;
        }

        const result = window.scoutAI.classifyDrawing(this.strokes, this.canvas.width, this.canvas.height, this.targetCategory.id);
        const bubble = document.getElementById('ai-speech-bubble');
        const feedback = document.getElementById('sketch-feedback');
        const nextBtn = document.getElementById('sketch-next-round-btn');
        const guessBtn = document.getElementById('scout-guess-now-btn');

        const totalPointsDrawn = this.strokes.reduce((acc, s) => acc + s.length, 0);

        const isMatch = totalPointsDrawn >= 35 && (
            (result.id === this.targetCategory.id && result.confidence >= 50) ||
            (result.guesses.some(g => g.name === this.targetCategory.name && g.confidence >= 55))
        );

        if (isMatch) {
            this.handleAIWin(result);
        } else {
            window.audioEngine.playPop();
            if (feedback) {
                feedback.innerHTML = `🤖 Scout thinks it looks like a <strong>${result.label} (${result.confidence}%)</strong>! Keep adding details or tap Next!`;
                feedback.className = 'feedback-banner show-try-again';
            }
            if (bubble) {
                bubble.innerHTML = `"I think it's a <strong>${result.label}</strong> (${result.confidence}%)! Add more details to match a ${this.targetCategory.name}!"`;
            }
            window.audioEngine.speak(`I think it looks like a ${result.label}! Keep drawing or tap Next Challenge!`);

            if (nextBtn) nextBtn.classList.remove('hidden');
        }
    }

    handleAIWin(result) {
        this.isRoundWon = true;
        clearInterval(this.timerInterval);
        clearTimeout(this.idleCheckTimer);

        window.audioEngine.playCorrect();
        window.audioEngine.playStar();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 70);

        this.score += 25;
        window.appState.addStars(3);
        const starEl = document.getElementById('sketch-stars');
        if (starEl) starEl.textContent = window.appState.data.stars;

        const bubble = document.getElementById('ai-speech-bubble');
        if (bubble) {
            bubble.innerHTML = `🎉 <strong>YES! IT'S A ${this.targetCategory.name.toUpperCase()}!</strong> Scout recognized it with ${result.confidence}% confidence!`;
        }

        const feedback = document.getElementById('sketch-feedback');
        if (feedback) {
            feedback.innerHTML = `🤖 <strong>AI Recognition: 100% Match!</strong> +3 Stars!`;
            feedback.className = 'feedback-banner show-success';
        }

        window.audioEngine.speak(`Yes! That is definitely a ${this.targetCategory.name}! You are a wonderful artist!`);

        const nextBtn = document.getElementById('sketch-next-round-btn');
        const guessBtn = document.getElementById('scout-guess-now-btn');
        if (guessBtn) guessBtn.classList.add('hidden');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.textContent = 'Next Challenge ▶';
        }

        clearTimeout(this.autoAdvanceTimer);
        this.autoAdvanceTimer = setTimeout(() => {
            if (this.isRoundWon) {
                if (feedback) feedback.className = 'feedback-banner';
                this.nextChallenge();
            }
        }, 3400);
    }

    handleTimeout() {
        if (this.isRoundWon) return;
        window.audioEngine.playPop();

        const result = window.scoutAI.classifyDrawing(this.strokes, this.canvas.width, this.canvas.height, this.targetCategory.id);
        const bubble = document.getElementById('ai-speech-bubble');
        const feedback = document.getElementById('sketch-feedback');
        const nextBtn = document.getElementById('sketch-next-round-btn');
        const guessBtn = document.getElementById('scout-guess-now-btn');

        if (result.confidence >= 40) {
            this.score += 15;
            window.appState.addStars(2);
            if (bubble) bubble.innerHTML = `"Time's up! Great sketch of a ${this.targetCategory.name}! Scout awards +2 Stars!"`;
            if (feedback) {
                feedback.innerHTML = `⏱️ <strong>Time's up!</strong> Great effort! +2 Stars!`;
                feedback.className = 'feedback-banner show-success';
            }
            window.audioEngine.speak(`Time is up! Great sketch of a ${this.targetCategory.name}!`);
        } else {
            if (bubble) bubble.innerHTML = `"Time is up! That was an awesome try! Let's do another one!"`;
            if (feedback) {
                feedback.innerHTML = `Time up! Let's try the next challenge!`;
                feedback.className = 'feedback-banner show-try-again';
            }
            window.audioEngine.speak(`Time is up! Great effort! On to the next challenge!`);
        }

        if (guessBtn) guessBtn.classList.add('hidden');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            nextBtn.textContent = 'Next Challenge ▶';
        }

        clearTimeout(this.autoAdvanceTimer);
        this.autoAdvanceTimer = setTimeout(() => {
            if (feedback) feedback.className = 'feedback-banner';
            this.nextChallenge();
        }, 3200);
    }

    finishGame() {
        this.destroy();
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.addStars(6);

        const scene = document.querySelector('.ai-sketch-scene');
        if (scene) {
            scene.innerHTML = `
                <div class="mission-complete-card">
                    <div class="huge-badge">🤖</div>
                    <h2>AI Vision Master Artist!</h2>
                    <p class="mission-subtitle">You taught the Scout AI vision model with your drawings!</p>
                    <div class="reward-box">
                        <div class="reward-item">⭐ +6 AI Stars!</div>
                        <div class="reward-item">🏆 Score: ${this.score} pts</div>
                    </div>
                    <div class="complete-actions">
                        <button class="primary-btn play-again-btn" id="sketch-replay-btn">🎮 Play Again</button>
                        <button class="secondary-btn" id="sketch-hub-finish-btn">🏠 Hub</button>
                    </div>
                </div>
            `;
        }

        window.audioEngine.speak(`AI Vision Master! You and Scout AI make the ultimate team!`);

        const replayBtn = document.getElementById('sketch-replay-btn');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                window.audioEngine.playClick();
                this.start();
            });
        }

        const hubBtn = document.getElementById('sketch-hub-finish-btn');
        if (hubBtn) {
            hubBtn.addEventListener('click', () => {
                window.audioEngine.playClick();
                window.app.showHub();
            });
        }
    }
}
