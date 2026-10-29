// Game 2: Safari Phonics & Word Builder
class SafariSpellingGame {
    constructor(container) {
        this.container = container;
        this.currentWordIdx = 0;
        this.score = 0;
        this.totalWords = 5;
        this.currentWordData = null;
        this.userLetters = [];

        this.wordBanks = {
            toddler: [
                { word: 'CAT', emoji: '🐱', hint: 'Says Meow!', fact: 'Cats can jump six times their height!' },
                { word: 'DOG', emoji: '🐶', hint: 'Loyal puppy friend!', fact: 'Dogs have an amazing sense of smell!' },
                { word: 'PIG', emoji: '🐷', hint: 'Says Oink Oink!', fact: 'Pigs are super smart and love mud baths!' },
                { word: 'COW', emoji: '🐮', hint: 'Says Moo!', fact: 'Cows have best friends and get happy together!' },
                { word: 'OWL', emoji: '🦉', hint: 'Flies at night, Hoot Hoot!', fact: 'Owls can turn their heads almost all the way around!' },
                { word: 'BEE', emoji: '🐝', hint: 'Buzzy honey maker!', fact: 'Bees dance to show other bees where flowers are!' },
                { word: 'FOX', emoji: '🦊', hint: 'Clever woodland animal!', fact: 'Foxes have bushy tails to keep warm!' },
                { word: 'SUN', emoji: '☀️', hint: 'Warm yellow star in the sky!', fact: 'Light from the sun reaches Earth in just 8 minutes!' },
                { word: 'BAT', emoji: '🦇', hint: 'Flying nighttime friend!', fact: 'Bats are the only mammals capable of true flight!' },
                { word: 'ANT', emoji: '🐜', hint: 'Tiny strong worker!', fact: 'Ants can carry up to 50 times their own body weight!' },
                { word: 'BUG', emoji: '🐞', hint: 'Spotted ladybug crawler!', fact: 'Ladybugs eat garden pests to help plants grow healthy!' },
                { word: 'FISH', emoji: '🐟', hint: 'Swims in the clear water!', fact: 'Fish breathe underwater using special organs called gills!' }
            ],
            explorer: [
                { word: 'LION', emoji: '🦁', hint: 'King of the jungle!', fact: 'A lion roar can be heard 5 miles away!' },
                { word: 'FROG', emoji: '🐸', hint: 'Ribbit! Jumps high!', fact: 'Frogs drink water through their skin!' },
                { word: 'DUCK', emoji: '🦆', hint: 'Quack Quack swimmer!', fact: 'Duck feathers are completely waterproof!' },
                { word: 'BEAR', emoji: '🐻', hint: 'Loves honey & berries!', fact: 'Bears have an incredible sense of smell!' },
                { word: 'ZEBRA', emoji: '🦓', hint: 'Black and white stripes!', fact: 'Every zebra stripe pattern is unique like a fingerprint!' },
                { word: 'PANDA', emoji: '🐼', hint: 'Loves eating bamboo!', fact: 'Pandas spend 12 hours a day munching bamboo!' },
                { word: 'KOALA', emoji: '🐨', hint: 'Eucalyptus tree climber!', fact: 'Koalas sleep up to 20 hours a day!' },
                { word: 'TIGER', emoji: '🐯', hint: 'Striped jungle hunter!', fact: 'Tigers are excellent swimmers!' },
                { word: 'SHARK', emoji: '🦈', hint: 'Fast ocean predator!', fact: 'Sharks never run out of teeth; they grow thousands in a lifetime!' },
                { word: 'HORSE', emoji: '🐴', hint: 'Neighs and gallops fast!', fact: 'Horses can sleep both lying down and standing up!' },
                { word: 'MONKEY', emoji: '🐒', hint: 'Swings through jungle trees!', fact: 'Monkeys use their tails like an extra hand to hold branches!' },
                { word: 'TURTLE', emoji: '🐢', hint: 'Carries a home on its back!', fact: 'Turtles have been living on Earth for over 200 million years!' },
                { word: 'RABBIT', emoji: '🐰', hint: 'Long ears and hops high!', fact: 'A rabbit long ears can turn in all directions to listen!' }
            ],
            master: [
                { word: 'DOLPHIN', emoji: '🐬', hint: 'Playful ocean genius!', fact: 'Dolphins have special whistle names for each other!' },
                { word: 'ELEPHANT', emoji: '🐘', hint: 'Gentle giant with a trunk!', fact: 'Elephants can communicate with low rumbles in the ground!' },
                { word: 'GIRAFFE', emoji: '🦒', hint: 'Super tall with long neck!', fact: 'A giraffe tongue is blue-purple and 18 inches long!' },
                { word: 'PENGUIN', emoji: '🐧', hint: 'Tuxedo bird that swims!', fact: 'Penguins can leap out of the ocean water onto ice!' },
                { word: 'KANGAROO', emoji: '🦘', hint: 'Aussie hopper with pouch!', fact: 'Kangaroos use their big muscular tails for balance!' },
                { word: 'OCTOPUS', emoji: '🐙', hint: 'Eight arms in the ocean!', fact: 'An octopus has three hearts and blue blood!' },
                { word: 'CHAMELEON', emoji: '🦎', hint: 'Color-changing reptile!', fact: 'A chameleon eyes can look in two different directions at the same time!' },
                { word: 'FLAMINGO', emoji: '🦩', hint: 'Pretty pink wading bird!', fact: 'Flamingos are pink because of the carotenoid-rich algae and shrimp they eat!' },
                { word: 'CROCODILE', emoji: '🐊', hint: 'Ancient river reptile!', fact: 'Crocodiles can hold their breath underwater for over an hour!' },
                { word: 'HEDGEHOG', emoji: '🦔', hint: 'Cute friend with spiky quills!', fact: 'A hedgehog has between 5,000 and 7,000 protective quills!' },
                { word: 'BUTTERFLY', emoji: '🦋', hint: 'Flutters with colorful wings!', fact: 'Butterflies taste their food using sensory organs on their feet!' },
                { word: 'JELLYFISH', emoji: '🪼', hint: 'Glows and drifts in sea!', fact: 'Jellyfish have no brain, no heart, and are 95% water!' }
            ]
        };
    }

    start() {
        this.score = 0;
        this.currentWordIdx = 0;
        const tier = window.appState.data.ageGroup;
        const pool = this.wordBanks[tier] || this.wordBanks.explorer;
        this.selectedWords = [...pool].sort(() => Math.random() - 0.5).slice(0, this.totalWords);

        this.renderShell();
        this.loadWord(0);
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board safari-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="safari-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Safari:</span>
                            <div class="progress-track">
                                <div class="progress-fill" id="safari-progress" style="width: 0%"></div>
                            </div>
                            <span id="safari-word-counter">1/${this.totalWords}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="safari-stars">0</strong></span>
                    </div>
                </div>

                <div class="safari-scene">
                    <div class="safari-backdrop">
                        <div class="cloud-anim c1">☁️</div>
                        <div class="cloud-anim c2">☁️</div>
                    </div>

                    <div class="safari-card" id="safari-card">
                        <div class="animal-avatar-container">
                            <div class="animal-emoji-bounce" id="animal-emoji">🦁</div>
                            <button class="safari-sound-btn pulse-glow" id="safari-speak-word-btn" title="Pronounce Word">
                                🔊 Hear Word
                            </button>
                        </div>

                        <div class="animal-hint-bubble" id="animal-hint">King of the jungle!</div>

                        <!-- Target Slots -->
                        <div class="spelling-slots-row" id="spelling-slots"></div>

                        <!-- Available Letter Tiles -->
                        <div class="letter-tiles-pool" id="letter-tiles"></div>

                        <!-- Action buttons -->
                        <div class="safari-actions">
                            <button class="utility-pill-btn" id="safari-clear-btn">🔄 Clear</button>
                            <button class="utility-pill-btn" id="safari-hint-btn">💡 Hint</button>
                        </div>
                    </div>

                    <div class="feedback-banner" id="safari-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('safari-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('safari-clear-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.clearCurrentLetters();
        });

        document.getElementById('safari-hint-btn').addEventListener('click', () => {
            window.audioEngine.playStar();
            this.provideHint();
        });

        document.getElementById('safari-speak-word-btn').addEventListener('click', () => {
            if (this.currentWordData) {
                window.audioEngine.speak(`${this.currentWordData.word}! ${this.currentWordData.hint}`);
            }
        });
    }

    loadWord(idx) {
        this.currentWordIdx = idx;
        document.getElementById('safari-word-counter').textContent = `${idx + 1}/${this.totalWords}`;
        const pct = (idx / this.totalWords) * 100;
        document.getElementById('safari-progress').style.width = `${pct}%`;

        this.currentWordData = this.selectedWords[idx];
        this.userLetters = Array(this.currentWordData.word.length).fill(null);

        document.getElementById('animal-emoji').textContent = this.currentWordData.emoji;
        document.getElementById('animal-hint').textContent = this.currentWordData.hint;

        // Render target slots
        const slotsContainer = document.getElementById('spelling-slots');
        slotsContainer.innerHTML = '';
        for (let i = 0; i < this.currentWordData.word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.dataset.index = i;
            slot.innerHTML = `<span class="slot-letter">_</span>`;
            slot.onclick = () => this.removeLetterFromSlot(i);
            slotsContainer.appendChild(slot);
        }

        // Prepare scrambled letter tiles
        const letters = this.currentWordData.word.split('');
        // Add 1 or 2 extra random distractor letters for Explorer & Master
        if (window.appState.data.ageGroup !== 'toddler') {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const extra = alphabet[Math.floor(Math.random() * alphabet.length)];
            letters.push(extra);
        }

        const scrambled = letters.map((char, originalIndex) => ({ char, id: `${char}_${originalIndex}` }))
                                 .sort(() => Math.random() - 0.5);

        const poolContainer = document.getElementById('letter-tiles');
        poolContainer.innerHTML = '';
        scrambled.forEach(item => {
            const tile = document.createElement('button');
            tile.className = 'letter-tile bounce-hover';
            tile.textContent = item.char;
            tile.dataset.char = item.char;
            tile.dataset.id = item.id;
            tile.onclick = () => this.selectLetterTile(item, tile);
            poolContainer.appendChild(tile);
        });

        // Toddler assist: pronounce word on arrival
        window.audioEngine.speak(this.currentWordData.word);
    }

    selectLetterTile(item, tileElement) {
        // Find first empty slot
        const emptyIdx = this.userLetters.findIndex(l => l === null);
        if (emptyIdx === -1) {
            window.audioEngine.playPop();
            return;
        }

        window.audioEngine.playNote ? window.audioEngine.playDing(600 + emptyIdx * 80) : window.audioEngine.playPop();
        window.audioEngine.speak(item.char, { rate: 1.1 });

        this.userLetters[emptyIdx] = { ...item, tileElement };
        tileElement.classList.add('tile-used');
        tileElement.disabled = true;

        const slot = document.querySelectorAll('.letter-slot')[emptyIdx];
        slot.classList.add('slot-filled');
        slot.querySelector('.slot-letter').textContent = item.char;

        // Check if full
        if (!this.userLetters.includes(null)) {
            this.validateWord();
        }
    }

    removeLetterFromSlot(index) {
        const item = this.userLetters[index];
        if (!item) return;

        window.audioEngine.playClick();
        item.tileElement.classList.remove('tile-used');
        item.tileElement.disabled = false;

        this.userLetters[index] = null;
        const slot = document.querySelectorAll('.letter-slot')[index];
        slot.classList.remove('slot-filled');
        slot.querySelector('.slot-letter').textContent = '_';
    }

    clearCurrentLetters() {
        this.userLetters.forEach((item, idx) => {
            if (item) {
                item.tileElement.classList.remove('tile-used');
                item.tileElement.disabled = false;
            }
        });
        this.userLetters = Array(this.currentWordData.word.length).fill(null);
        document.querySelectorAll('.letter-slot').forEach(slot => {
            slot.classList.remove('slot-filled');
            slot.querySelector('.slot-letter').textContent = '_';
        });
    }

    provideHint() {
        const targetWord = this.currentWordData.word;
        // Find first slot where letter is missing or wrong
        for (let i = 0; i < targetWord.length; i++) {
            const correctChar = targetWord[i];
            if (!this.userLetters[i] || this.userLetters[i].char !== correctChar) {
                // If wrong letter is in this slot, remove it first
                if (this.userLetters[i]) {
                    this.removeLetterFromSlot(i);
                }
                // Highlight the matching tile in the pool
                const unusedTile = Array.from(document.querySelectorAll('.letter-tile:not(.tile-used)'))
                    .find(t => t.dataset.char === correctChar);
                if (unusedTile) {
                    unusedTile.classList.add('hint-glow');
                    setTimeout(() => unusedTile.classList.remove('hint-glow'), 1500);
                    window.audioEngine.speak(`Look for letter ${correctChar}!`);
                }
                break;
            }
        }
    }

    validateWord() {
        const spelled = this.userLetters.map(l => l.char).join('');
        const feedback = document.getElementById('safari-feedback');

        if (spelled === this.currentWordData.word) {
            window.audioEngine.playCorrect();
            window.appState.addStars(2);
            this.score += 20;

            const rect = document.getElementById('spelling-slots').getBoundingClientRect();
            window.confettiEngine.burst(rect.x + rect.width / 2, rect.y + rect.height / 2, 35);

            document.querySelectorAll('.letter-slot').forEach(s => s.classList.add('slot-correct'));
            feedback.innerHTML = `🎉 <strong>${this.currentWordData.word}!</strong> ${this.currentWordData.fact}`;
            feedback.className = 'feedback-banner show-success';

            window.audioEngine.speak(`Awesome! ${this.currentWordData.word}! ${this.currentWordData.fact}`);

            document.getElementById('safari-stars').textContent = window.appState.data.stars;

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                if (this.currentWordIdx + 1 < this.totalWords) {
                    this.loadWord(this.currentWordIdx + 1);
                } else {
                    this.finishSafari();
                }
            }, 2800);
        } else {
            window.audioEngine.playWrong();
            document.querySelectorAll('.letter-slot').forEach(s => s.classList.add('slot-wrong'));
            setTimeout(() => {
                document.querySelectorAll('.letter-slot').forEach(s => s.classList.remove('slot-wrong'));
            }, 600);

            feedback.innerHTML = `Almost there! Check the letters and try again!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Almost! Try rearranging the letters!');
        }
    }

    finishSafari() {
        document.getElementById('safari-progress').style.width = '100%';
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.unlockBadge('word_master');
        window.appState.updateHighScore('spelling', this.score);
        window.appState.addStars(5);

        const card = document.getElementById('safari-card');
        card.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🦁</div>
                <h2>Safari Champion!</h2>
                <p class="mission-subtitle">You spelled all the safari animals like a true reader!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +5 Safari Bonus Stars!</div>
                    <div class="reward-item">📖 Mastered: ${this.totalWords} Words</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="safari-replay-btn">🎮 Spell Again</button>
                    <button class="secondary-btn" id="safari-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak('Safari Champion! You spelled all the words and earned bonus stars!');

        document.getElementById('safari-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('safari-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
