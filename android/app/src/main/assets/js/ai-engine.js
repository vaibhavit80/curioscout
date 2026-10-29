// CurioScout Intelligent In-Browser AI Engine
// High-Accuracy Vision Classification, Landmark Emotion Analysis & Adaptive Learning

class ScoutAIEngine {
    constructor() {
        this.activeSessionContext = {
            game: null,
            difficulty: 'normal',
            consecutiveErrors: 0,
            consecutiveSuccess: 0
        };

        this.categories = {
            sun: { id: 'sun', name: 'Sun', emoji: '☀️' },
            star: { id: 'star', name: 'Star', emoji: '⭐' },
            face: { id: 'face', name: 'Smiley Face', emoji: '😊' },
            flower: { id: 'flower', name: 'Flower', emoji: '🌸' },
            tree: { id: 'tree', name: 'Tree', emoji: '🌲' },
            house: { id: 'house', name: 'House', emoji: '🏠' },
            fish: { id: 'fish', name: 'Fish', emoji: '🐟' },
            heart: { id: 'heart', name: 'Heart', emoji: '💖' },
            cloud: { id: 'cloud', name: 'Cloud', emoji: '☁️' },
            apple: { id: 'apple', name: 'Apple', emoji: '🍎' },
            car: { id: 'car', name: 'Car', emoji: '🚗' },
            butterfly: { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
            sailboat: { id: 'sailboat', name: 'Sailboat', emoji: '⛵' },
            moon: { id: 'moon', name: 'Crescent Moon', emoji: '🌙' },
            icecream: { id: 'icecream', name: 'Ice Cream', emoji: '🍦' },
            glasses: { id: 'glasses', name: 'Glasses', emoji: '👓' }
        };

        this.knowledgeBase = {
            sky: "The sky looks blue because Earth's atmosphere scatters sunlight in all directions, and blue light waves scatter more than other colors because they travel as shorter, smaller waves!",
            stars: "Stars are gigantic glowing balls of super-hot gas, mostly hydrogen and helium! Our Sun is the closest star to Earth!",
            rainbow: "Rainbows happen when sunlight shines through raindrops. The water drops act like tiny prisms that split white light into all the colors of the rainbow!",
            robots: "Robots are smart machines that follow sequences of instructions called code written by software engineers like you in Code-a-Bot!",
            dino: "Dinosaurs ruled the Earth for 165 million years! Birds alive today are actually the descendants of feathered theropod dinosaurs!",
            ocean: "Over 70% of our planet is covered in oceans, and we have only explored about 5% of deep sea waters!",
            money: "Money was invented so people didn't have to trade goats for shoes! It gives everything a standard value we can count and save!",
            cats: "Cats purr not just when they are happy, but also because the gentle sound frequency helps their muscles and bones heal!"
        };
    }

    // =========================================================================
    // HIGH-ACCURACY COMPUTER VISION: SPATIAL GRID & GEOMETRIC FEATURE EXTRACTION
    // =========================================================================
    classifyDrawing(strokes, canvasWidth, canvasHeight, targetHint = null) {
        if (!strokes || strokes.length === 0) {
            return { label: 'Empty Canvas', id: null, confidence: 0, emoji: '✏️', guesses: [] };
        }

        // 1. Gather all points & calculate global bounds
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        let totalPoints = 0;
        let totalLength = 0;
        let sumX = 0, sumY = 0;

        const strokeMeta = strokes.map(stroke => {
            let sLen = 0;
            let sMinX = Infinity, sMaxX = -Infinity, sMinY = Infinity, sMaxY = -Infinity;

            for (let i = 0; i < stroke.length; i++) {
                const pt = stroke[i];
                totalPoints++;
                sumX += pt.x;
                sumY += pt.y;

                if (pt.x < minX) minX = pt.x;
                if (pt.x > maxX) maxX = pt.x;
                if (pt.y < minY) minY = pt.y;
                if (pt.y > maxY) maxY = pt.y;

                if (pt.x < sMinX) sMinX = pt.x;
                if (pt.x > sMaxX) sMaxX = pt.x;
                if (pt.y < sMinY) sMinY = pt.y;
                if (pt.y > sMaxY) sMaxY = pt.y;

                if (i > 0) {
                    const prev = stroke[i - 1];
                    sLen += Math.hypot(pt.x - prev.x, pt.y - prev.y);
                }
            }
            totalLength += sLen;

            // Check if stroke forms a closed or nearly-closed loop
            const startPt = stroke[0];
            const endPt = stroke[stroke.length - 1];
            const isLoop = stroke.length > 5 && Math.hypot(startPt.x - endPt.x, startPt.y - endPt.y) < Math.max(25, sLen * 0.25);

            return {
                length: sLen,
                isLoop,
                width: Math.max(1, sMaxX - sMinX),
                height: Math.max(1, sMaxY - sMinY),
                cx: (sMinX + sMaxX) / 2,
                cy: (sMinY + sMaxY) / 2
            };
        });

        const width = Math.max(10, maxX - minX);
        const height = Math.max(10, maxY - minY);
        const aspectRatio = width / height; // > 1 is wide, < 1 is tall
        const diag = Math.hypot(width, height);
        const strokeCount = strokes.length;

        // PREVENT PREMATURE IDENTIFICATION:
        // A child cannot draw a recognizable object with under 35 points, under 140px total length, or under 50px dimensions!
        if (totalPoints < 35 || totalLength < 140 || Math.max(width, height) < 50) {
            return {
                label: 'Drawing in progress...',
                id: null,
                confidence: 0,
                emoji: '✏️',
                guesses: [
                    { name: 'Drawing in progress...', emoji: '✏️', confidence: 0 }
                ]
            };
        }

        // Centroid normalized to [0, 1] relative to bounding box
        const centroidNormX = (sumX / totalPoints - minX) / width;
        const centroidNormY = (sumY / totalPoints - minY) / height;

        // 2. Spatial 3x3 Quadrant Density Grid (Convolutional Pooling)
        // [TL, TM, TR]
        // [ML, MM, MR]
        // [BL, BM, BR]
        const grid3x3 = Array(9).fill(0);
        strokes.forEach(stroke => {
            stroke.forEach(pt => {
                const col = Math.min(2, Math.max(0, Math.floor(((pt.x - minX) / width) * 3)));
                const row = Math.min(2, Math.max(0, Math.floor(((pt.y - minY) / height) * 3)));
                grid3x3[row * 3 + col]++;
            });
        });
        const gridNorm = grid3x3.map(v => totalPoints > 0 ? v / totalPoints : 0);

        const hasAnyLoop = strokeMeta.some(s => s.isLoop);
        const loopsCount = strokeMeta.filter(s => s.isLoop).length;

        // Direction / Corner turn detection for continuous stroke analysis
        let directionChanges = 0;
        strokes.forEach(s => {
            if (s.length > 8) {
                for (let i = 4; i < s.length - 4; i += 3) {
                    const v1x = s[i].x - s[i - 3].x;
                    const v1y = s[i].y - s[i - 3].y;
                    const v2x = s[i + 3].x - s[i].x;
                    const v2y = s[i + 3].y - s[i].y;
                    const dot = v1x * v2x + v1y * v2y;
                    const mag = (Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y)) || 0.001;
                    const cosA = dot / mag;
                    if (cosA < 0.25) directionChanges++; // Sharp turn < 75 degrees
                }
            }
        });

        // 3. Category Evaluation Models (Clean zero-bias priors)
        const scores = {};
        Object.keys(this.categories).forEach(k => { scores[k] = 5; });

        // --- SUN ---
        // Requires circular center AND radiating rays (strokeCount >= 3 or zig-zag directionChanges >= 6)
        let sunScore = 5;
        const radialCoverage = (gridNorm[0] > 0.03 ? 1 : 0) + (gridNorm[1] > 0.03 ? 1 : 0) +
                               (gridNorm[2] > 0.03 ? 1 : 0) + (gridNorm[3] > 0.03 ? 1 : 0) +
                               (gridNorm[5] > 0.03 ? 1 : 0) + (gridNorm[6] > 0.03 ? 1 : 0) +
                               (gridNorm[7] > 0.03 ? 1 : 0) + (gridNorm[8] > 0.03 ? 1 : 0);
        
        if (Math.abs(aspectRatio - 1.0) < 0.35) sunScore += 15;
        if (hasAnyLoop) sunScore += 25; // Center sun body
        if (strokeCount >= 3) sunScore += 35; // Center + separate rays!
        if (radialCoverage >= 5) sunScore += 15;
        // A single circle without rays is NOT a finished sun
        if (strokeCount < 3 && directionChanges < 6) sunScore = Math.min(35, sunScore);
        scores.sun = sunScore;

        // --- STAR ---
        // Requires continuous jagged star (directionChanges >= 4) OR crossed lines (strokeCount >= 3)
        let starScore = 5;
        if (Math.abs(aspectRatio - 1.0) < 0.30) starScore += 15;
        if (gridNorm[4] > 0.15) starScore += 15; // Dense center intersection
        if (strokeCount === 1 && totalLength / diag > 2.6 && directionChanges >= 4) {
            starScore += 55; // Classic continuous 5-point star
        } else if (strokeCount >= 3 && strokeCount <= 6 && !hasAnyLoop && (gridNorm[4] > 0.12)) {
            starScore += 45; // Crossed line star
        } else {
            // A simple line or smooth curve can NEVER score high on Star!
            starScore = Math.min(25, starScore);
        }
        scores.star = starScore;

        // --- SMILEY FACE ---
        // Outer loop + internal features (eyes & mouth: strokeCount >= 3)
        let faceScore = 5;
        if (hasAnyLoop) faceScore += 25;
        if (Math.abs(aspectRatio - 1.0) < 0.30) faceScore += 15;
        if (centroidNormY > 0.42 && centroidNormY < 0.58) faceScore += 15;
        if (strokeCount >= 3 && strokeCount <= 7) {
            faceScore += 35; // Face + eyes + mouth!
        } else if (strokeCount < 3) {
            faceScore = Math.min(35, faceScore); // Just head, missing eyes/smile
        }
        scores.face = faceScore;

        // --- FLOWER ---
        // Center loop/petals + stem on bottom
        let flowerScore = 5;
        if (hasAnyLoop) flowerScore += 25;
        if (centroidNormY < 0.50) flowerScore += 15; // Top-heavy blossom
        if (aspectRatio < 0.95) flowerScore += 20; // Taller than wide (stem)
        if (gridNorm[7] > 0.12 || gridNorm[6] > 0.1) flowerScore += 20; // Stem down in bottom center
        if (strokeCount >= 2) flowerScore += 15;
        if (strokeCount < 2) flowerScore = Math.min(30, flowerScore);
        scores.flower = flowerScore;

        // --- TREE ---
        // Tall aspect ratio (W < H), heavy mass in top 2/3 (foliage), narrow central vertical trunk at bottom
        let treeScore = 5;
        if (aspectRatio < 0.85) treeScore += 35; // Distinctly vertical
        if (centroidNormY < 0.46) treeScore += 25; // Top heavy leaves
        const botTrunkRatio = gridNorm[7] / (gridNorm[6] + gridNorm[7] + gridNorm[8] + 0.001);
        if (botTrunkRatio > 0.50) treeScore += 25; // Narrow center trunk
        scores.tree = treeScore;

        // --- HOUSE ---
        // Wide base at bottom + apex at top center (roof) + multiple strokes
        let houseScore = 5;
        if (gridNorm[1] > 0.10 && gridNorm[0] + gridNorm[2] < 0.30) houseScore += 30; // Roof apex top center
        if (gridNorm[6] > 0.06 && gridNorm[8] > 0.06) houseScore += 25; // Wide base corners
        if (strokeCount >= 2 && strokeCount <= 8) houseScore += 25;
        if (Math.abs(aspectRatio - 1.0) < 0.4) houseScore += 10;
        if (strokeCount < 2) houseScore = Math.min(25, houseScore);
        scores.house = houseScore;

        // --- FISH ---
        // Distinctly horizontal (aspectRatio > 1.25), loop body, tail at one end
        let fishScore = 5;
        if (aspectRatio > 1.25) fishScore += 35; // Horizontal swim orientation
        if (hasAnyLoop) fishScore += 25; // Fish body
        if (Math.abs(gridNorm[3] - gridNorm[5]) > 0.08) fishScore += 25; // Asymmetric (head vs tail)
        scores.fish = fishScore;

        // --- HEART ---
        // Two symmetric upper lobes (TL & TR), dip in TM, tapers to bottom vertex (BM)
        let heartScore = 5;
        if (gridNorm[0] > 0.08 && gridNorm[2] > 0.08) heartScore += 35; // Twin upper lobes
        if (gridNorm[1] < (gridNorm[0] + gridNorm[2]) * 0.45) heartScore += 25; // Dip in top center
        if (gridNorm[7] > 0.08 && gridNorm[6] < 0.08 && gridNorm[8] < 0.08) heartScore += 25; // Pointed bottom center
        scores.heart = heartScore;

        // --- CLOUD ---
        // Horizontally stretched, wavy top, flatter bottom
        let cloudScore = 5;
        if (aspectRatio > 1.35 && aspectRatio < 2.8) cloudScore += 35;
        if (centroidNormY > 0.45) cloudScore += 20;
        if (hasAnyLoop || directionChanges >= 3) cloudScore += 25;
        scores.cloud = cloudScore;

        // --- APPLE ---
        // Round loop + top stem/leaf (strokeCount >= 2 or top mass)
        let appleScore = 5;
        if (hasAnyLoop && Math.abs(aspectRatio - 1.0) < 0.35) appleScore += 30;
        if (gridNorm[1] > 0.08 || strokeCount >= 2) appleScore += 25; // Stem on top
        if (centroidNormY > 0.46) appleScore += 15; // Slightly bottom heavy
        if (strokeCount < 2 && !hasAnyLoop) appleScore = 0;
        scores.apple = appleScore;

        // --- CAR ---
        // Horizontally elongated (aspectRatio > 1.25), multiple strokes (body + wheels)
        let carScore = 5;
        if (aspectRatio > 1.25) carScore += 30;
        if (gridNorm[6] > 0.08 && gridNorm[8] > 0.08) carScore += 25; // Wheels/base at bottom corners
        if (strokeCount >= 2) carScore += 20;
        if (gridNorm[1] > 0.08 || gridNorm[4] > 0.15) carScore += 15; // Cabin on top
        if (strokeCount < 2) carScore = Math.min(25, carScore);
        scores.car = carScore;

        // --- BUTTERFLY ---
        // Symmetrical left and right wings (gridNorm[3] & gridNorm[5]), center body
        let butterflyScore = 5;
        if (Math.abs(gridNorm[3] - gridNorm[5]) < 0.12 && gridNorm[3] > 0.08) butterflyScore += 35; // Symmetric side wings
        if (gridNorm[4] > 0.10 || gridNorm[1] > 0.08) butterflyScore += 20; // Center thorax
        if (Math.abs(aspectRatio - 1.0) < 0.5) butterflyScore += 20;
        if (strokeCount >= 2 || loopsCount >= 2) butterflyScore += 20;
        scores.butterfly = butterflyScore;

        // --- SAILBOAT ---
        // Flat/curved hull at bottom (BL, BM, BR) + tall mast/sail at top (TM, MM)
        let sailboatScore = 5;
        if (gridNorm[6] + gridNorm[7] + gridNorm[8] > 0.28) sailboatScore += 35; // Bottom hull
        if (gridNorm[1] > 0.10 || gridNorm[4] > 0.15) sailboatScore += 25; // Tall sail
        if (strokeCount >= 2) sailboatScore += 20;
        if (aspectRatio < 1.35) sailboatScore += 15;
        scores.sailboat = sailboatScore;

        // --- CRESCENT MOON ---
        // Open curved arc without loop, asymmetric, vertical/diagonal
        let moonScore = 5;
        if (!hasAnyLoop && totalLength / diag > 1.4 && totalLength / diag < 2.5) moonScore += 35;
        if (Math.abs(gridNorm[3] - gridNorm[5]) > 0.10 || Math.abs(gridNorm[0] - gridNorm[2]) > 0.10) moonScore += 25; // Curved hollow
        if (aspectRatio > 0.6 && aspectRatio < 1.6) moonScore += 20;
        scores.moon = moonScore;

        // --- ICE CREAM ---
        // Top round scoop + bottom pointed triangular cone
        let icecreamScore = 5;
        if (aspectRatio < 0.95) icecreamScore += 25; // Taller than wide
        if (centroidNormY < 0.48) icecreamScore += 25; // Top-heavy scoop
        if (gridNorm[7] > 0.12 && gridNorm[6] < 0.09 && gridNorm[8] < 0.09) icecreamScore += 25; // Pointed cone at bottom
        if (strokeCount >= 2 || hasAnyLoop) icecreamScore += 15;
        scores.icecream = icecreamScore;

        // --- GLASSES ---
        // Distinctly wide (aspectRatio > 1.35), two loops / side lobes with center bridge
        let glassesScore = 5;
        if (aspectRatio > 1.35) glassesScore += 35; // Horizontal width
        if (loopsCount >= 2 || (gridNorm[3] > 0.10 && gridNorm[5] > 0.10)) glassesScore += 35; // Two lenses
        if (gridNorm[4] > 0.05) glassesScore += 20; // Center bridge
        scores.glasses = glassesScore;

        // Target Context Alignment - Only if drawing has genuine structural similarity (score >= 45)
        if (targetHint && scores[targetHint] && scores[targetHint] >= 45) {
            scores[targetHint] = Math.min(96, scores[targetHint] + 12);
        }

        // Format and sort predictions
        const ranked = Object.keys(scores).map(k => ({
            id: k,
            name: this.categories[k].name,
            emoji: this.categories[k].emoji,
            score: Math.min(96, Math.max(10, Math.round(scores[k])))
        })).sort((a, b) => b.score - a.score);

        const top = ranked[0];

        return {
            label: top.name,
            id: top.id,
            emoji: top.emoji,
            confidence: top.score,
            guesses: ranked.slice(0, 3).map(r => ({
                name: r.name,
                emoji: r.emoji,
                confidence: r.score
            }))
        };
    }

    // =========================================================================
    // HIGH-ACCURACY EMOTION VISION AI: FACIAL LANDMARK RECOGNITION
    // =========================================================================
    analyzeFacialLandmarks(faceState) {
        // Geometric landmark coordinates in 200x200 face space
        // Eyebrows: Left (x: 50..85), Right (x: 115..150)
        // Eyes: Left (70, 85), Right (130, 85)
        // Mouth: Left (65), Center (100), Right (135)
        
        let browAngleDeg = 0; // Negative = V-angry, Positive = Drooping sad, High Y = Raised surprise
        let mouthCurvePx = 0; // Positive = Smile upward, Negative = Frown downward
        let eyeOpennessRatio = 0.5;

        // 1. Eyebrow landmark calculation
        if (faceState.eyebrows === 'raised') {
            browAngleDeg = 15; // High vertical shift
        } else if (faceState.eyebrows === 'angry') {
            browAngleDeg = -25; // Steep V-incline
        } else if (faceState.eyebrows === 'sad') {
            browAngleDeg = 25; // Droop toward temple
        } else {
            browAngleDeg = 0; // Neutral horizontal
        }

        // 2. Mouth curvature calculation
        if (faceState.mouth === 'grin') {
            mouthCurvePx = 45; // Deep upward crescent
        } else if (faceState.mouth === 'smile') {
            mouthCurvePx = 25; // Gentle upward arc
        } else if (faceState.mouth === 'frown') {
            mouthCurvePx = -30; // Downward curve
        } else if (faceState.mouth === 'surprised') {
            mouthCurvePx = 0; // Circular open
        }

        // 3. Eye aspect ratio
        if (faceState.eyes === 'wide') eyeOpennessRatio = 0.95;
        else if (faceState.eyes === 'sparkle') eyeOpennessRatio = 0.85;
        else eyeOpennessRatio = 0.50;

        // Softmax multi-class emotion probabilities
        const rawScores = {
            Happy: 10,
            Sad: 10,
            Surprised: 10,
            Frustrated: 10,
            Peaceful: 10
        };

        if (mouthCurvePx > 0) {
            rawScores.Happy += mouthCurvePx * 1.8;
            if (faceState.eyebrows === 'neutral') rawScores.Peaceful += 35;
            if (faceState.eyes === 'sparkle') rawScores.Happy += 25;
        } else if (mouthCurvePx < 0) {
            if (browAngleDeg > 10) rawScores.Sad += 70;
            else if (browAngleDeg < -10) rawScores.Frustrated += 75;
            else {
                rawScores.Sad += 35;
                rawScores.Frustrated += 35;
            }
        } else {
            // Mouth is surprised or neutral
            if (faceState.mouth === 'surprised' || faceState.eyebrows === 'raised') {
                rawScores.Surprised += 75;
                if (eyeOpennessRatio > 0.7) rawScores.Surprised += 20;
            } else {
                rawScores.Peaceful += 55;
            }
        }

        // Normalize to 100%
        const total = Object.values(rawScores).reduce((a, b) => a + b, 0);
        const probabilities = Object.keys(rawScores).map(k => ({
            emotion: k,
            pct: Math.round((rawScores[k] / total) * 100)
        })).sort((a, b) => b.pct - a.pct);

        const primary = probabilities[0];

        // Explanatory diagnosis
        let explanation = "";
        if (primary.emotion === 'Happy') {
            explanation = `Upturned mouth curve (+${mouthCurvePx}px) with relaxed eyebrows indicates happiness & joy!`;
        } else if (primary.emotion === 'Sad') {
            explanation = `Downturned mouth (${mouthCurvePx}px) with drooping eyebrows (+${browAngleDeg}°) signals sadness.`;
        } else if (primary.emotion === 'Frustrated') {
            explanation = `Sharp V-angled eyebrows (${browAngleDeg}°) with tight lips signify anger & frustration!`;
        } else if (primary.emotion === 'Surprised') {
            explanation = `Raised eyebrows and wide circular mouth indicate astonishment & wonder!`;
        } else {
            explanation = `Balanced neutral facial features show calm peacefulness.`;
        }

        return {
            primaryEmotion: primary.emotion,
            confidence: primary.pct,
            probabilities,
            explanation,
            landmarks: {
                browAngleDeg,
                mouthCurvePx,
                eyeOpennessRatio
            }
        };
    }

    // =========================================================================
    // DYNAMIC AI STORY GENERATOR WITH CONTEXTUAL BRANCHING
    // =========================================================================
    generateStoryBeat(hero, world, tool, chapterIndex = 1, decision = null) {
        const stories = {
            1: {
                title: `Chapter 1: The Call to Adventure`,
                text: `In the heart of ${world.name}, ${hero.name} ${hero.emoji} stood before a legendary crystal pediment. Held securely in hand was the ${tool.name} ${tool.emoji}! Suddenly, the atmosphere shimmered with golden star-dust, revealing a hidden split in the trail.`,
                choices: [
                    { id: 'path_stars', text: `Follow the shimmering star-lit river 🌊` },
                    { id: 'path_cave', text: `Venture into the whispering glowing caverns 💎` }
                ],
                moral: 'Every great explorer begins by asking what lies ahead.'
            },
            2: {
                title: `Chapter 2: The Challenge of ${world.name}`,
                text: decision === 'path_stars' 
                    ? `Along the sparkling star-lit river, ${hero.name} met a friendly water-sprite who was trying to clean up fallen stardust. With a quick tap of the ${tool.name} ${tool.emoji}, beams of light gathered the stardust into a radiant beacon!`
                    : `Inside the glowing caverns, musical crystal chimes resonated with each footprint! A little cave-dweller asked ${hero.name} to help decode an ancient glyph using the ${tool.name}.`,
                choices: [
                    { id: 'solve_puzzle', text: `Use the ${tool.name} to solve the ancient mystery! ⚡` },
                    { id: 'make_friend', text: `Unite all the animal friends in cheerful song! 🎵` }
                ],
                moral: 'Teamwork and clever tools can overcome any hurdle.'
            },
            3: {
                title: `Chapter 3: Grand Finale & Scout Celebration`,
                text: `Success! Thanks to ${hero.name}'s brave choices and the wonders of the ${tool.name}, peace and radiant joy were restored across ${world.name}! All the woodland creatures gathered under fireworks to crown ${hero.name} a Master Scout!`,
                choices: [],
                moral: 'Curiosity, kindness, and bravery are your ultimate superpowers!'
            }
        };

        return stories[chapterIndex] || stories[1];
    }

    // Quick AI Fact Answerer
    askQuestion(topic) {
        const key = Object.keys(this.knowledgeBase).find(k => topic.toLowerCase().includes(k));
        if (key) {
            return this.knowledgeBase[key];
        }
        return "That is a brilliant question! Science shows that the more you explore and ask questions, the stronger your brain connections grow!";
    }
}

window.scoutAI = new ScoutAIEngine();
