// Kid-friendly Web Audio Synthesizer & Speech Engine
// 100% self-contained, no external MP3 dependencies!

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.speechEnabled = true;
        this.synth = window.speechSynthesis || null;
        this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);

        // Listen for any user tap/click to unlock AudioContext (browser policy)
        ['click', 'touchstart', 'keydown'].forEach(evt => {
            window.addEventListener(evt, this.initOnFirstInteraction, { once: true });
        });
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnFirstInteraction() {
        this.initContext();
    }

    toggleMute(state) {
        if (typeof state === 'boolean') {
            this.muted = !state;
        } else {
            this.muted = !this.muted;
        }
        return !this.muted;
    }

    toggleSpeech(state) {
        if (typeof state === 'boolean') {
            this.speechEnabled = state;
        } else {
            this.speechEnabled = !this.speechEnabled;
        }
        return this.speechEnabled;
    }

    // Speak text aloud using Web Speech API
    speak(text, { pitch = 1.2, rate = 0.95 } = {}) {
        if (!this.speechEnabled || !this.synth) return;
        try {
            this.synth.cancel(); // Stop any pending speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.pitch = pitch; // Slightly higher pitch sounds friendlier to kids
            utterance.rate = rate;
            
            // Prefer a natural, clear voice
            const voices = this.synth.getVoices();
            const preferredVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Zira')))) || voices.find(v => v.lang.startsWith('en'));
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            this.synth.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
        }
    }

    // Gentle tactile click
    playClick() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Bubble pop sound
    playPop() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
    }

    // Happy ding chime
    playDing(freq = 880) {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    // Correct answer sweet arpeggio (C5 - E5 - G5 - C6)
    playCorrect() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime + (i * 0.08);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.35);
        });
    }

    // Soft "try again" friendly wobble (never scary or sad)
    playWrong() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const t = this.ctx.currentTime;
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.linearRampToValueAtTime(220, t + 0.12);
        osc.frequency.linearRampToValueAtTime(190, t + 0.28);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
    }

    // Star sparkle shimmer
    playStar() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const pitches = [1046.5, 1318.5, 1567.98, 2093.0];
        pitches.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const t = this.ctx.currentTime + (idx * 0.05);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.25);
        });
    }

    // Victory fanfare! (Triumphant trumpet style chords)
    playFanfare() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const notes = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 523.25, t: 0.15, d: 0.15 },
            { f: 523.25, t: 0.30, d: 0.15 },
            { f: 659.25, t: 0.45, d: 0.35 },
            { f: 783.99, t: 0.80, d: 0.25 },
            { f: 1046.50, t: 1.05, d: 0.70 }
        ];

        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const startTime = this.ctx.currentTime + n.t;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, startTime);

            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + n.d);
        });
    }

    // Musical note for Xylophone / Piano
    playInstrumentNote(freq, type = 'sine', duration = 0.8) {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = type; // 'sine' for chime/xylophone, 'triangle' for warm piano
        osc.frequency.setValueAtTime(freq, now);

        // Rich envelope: instant attack, exponential natural decay
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        // Add gentle high overtone for chime richness
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.5));

        osc.connect(gain);
        osc2.connect(gain2);
        gain.connect(this.ctx.destination);
        gain2.connect(this.ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
    }

    // Cash Register Cha-Ching!
    playChaChing() {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        // Two quick high bell rings + low metallic drawer slide
        const bells = [1567.98, 2093.0];
        bells.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = t + (idx * 0.12);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.3, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.4);
        });
    }

    // Robot step beep / boop
    playRobotBeep(freq = 520) {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq * 1.25, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    // Clock tick / tock
    playTick(isTock = false) {
        if (this.muted) return;
        this.initContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isTock ? 700 : 950, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    }
}

// Global singleton instance
window.audioEngine = new SoundEngine();
