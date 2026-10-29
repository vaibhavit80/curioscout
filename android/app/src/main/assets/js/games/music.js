// Game 6: Rainbow Piano & Nursery Rhyme Maestro
class MusicMaestroGame {
    constructor(container) {
        this.container = container;
        this.currentMode = 'song'; // 'song' or 'freeplay'
        this.currentSongKey = 'twinkle';
        this.songNoteIndex = 0;

        this.notes = [
            { note: 'C4', label: 'Do', key: 'C', freq: 261.63, color: '#FF3B30' },
            { note: 'D4', label: 'Re', key: 'D', freq: 293.66, color: '#FF9500' },
            { note: 'E4', label: 'Mi', key: 'E', freq: 329.63, color: '#FFCC00' },
            { note: 'F4', label: 'Fa', key: 'F', freq: 349.23, color: '#34C759' },
            { note: 'G4', label: 'Sol', key: 'G', freq: 392.00, color: '#00C7BE' },
            { note: 'A4', label: 'La', key: 'A', freq: 440.00, color: '#007AFF' },
            { note: 'B4', label: 'Ti', key: 'B', freq: 493.88, color: '#5856D6' },
            { note: 'C5', label: 'Do', key: 'C5', freq: 523.25, color: '#AF52DE' }
        ];

        this.songs = {
            twinkle: {
                title: 'Twinkle Twinkle Little Star',
                icon: '⭐',
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
            },
            mary: {
                title: 'Mary Had a Little Lamb',
                icon: '🐑',
                notes: ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4', 'D4', 'D4', 'D4', 'E4', 'G4', 'G4']
            },
            macdonald: {
                title: 'Old MacDonald Had a Farm',
                icon: '🚜',
                notes: ['C4', 'C4', 'C4', 'G4', 'A4', 'A4', 'G4', 'E4', 'E4', 'D4', 'D4', 'C4']
            },
            row: {
                title: 'Row Row Row Your Boat',
                icon: '⛵',
                notes: ['C4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'E4', 'F4', 'G4']
            },
            jingle: {
                title: 'Jingle Bells',
                icon: '🔔',
                notes: ['E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'G4', 'C4', 'D4', 'E4', 'F4', 'F4', 'F4']
            },
            birthday: {
                title: 'Happy Birthday to You',
                icon: '🎂',
                notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4']
            },
            babyshark: {
                title: 'Baby Shark Doo Doo',
                icon: '🦈',
                notes: ['D4', 'E4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4', 'G4', 'D4', 'E4', 'G4', 'G4']
            },
            wheels: {
                title: 'The Wheels on the Bus',
                icon: '🚌',
                notes: ['C4', 'F4', 'F4', 'F4', 'F4', 'A4', 'C5', 'A4', 'F4', 'G4', 'E4', 'C4', 'F4']
            },
            brother: {
                title: 'Brother John (Frère Jacques)',
                icon: '⏰',
                notes: ['C4', 'D4', 'E4', 'C4', 'C4', 'D4', 'E4', 'C4', 'E4', 'F4', 'G4', 'E4', 'F4', 'G4']
            },
            london: {
                title: 'London Bridge is Falling Down',
                icon: '🌉',
                notes: ['G4', 'A4', 'G4', 'F4', 'E4', 'F4', 'G4', 'D4', 'E4', 'F4', 'E4', 'F4', 'G4']
            }
        };
    }

    start() {
        this.songNoteIndex = 0;
        this.renderShell();
        this.updateSongGuide();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board music-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="music-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="music-song-selector">
                            <select id="song-select" class="song-dropdown">
                                <option value="twinkle">⭐ Twinkle Twinkle Little Star</option>
                                <option value="mary">🐑 Mary Had a Little Lamb</option>
                                <option value="macdonald">🚜 Old MacDonald Had a Farm</option>
                                <option value="row">⛵ Row Row Row Your Boat</option>
                                <option value="jingle">🔔 Jingle Bells</option>
                                <option value="birthday">🎂 Happy Birthday</option>
                                <option value="babyshark">🦈 Baby Shark</option>
                                <option value="wheels">🚌 Wheels on the Bus</option>
                                <option value="brother">⏰ Brother John</option>
                                <option value="london">🌉 London Bridge</option>
                            </select>
                            <button class="mode-tag-pill ${this.currentMode === 'freeplay' ? 'active' : ''}" id="music-freeplay-toggle">
                                🎹 Free Play
                            </button>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="music-stars">0</strong></span>
                    </div>
                </div>

                <div class="music-scene">
                    <div class="song-prompt-display" id="song-prompt">
                        <div class="song-title-row">
                            <span class="now-playing-label">Song Guide:</span>
                            <span class="song-name-text" id="song-title">Twinkle Twinkle Little Star</span>
                        </div>
                        <div class="song-sheet-notes" id="song-sheet">
                            <!-- Target notes sequence -->
                        </div>
                    </div>

                    <!-- Rainbow Piano / Xylophone Keys -->
                    <div class="rainbow-xylophone" id="xylophone-keys">
                        ${this.notes.map(n => `
                            <button class="piano-key" 
                                    data-note="${n.note}" 
                                    style="--key-color: ${n.color};"
                                    id="key-${n.note}">
                                <span class="key-note-name">${n.note.replace(/[0-9]/g, '')}</span>
                                <span class="key-solfege">${n.label}</span>
                            </button>
                        `).join('')}
                    </div>

                    <div class="feedback-banner" id="music-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('music-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        const songSelect = document.getElementById('song-select');
        songSelect.value = this.currentSongKey;
        songSelect.addEventListener('change', (e) => {
            this.currentSongKey = e.target.value;
            this.songNoteIndex = 0;
            this.currentMode = 'song';
            document.getElementById('music-freeplay-toggle').classList.remove('active');
            document.getElementById('song-prompt').style.display = 'block';
            this.updateSongGuide();
        });

        const freePlayBtn = document.getElementById('music-freeplay-toggle');
        freePlayBtn.addEventListener('click', () => {
            if (this.currentMode === 'song') {
                this.currentMode = 'freeplay';
                freePlayBtn.classList.add('active');
                document.getElementById('song-prompt').style.display = 'none';
                window.audioEngine.speak('Free Play Mode! Tap any key to make music!');
            } else {
                this.currentMode = 'song';
                freePlayBtn.classList.remove('active');
                document.getElementById('song-prompt').style.display = 'block';
                this.updateSongGuide();
            }
        });

        // Attach tap/click listeners to piano keys
        this.notes.forEach(n => {
            const el = document.getElementById(`key-${n.note}`);
            el.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.handleKeyPress(n);
            });
        });
    }

    handleKeyPress(noteObj) {
        // Play note audio
        window.audioEngine.playInstrumentNote(noteObj.freq, 'sine', 0.9);

        // Visual press animation
        const keyEl = document.getElementById(`key-${noteObj.note}`);
        keyEl.classList.add('key-pressed');
        setTimeout(() => keyEl.classList.remove('key-pressed'), 250);

        // In Freeplay, just play sound
        if (this.currentMode === 'freeplay') return;

        // In Song mode, check if matches expected note
        const currentSong = this.songs[this.currentSongKey];
        const expectedNote = currentSong.notes[this.songNoteIndex];

        if (noteObj.note === expectedNote) {
            // Note matched!
            this.songNoteIndex++;
            this.updateSongGuide();

            if (this.songNoteIndex >= currentSong.notes.length) {
                this.finishSong();
            }
        } else {
            // Friendly soft try again
            keyEl.classList.add('key-wrong');
            setTimeout(() => keyEl.classList.remove('key-wrong'), 300);
        }
    }

    updateSongGuide() {
        const currentSong = this.songs[this.currentSongKey];
        document.getElementById('song-title').textContent = currentSong.title;

        // Render sheet note bubbles
        const sheet = document.getElementById('song-sheet');
        sheet.innerHTML = '';

        currentSong.notes.forEach((noteStr, idx) => {
            const bubble = document.createElement('span');
            bubble.className = 'sheet-note-bubble';
            if (idx < this.songNoteIndex) {
                bubble.classList.add('note-played');
            } else if (idx === this.songNoteIndex) {
                bubble.classList.add('note-current');
            }
            bubble.textContent = noteStr.replace(/[0-9]/g, '');
            sheet.appendChild(bubble);
        });

        // Highlight the key to press
        document.querySelectorAll('.piano-key').forEach(k => k.classList.remove('key-highlight-guide'));
        if (this.songNoteIndex < currentSong.notes.length) {
            const nextNote = currentSong.notes[this.songNoteIndex];
            const targetKey = document.getElementById(`key-${nextNote}`);
            if (targetKey) {
                targetKey.classList.add('key-highlight-guide');
            }
        }
    }

    finishSong() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 110);

        window.appState.unlockBadge('maestro');
        window.appState.addStars(4);

        const currentSong = this.songs[this.currentSongKey];
        const feedback = document.getElementById('music-feedback');
        feedback.innerHTML = `🎵 <strong>Bravo!</strong> You played ${currentSong.title}!`;
        feedback.className = 'feedback-banner show-success';

        window.audioEngine.speak(`Bravo! You played ${currentSong.title} beautifully!`);

        setTimeout(() => {
            this.songNoteIndex = 0;
            this.updateSongGuide();
            feedback.className = 'feedback-banner';
        }, 3200);
    }
}
