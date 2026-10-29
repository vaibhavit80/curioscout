// Game State & Persistence (Stars, Badges, Stickers, Profiles)
class AppState {
    constructor() {
        this.STORAGE_KEY = 'curioscout_game_state_v1';
        this.data = this.loadState();
        this.listeners = [];
    }

    getDefaultState() {
        return {
            childName: 'Curio Scout',
            ageGroup: 'explorer', // 'toddler' (3-5), 'explorer' (6-8), 'master' (9+)
            stars: 0,
            soundEnabled: true,
            voiceEnabled: true,
            highScores: {
                math: 0,
                spelling: 0,
                memory: 0,
                shapes: 0,
                habitats: 0,
                music: 0
            },
            unlockedStickers: ['rocket', 'star', 'cat'],
            stickersPlaced: [], // Stickers placed on doodle board
            badges: [
                { id: 'first_play', name: 'First Steps', icon: '🌟', desc: 'Played your very first game!', earned: true },
                { id: 'math_wizard', name: 'Math Star', icon: '🪐', desc: 'Solved 10 math challenges!', earned: false },
                { id: 'word_master', name: 'Word Explorer', icon: '🦁', desc: 'Spelled 5 animals correctly!', earned: false },
                { id: 'memory_pro', name: 'Brain Spark', icon: '🧠', desc: 'Finished a Memory Match game!', earned: false },
                { id: 'artist', name: 'Master Artist', icon: '🎨', desc: 'Created a colorful masterpiece!', earned: false },
                { id: 'maestro', name: 'Music Maestro', icon: '🎵', desc: 'Played a nursery rhyme tune!', earned: false },
                { id: 'nature_hero', name: 'Eco-Hero', icon: '🌿', desc: 'Matched animals to their habitats!', earned: false },
                { id: 'collector', name: 'Super Collector', icon: '🏆', desc: 'Earned 50 stars!', earned: false }
            ],
            availableStickers: [
                { id: 'rocket', emoji: '🚀', name: 'Space Rocket', starsNeeded: 0 },
                { id: 'star', emoji: '⭐', name: 'Golden Star', starsNeeded: 0 },
                { id: 'cat', emoji: '🐱', name: 'Curious Cat', starsNeeded: 0 },
                { id: 'dino', emoji: '🦖', name: 'Friendly T-Rex', starsNeeded: 5 },
                { id: 'unicorn', emoji: '🦄', name: 'Magic Unicorn', starsNeeded: 10 },
                { id: 'alien', emoji: '👾', name: 'Happy Alien', starsNeeded: 15 },
                { id: 'lion', emoji: '🦁', name: 'Safari Lion', starsNeeded: 20 },
                { id: 'rainbow', emoji: '🌈', name: 'Rainbow Wonder', starsNeeded: 25 },
                { id: 'robot', emoji: '🤖', name: 'Beep Robot', starsNeeded: 30 },
                { id: 'dolphin', emoji: '🐬', name: 'Playful Dolphin', starsNeeded: 40 },
                { id: 'crown', emoji: '👑', name: 'Royal Crown', starsNeeded: 50 },
                { id: 'planet', emoji: '🪐', name: 'Saturn Rings', starsNeeded: 65 }
            ]
        };
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...this.getDefaultState(), ...parsed };
            }
        } catch (e) {
            console.error('Failed to load local state:', e);
        }
        return this.getDefaultState();
    }

    saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            this.notify();
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }

    subscribe(fn) {
        this.listeners.push(fn);
    }

    notify() {
        this.listeners.forEach(fn => fn(this.data));
    }

    addStars(amount) {
        this.data.stars += amount;
        if (this.data.stars >= 50) {
            this.unlockBadge('collector');
        }
        this.checkStickerUnlocks();
        this.saveState();
        return this.data.stars;
    }

    unlockBadge(badgeId) {
        const badge = this.data.badges.find(b => b.id === badgeId);
        if (badge && !badge.earned) {
            badge.earned = true;
            this.saveState();
            return badge;
        }
        return null;
    }

    checkStickerUnlocks() {
        let newlyUnlocked = [];
        this.data.availableStickers.forEach(sticker => {
            if (this.data.stars >= sticker.starsNeeded && !this.data.unlockedStickers.includes(sticker.id)) {
                this.data.unlockedStickers.push(sticker.id);
                newlyUnlocked.push(sticker);
            }
        });
        return newlyUnlocked;
    }

    updateHighScore(gameKey, score) {
        if (!this.data.highScores[gameKey] || score > this.data.highScores[gameKey]) {
            this.data.highScores[gameKey] = score;
            this.saveState();
            return true;
        }
        return false;
    }

    setAgeGroup(group) {
        this.data.ageGroup = group;
        this.saveState();
    }

    setName(name) {
        this.data.childName = name || 'Little Explorer';
        this.saveState();
    }
}

window.appState = new AppState();
