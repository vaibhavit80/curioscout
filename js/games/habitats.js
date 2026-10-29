// Game 5: Habitat Explorer & Nature Science
class HabitatExplorerGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 6;
        this.currentAnimal = null;

        this.habitats = {
            polar: { name: 'Arctic Ice', emoji: '❄️', bg: 'linear-gradient(135deg, #E0F7FA, #80DEEA)' },
            ocean: { name: 'Deep Ocean', emoji: '🌊', bg: 'linear-gradient(135deg, #0288D1, #01579B)' },
            jungle: { name: 'Lush Jungle', emoji: '🌴', bg: 'linear-gradient(135deg, #2E7D32, #1B5E20)' },
            savanna: { name: 'Sunny Savanna', emoji: '🌾', bg: 'linear-gradient(135deg, #FBC02D, #E65100)' },
            desert: { name: 'Desert Dunes', emoji: '🏜️', bg: 'linear-gradient(135deg, #FFE082, #FF8F00)' }
        };

        this.animalPool = [
            { name: 'Polar Bear', emoji: '🐻‍❄️', habitat: 'polar', fact: 'Polar bears have thick blubber and fur to stay cozy in sub-zero ice!' },
            { name: 'Penguin', emoji: '🐧', habitat: 'polar', fact: 'Penguins are birds that cannot fly, but they fly through icy waters like torpedoes!' },
            { name: 'Walrus', emoji: '🦭', habitat: 'polar', fact: 'Walruses use their long tusks to pull themselves up onto sea ice!' },
            { name: 'Dolphin', emoji: '🐬', habitat: 'ocean', fact: 'Dolphins jump above waves to breathe fresh air through blowholes!' },
            { name: 'Octopus', emoji: '🐙', habitat: 'ocean', fact: 'An octopus can squirt ink and change color instantly to camouflage!' },
            { name: 'Sea Turtle', emoji: '🐢', habitat: 'ocean', fact: 'Sea turtles can hold their breath underwater for hours!' },
            { name: 'Monkey', emoji: '🐒', habitat: 'jungle', fact: 'Monkeys swing from tall canopy vines and chat in the treetops!' },
            { name: 'Toucan', emoji: '🦜', habitat: 'jungle', fact: 'A toucan giant bill helps it reach delicious berries high up in fruit trees!' },
            { name: 'Sloth', emoji: '🦥', habitat: 'jungle', fact: 'Sloths move very slowly and spend almost their entire lives hanging upside down!' },
            { name: 'Lion', emoji: '🦁', habitat: 'savanna', fact: 'Lions rest in golden grasslands and are known as the kings of the savanna!' },
            { name: 'Giraffe', emoji: '🦒', habitat: 'savanna', fact: 'Giraffes are the tallest mammals on Earth, nibbling sweet acacia leaves!' },
            { name: 'Elephant', emoji: '🐘', habitat: 'savanna', fact: 'African elephants use their big ears like giant fans to cool down in the heat!' },
            { name: 'Camel', emoji: '🐫', habitat: 'desert', fact: 'Camels can survive weeks without drinking water by storing energy in their humps!' },
            { name: 'Snowy Owl', emoji: '🦉', habitat: 'polar', fact: 'Snowy owls have thick feathered feet that act like built-in snowshoes on ice!' },
            { name: 'Arctic Fox', emoji: '🦊', habitat: 'polar', fact: 'Arctic foxes change their coat from brown in summer to pure white in winter!' },
            { name: 'Narwhal', emoji: '🐳', habitat: 'polar', fact: 'The unicorn of the sea! That long spiral horn is actually an overgrown sensory tooth!' },
            { name: 'Blue Whale', emoji: '🐋', habitat: 'ocean', fact: 'The blue whale is the largest animal that has ever lived on Earth, even bigger than any dinosaur!' },
            { name: 'Clownfish', emoji: '🐠', habitat: 'ocean', fact: 'Clownfish live safely inside stinging sea anemones because of a protective mucus layer!' },
            { name: 'Seahorse', emoji: '🐡', habitat: 'ocean', fact: 'Seahorses anchor themselves to sea grass with their prehensile tails so currents do not wash them away!' },
            { name: 'Jaguar', emoji: '🐆', habitat: 'jungle', fact: 'Jaguars have the strongest bite of any big cat and are great tree climbers!' },
            { name: 'Poison Dart Frog', emoji: '🐸', habitat: 'jungle', fact: 'Their bright neon colors warn jungle predators that they are dangerous to touch!' },
            { name: 'Chameleon', emoji: '🦎', habitat: 'jungle', fact: 'Chameleons change colors to communicate with other chameleons and adjust to temperature!' },
            { name: 'Cheetah', emoji: '🐆', habitat: 'savanna', fact: 'Cheetahs are the fastest land animals, sprinting up to 70 miles per hour in short bursts!' },
            { name: 'Zebra', emoji: '🦓', habitat: 'savanna', fact: 'Zebras run in zig-zags when chased, confusing predators with their dazzle of stripes!' },
            { name: 'Hippopotamus', emoji: '🦛', habitat: 'savanna', fact: 'Hippos spend up to 16 hours a day submerged in rivers to stay cool in the hot savanna sun!' },
            { name: 'Fennec Fox', emoji: '🦊', habitat: 'desert', fact: 'Fennec foxes have huge 6-inch ears that radiate heat away to keep their bodies cool!' },
            { name: 'Rattlesnake', emoji: '🐍', habitat: 'desert', fact: 'Desert rattlesnakes shake their hollow tail segments to produce a loud buzzing warning sound!' },
            { name: 'Scorpion', emoji: '🦂', habitat: 'desert', fact: 'Scorpions glow bright fluorescent neon green under ultraviolet blacklight!' }
        ];
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.shuffledAnimals = [...this.animalPool].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);

        this.renderShell();
        this.nextAnimal();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board nature-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="nature-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Habitat:</span>
                            <div class="progress-track">
                                <div class="progress-fill" id="nature-progress" style="width: 0%"></div>
                            </div>
                            <span id="nature-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="nature-stars">0</strong></span>
                    </div>
                </div>

                <div class="nature-scene">
                    <div class="nature-question-card" id="nature-card">
                        <div class="prompt-text">Where does this wild friend live?</div>
                        
                        <div class="target-animal-display">
                            <div class="big-animal-emoji" id="nature-target-emoji">🐻‍❄️</div>
                            <h2 class="animal-target-name" id="nature-target-name">Polar Bear</h2>
                            <button class="safari-sound-btn" id="nature-speak-btn">🔊 Hear Question</button>
                        </div>

                        <div class="habitats-options-grid" id="habitats-grid">
                            <!-- Habitat cards injected here -->
                        </div>
                    </div>

                    <div class="feedback-banner" id="nature-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('nature-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('nature-speak-btn').addEventListener('click', () => {
            if (this.currentAnimal) {
                window.audioEngine.speak(`Where does the ${this.currentAnimal.name} live? Tap its habitat!`);
            }
        });
    }

    nextAnimal() {
        if (this.round >= this.totalRounds) {
            this.finishExplorer();
            return;
        }

        this.round++;
        document.getElementById('nature-round-indicator').textContent = `${this.round}/${this.totalRounds}`;
        const pct = ((this.round - 1) / this.totalRounds) * 100;
        document.getElementById('nature-progress').style.width = `${pct}%`;

        this.currentAnimal = this.shuffledAnimals[this.round - 1];

        document.getElementById('nature-target-emoji').textContent = this.currentAnimal.emoji;
        document.getElementById('nature-target-name').textContent = this.currentAnimal.name;

        // Pick correct habitat + 2 or 3 distractors
        const correctHabitatKey = this.currentAnimal.habitat;
        const allKeys = Object.keys(this.habitats);
        const optionsKeys = new Set([correctHabitatKey]);

        while (optionsKeys.size < 4) {
            const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)];
            optionsKeys.add(randomKey);
        }

        const shuffledOptions = Array.from(optionsKeys).sort(() => Math.random() - 0.5);

        const grid = document.getElementById('habitats-grid');
        grid.innerHTML = '';

        shuffledOptions.forEach(hKey => {
            const hData = this.habitats[hKey];
            const card = document.createElement('button');
            card.className = 'habitat-card bounce-hover';
            card.style.background = hData.bg;
            card.innerHTML = `
                <div class="habitat-icon">${hData.emoji}</div>
                <div class="habitat-title">${hData.name}</div>
            `;
            card.onclick = () => this.handleHabitatSelection(hKey, card);
            grid.appendChild(card);
        });

        window.audioEngine.speak(`Where does the ${this.currentAnimal.name} live?`);
    }

    handleHabitatSelection(chosenKey, cardEl) {
        const isCorrect = chosenKey === this.currentAnimal.habitat;
        const feedback = document.getElementById('nature-feedback');

        // Disable options
        document.querySelectorAll('.habitat-card').forEach(c => c.disabled = true);

        if (isCorrect) {
            window.audioEngine.playCorrect();
            this.score += 15;
            window.appState.addStars(2);
            document.getElementById('nature-stars').textContent = window.appState.data.stars;

            cardEl.classList.add('habitat-correct');
            const rect = cardEl.getBoundingClientRect();
            window.confettiEngine.burst(rect.x + rect.width / 2, rect.y + rect.height / 2, 35);

            feedback.innerHTML = `🌿 <strong>Correct!</strong> ${this.currentAnimal.fact}`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak(`Correct! ${this.currentAnimal.fact}`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextAnimal();
            }, 3000);
        } else {
            window.audioEngine.playWrong();
            cardEl.classList.add('habitat-wrong');

            // Highlight correct one
            document.querySelectorAll('.habitat-card').forEach(c => {
                if (c.innerHTML.includes(this.habitats[this.currentAnimal.habitat].name)) {
                    c.classList.add('habitat-correct');
                }
            });

            feedback.innerHTML = `Not quite! The ${this.currentAnimal.name} loves the <strong>${this.habitats[this.currentAnimal.habitat].name}</strong>!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`The ${this.currentAnimal.name} lives in the ${this.habitats[this.currentAnimal.habitat].name}!`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextAnimal();
            }, 2500);
        }
    }

    finishExplorer() {
        document.getElementById('nature-progress').style.width = '100%';
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.unlockBadge('nature_hero');
        window.appState.updateHighScore('habitats', this.score);
        window.appState.addStars(5);

        const card = document.getElementById('nature-card');
        card.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🌿</div>
                <h2>Wildlife Explorer Badge!</h2>
                <p class="mission-subtitle">You guided all the wild animals safely back to their homes!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +5 Nature Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="nature-replay-btn">🎮 Explore Again</button>
                    <button class="secondary-btn" id="nature-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Wildlife Explorer! You guided all the animals home and earned your badge!`);

        document.getElementById('nature-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('nature-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
