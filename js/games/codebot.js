// Game 8: Code-a-Bot: The Visual Logic Maze
// Teaches computational thinking, sequencing, spatial orientation, and debugging
class CodeABotGame {
    constructor(container) {
        this.container = container;
        this.currentLevel = 0;
        this.program = []; // Array of command actions
        this.maxCommands = 12;
        this.isRunning = false;
        this.botPos = { x: 0, y: 0, dir: 1 }; // dir: 0=Up, 1=Right, 2=Down, 3=Left

        this.levels = [
            {
                name: 'Level 1: First Steps',
                gridSize: 5,
                start: { x: 0, y: 2, dir: 1 },
                goal: { x: 3, y: 2 },
                items: [{ x: 1, y: 2, collected: false }],
                obstacles: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
                tip: 'Add "Move Forward" blocks to collect the battery and reach the portal!'
            },
            {
                name: 'Level 2: Turn the Corner',
                gridSize: 5,
                start: { x: 1, y: 1, dir: 1 },
                goal: { x: 3, y: 3 },
                items: [{ x: 3, y: 1, collected: false }],
                obstacles: [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 1 }],
                tip: 'Move forward, turn right, and reach the finish pad!'
            },
            {
                name: 'Level 3: Leap Across the Water',
                gridSize: 5,
                start: { x: 0, y: 2, dir: 1 },
                goal: { x: 4, y: 2 },
                items: [{ x: 1, y: 2, collected: false }, { x: 3, y: 2, collected: false }],
                water: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
                obstacles: [],
                tip: 'Use the "Jump Over" block to leap over the river puddle!'
            },
            {
                name: 'Level 4: Zig-Zag Gem Collector',
                gridSize: 5,
                start: { x: 0, y: 0, dir: 2 },
                goal: { x: 4, y: 4 },
                items: [{ x: 0, y: 2, collected: false }, { x: 2, y: 2, collected: false }, { x: 2, y: 4, collected: false }],
                obstacles: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
                tip: 'Plan your turns carefully to navigate around the stone barriers!'
            },
            {
                name: 'Level 5: Master Maze Challenge',
                gridSize: 6,
                start: { x: 0, y: 0, dir: 1 },
                goal: { x: 5, y: 5 },
                items: [{ x: 2, y: 0, collected: false }, { x: 2, y: 3, collected: false }, { x: 5, y: 3, collected: false }],
                water: [{ x: 2, y: 1 }, { x: 4, y: 3 }],
                obstacles: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 1 }, { x: 1, y: 4 }, { x: 3, y: 4 }],
                tip: 'Combine turning, jumping, and moving to solve the grand coding maze!'
            }
        ];
    }

    start() {
        this.currentLevel = 0;
        this.program = [];
        this.isRunning = false;
        this.renderShell();
        this.loadLevel(0);
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board codebot-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="codebot-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Coding Quest:</span>
                            <span id="codebot-level-name">Level 1</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="codebot-stars">0</strong></span>
                    </div>
                </div>

                <div class="codebot-scene">
                    <!-- Left: Interactive Logic Grid -->
                    <div class="codebot-grid-pane">
                        <div class="level-tip-bubble" id="codebot-tip">
                            🤖 Program the robot with direction cards!
                        </div>
                        <div class="codebot-grid-wrapper" id="codebot-grid-wrapper">
                            <div class="codebot-grid" id="codebot-grid"></div>
                        </div>
                    </div>

                    <!-- Right: Program Queue & Command Cards -->
                    <div class="codebot-program-pane">
                        <div class="program-header">
                            <h3>📜 Your Code Program (<span id="program-count">0</span>/${this.maxCommands})</h3>
                            <button class="utility-pill-btn" id="clear-program-btn">🗑️ Clear</button>
                        </div>

                        <!-- Sequence list of blocks -->
                        <div class="code-queue-container" id="code-queue">
                            <span class="empty-code-hint">Click command blocks below to build your program!</span>
                        </div>

                        <!-- Available command block buttons -->
                        <div class="command-blocks-palette">
                            <button class="code-block-btn block-forward bounce-hover" data-cmd="forward">
                                ⬆️ Move Forward
                            </button>
                            <button class="code-block-btn block-left bounce-hover" data-cmd="left">
                                ↩️ Turn Left
                            </button>
                            <button class="code-block-btn block-right bounce-hover" data-cmd="right">
                                ↪️ Turn Right
                            </button>
                            <button class="code-block-btn block-jump bounce-hover" data-cmd="jump">
                                🦘 Jump Over
                            </button>
                        </div>

                        <!-- Execution controls -->
                        <div class="code-controls-row">
                            <button class="primary-btn run-code-btn" id="run-code-btn">
                                ▶ Run Code!
                            </button>
                            <button class="secondary-btn" id="reset-bot-btn">
                                🔄 Reset Bot
                            </button>
                        </div>
                    </div>

                    <div class="feedback-banner" id="codebot-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('codebot-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('clear-program-btn').addEventListener('click', () => {
            if (this.isRunning) return;
            window.audioEngine.playClick();
            this.program = [];
            this.renderProgramQueue();
        });

        document.getElementById('reset-bot-btn').addEventListener('click', () => {
            if (this.isRunning) return;
            window.audioEngine.playClick();
            this.resetBotPosition();
        });

        document.getElementById('run-code-btn').addEventListener('click', () => {
            if (this.isRunning) return;
            this.executeProgram();
        });

        // Command buttons
        document.querySelectorAll('.code-block-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isRunning) return;
                const cmd = e.currentTarget.dataset.cmd;
                this.addCommand(cmd);
            });
        });
    }

    loadLevel(lvlIdx) {
        this.currentLevel = lvlIdx;
        const lvl = this.levels[lvlIdx];
        this.program = [];

        document.getElementById('codebot-level-name').textContent = lvl.name;
        document.getElementById('codebot-tip').textContent = lvl.tip;

        // Reset items
        this.activeItems = lvl.items.map(it => ({ ...it, collected: false }));
        this.activeObstacles = lvl.obstacles || [];
        this.activeWater = lvl.water || [];

        this.resetBotPosition();
        this.renderGrid();
        this.renderProgramQueue();

        window.audioEngine.speak(lvl.tip);
    }

    resetBotPosition() {
        const lvl = this.levels[this.currentLevel];
        this.botPos = { ...lvl.start };
        this.activeItems = lvl.items.map(it => ({ ...it, collected: false }));
        this.renderGrid();
    }

    renderGrid() {
        const lvl = this.levels[this.currentLevel];
        const grid = document.getElementById('codebot-grid');
        grid.style.gridTemplateColumns = `repeat(${lvl.gridSize}, 1fr)`;
        grid.innerHTML = '';

        const dirEmojis = ['⬆️', '➡️', '⬇️', '⬅️'];

        for (let y = 0; y < lvl.gridSize; y++) {
            for (let x = 0; x < lvl.gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'code-grid-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;

                // Check contents
                if (this.botPos.x === x && this.botPos.y === y) {
                    cell.classList.add('cell-bot');
                    cell.innerHTML = `
                        <div class="bot-sprite" style="transform: rotate(${this.botPos.dir * 90}deg)">
                            🤖
                        </div>
                    `;
                } else if (lvl.goal.x === x && lvl.goal.y === y) {
                    cell.classList.add('cell-goal');
                    cell.innerHTML = `<span class="goal-portal">🌀</span>`;
                } else {
                    const item = this.activeItems.find(it => it.x === x && it.y === y);
                    const isObstacle = this.activeObstacles.some(ob => ob.x === x && ob.y === y);
                    const isWater = this.activeWater.some(w => w.x === x && w.y === y);

                    if (item && !item.collected) {
                        cell.classList.add('cell-item');
                        cell.innerHTML = `<span class="item-cog">🔋</span>`;
                    } else if (isObstacle) {
                        cell.classList.add('cell-obstacle');
                        cell.innerHTML = `<span>🪨</span>`;
                    } else if (isWater) {
                        cell.classList.add('cell-water');
                        cell.innerHTML = `<span>🌊</span>`;
                    }
                }

                grid.appendChild(cell);
            }
        }
    }

    addCommand(cmd) {
        if (this.program.length >= this.maxCommands) {
            window.audioEngine.playWrong();
            return;
        }

        window.audioEngine.playPop();
        this.program.push(cmd);
        this.renderProgramQueue();
    }

    removeCommand(idx) {
        if (this.isRunning) return;
        window.audioEngine.playClick();
        this.program.splice(idx, 1);
        this.renderProgramQueue();
    }

    renderProgramQueue() {
        const queueEl = document.getElementById('code-queue');
        document.getElementById('program-count').textContent = this.program.length;

        if (this.program.length === 0) {
            queueEl.innerHTML = `<span class="empty-code-hint">Click command blocks below to build your program!</span>`;
            return;
        }

        queueEl.innerHTML = '';
        const names = {
            forward: { icon: '⬆️', label: 'Step' },
            left: { icon: '↩️', label: 'Left' },
            right: { icon: '↪️', label: 'Right' },
            jump: { icon: '🦘', label: 'Jump' }
        };

        this.program.forEach((cmd, idx) => {
            const card = document.createElement('div');
            card.className = `queue-block-pill block-${cmd}`;
            card.id = `queue-block-${idx}`;
            card.innerHTML = `
                <span class="block-step-num">${idx + 1}</span>
                <span class="block-ico">${names[cmd].icon}</span>
                <span class="block-txt">${names[cmd].label}</span>
                <button class="remove-block-x">&times;</button>
            `;
            card.querySelector('.remove-block-x').onclick = (e) => {
                e.stopPropagation();
                this.removeCommand(idx);
            };
            queueEl.appendChild(card);
        });
    }

    async executeProgram() {
        if (this.program.length === 0) {
            window.audioEngine.playWrong();
            window.audioEngine.speak('Add at least one command block first!');
            return;
        }

        this.isRunning = true;
        this.resetBotPosition();
        const feedback = document.getElementById('codebot-feedback');
        const lvl = this.levels[this.currentLevel];

        window.audioEngine.speak('Running code!');

        for (let i = 0; i < this.program.length; i++) {
            // Highlight current block in queue
            document.querySelectorAll('.queue-block-pill').forEach(b => b.classList.remove('running-active'));
            const activeBlock = document.getElementById(`queue-block-${i}`);
            if (activeBlock) {
                activeBlock.classList.add('running-active');
            }

            const cmd = this.program[i];
            const success = await this.stepCommand(cmd);

            if (!success) {
                this.isRunning = false;
                return;
            }

            // Check if collected item
            const itemFound = this.activeItems.find(it => it.x === this.botPos.x && it.y === this.botPos.y && !it.collected);
            if (itemFound) {
                itemFound.collected = true;
                window.audioEngine.playStar();
                this.renderGrid();
            }

            // Short pause between steps
            await new Promise(r => setTimeout(r, 450));
        }

        document.querySelectorAll('.queue-block-pill').forEach(b => b.classList.remove('running-active'));

        // Check victory condition
        const allItemsCollected = this.activeItems.every(it => it.collected);
        const reachedGoal = this.botPos.x === lvl.goal.x && this.botPos.y === lvl.goal.y;

        if (reachedGoal && allItemsCollected) {
            window.audioEngine.playCorrect();
            window.appState.addStars(3);
            document.getElementById('codebot-stars').textContent = window.appState.data.stars;
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 40);

            feedback.innerHTML = `🤖 <strong>Mission Clear!</strong> Code executed perfectly!`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak('Mission Clear! Program executed perfectly!');

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.isRunning = false;
                if (this.currentLevel + 1 < this.levels.length) {
                    this.loadLevel(this.currentLevel + 1);
                } else {
                    this.finishGame();
                }
            }, 2500);
        } else if (reachedGoal && !allItemsCollected) {
            window.audioEngine.playWrong();
            feedback.innerHTML = `Reached the portal, but forgot the energy batteries!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Collect all the batteries before reaching the portal!');
            this.isRunning = false;
        } else {
            window.audioEngine.playWrong();
            feedback.innerHTML = `Didn't reach the portal! Let's debug the code!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Did not reach the portal! Add or fix your command blocks!');
            this.isRunning = false;
        }
    }

    async stepCommand(cmd) {
        const lvl = this.levels[this.currentLevel];
        const feedback = document.getElementById('codebot-feedback');

        if (cmd === 'left') {
            window.audioEngine.playRobotBeep(450);
            this.botPos.dir = (this.botPos.dir + 3) % 4; // rotate CCW
            this.renderGrid();
            return true;
        }

        if (cmd === 'right') {
            window.audioEngine.playRobotBeep(650);
            this.botPos.dir = (this.botPos.dir + 1) % 4; // rotate CW
            this.renderGrid();
            return true;
        }

        const delta = [
            { dx: 0, dy: -1 }, // Up
            { dx: 1, dy: 0 },  // Right
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }  // Left
        ][this.botPos.dir];

        const stepCount = (cmd === 'jump') ? 2 : 1;
        const newX = this.botPos.x + (delta.dx * stepCount);
        const newY = this.botPos.y + (delta.dy * stepCount);

        // Boundary check
        if (newX < 0 || newX >= lvl.gridSize || newY < 0 || newY >= lvl.gridSize) {
            window.audioEngine.playWrong();
            feedback.innerHTML = `⚠️ Ouch! Bot hit the edge of the world!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Bot bumped into the wall! Try turning before moving!');
            return false;
        }

        // Obstacle check
        if (this.activeObstacles.some(ob => ob.x === newX && ob.y === newY)) {
            window.audioEngine.playWrong();
            feedback.innerHTML = `🪨 Ouch! Bot bumped into a boulder!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Blocked by a boulder! Let us debug!');
            return false;
        }

        // Water check (if stepped normally into water, it fails)
        if (cmd === 'forward' && this.activeWater.some(w => w.x === newX && w.y === newY)) {
            window.audioEngine.playWrong();
            feedback.innerHTML = `🌊 Splash! Bot fell into the river! Use "Jump"!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Splash! Use the Jump command to clear water!');
            return false;
        }

        window.audioEngine.playRobotBeep(cmd === 'jump' ? 880 : 580);
        this.botPos.x = newX;
        this.botPos.y = newY;
        this.renderGrid();
        return true;
    }

    finishGame() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.addStars(6);

        const scene = document.querySelector('.codebot-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🤖</div>
                <h2>Junior Software Engineer!</h2>
                <p class="mission-subtitle">You wrote bug-free algorithms and solved every logic maze!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +6 Logic Stars!</div>
                    <div class="reward-item">⚡ 5/5 Mazes Solved</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="codebot-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="codebot-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Incredible! You are a brilliant junior software engineer!`);

        document.getElementById('codebot-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('codebot-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
