// Game 3: Magical Memory Card Flip
class MemoryMatchGame {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 6;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isLocked = false;

        this.themes = {
            animals: {
                name: 'Cute Animals',
                icon: '🐾',
                items: [
                    { emoji: '🐶', name: 'Puppy' },
                    { emoji: '🐱', name: 'Kitten' },
                    { emoji: '🐰', name: 'Bunny' },
                    { emoji: '🦊', name: 'Fox' },
                    { emoji: '🐼', name: 'Panda' },
                    { emoji: '🦁', name: 'Lion' },
                    { emoji: '🐸', name: 'Frog' },
                    { emoji: '🐵', name: 'Monkey' }
                ]
            },
            fruits: {
                name: 'Yummy Fruits',
                icon: '🍓',
                items: [
                    { emoji: '🍎', name: 'Apple' },
                    { emoji: '🍌', name: 'Banana' },
                    { emoji: '🍓', name: 'Strawberry' },
                    { emoji: '🍇', name: 'Grapes' },
                    { emoji: '🍊', name: 'Orange' },
                    { emoji: '🍉', name: 'Watermelon' },
                    { emoji: '🍍', name: 'Pineapple' },
                    { emoji: '🍒', name: 'Cherries' }
                ]
            },
            space: {
                name: 'Cosmic Wonders',
                icon: '🚀',
                items: [
                    { emoji: '🚀', name: 'Rocket' },
                    { emoji: '🪐', name: 'Saturn' },
                    { emoji: '🛸', name: 'UFO' },
                    { emoji: '🌍', name: 'Earth' },
                    { emoji: '☀️', name: 'Sun' },
                    { emoji: '🌙', name: 'Moon' },
                    { emoji: '👾', name: 'Alien' },
                    { emoji: '⭐', name: 'Star' }
                ]
            }
        };
        this.currentThemeKey = 'animals';
    }

    start() {
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.isLocked = false;
        clearInterval(this.timerInterval);
        this.timer = 0;

        const age = window.appState.data.ageGroup;
        if (age === 'toddler') {
            this.totalPairs = 3; // 6 cards
        } else if (age === 'explorer') {
            this.totalPairs = 6; // 12 cards
        } else {
            this.totalPairs = 8; // 16 cards
        }

        this.renderShell();
        this.setupBoard();
        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            const timerEl = document.getElementById('memory-timer');
            if (timerEl) {
                timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board memory-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="memory-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="theme-selector-pill">
                            <button class="theme-tab-btn ${this.currentThemeKey === 'animals' ? 'active' : ''}" data-theme="animals">🐾 Animals</button>
                            <button class="theme-tab-btn ${this.currentThemeKey === 'fruits' ? 'active' : ''}" data-theme="fruits">🍓 Fruits</button>
                            <button class="theme-tab-btn ${this.currentThemeKey === 'space' ? 'active' : ''}" data-theme="space">🚀 Space</button>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⏱️ <strong id="memory-timer">0:00</strong></span>
                        <span class="stat-badge">🎯 Moves: <strong id="memory-moves">0</strong></span>
                    </div>
                </div>

                <div class="memory-scene">
                    <div class="memory-grid-container">
                        <div class="memory-grid cards-${this.totalPairs * 2}" id="memory-grid"></div>
                    </div>
                    <div class="feedback-banner" id="memory-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('memory-back-btn').addEventListener('click', () => {
            this.stopTimer();
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.querySelectorAll('.theme-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const themeKey = e.target.dataset.theme;
                if (themeKey !== this.currentThemeKey) {
                    window.audioEngine.playPop();
                    this.currentThemeKey = themeKey;
                    this.start();
                }
            });
        });
    }

    setupBoard() {
        const theme = this.themes[this.currentThemeKey];
        const selectedItems = [...theme.items].sort(() => Math.random() - 0.5).slice(0, this.totalPairs);

        // Create pairs
        const cardDeck = [];
        selectedItems.forEach((item, idx) => {
            cardDeck.push({ ...item, pairId: idx, cardId: `card_${idx}_a` });
            cardDeck.push({ ...item, pairId: idx, cardId: `card_${idx}_b` });
        });

        // Shuffle
        cardDeck.sort(() => Math.random() - 0.5);

        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';

        cardDeck.forEach((cardData) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.cardId = cardData.cardId;
            cardEl.dataset.pairId = cardData.pairId;
            cardEl.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <span class="card-question">❓</span>
                    </div>
                    <div class="card-back">
                        <span class="card-emoji">${cardData.emoji}</span>
                        <span class="card-name">${cardData.name}</span>
                    </div>
                </div>
            `;

            cardEl.addEventListener('click', () => this.flipCard(cardEl, cardData));
            grid.appendChild(cardEl);
        });

        window.audioEngine.speak(`Find the matching ${theme.name}!`);
    }

    flipCard(cardEl, cardData) {
        if (this.isLocked) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        window.audioEngine.playDing(500 + this.flippedCards.length * 200);
        cardEl.classList.add('flipped');
        this.flippedCards.push({ element: cardEl, data: cardData });

        if (this.flippedCards.length === 2) {
            this.moves++;
            document.getElementById('memory-moves').textContent = this.moves;
            this.checkMatch();
        }
    }

    checkMatch() {
        this.isLocked = true;
        const [card1, card2] = this.flippedCards;

        if (card1.data.pairId === card2.data.pairId) {
            // MATCH!
            setTimeout(() => {
                window.audioEngine.playCorrect();
                card1.element.classList.add('matched');
                card2.element.classList.add('matched');

                const rect = card2.element.getBoundingClientRect();
                window.confettiEngine.burst(rect.x + rect.width / 2, rect.y + rect.height / 2, 20);

                window.audioEngine.speak(card1.data.name);

                this.matchedPairs++;
                this.flippedCards = [];
                this.isLocked = false;

                if (this.matchedPairs === this.totalPairs) {
                    this.finishGame();
                }
            }, 400);
        } else {
            // NO MATCH
            setTimeout(() => {
                window.audioEngine.playWrong();
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                this.flippedCards = [];
                this.isLocked = false;
            }, 950);
        }
    }

    finishGame() {
        this.stopTimer();
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 110);

        window.appState.unlockBadge('memory_pro');
        const calculatedScore = Math.max(10, 100 - (this.moves * 3) - Math.floor(this.timer / 2));
        window.appState.updateHighScore('memory', calculatedScore);
        window.appState.addStars(4);

        const grid = document.getElementById('memory-grid');
        grid.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🧠</div>
                <h2>Super Memory Master!</h2>
                <p class="mission-subtitle">You matched all the cards in ${this.moves} moves!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +4 Memory Stars!</div>
                    <div class="reward-item">⏱️ Time: ${document.getElementById('memory-timer').textContent}</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="memory-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="memory-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Super memory master! You found all matches in ${this.moves} moves!`);

        document.getElementById('memory-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('memory-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
