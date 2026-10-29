// Game 15: Polyomino Tangram World (Ancient Geometric Silhouette Puzzle)
// Teaches spatial awareness, 2D rotation, geometric composition, and figure-ground perception!
class PolyominoTangramGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 5;
        this.currentPuzzle = null;
        this.placedPieceIds = new Set();
        this.selectedTrayPiece = null;

        this.tangramPieces = [
            { id: 'LT1', name: 'Large Triangle Blue', color: '#3B82F6', icon: '📐', size: 'Large', points: '0,0 120,0 0,120' },
            { id: 'LT2', name: 'Large Triangle Purple', color: '#8B5CF6', icon: '📐', size: 'Large', points: '0,0 120,0 0,120' },
            { id: 'MT', name: 'Medium Triangle Orange', color: '#F97316', icon: '🔺', size: 'Medium', points: '0,0 84,0 0,84' },
            { id: 'ST1', name: 'Small Triangle Green', color: '#10B981', icon: '▲', size: 'Small', points: '0,0 60,0 0,60' },
            { id: 'ST2', name: 'Small Triangle Red', color: '#EF4444', icon: '▲', size: 'Small', points: '0,0 60,0 0,60' },
            { id: 'SQ', name: 'Square Yellow', color: '#F59E0B', icon: '🟩', size: 'Square', points: '0,0 60,0 60,60 0,60' },
            { id: 'PA', name: 'Parallelogram Teal', color: '#06B6D4', icon: '🔷', size: 'Parallelogram', points: '0,0 60,0 90,60 30,60' }
        ];

        this.puzzles = [
            {
                id: 'cat',
                name: 'Curious Cat',
                emoji: '🐱',
                silhouetteDesc: 'Assemble the head, ears, body, and tail of this playful kitty!',
                fact: 'Tangram puzzles originated over 1,000 years ago in ancient Song Dynasty China!',
                requiredPieces: ['LT1', 'LT2', 'MT', 'ST1', 'ST2'],
                zones: [
                    { id: 'z1', pieceId: 'LT1', label: 'Body', x: 130, y: 140, rot: 0, width: 90, height: 90 },
                    { id: 'z2', pieceId: 'LT2', label: 'Back', x: 210, y: 140, rot: 90, width: 90, height: 90 },
                    { id: 'z3', pieceId: 'MT', label: 'Head', x: 90, y: 70, rot: 45, width: 70, height: 70 },
                    { id: 'z4', pieceId: 'ST1', label: 'Ear 1', x: 70, y: 25, rot: 0, width: 45, height: 45 },
                    { id: 'z5', pieceId: 'ST2', label: 'Tail', x: 290, y: 190, rot: 135, width: 45, height: 45 }
                ]
            },
            {
                id: 'rocket',
                name: 'Galaxy Rocket',
                emoji: '🚀',
                silhouetteDesc: 'Construct the rocket fuselage, nose cone, and booster wings!',
                fact: 'Rockets reach speeds over 17,500 miles per hour to break through Earth gravity into orbit!',
                requiredPieces: ['LT1', 'LT2', 'MT', 'ST1', 'ST2', 'SQ'],
                zones: [
                    { id: 'z1', pieceId: 'MT', label: 'Nose Cone', x: 175, y: 25, rot: 0, width: 70, height: 70 },
                    { id: 'z2', pieceId: 'SQ', label: 'Cabin', x: 180, y: 95, rot: 0, width: 60, height: 60 },
                    { id: 'z3', pieceId: 'LT1', label: 'Left Wing', x: 110, y: 155, rot: 45, width: 85, height: 85 },
                    { id: 'z4', pieceId: 'LT2', label: 'Right Wing', x: 225, y: 155, rot: -45, width: 85, height: 85 },
                    { id: 'z5', pieceId: 'ST1', label: 'Left Flame', x: 150, y: 235, rot: 180, width: 45, height: 45 },
                    { id: 'z6', pieceId: 'ST2', label: 'Right Flame', x: 220, y: 235, rot: 180, width: 45, height: 45 }
                ]
            },
            {
                id: 'boat',
                name: 'Majestic Sailboat',
                emoji: '⛵',
                silhouetteDesc: 'Fit the sails and boat hull together so it can glide across the waves!',
                fact: 'Sailboats use Bernoulli principle—the same aerodynamic law that allows airplane wings to fly!',
                requiredPieces: ['LT1', 'LT2', 'MT', 'ST1', 'PA'],
                zones: [
                    { id: 'z1', pieceId: 'LT1', label: 'Main Sail', x: 180, y: 40, rot: 0, width: 90, height: 90 },
                    { id: 'z2', pieceId: 'LT2', label: 'Jib Sail', x: 110, y: 70, rot: -90, width: 85, height: 85 },
                    { id: 'z3', pieceId: 'MT', label: 'Mast', x: 160, y: 130, rot: 45, width: 65, height: 65 },
                    { id: 'z4', pieceId: 'PA', label: 'Hull Base', x: 140, y: 195, rot: 0, width: 95, height: 50 },
                    { id: 'z5', pieceId: 'ST1', label: 'Bow', x: 75, y: 195, rot: 180, width: 45, height: 45 }
                ]
            },
            {
                id: 'swan',
                name: 'Graceful Swan',
                emoji: '🦢',
                silhouetteDesc: 'Piece together the arched neck, beak, and floating body of the swan!',
                fact: 'Swans have over 25,000 feathers and mate for life, forming heart shapes with their necks!',
                requiredPieces: ['LT1', 'LT2', 'ST1', 'ST2', 'SQ'],
                zones: [
                    { id: 'z1', pieceId: 'ST1', label: 'Head/Beak', x: 100, y: 35, rot: 45, width: 45, height: 45 },
                    { id: 'z2', pieceId: 'SQ', label: 'Neck', x: 130, y: 75, rot: 45, width: 55, height: 55 },
                    { id: 'z3', pieceId: 'LT1', label: 'Body', x: 175, y: 130, rot: 0, width: 90, height: 90 },
                    { id: 'z4', pieceId: 'LT2', label: 'Wing', x: 235, y: 95, rot: 90, width: 85, height: 85 },
                    { id: 'z5', pieceId: 'ST2', label: 'Tail Feather', x: 300, y: 145, rot: -45, width: 45, height: 45 }
                ]
            },
            {
                id: 'house',
                name: 'Cozy Cottage',
                emoji: '🏠',
                silhouetteDesc: 'Build the triangular roof, chimney, and solid walls of this sweet home!',
                fact: 'Geometric polyominoes are widely used in computer graphic rendering and architecture design!',
                requiredPieces: ['LT1', 'LT2', 'SQ', 'MT', 'ST1'],
                zones: [
                    { id: 'z1', pieceId: 'LT1', label: 'Left Roof', x: 130, y: 55, rot: 45, width: 85, height: 85 },
                    { id: 'z2', pieceId: 'LT2', label: 'Right Roof', x: 210, y: 55, rot: -45, width: 85, height: 85 },
                    { id: 'z3', pieceId: 'ST1', label: 'Chimney', x: 250, y: 25, rot: 0, width: 45, height: 45 },
                    { id: 'z4', pieceId: 'SQ', label: 'Main Wall', x: 150, y: 140, rot: 0, width: 65, height: 65 },
                    { id: 'z5', pieceId: 'MT', label: 'Porch', x: 215, y: 140, rot: 0, width: 70, height: 70 }
                ]
            }
        ];
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.shuffledPuzzles = [...this.puzzles].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);
        this.renderShell();
        this.nextPuzzle();
    }

    destroy() {
        // Cleanup
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board tangram-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="tangram-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Tangram Puzzle:</span>
                            <span id="tangram-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">🧩 <strong id="tangram-placed-count">0/5</strong></span>
                        <span class="stat-badge">⭐ <strong id="tangram-stars">${window.appState.data.stars}</strong></span>
                    </div>
                </div>

                <div class="tangram-scene">
                    <!-- Puzzle Mission Header -->
                    <div class="tangram-header-card">
                        <div class="tangram-badge" id="tangram-badge-emoji">🐱</div>
                        <div class="tangram-info">
                            <h2 class="tangram-title" id="tangram-puzzle-title">Curious Cat</h2>
                            <p class="tangram-desc" id="tangram-puzzle-desc">Tap a piece in your tray, then tap its matching shape in the silhouette!</p>
                        </div>
                        <div class="tangram-actions">
                            <button class="utility-pill-btn" id="tangram-hint-btn">💡 Hint</button>
                            <button class="utility-pill-btn" id="tangram-reset-btn">🔄 Reset</button>
                        </div>
                    </div>

                    <!-- Silhouette Canvas Board -->
                    <div class="tangram-workspace">
                        <div class="tangram-silhouette-board" id="tangram-board">
                            <!-- Drop Zones injected dynamically -->
                        </div>

                        <!-- Piece Tray -->
                        <div class="tangram-tray-container">
                            <div class="tray-label">Your Geometric Puzzle Tray (Tap a piece to pick up):</div>
                            <div class="tangram-pieces-tray" id="tangram-tray">
                                <!-- Pieces injected dynamically -->
                            </div>
                        </div>
                    </div>

                    <div class="feedback-banner" id="tangram-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('tangram-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('tangram-reset-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.resetCurrentPuzzle();
        });

        document.getElementById('tangram-hint-btn').addEventListener('click', () => {
            this.giveHint();
        });
    }

    nextPuzzle() {
        if (this.round >= this.totalRounds) {
            this.finishMission();
            return;
        }

        this.round++;
        this.currentPuzzle = this.shuffledPuzzles[this.round - 1];
        this.placedPieceIds.clear();
        this.selectedTrayPiece = null;

        document.getElementById('tangram-round-indicator').textContent = `${this.round}/${this.totalRounds}`;
        document.getElementById('tangram-badge-emoji').textContent = this.currentPuzzle.emoji;
        document.getElementById('tangram-puzzle-title').textContent = this.currentPuzzle.name;
        document.getElementById('tangram-puzzle-desc').textContent = this.currentPuzzle.silhouetteDesc;
        document.getElementById('tangram-placed-count').textContent = `0/${this.currentPuzzle.zones.length}`;

        this.renderBoard();
        this.renderTray();

        window.audioEngine.speak(`Can you build the ${this.currentPuzzle.name}? Tap a shape from your tray, then place it!`);
    }

    renderBoard() {
        const board = document.getElementById('tangram-board');
        board.innerHTML = '';

        this.currentPuzzle.zones.forEach(zone => {
            const pieceDef = this.tangramPieces.find(p => p.id === zone.pieceId);
            const isPlaced = this.placedPieceIds.has(zone.pieceId);

            const slot = document.createElement('div');
            slot.className = `tangram-zone-slot ${isPlaced ? 'filled' : 'empty'}`;
            slot.id = `zone-${zone.id}`;
            slot.dataset.zoneId = zone.id;
            slot.dataset.pieceId = zone.pieceId;
            slot.style.left = `${zone.x}px`;
            slot.style.top = `${zone.y}px`;
            slot.style.width = `${zone.width}px`;
            slot.style.height = `${zone.height}px`;
            slot.style.transform = `rotate(${zone.rot}deg)`;

            if (isPlaced) {
                slot.style.backgroundColor = pieceDef.color;
                slot.innerHTML = `<span class="zone-icon">${pieceDef.icon}</span>`;
            } else {
                slot.innerHTML = `<span class="zone-hint-label">${zone.label}</span>`;
            }

            slot.addEventListener('click', () => {
                this.handleZoneClick(zone);
            });

            board.appendChild(slot);
        });
    }

    renderTray() {
        const tray = document.getElementById('tangram-tray');
        tray.innerHTML = '';

        const availablePieces = this.tangramPieces.filter(p => this.currentPuzzle.requiredPieces.includes(p.id));

        availablePieces.forEach(piece => {
            const isPlaced = this.placedPieceIds.has(piece.id);
            const isSelected = this.selectedTrayPiece && this.selectedTrayPiece.id === piece.id;

            const btn = document.createElement('button');
            btn.className = `tangram-tray-piece ${isPlaced ? 'placed' : ''} ${isSelected ? 'selected' : ''}`;
            btn.id = `tray-piece-${piece.id}`;
            btn.style.setProperty('--piece-color', piece.color);

            btn.innerHTML = `
                <div class="tray-piece-bubble" style="background: ${piece.color}">
                    <span>${piece.icon}</span>
                </div>
                <span class="tray-piece-name">${piece.name.split(' ')[0]}</span>
                <span class="tray-piece-size">${piece.size}</span>
            `;

            if (!isPlaced) {
                btn.addEventListener('click', () => {
                    window.audioEngine.playPop();
                    this.selectedTrayPiece = piece;
                    document.querySelectorAll('.tangram-tray-piece').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');

                    const feedback = document.getElementById('tangram-feedback');
                    feedback.innerHTML = `Selected <strong>${piece.name}</strong>! Now tap where it fits on the silhouette!`;
                    feedback.className = 'feedback-banner show-try-again';
                });
            }

            tray.appendChild(btn);
        });
    }

    handleZoneClick(zone) {
        if (this.placedPieceIds.has(zone.pieceId)) {
            // Already placed
            window.audioEngine.playPop();
            return;
        }

        if (!this.selectedTrayPiece) {
            window.audioEngine.playWrong();
            const feedback = document.getElementById('tangram-feedback');
            feedback.innerHTML = `Please select a geometric piece from your bottom tray first!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak('Pick a geometric piece from your tray first!');
            return;
        }

        if (this.selectedTrayPiece.id === zone.pieceId) {
            // Correct fit!
            window.audioEngine.playDing();
            window.audioEngine.playStar();
            this.placedPieceIds.add(zone.pieceId);
            this.selectedTrayPiece = null;

            window.confettiEngine.burst(zone.x + 80, zone.y + 120, 25);

            document.getElementById('tangram-placed-count').textContent = `${this.placedPieceIds.size}/${this.currentPuzzle.zones.length}`;

            this.renderBoard();
            this.renderTray();

            const feedback = document.getElementById('tangram-feedback');
            feedback.innerHTML = `✨ <strong>Perfect Snap!</strong> That piece fits like magic!`;
            feedback.className = 'feedback-banner show-success';

            // Check if entire puzzle is solved
            if (this.placedPieceIds.size === this.currentPuzzle.zones.length) {
                this.handlePuzzleComplete();
            }
        } else {
            // Wrong piece for this zone
            window.audioEngine.playWrong();
            const pieceDef = this.tangramPieces.find(p => p.id === zone.pieceId);
            const feedback = document.getElementById('tangram-feedback');
            feedback.innerHTML = `Oops! This spot needs the <strong>${pieceDef.name}</strong> (${pieceDef.size})!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`That spot needs the ${pieceDef.name}! Try another piece!`);
        }
    }

    giveHint() {
        // Find an unplaced zone and auto-select its piece
        const unplacedZone = this.currentPuzzle.zones.find(z => !this.placedPieceIds.has(z.pieceId));
        if (unplacedZone) {
            const piece = this.tangramPieces.find(p => p.id === unplacedZone.pieceId);
            this.selectedTrayPiece = piece;
            this.renderTray();

            // Highlight zone slot
            const slot = document.getElementById(`zone-${unplacedZone.id}`);
            if (slot) {
                slot.classList.add('hint-pulse');
                setTimeout(() => slot.classList.remove('hint-pulse'), 2000);
            }

            const feedback = document.getElementById('tangram-feedback');
            feedback.innerHTML = `💡 <strong>Hint:</strong> Picked the <strong>${piece.name}</strong> for you! Place it on the glowing spot!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`Here is a hint! Place the ${piece.name} on the glowing shape!`);
        }
    }

    resetCurrentPuzzle() {
        this.placedPieceIds.clear();
        this.selectedTrayPiece = null;
        document.getElementById('tangram-placed-count').textContent = `0/${this.currentPuzzle.zones.length}`;
        this.renderBoard();
        this.renderTray();
        const feedback = document.getElementById('tangram-feedback');
        feedback.className = 'feedback-banner';
    }

    handlePuzzleComplete() {
        window.audioEngine.playCorrect();
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 75);

        this.score += 30;
        window.appState.addStars(4);
        document.getElementById('tangram-stars').textContent = window.appState.data.stars;

        const feedback = document.getElementById('tangram-feedback');
        feedback.innerHTML = `🎉 <strong>${this.currentPuzzle.name.toUpperCase()} COMPLETED!</strong> +4 Stars! ${this.currentPuzzle.fact}`;
        feedback.className = 'feedback-banner show-success';

        window.audioEngine.speak(`Congratulations! You solved the ${this.currentPuzzle.name}! ${this.currentPuzzle.fact}`);

        setTimeout(() => {
            feedback.className = 'feedback-banner';
            this.nextPuzzle();
        }, 3600);
    }

    finishMission() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);
        window.appState.addStars(6);

        const scene = document.querySelector('.tangram-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🧩🏆</div>
                <h2>Tangram Master Architect!</h2>
                <p class="mission-subtitle">You transformed 7 ancient geometric tiles into animals, rockets, and ships!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +6 Polyomino Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                    <div class="reward-item">📐 Spatial Geometry Badge Unlocked!</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="tangram-replay-btn">🎮 Play Again</button>
                    <button class="secondary-btn" id="tangram-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Master Architect! You solved every geometric silhouette with incredible precision!`);

        document.getElementById('tangram-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('tangram-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
