// Game 7: Color Studio & Sticker Art Pad
class DoodleArtGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.brushColor = '#FF3B30';
        this.brushSize = 14;
        this.mode = 'brush'; // 'brush', 'rainbow', 'eraser', 'sticker'
        this.selectedSticker = '⭐';
        this.rainbowHue = 0;
        this.history = [];
        this.maxHistory = 15;

        this.templates = [
            { id: 'blank', name: 'Blank Canvas', icon: '📄' },
            { id: 'dino', name: 'Cute Dino', icon: '🦖' },
            { id: 'rocket', name: 'Space Rocket', icon: '🚀' },
            { id: 'unicorn', name: 'Unicorn Magic', icon: '🦄' },
            { id: 'whale', name: 'Happy Whale', icon: '🐳' }
        ];

        this.palette = [
            '#FF3B30', '#FF9500', '#FFCC00', '#34C759', 
            '#00C7BE', '#007AFF', '#5856D6', '#AF52DE', 
            '#FF2D55', '#795548', '#000000', '#FFFFFF'
        ];
    }

    start() {
        this.renderShell();
        this.initCanvas();
        this.loadTemplate('dino');
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board doodle-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="doodle-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="template-selector-pill">
                            ${this.templates.map(t => `
                                <button class="template-pill-btn" data-template="${t.id}" title="${t.name}">
                                    ${t.icon} <span class="template-name-label">${t.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="hud-stats">
                        <button class="utility-pill-btn save-btn" id="doodle-save-btn">💾 Save Art</button>
                        <button class="utility-pill-btn" id="doodle-clear-btn">🗑️ Clear</button>
                    </div>
                </div>

                <div class="doodle-scene">
                    <div class="doodle-toolbar">
                        <!-- Tools -->
                        <div class="tool-section">
                            <span class="tool-label">Magic Tools:</span>
                            <div class="tool-btn-group">
                                <button class="art-tool-btn active" id="tool-brush" title="Crayon Brush">🖍️</button>
                                <button class="art-tool-btn" id="tool-rainbow" title="Rainbow Brush">🌈</button>
                                <button class="art-tool-btn" id="tool-eraser" title="Eraser">🧼</button>
                            </div>
                        </div>

                        <!-- Brush Sizes -->
                        <div class="tool-section">
                            <span class="tool-label">Size:</span>
                            <div class="brush-size-group">
                                <button class="size-dot-btn" data-size="8" title="Small">●</button>
                                <button class="size-dot-btn active" data-size="16" title="Medium">●●</button>
                                <button class="size-dot-btn" data-size="28" title="Chubby Crayon">●●●</button>
                            </div>
                        </div>

                        <!-- Color Swatches -->
                        <div class="tool-section">
                            <span class="tool-label">Colors:</span>
                            <div class="palette-swatches" id="color-palette">
                                ${this.palette.map(c => `
                                    <button class="color-swatch-btn ${c === this.brushColor ? 'selected' : ''}" 
                                            data-color="${c}" 
                                            style="background-color: ${c}"></button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Sticker Stamping Pool -->
                        <div class="tool-section">
                            <span class="tool-label">Stickers (Tap to Stamp):</span>
                            <div class="sticker-stamp-pool" id="sticker-pool">
                                <!-- Populated dynamically from unlocked stickers -->
                            </div>
                        </div>
                    </div>

                    <div class="canvas-wrapper" id="canvas-wrapper">
                        <canvas id="art-canvas"></canvas>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('doodle-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        // Templates
        document.querySelectorAll('.template-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = e.currentTarget.dataset.template;
                window.audioEngine.playPop();
                this.loadTemplate(templateId);
            });
        });

        // Tool buttons
        document.getElementById('tool-brush').addEventListener('click', () => this.setMode('brush'));
        document.getElementById('tool-rainbow').addEventListener('click', () => this.setMode('rainbow'));
        document.getElementById('tool-eraser').addEventListener('click', () => this.setMode('eraser'));

        // Brush sizes
        document.querySelectorAll('.size-dot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.size-dot-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.brushSize = parseInt(btn.dataset.size, 10);
                window.audioEngine.playClick();
            });
        });

        // Color swatches
        document.querySelectorAll('.color-swatch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.color-swatch-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.brushColor = btn.dataset.color;
                if (this.mode === 'eraser') this.setMode('brush');
                window.audioEngine.playClick();
            });
        });

        // Clear canvas
        document.getElementById('doodle-clear-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.clearCanvas();
        });

        // Save canvas
        document.getElementById('doodle-save-btn').addEventListener('click', () => {
            this.saveArtwork();
        });

        this.renderStickerPool();
    }

    renderStickerPool() {
        const pool = document.getElementById('sticker-pool');
        pool.innerHTML = '';

        // Unlocked stickers from AppState
        const unlocked = window.appState.data.unlockedStickers;
        const allStickers = window.appState.data.availableStickers;

        allStickers.forEach(sticker => {
            const isUnlocked = unlocked.includes(sticker.id);
            const btn = document.createElement('button');
            btn.className = `stamp-btn ${isUnlocked ? 'stamp-unlocked' : 'stamp-locked'} ${this.mode === 'sticker' && this.selectedSticker === sticker.emoji ? 'selected' : ''}`;
            btn.textContent = sticker.emoji;
            btn.title = isUnlocked ? `Stamp ${sticker.name}` : `Unlock at ${sticker.starsNeeded} ⭐`;
            
            if (isUnlocked) {
                btn.addEventListener('click', () => {
                    this.mode = 'sticker';
                    this.selectedSticker = sticker.emoji;
                    document.querySelectorAll('.art-tool-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    window.audioEngine.playPop();
                    window.audioEngine.speak(`Tap on the drawing to stamp ${sticker.name}!`);
                });
            }
            pool.appendChild(btn);
        });
    }

    setMode(newMode) {
        this.mode = newMode;
        document.querySelectorAll('.art-tool-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('selected'));

        if (newMode === 'brush') document.getElementById('tool-brush').classList.add('active');
        if (newMode === 'rainbow') document.getElementById('tool-rainbow').classList.add('active');
        if (newMode === 'eraser') document.getElementById('tool-eraser').classList.add('active');

        window.audioEngine.playClick();
    }

    initCanvas() {
        this.canvas = document.getElementById('art-canvas');
        this.ctx = this.canvas.getContext('2d');

        const wrapper = document.getElementById('canvas-wrapper');
        const rect = wrapper.getBoundingClientRect();
        this.canvas.width = Math.min(840, rect.width - 24);
        this.canvas.height = 540;

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Mouse & Touch listeners
        const startDraw = (e) => {
            const pos = this.getCanvasPos(e);
            if (this.mode === 'sticker') {
                this.stampSticker(pos.x, pos.y);
                return;
            }
            this.isDrawing = true;
            this.lastX = pos.x;
            this.lastY = pos.y;
            this.drawDot(pos.x, pos.y);
        };

        const moveDraw = (e) => {
            if (!this.isDrawing || this.mode === 'sticker') return;
            e.preventDefault();
            const pos = this.getCanvasPos(e);
            this.drawLine(this.lastX, this.lastY, pos.x, pos.y);
            this.lastX = pos.x;
            this.lastY = pos.y;
        };

        const endDraw = () => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this.saveHistory();
            }
        };

        this.canvas.addEventListener('mousedown', startDraw);
        this.canvas.addEventListener('mousemove', moveDraw);
        window.addEventListener('mouseup', endDraw);

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDraw(e.touches[0]);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            moveDraw(e.touches[0]);
        }, { passive: false });

        window.addEventListener('touchend', endDraw);
    }

    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    drawDot(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.getStrokeStyle();
        this.ctx.fill();
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineWidth = this.brushSize;
        this.ctx.strokeStyle = this.getStrokeStyle();
        this.ctx.stroke();
    }

    getStrokeStyle() {
        if (this.mode === 'eraser') {
            return '#FFFFFF';
        }
        if (this.mode === 'rainbow') {
            this.rainbowHue = (this.rainbowHue + 4) % 360;
            return `hsl(${this.rainbowHue}, 90%, 55%)`;
        }
        return this.brushColor;
    }

    stampSticker(x, y) {
        this.ctx.font = '54px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.selectedSticker, x, y);

        window.audioEngine.playPop();
        window.confettiEngine.burst(x, y, 12);
        this.saveHistory();
    }

    saveHistory() {
        this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.history = [];
    }

    loadTemplate(templateId) {
        this.clearCanvas();
        if (templateId === 'blank') return;

        // Draw crisp cartoon outline paths for kids to color inside
        this.ctx.save();
        this.ctx.strokeStyle = '#2D3748';
        this.ctx.lineWidth = 5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        if (templateId === 'dino') {
            // Friendly cartoon baby dinosaur outline
            this.ctx.beginPath();
            // Dino body
            this.ctx.ellipse(cx, cy + 40, 110, 80, 0, 0, Math.PI * 2);
            // Dino neck & head
            this.ctx.moveTo(cx - 60, cy + 10);
            this.ctx.quadraticCurveTo(cx - 90, cy - 80, cx - 40, cy - 90);
            this.ctx.quadraticCurveTo(cx + 10, cy - 90, cx + 15, cy - 50);
            this.ctx.quadraticCurveTo(cx - 10, cy - 30, cx - 10, cy + 10);
            // Tail
            this.ctx.moveTo(cx + 90, cy + 20);
            this.ctx.quadraticCurveTo(cx + 160, cy + 40, cx + 180, cy - 10);
            this.ctx.quadraticCurveTo(cx + 150, cy + 60, cx + 100, cy + 70);
            // Legs
            this.ctx.rect(cx - 50, cy + 100, 30, 45);
            this.ctx.rect(cx + 25, cy + 100, 30, 45);
            this.ctx.stroke();

            // Eye & Smile
            this.ctx.beginPath();
            this.ctx.arc(cx - 30, cy - 65, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = '#2D3748';
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cx - 35, cy - 50, 10, 0, Math.PI);
            this.ctx.stroke();

            // Dino spikes
            for (let i = 0; i < 4; i++) {
                const sx = cx + 20 + (i * 25);
                const sy = cy - 25 + (i * 15);
                this.ctx.beginPath();
                this.ctx.moveTo(sx - 10, sy);
                this.ctx.lineTo(sx, sy - 20);
                this.ctx.lineTo(sx + 10, sy);
                this.ctx.stroke();
            }
        } else if (templateId === 'rocket') {
            // Space Rocket Outline
            this.ctx.beginPath();
            // Rocket fuselage
            this.ctx.moveTo(cx, cy - 130);
            this.ctx.quadraticCurveTo(cx + 60, cy - 40, cx + 60, cy + 70);
            this.ctx.lineTo(cx - 60, cy + 70);
            this.ctx.quadraticCurveTo(cx - 60, cy - 40, cx, cy - 130);
            // Wings
            this.ctx.moveTo(cx - 60, cy + 20);
            this.ctx.lineTo(cx - 110, cy + 90);
            this.ctx.lineTo(cx - 60, cy + 70);
            this.ctx.moveTo(cx + 60, cy + 20);
            this.ctx.lineTo(cx + 110, cy + 90);
            this.ctx.lineTo(cx + 60, cy + 70);
            // Engine booster
            this.ctx.rect(cx - 30, cy + 70, 60, 20);
            this.ctx.stroke();

            // Porthole window
            this.ctx.beginPath();
            this.ctx.arc(cx, cy - 20, 28, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.arc(cx, cy - 20, 20, 0, Math.PI * 2);
            this.ctx.stroke();
        } else if (templateId === 'unicorn') {
            // Magic Unicorn Outline
            this.ctx.beginPath();
            // Head
            this.ctx.ellipse(cx - 20, cy - 10, 80, 50, -0.2, 0, Math.PI * 2);
            // Neck
            this.ctx.moveTo(cx + 20, cy + 20);
            this.ctx.lineTo(cx + 50, cy + 110);
            this.ctx.lineTo(cx - 50, cy + 110);
            this.ctx.lineTo(cx - 60, cy + 25);
            // Horn
            this.ctx.moveTo(cx - 40, cy - 50);
            this.ctx.lineTo(cx - 10, cy - 130);
            this.ctx.lineTo(cx, cy - 45);
            // Ear
            this.ctx.moveTo(cx + 15, cy - 55);
            this.ctx.lineTo(cx + 35, cy - 90);
            this.ctx.lineTo(cx + 45, cy - 45);
            this.ctx.stroke();

            // Eye with cute eyelashes
            this.ctx.beginPath();
            this.ctx.arc(cx - 30, cy - 15, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = '#2D3748';
            this.ctx.fill();
        } else if (templateId === 'whale') {
            // Cute Ocean Whale
            this.ctx.beginPath();
            // Body
            this.ctx.ellipse(cx, cy + 10, 130, 75, 0, 0, Math.PI * 2);
            // Tail
            this.ctx.moveTo(cx + 120, cy + 10);
            this.ctx.lineTo(cx + 175, cy - 35);
            this.ctx.quadraticCurveTo(cx + 155, cy + 10, cx + 175, cy + 55);
            this.ctx.lineTo(cx + 120, cy + 15);
            // Fin
            this.ctx.moveTo(cx - 15, cy + 25);
            this.ctx.quadraticCurveTo(cx - 15, cy + 75, cx + 25, cy + 55);
            this.ctx.stroke();

            // Water spout
            this.ctx.beginPath();
            this.ctx.moveTo(cx - 50, cy - 65);
            this.ctx.quadraticCurveTo(cx - 70, cy - 105, cx - 90, cy - 85);
            this.ctx.moveTo(cx - 50, cy - 65);
            this.ctx.quadraticCurveTo(cx - 50, cy - 120, cx - 40, cy - 95);
            this.ctx.moveTo(cx - 50, cy - 65);
            this.ctx.quadraticCurveTo(cx - 30, cy - 105, cx - 10, cy - 85);
            this.ctx.stroke();

            // Eye & Smile
            this.ctx.beginPath();
            this.ctx.arc(cx - 80, cy - 10, 7, 0, Math.PI * 2);
            this.ctx.fillStyle = '#2D3748';
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(cx - 75, cy + 10, 15, 0, Math.PI * 0.7);
            this.ctx.stroke();
        }

        this.ctx.restore();
        this.saveHistory();
    }

    saveArtwork() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 80);

        window.appState.unlockBadge('artist');
        window.appState.addStars(3);

        // Download PNG
        const link = document.createElement('a');
        link.download = `curioscout_masterpiece_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();

        window.audioEngine.speak('Masterpiece saved! You are a brilliant artist!');
    }
}
