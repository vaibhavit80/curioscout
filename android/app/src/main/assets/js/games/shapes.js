// Game 4: Color & Shape Sorter Factory
class ShapeSorterGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.itemsSorted = 0;
        this.targetCount = 10;
        this.currentItem = null;
        this.sortMode = 'shape'; // 'shape' or 'color'

        this.shapes = [
            { id: 'circle', name: 'Circle', svg: '<circle cx="50" cy="50" r="42" fill="currentColor"/>' },
            { id: 'square', name: 'Square', svg: '<rect x="12" y="12" width="76" height="76" rx="10" fill="currentColor"/>' },
            { id: 'triangle', name: 'Triangle', svg: '<polygon points="50,12 88,86 12,86" fill="currentColor"/>' },
            { id: 'star', name: 'Star', svg: '<polygon points="50,10 62,38 92,38 68,56 78,86 50,68 22,86 32,56 8,38 38,38" fill="currentColor"/>' },
            { id: 'heart', name: 'Heart', svg: '<path d="M50 82 S15 55 15 32 A20 20 0 0 1 50 25 A20 20 0 0 1 85 32 C85 55 50 82 50 82 Z" fill="currentColor"/>' }
        ];

        this.colors = [
            { id: 'red', name: 'Red', hex: '#FF4B4B' },
            { id: 'blue', name: 'Blue', hex: '#2196F3' },
            { id: 'green', name: 'Green', hex: '#4CAF50' },
            { id: 'yellow', name: 'Yellow', hex: '#FFEB3B' },
            { id: 'purple', name: 'Purple', hex: '#9C27B0' },
            { id: 'orange', name: 'Orange', hex: '#FF9800' }
        ];
    }

    start() {
        this.score = 0;
        this.itemsSorted = 0;
        const age = window.appState.data.ageGroup;
        // In toddler, alternate between shape and color
        this.sortMode = Math.random() > 0.5 ? 'shape' : 'color';

        this.renderShell();
        this.setupBins();
        this.spawnNextItem();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board sorter-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="sorter-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="mode-toggle-group">
                            <button class="sorter-mode-tab ${this.sortMode === 'shape' ? 'active' : ''}" id="mode-shape-btn">🔷 Sort Shapes</button>
                            <button class="sorter-mode-tab ${this.sortMode === 'color' ? 'active' : ''}" id="mode-color-btn">🎨 Sort Colors</button>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="sorter-stars">0</strong></span>
                        <span class="stat-badge">📦 <strong id="sorter-count">0/${this.targetCount}</strong></span>
                    </div>
                </div>

                <div class="sorter-scene">
                    <div class="factory-instruction" id="sorter-instruction">
                        Tap the matching bin!
                    </div>

                    <div class="conveyor-station">
                        <div class="chute-item-wrapper" id="chute-item-wrapper">
                            <!-- Spawned Item Appears Here -->
                        </div>
                    </div>

                    <div class="bins-container" id="sorter-bins">
                        <!-- Sorting target bins rendered here -->
                    </div>

                    <div class="feedback-banner" id="sorter-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('sorter-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('mode-shape-btn').addEventListener('click', () => {
            if (this.sortMode !== 'shape') {
                window.audioEngine.playPop();
                this.sortMode = 'shape';
                this.start();
            }
        });

        document.getElementById('mode-color-btn').addEventListener('click', () => {
            if (this.sortMode !== 'color') {
                window.audioEngine.playPop();
                this.sortMode = 'color';
                this.start();
            }
        });
    }

    setupBins() {
        const binsContainer = document.getElementById('sorter-bins');
        binsContainer.innerHTML = '';

        if (this.sortMode === 'shape') {
            document.getElementById('sorter-instruction').innerHTML = 'Sort by <strong>Shape</strong>! Drop each into the right bin:';
            // Pick 3 or 4 shapes
            const count = window.appState.data.ageGroup === 'toddler' ? 3 : 4;
            this.activeCategories = [...this.shapes].slice(0, count);

            this.activeCategories.forEach(shape => {
                const bin = document.createElement('button');
                bin.className = 'sorter-bin bounce-hover';
                bin.dataset.binId = shape.id;
                bin.innerHTML = `
                    <div class="bin-shape-preview">
                        <svg viewBox="0 0 100 100" style="color: #6366F1">${shape.svg}</svg>
                    </div>
                    <span class="bin-label">${shape.name}</span>
                `;
                bin.onclick = () => this.handleSort(shape.id, bin);
                binsContainer.appendChild(bin);
            });
        } else {
            document.getElementById('sorter-instruction').innerHTML = 'Sort by <strong>Color</strong>! Match the color:';
            const count = window.appState.data.ageGroup === 'toddler' ? 3 : 4;
            this.activeCategories = [...this.colors].slice(0, count);

            this.activeCategories.forEach(color => {
                const bin = document.createElement('button');
                bin.className = 'sorter-bin bounce-hover';
                bin.dataset.binId = color.id;
                bin.innerHTML = `
                    <div class="bin-color-circle" style="background-color: ${color.hex}"></div>
                    <span class="bin-label">${color.name}</span>
                `;
                bin.onclick = () => this.handleSort(color.id, bin);
                binsContainer.appendChild(bin);
            });
        }
    }

    spawnNextItem() {
        if (this.itemsSorted >= this.targetCount) {
            this.finishGame();
            return;
        }

        const wrapper = document.getElementById('chute-item-wrapper');
        wrapper.innerHTML = '';

        // Random shape from active pool (or all shapes)
        let chosenShape, chosenColor;

        if (this.sortMode === 'shape') {
            chosenShape = this.activeCategories[Math.floor(Math.random() * this.activeCategories.length)];
            chosenColor = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.targetMatch = chosenShape.id;
        } else {
            chosenColor = this.activeCategories[Math.floor(Math.random() * this.activeCategories.length)];
            chosenShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
            this.targetMatch = chosenColor.id;
        }

        this.currentItem = { shape: chosenShape, color: chosenColor };

        const itemEl = document.createElement('div');
        itemEl.className = 'falling-shape-object item-bounce-in';
        itemEl.id = 'current-falling-item';
        itemEl.innerHTML = `
            <svg viewBox="0 0 100 100" style="color: ${chosenColor.hex}">
                ${chosenShape.svg}
            </svg>
        `;
        wrapper.appendChild(itemEl);

        const phrase = `${chosenColor.name} ${chosenShape.name}`;
        window.audioEngine.speak(phrase);
    }

    handleSort(selectedBinId, binEl) {
        if (!this.currentItem) return;

        const isCorrect = selectedBinId === this.targetMatch;
        const feedback = document.getElementById('sorter-feedback');
        const itemEl = document.getElementById('current-falling-item');

        if (isCorrect) {
            window.audioEngine.playCorrect();
            this.itemsSorted++;
            this.score += 10;
            window.appState.addStars(1);

            document.getElementById('sorter-count').textContent = `${this.itemsSorted}/${this.targetCount}`;
            document.getElementById('sorter-stars').textContent = window.appState.data.stars;

            binEl.classList.add('bin-celebrate');
            setTimeout(() => binEl.classList.remove('bin-celebrate'), 600);

            if (itemEl) {
                itemEl.classList.add('item-sorted-success');
            }

            const praise = ['Great Job!', 'Spot On!', 'You Did It!', 'Smart Choice!'];
            const cheer = praise[Math.floor(Math.random() * praise.length)];
            feedback.innerHTML = `🎉 <strong>${cheer}</strong>`;
            feedback.className = 'feedback-banner show-success';

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.spawnNextItem();
            }, 600);
        } else {
            window.audioEngine.playWrong();
            binEl.classList.add('bin-shake');
            setTimeout(() => binEl.classList.remove('bin-shake'), 500);

            feedback.innerHTML = `Oops! Look closer and try again!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Try another bin!');
        }
    }

    finishGame() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.unlockBadge('first_play');
        window.appState.updateHighScore('shapes', this.score);
        window.appState.addStars(4);

        const scene = document.querySelector('.sorter-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">📦</div>
                <h2>Factory Star Sorter!</h2>
                <p class="mission-subtitle">You sorted all ${this.targetCount} shapes & colors with precision!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +4 Bonus Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="sorter-replay-btn">🎮 Sort Again</button>
                    <button class="secondary-btn" id="sorter-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Terrific! You sorted all the shapes and colors like a champion!`);

        document.getElementById('sorter-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('sorter-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
