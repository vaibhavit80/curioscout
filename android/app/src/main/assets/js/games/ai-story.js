// Game 12: AI TaleSpinner - Interactive Story Explorer
// Generates personalized, voiced, multi-chapter branching adventure books
class AITaleSpinnerGame {
    constructor(container) {
        this.container = container;
        this.chapter = 1;
        this.selectedHero = null;
        this.selectedWorld = null;
        this.selectedTool = null;
        this.currentBeat = null;

        this.heroes = [
            { id: 'puppy', name: 'Puppy Astro', emoji: '🐶', desc: 'Curious space pup with bouncy paws' },
            { id: 'robot', name: 'Beep Bot', emoji: '🤖', desc: 'Helpful inventor robot with gadget arms' },
            { id: 'dino', name: 'Rexy Dino', emoji: '🦖', desc: 'Gentle green baby dinosaur with big courage' },
            { id: 'fairy', name: 'Fairy Luna', emoji: '🧚‍♀️', desc: 'Sparkly woodland fairy who speaks with animals' },
            { id: 'dragon', name: 'Pip Dragon', emoji: '🐲', desc: 'Playful baby dragon who blows bubble-rings' }
        ];

        this.worlds = [
            { id: 'candy', name: 'Candy Planet', emoji: '🍭', bg: 'linear-gradient(135deg, #FF9A9E, #FECFEF)' },
            { id: 'ocean', name: 'Deep Sea Atlantis', emoji: '🌊', bg: 'linear-gradient(135deg, #2193B0, #6DD5ED)' },
            { id: 'forest', name: 'Enchanted Forest', emoji: '🌲', bg: 'linear-gradient(135deg, #11998E, #38EF7D)' },
            { id: 'space', name: 'Cosmic Star Station', emoji: '🚀', bg: 'linear-gradient(135deg, #1A1A40, #270082)' },
            { id: 'cloud', name: 'Cloud Kingdom', emoji: '☁️', bg: 'linear-gradient(135deg, #A1C4FD, #C2E9FB)' }
        ];

        this.tools = [
            { id: 'wand', name: 'Rainbow Wand', emoji: '🪄', desc: 'Shoots sparkles that turn bad moods into smiles' },
            { id: 'compass', name: 'Star Compass', emoji: '🧭', desc: 'Points toward hidden treasures and secrets' },
            { id: 'skateboard', name: 'Hover Skateboard', emoji: '🛹', desc: 'Flies over obstacles and loops through clouds' },
            { id: 'bubble', name: 'Magic Bubble Blaster', emoji: '🫧', desc: 'Creates floating shields and trampoline bubbles' }
        ];
    }

    start() {
        this.chapter = 1;
        this.selectedHero = this.heroes[0];
        this.selectedWorld = this.worlds[0];
        this.selectedTool = this.tools[0];
        this.renderIngredientsSelection();
    }

    renderIngredientsSelection() {
        this.container.innerHTML = `
            <div class="game-board ai-story-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="story-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <span class="hud-label">📖 AI Storycrafter Workshop</span>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="story-stars">0</strong></span>
                    </div>
                </div>

                <div class="story-builder-scene">
                    <div class="builder-intro">
                        <h2>✨ Pick Your Story Ingredients!</h2>
                        <p>Scout AI will weave an interactive adventure just for you!</p>
                    </div>

                    <!-- 1. Hero Selector -->
                    <div class="ingredients-shelf">
                        <h4 class="shelf-title">1. Choose Your Hero:</h4>
                        <div class="choice-cards-row" id="heroes-row">
                            ${this.heroes.map(h => `
                                <button class="story-ingredient-btn ${h.id === this.selectedHero.id ? 'active' : ''}" data-type="hero" data-id="${h.id}">
                                    <span class="ingredient-emoji">${h.emoji}</span>
                                    <span class="ingredient-name">${h.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 2. World Selector -->
                    <div class="ingredients-shelf">
                        <h4 class="shelf-title">2. Choose Your World:</h4>
                        <div class="choice-cards-row" id="worlds-row">
                            ${this.worlds.map(w => `
                                <button class="story-ingredient-btn ${w.id === this.selectedWorld.id ? 'active' : ''}" data-type="world" data-id="${w.id}">
                                    <span class="ingredient-emoji">${w.emoji}</span>
                                    <span class="ingredient-name">${w.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 3. Magic Tool Selector -->
                    <div class="ingredients-shelf">
                        <h4 class="shelf-title">3. Choose Your Magic Tool:</h4>
                        <div class="choice-cards-row" id="tools-row">
                            ${this.tools.map(t => `
                                <button class="story-ingredient-btn ${t.id === this.selectedTool.id ? 'active' : ''}" data-type="tool" data-id="${t.id}">
                                    <span class="ingredient-emoji">${t.emoji}</span>
                                    <span class="ingredient-name">${t.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <button class="primary-btn create-story-btn bounce-hover" id="generate-story-btn">
                        🪄 Scout AI, Spin My Story! ▶
                    </button>
                </div>
            </div>
        `;

        document.getElementById('story-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        // Click listeners on ingredient cards
        document.querySelectorAll('.story-ingredient-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                const id = e.currentTarget.dataset.id;
                window.audioEngine.playPop();

                if (type === 'hero') {
                    this.selectedHero = this.heroes.find(h => h.id === id);
                    document.querySelectorAll('#heroes-row .story-ingredient-btn').forEach(b => b.classList.remove('active'));
                } else if (type === 'world') {
                    this.selectedWorld = this.worlds.find(w => w.id === id);
                    document.querySelectorAll('#worlds-row .story-ingredient-btn').forEach(b => b.classList.remove('active'));
                } else if (type === 'tool') {
                    this.selectedTool = this.tools.find(t => t.id === id);
                    document.querySelectorAll('#tools-row .story-ingredient-btn').forEach(b => b.classList.remove('active'));
                }

                btn.classList.add('active');
            });
        });

        document.getElementById('generate-story-btn').addEventListener('click', () => {
            window.audioEngine.playFanfare();
            this.loadChapter(1);
        });

        window.audioEngine.speak('Pick your hero, a magical world, and a special tool, and I will write a story for you!');
    }

    loadChapter(chapterNum, decision = null) {
        this.chapter = chapterNum;
        this.currentBeat = window.scoutAI.generateStoryBeat(this.selectedHero, this.selectedWorld, this.selectedTool, chapterNum, decision);

        this.renderChapterView();
        window.audioEngine.speak(this.currentBeat.text);
    }

    renderChapterView() {
        this.container.innerHTML = `
            <div class="game-board ai-story-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="story-hub-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <span class="hud-label">📖 Chapter ${this.chapter} of 3</span>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="story-stars">${window.appState.data.stars}</strong></span>
                    </div>
                </div>

                <div class="story-reader-scene" style="background: ${this.selectedWorld.bg}">
                    <div class="story-book-container bounce-in">
                        <div class="book-header">
                            <span class="book-cast">
                                ${this.selectedHero.emoji} ${this.selectedHero.name} • ${this.selectedWorld.emoji} ${this.selectedWorld.name}
                            </span>
                            <button class="speech-repeat-btn" id="story-read-aloud-btn" title="Read Aloud">🔊</button>
                        </div>

                        <h2 class="book-chapter-title">${this.currentBeat.title}</h2>

                        <div class="book-story-text">
                            ${this.currentBeat.text}
                        </div>

                        <div class="story-moral-bubble">
                            💡 <em>"${this.currentBeat.moral}"</em>
                        </div>

                        <!-- Branching choices if chapter < 3 -->
                        ${this.chapter < 3 ? `
                            <div class="story-decision-box">
                                <span class="decision-prompt">What should ${this.selectedHero.name} do next?</span>
                                <div class="choices-button-row">
                                    ${this.currentBeat.choices.map(c => `
                                        <button class="choice-path-btn bounce-hover" data-choice-id="${c.id}">
                                            ${c.text}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : `
                            <div class="story-finale-actions">
                                <button class="primary-btn bounce-hover" id="spin-new-story-btn">🪄 Spin Another Story</button>
                                <button class="secondary-btn" id="story-finish-hub-btn">🏠 Hub</button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('story-hub-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('story-read-aloud-btn').addEventListener('click', () => {
            window.audioEngine.speak(this.currentBeat.text);
        });

        if (this.chapter < 3) {
            document.querySelectorAll('.choice-path-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const choiceId = e.currentTarget.dataset.choiceId;
                    window.audioEngine.playPop();
                    window.appState.addStars(2);
                    window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 30);
                    this.loadChapter(this.chapter + 1, choiceId);
                });
            });
        } else {
            window.appState.addStars(5);
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 100);

            document.getElementById('spin-new-story-btn').addEventListener('click', () => {
                window.audioEngine.playClick();
                this.start();
            });

            document.getElementById('story-finish-hub-btn').addEventListener('click', () => {
                window.audioEngine.playClick();
                window.app.showHub();
            });
        }
    }
}
