// Main Application Controller & Hub Manager
class CurioScoutApp {
    constructor() {
        this.hubView = document.getElementById('hub-view');
        this.gameView = document.getElementById('game-view');
        this.modalContainer = document.getElementById('modal-container');
        this.activeGameInstance = null;

        this.games = {
            math: {
                id: 'math',
                title: 'Math Galaxy',
                category: 'Math & Counting',
                emoji: '🚀',
                badgeColor: '#FF6B6B',
                desc: 'Fly across planets, count stars, and master arithmetic!',
                instantiate: (c) => new MathGalaxyGame(c)
            },
            spelling: {
                id: 'spelling',
                title: 'Safari Phonics',
                category: 'Words & Reading',
                emoji: '🦁',
                badgeColor: '#4ECDC4',
                desc: 'Spell animal names, hear fun facts, and build vocabulary!',
                instantiate: (c) => new SafariSpellingGame(c)
            },
            memory: {
                id: 'memory',
                title: 'Memory Match',
                category: 'Focus & Brain',
                emoji: '🧠',
                badgeColor: '#FFE66D',
                desc: 'Flip magical cards and discover matching pairs!',
                instantiate: (c) => new MemoryMatchGame(c)
            },
            shapes: {
                id: 'shapes',
                title: 'Shape Sorter',
                category: 'Logic & Colors',
                emoji: '📦',
                badgeColor: '#9B51E0',
                desc: 'Sort colorful shapes and geometric objects into magic bins!',
                instantiate: (c) => new ShapeSorterGame(c)
            },
            habitats: {
                id: 'habitats',
                title: 'Habitat Explorer',
                category: 'Nature & Science',
                emoji: '🌿',
                badgeColor: '#27AE60',
                desc: 'Help wild creatures find their true homes across the world!',
                instantiate: (c) => new HabitatExplorerGame(c)
            },
            music: {
                id: 'music',
                title: 'Rainbow Piano',
                category: 'Music & Ear',
                emoji: '🎵',
                badgeColor: '#FF7675',
                desc: 'Play colorful xylophone notes and learn famous nursery rhymes!',
                instantiate: (c) => new MusicMaestroGame(c)
            },
            doodle: {
                id: 'doodle',
                title: 'Color Studio',
                category: 'Art & Creativity',
                emoji: '🎨',
                badgeColor: '#F368E0',
                desc: 'Color cute animals, use rainbow brushes, and stamp stickers!',
                instantiate: (c) => new DoodleArtGame(c)
            },
            codebot: {
                id: 'codebot',
                title: 'Code-a-Bot',
                category: 'Coding & Logic',
                emoji: '🤖',
                badgeColor: '#3B82F6',
                desc: 'Program robot moves, turns, and jumps to solve visual code mazes!',
                instantiate: (c) => new CodeABotGame(c)
            },
            clock: {
                id: 'clock',
                title: 'Chrono-Clock',
                category: 'Time & Routines',
                emoji: '⏰',
                badgeColor: '#F59E0B',
                desc: 'Rotate clock hands, master hours and minutes, and travel through day and night!',
                instantiate: (c) => new ChronoClockGame(c)
            },
            market: {
                id: 'market',
                title: 'Junior Market',
                category: 'Money & Math',
                emoji: '🏪',
                badgeColor: '#10B981',
                desc: 'Count real coins, serve animal customers, and run the cash register!',
                instantiate: (c) => new JuniorMarketGame(c)
            },
            aisketch: {
                id: 'aisketch',
                title: 'AI Quick Draw',
                category: 'AI & Vision',
                emoji: '🤖',
                badgeColor: '#6366F1',
                desc: 'Draw sketches and watch the Scout AI computer vision guess in real-time!',
                instantiate: (c) => new AISketchGuesserGame(c)
            },
            aistory: {
                id: 'aistory',
                title: 'AI TaleSpinner',
                category: 'AI & Storytelling',
                emoji: '📖',
                badgeColor: '#EC4899',
                desc: 'Pick your heroes, worlds, and magic tools for an AI-woven voiced adventure!',
                instantiate: (c) => new AITaleSpinnerGame(c)
            },
            aiemotion: {
                id: 'aiemotion',
                title: 'AI Emotion Bot',
                category: 'AI & Empathy',
                emoji: '💖',
                badgeColor: '#F43F5E',
                desc: 'Discover how emotion AI recognizes facial landmarks, eyebrows, and smiles!',
                instantiate: (c) => new AIEmotionBotGame(c)
            },
            aipattern: {
                id: 'aipattern',
                title: 'AI Pattern Detective',
                category: 'AI & Logic',
                emoji: '🔍',
                badgeColor: '#9333EA',
                desc: 'Decode sequences, shape rotations, and arithmetic rules with Scout AI!',
                instantiate: (c) => new AIPatternDetectiveGame(c)
            },
            tangram: {
                id: 'tangram',
                title: 'Polyomino Tangram',
                category: 'Spatial & Geometry',
                emoji: '🧩',
                badgeColor: '#0284C7',
                desc: 'Fit colorful geometric tiles into animals, rockets, and sailboat silhouettes!',
                instantiate: (c) => new PolyominoTangramGame(c)
            }
        };

        this.init();
    }

    init() {
        this.renderHubGameCards();
        this.updateHeaderStats();
        this.bindEvents();

        // Subscribe to state changes to update header star count
        window.appState.subscribe(() => {
            this.updateHeaderStats();
        });

        // Welcome greeting with gentle delay
        setTimeout(() => {
            const name = window.appState.data.childName;
            window.audioEngine.speak(`Welcome to Curio Scout, ${name}! Pick an adventure to play!`);
        }, 800);
    }

    bindEvents() {
        // Nav buttons
        const aiNavBtn = document.getElementById('nav-scout-ai-btn');
        if (aiNavBtn) {
            aiNavBtn.addEventListener('click', () => {
                window.audioEngine.playPop();
                this.openScoutAIModal();
            });
        }

        document.getElementById('nav-stickers-btn').addEventListener('click', () => {
            window.audioEngine.playPop();
            this.openStickersModal();
        });

        document.getElementById('nav-parent-btn').addEventListener('click', () => {
            window.audioEngine.playPop();
            this.openParentModal();
        });

        document.getElementById('nav-settings-btn').addEventListener('click', () => {
            window.audioEngine.playPop();
            this.openSettingsModal();
        });

        document.getElementById('sound-toggle-btn').addEventListener('click', (e) => {
            const soundActive = window.audioEngine.toggleMute();
            window.appState.data.soundEnabled = soundActive;
            window.appState.saveState();
            e.currentTarget.textContent = soundActive ? '🔊' : '🔇';
            e.currentTarget.title = soundActive ? 'Sound On' : 'Sound Muted';
        });

        document.getElementById('speech-toggle-btn').addEventListener('click', (e) => {
            const speechActive = window.audioEngine.toggleSpeech();
            window.appState.data.voiceEnabled = speechActive;
            window.appState.saveState();
            e.currentTarget.textContent = speechActive ? '🗣️' : '😶';
            e.currentTarget.title = speechActive ? 'Voice Reading On' : 'Voice Off';
        });

        // Fullscreen toggle for tablets & interactive kiosks
        const fsBtn = document.getElementById('fullscreen-btn');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                window.audioEngine.playClick();
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    fsBtn.textContent = '🗗';
                } else {
                    document.exitFullscreen().catch(() => {});
                    fsBtn.textContent = '⛶';
                }
            });
        }
    }

    updateHeaderStats() {
        const starEl = document.getElementById('header-stars-count');
        if (starEl) {
            starEl.textContent = window.appState.data.stars;
        }

        const nameEl = document.getElementById('profile-name-tag');
        if (nameEl) {
            nameEl.textContent = window.appState.data.childName;
        }

        const ageBadge = document.getElementById('profile-age-tag');
        if (ageBadge) {
            const map = { toddler: 'Ages 3-5 (Toddler)', explorer: 'Ages 6-8 (Explorer)', master: 'Ages 9+ (Super Star)' };
            ageBadge.textContent = map[window.appState.data.ageGroup] || 'Explorer';
        }
    }

    renderHubGameCards() {
        const grid = document.getElementById('games-grid');
        grid.innerHTML = '';

        Object.values(this.games).forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card bounce-hover';
            card.innerHTML = `
                <div class="card-icon-bubble" style="background: ${game.badgeColor}">
                    <span>${game.emoji}</span>
                </div>
                <div class="card-content">
                    <span class="card-tag">${game.category}</span>
                    <h3 class="card-title">${game.title}</h3>
                    <p class="card-desc">${game.desc}</p>
                </div>
                <button class="card-play-btn" data-game="${game.id}">
                    Play Now ▶
                </button>
            `;

            card.addEventListener('click', () => {
                this.launchGame(game.id);
            });

            grid.appendChild(card);
        });
    }

    launchGame(gameId) {
        const game = this.games[gameId];
        if (!game) return;

        if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
            try { this.activeGameInstance.destroy(); } catch (err) {}
        }

        window.audioEngine.playPop();
        this.hubView.classList.add('hidden');
        this.gameView.classList.remove('hidden');
        this.gameView.innerHTML = '';

        this.activeGameInstance = game.instantiate(this.gameView);
        this.activeGameInstance.start();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showHub() {
        if (this.activeGameInstance && typeof this.activeGameInstance.destroy === 'function') {
            try { this.activeGameInstance.destroy(); } catch (err) {}
        }
        this.gameView.classList.add('hidden');
        this.gameView.innerHTML = '';
        this.activeGameInstance = null;
        this.hubView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    openModal(titleHtml, bodyHtml) {
        this.modalContainer.innerHTML = `
            <div class="modal-backdrop">
                <div class="modal-dialog bounce-in">
                    <div class="modal-header">
                        <h2>${titleHtml}</h2>
                        <button class="modal-close-btn" id="modal-close-x">✕</button>
                    </div>
                    <div class="modal-body">
                        ${bodyHtml}
                    </div>
                </div>
            </div>
        `;
        this.modalContainer.classList.remove('hidden');

        document.getElementById('modal-close-x').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.closeModal();
        });

        this.modalContainer.querySelector('.modal-backdrop').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        this.modalContainer.classList.add('hidden');
        this.modalContainer.innerHTML = '';
    }

    openStickersModal() {
        const stickers = window.appState.data.availableStickers;
        const unlocked = window.appState.data.unlockedStickers;
        const badges = window.appState.data.badges;
        const stars = window.appState.data.stars;

        const stickerCardsHtml = stickers.map(s => {
            const isUnlocked = unlocked.includes(s.id);
            return `
                <div class="sticker-collectible-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}">
                    <div class="collectible-emoji">${s.emoji}</div>
                    <div class="collectible-name">${s.name}</div>
                    <div class="collectible-status">
                        ${isUnlocked ? '✅ Unlocked' : `🔒 Need ${s.starsNeeded} ⭐`}
                    </div>
                </div>
            `;
        }).join('');

        const badgesHtml = badges.map(b => `
            <div class="badge-item ${b.earned ? 'earned' : 'locked'}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-info">
                    <h4>${b.name}</h4>
                    <p>${b.desc}</p>
                </div>
                <div class="badge-tag">${b.earned ? '🌟 Earned' : 'Locked'}</div>
            </div>
        `).join('');

        const html = `
            <div class="sticker-book-wrapper">
                <div class="star-counter-banner">
                    <span>You have <strong>${stars} ⭐ Stars</strong>! Play games to unlock more magical stickers!</span>
                </div>
                
                <h3 class="modal-subheading">🎁 Collectible Stickers for Art Studio</h3>
                <div class="sticker-shelf-grid">
                    ${stickerCardsHtml}
                </div>

                <h3 class="modal-subheading" style="margin-top: 24px;">🏆 Achievement Badges</h3>
                <div class="badges-list">
                    ${badgesHtml}
                </div>
            </div>
        `;

        this.openModal('⭐ Sticker Book & Trophy Room', html);
        window.audioEngine.speak(`You have ${stars} stars! Here are your stickers and badges!`);
    }

    openParentModal() {
        const stats = window.appState.data;
        const high = stats.highScores;

        const html = `
            <div class="parent-dashboard-wrapper">
                <p class="parent-intro">
                    Welcome to the Parent & Educator Hub. Track learning progress, cognitive skills, and encourage daily discovery.
                </p>

                <div class="report-cards-grid">
                    <div class="report-card">
                        <div class="report-icon">⭐</div>
                        <div class="report-number">${stats.stars}</div>
                        <div class="report-label">Total Stars Earned</div>
                    </div>
                    <div class="report-card">
                        <div class="report-icon">🏆</div>
                        <div class="report-number">${stats.badges.filter(b => b.earned).length} / ${stats.badges.length}</div>
                        <div class="report-label">Badges Achieved</div>
                    </div>
                    <div class="report-card">
                        <div class="report-icon">🎨</div>
                        <div class="report-number">${stats.unlockedStickers.length}</div>
                        <div class="report-label">Stickers Unlocked</div>
                    </div>
                </div>

                <h4 style="margin-top: 20px; color: #2D3748;">Learning Domains Practiced:</h4>
                <ul class="skills-list">
                    <li>🔢 <strong>Math Galaxy:</strong> Number sense, counting, arithmetic calculation (High Score: ${high.math || 0})</li>
                    <li>📖 <strong>Safari Phonics:</strong> Word spelling, phonetic awareness, zoology facts (High Score: ${high.spelling || 0})</li>
                    <li>🧠 <strong>Memory Match:</strong> Visual recall, working memory & spatial focus (Best Score: ${high.memory || 0})</li>
                    <li>🔷 <strong>Shape & Color Sorter:</strong> Geometry, classification, categorizing (High Score: ${high.shapes || 0})</li>
                    <li>🌿 <strong>Habitat Explorer:</strong> Geography, ecosystems, animal science (High Score: ${high.habitats || 0})</li>
                    <li>🎵 <strong>Rainbow Piano:</strong> Musical solfege, melody imitation, auditory recognition</li>
                    <li>🤖 <strong>Code-a-Bot:</strong> Algorithmic sequencing, spatial turns, debugging</li>
                    <li>⏰ <strong>Chrono-Clock:</strong> Analog time, elapsed time, daily routines</li>
                    <li>🏪 <strong>Junior Market:</strong> Coin values, financial literacy, practical math</li>
                    <li>👁️ <strong>AI Quick Draw:</strong> Geometric feature vision, sketch recognition</li>
                    <li>📖 <strong>AI TaleSpinner:</strong> Dynamic narrative synthesis, creative branching choices</li>
                    <li>💖 <strong>AI Emotion Bot:</strong> Facial landmark analysis, empathy & SEL</li>
                </ul>

                <div class="parent-tip-box">
                    💡 <strong>Tip for Parents:</strong> Try AI TaleSpinner together! Ask your child why they chose specific branching paths to nurture creative reasoning.
                </div>
            </div>
        `;

        this.openModal('👨‍👩‍👧 Parent & Learning Report', html);
    }

    openSettingsModal() {
        const currentAge = window.appState.data.ageGroup;
        const currentName = window.appState.data.childName;

        const html = `
            <div class="settings-form">
                <div class="settings-row">
                    <label>Explorer Name:</label>
                    <input type="text" id="settings-name-input" class="kid-input" value="${currentName}" maxlength="18" placeholder="Enter name...">
                </div>

                <div class="settings-row">
                    <label>Age & Learning Level:</label>
                    <div class="age-pills-selector">
                        <label class="age-pill-option ${currentAge === 'toddler' ? 'checked' : ''}">
                            <input type="radio" name="age-tier" value="toddler" ${currentAge === 'toddler' ? 'checked' : ''}>
                            <strong>Toddler (3 - 5)</strong>
                            <span>Counting, basic shapes, 3-letter words</span>
                        </label>
                        <label class="age-pill-option ${currentAge === 'explorer' ? 'checked' : ''}">
                            <input type="radio" name="age-tier" value="explorer" ${currentAge === 'explorer' ? 'checked' : ''}>
                            <strong>Explorer (6 - 8)</strong>
                            <span>Addition/subtraction, 4-5 letter spelling, habitats</span>
                        </label>
                        <label class="age-pill-option ${currentAge === 'master' ? 'checked' : ''}">
                            <input type="radio" name="age-tier" value="master" ${currentAge === 'master' ? 'checked' : ''}>
                            <strong>Super Star (9+)</strong>
                            <span>Multiplication, mental math, advanced words</span>
                        </label>
                    </div>
                </div>

                <div class="modal-footer-action">
                    <button class="primary-btn" id="save-settings-btn">Save Changes ✨</button>
                </div>
            </div>
        `;

        this.openModal('⚙️ Settings & Age Level', html);

        // Highlight selected pill
        document.querySelectorAll('input[name="age-tier"]').forEach(radio => {
            radio.addEventListener('change', () => {
                document.querySelectorAll('.age-pill-option').forEach(p => p.classList.remove('checked'));
                radio.closest('.age-pill-option').classList.add('checked');
                window.audioEngine.playPop();
            });
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            const nameInput = document.getElementById('settings-name-input');
            const selectedAge = document.querySelector('input[name="age-tier"]:checked')?.value || 'explorer';
            
            window.appState.setName(nameInput.value.trim());
            window.appState.setAgeGroup(selectedAge);
            this.updateHeaderStats();

            window.audioEngine.playCorrect();
            this.closeModal();
            window.audioEngine.speak(`Awesome! Settings saved for ${window.appState.data.childName}!`);
        });
    }

    openScoutAIModal() {
        const name = window.appState.data.childName;
        const html = `
            <div class="scout-ai-modal-wrapper">
                <div class="scout-bot-header">
                    <div class="scout-avatar-large">🤖</div>
                    <div class="scout-greeting-box">
                        <h3>Hi ${name}! I'm Scout AI!</h3>
                        <p id="scout-ai-response-text">
                            I'm your intelligent learning companion! Ask me any curious question about science, nature, space, or get a hint!
                        </p>
                        <button class="safari-sound-btn" id="scout-hear-btn">🔊 Read Aloud</button>
                    </div>
                </div>

                <div class="curious-prompts-section">
                    <span class="prompt-group-label">Quick Curious Questions:</span>
                    <div class="ai-chips-grid">
                        <button class="ai-question-chip" data-q="sky">🌌 Why is the sky blue?</button>
                        <button class="ai-question-chip" data-q="stars">⭐ What are stars?</button>
                        <button class="ai-question-chip" data-q="rainbow">🌈 How do rainbows form?</button>
                        <button class="ai-question-chip" data-q="robots">🤖 How do robots think?</button>
                        <button class="ai-question-chip" data-q="dino">🦖 Why are dinos special?</button>
                        <button class="ai-question-chip" data-q="cats">🐱 Why do cats purr?</button>
                    </div>
                </div>

                <div class="scout-custom-question-row">
                    <input type="text" id="custom-ai-query" class="kid-input" placeholder="Type a curious question (e.g. ocean, stars)...">
                    <button class="primary-btn" id="ask-ai-submit-btn">Ask AI! ✨</button>
                </div>
            </div>
        `;

        this.openModal('🤖 Ask Scout AI Companion', html);

        const responseBox = document.getElementById('scout-ai-response-text');

        document.getElementById('scout-hear-btn').addEventListener('click', () => {
            window.audioEngine.speak(responseBox.textContent);
        });

        // Question chip clicks
        document.querySelectorAll('.ai-question-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const topic = e.currentTarget.dataset.q;
                window.audioEngine.playPop();
                const answer = window.scoutAI.askQuestion(topic);
                responseBox.textContent = answer;
                window.audioEngine.speak(answer);
            });
        });

        const handleAsk = () => {
            const input = document.getElementById('custom-ai-query');
            const q = input.value.trim();
            if (q) {
                window.audioEngine.playPop();
                const answer = window.scoutAI.askQuestion(q);
                responseBox.textContent = answer;
                window.audioEngine.speak(answer);
                input.value = '';
            }
        };

        document.getElementById('ask-ai-submit-btn').addEventListener('click', handleAsk);
        document.getElementById('custom-ai-query').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAsk();
        });

        window.audioEngine.speak(`Hi ${name}! I am Scout A I! Ask me any curious question!`);
    }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CurioScoutApp();
});
