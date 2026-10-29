// Game 10: Junior Market & Cash Register
// Teaches coin values, money counting, financial literacy, and practical arithmetic
class JuniorMarketGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.round = 0;
        this.totalRounds = 5;
        this.currentOrder = null;
        this.trayCoins = []; // Coins placed in payment tray

        this.denominations = [
            { id: 'penny', name: 'Penny', value: 1, label: '1¢', icon: '🪙', color: '#CD7F32' },
            { id: 'nickel', name: 'Nickel', value: 5, label: '5¢', icon: '🪙', color: '#BDC3C7' },
            { id: 'dime', name: 'Dime', value: 10, label: '10¢', icon: '🪙', color: '#95A5A6' },
            { id: 'quarter', name: 'Quarter', value: 25, label: '25¢', icon: '🪙', color: '#7F8C8D' },
            { id: 'dollar', name: 'Dollar', value: 100, label: '$1.00', icon: '💵', color: '#2ECC71' }
        ];

        this.orderPool = [
            { customer: '🐰', customerName: 'Bunny Bella', item: 'Fresh Carrot', itemEmoji: '🥕', cents: 25 },
            { customer: '🐻', customerName: 'Bear Barnaby', item: 'Honey Jar', itemEmoji: '🍯', cents: 65 },
            { customer: '🐼', customerName: 'Panda Pip', item: 'Bamboo Cookie', itemEmoji: '🍪', cents: 40 },
            { customer: '🦊', customerName: 'Fox Frankie', item: 'Juicy Strawberry', itemEmoji: '🍓', cents: 35 },
            { customer: '🐶', customerName: 'Puppy Peanut', item: 'Bakery Pretzel', itemEmoji: '🥨', cents: 75 },
            { customer: '🐱', customerName: 'Kitty Cleo', item: 'Fish Cracker', itemEmoji: '🐟', cents: 50 },
            { customer: '🦁', customerName: 'Lion Leo', item: 'Golden Apple', itemEmoji: '🍎', cents: 125 }
        ];
    }

    start() {
        this.score = 0;
        this.round = 0;
        this.trayCoins = [];
        this.orders = [...this.orderPool].sort(() => Math.random() - 0.5).slice(0, this.totalRounds);

        this.renderShell();
        this.nextCustomer();
    }

    renderShell() {
        this.container.innerHTML = `
            <div class="game-board market-board">
                <div class="game-hud">
                    <button class="back-hub-btn" id="market-back-btn">⬅ Hub</button>
                    <div class="hud-center">
                        <div class="progress-pill">
                            <span class="hud-label">Market Orders:</span>
                            <span id="market-round-indicator">1/${this.totalRounds}</span>
                        </div>
                    </div>
                    <div class="hud-stats">
                        <span class="stat-badge">⭐ <strong id="market-stars">0</strong></span>
                    </div>
                </div>

                <div class="market-scene">
                    <!-- Customer Greeting & Stand Counter -->
                    <div class="market-counter-display">
                        <div class="customer-avatar" id="customer-emoji">🐰</div>
                        <div class="customer-speech-bubble" id="customer-bubble">
                            "Hello! I'd love a <strong id="order-item-name">Fresh Carrot</strong> please!"
                            <div class="order-price-tag" id="order-price-tag">Price: $0.25</div>
                        </div>
                        <button class="speech-repeat-btn" id="market-speak-order-btn" title="Hear Customer Order">
                            🔊
                        </button>
                    </div>

                    <!-- Payment Tray on the Checkout Counter -->
                    <div class="checkout-tray-section">
                        <div class="tray-header">
                            <span>🛒 Payment Counter Tray (Tap any coin to take it back):</span>
                            <div class="running-total-pill">
                                Total in Tray: <strong id="tray-total-display">$0.00</strong>
                            </div>
                        </div>
                        <div class="payment-tray" id="payment-tray">
                            <span class="empty-tray-label">Tap coins from the cash drawer below to pay!</span>
                        </div>
                    </div>

                    <!-- Cash Register Drawer (Coins & Bills) -->
                    <div class="cash-drawer-container">
                        <div class="drawer-title">💰 Open Cash Drawer:</div>
                        <div class="drawer-coins-grid">
                            ${this.denominations.map(d => `
                                <button class="coin-btn bounce-hover" data-coin-id="${d.id}" style="--coin-col: ${d.color};">
                                    <span class="coin-icon">${d.icon}</span>
                                    <span class="coin-val">${d.label}</span>
                                    <span class="coin-name">${d.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Checkout Action -->
                    <div class="checkout-actions-row">
                        <button class="primary-btn ring-up-btn" id="ring-up-sale-btn">
                            🔔 Ring Up Sale ($<span id="target-due-btn">0.25</span>)!
                        </button>
                        <button class="utility-pill-btn" id="clear-tray-btn">
                            🔄 Clear Tray
                        </button>
                    </div>

                    <div class="feedback-banner" id="market-feedback"></div>
                </div>
            </div>
        `;

        document.getElementById('market-back-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });

        document.getElementById('market-speak-order-btn').addEventListener('click', () => {
            if (this.currentOrder) {
                const dollars = (this.currentOrder.cents / 100).toFixed(2);
                window.audioEngine.speak(`${this.currentOrder.customerName} wants a ${this.currentOrder.item} for ${dollars} dollars!`);
            }
        });

        document.getElementById('clear-tray-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.trayCoins = [];
            this.renderTray();
        });

        document.getElementById('ring-up-sale-btn').addEventListener('click', () => {
            this.checkPayment();
        });

        // Add coin clicks
        document.querySelectorAll('.coin-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const coinId = e.currentTarget.dataset.coinId;
                const coinObj = this.denominations.find(d => d.id === coinId);
                if (coinObj) {
                    this.addCoinToTray(coinObj);
                }
            });
        });
    }

    nextCustomer() {
        if (this.round >= this.totalRounds) {
            this.finishMarket();
            return;
        }

        this.round++;
        document.getElementById('market-round-indicator').textContent = `${this.round}/${this.totalRounds}`;

        this.currentOrder = this.orders[this.round - 1];
        this.trayCoins = [];

        document.getElementById('customer-emoji').textContent = this.currentOrder.customer;
        document.getElementById('order-item-name').textContent = `${this.currentOrder.item} ${this.currentOrder.itemEmoji}`;
        
        const priceStr = `$${(this.currentOrder.cents / 100).toFixed(2)}`;
        document.getElementById('order-price-tag').textContent = `Price: ${priceStr}`;
        document.getElementById('target-due-btn').textContent = (this.currentOrder.cents / 100).toFixed(2);

        this.renderTray();

        window.audioEngine.speak(`${this.currentOrder.customerName} wants a ${this.currentOrder.item} for ${priceStr}! Place the right coins in the tray!`);
    }

    addCoinToTray(coinObj) {
        window.audioEngine.playDing(700 + (coinObj.value * 5));
        this.trayCoins.push(coinObj);
        this.renderTray();
    }

    removeCoinFromTray(index) {
        window.audioEngine.playClick();
        this.trayCoins.splice(index, 1);
        this.renderTray();
    }

    renderTray() {
        const trayEl = document.getElementById('payment-tray');
        const totalCents = this.trayCoins.reduce((sum, c) => sum + c.value, 0);

        document.getElementById('tray-total-display').textContent = `$${(totalCents / 100).toFixed(2)}`;

        if (this.trayCoins.length === 0) {
            trayEl.innerHTML = `<span class="empty-tray-label">Tap coins from the cash drawer below to pay!</span>`;
            return;
        }

        trayEl.innerHTML = '';
        this.trayCoins.forEach((c, idx) => {
            const el = document.createElement('button');
            el.className = 'tray-coin-item item-bounce-in';
            el.innerHTML = `
                <span class="tray-coin-icon">${c.icon}</span>
                <span class="tray-coin-val">${c.label}</span>
            `;
            el.title = 'Click to return coin';
            el.onclick = () => this.removeCoinFromTray(idx);
            trayEl.appendChild(el);
        });
    }

    checkPayment() {
        const totalCents = this.trayCoins.reduce((sum, c) => sum + c.value, 0);
        const targetCents = this.currentOrder.cents;
        const feedback = document.getElementById('market-feedback');

        if (totalCents === targetCents) {
            // EXACT PAYMENT!
            window.audioEngine.playChaChing();
            window.appState.addStars(3);
            this.score += 25;
            document.getElementById('market-stars').textContent = window.appState.data.stars;
            window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 50);

            feedback.innerHTML = `💵 <strong>Cha-Ching!</strong> Exact payment received!`;
            feedback.className = 'feedback-banner show-success';
            window.audioEngine.speak(`Cha-Ching! Exact payment! ${this.currentOrder.customerName} is so happy!`);

            setTimeout(() => {
                feedback.className = 'feedback-banner';
                this.nextCustomer();
            }, 2600);
        } else if (totalCents < targetCents) {
            window.audioEngine.playWrong();
            const diff = `$${((targetCents - totalCents) / 100).toFixed(2)}`;
            feedback.innerHTML = `Almost there! Need ${diff} more to reach the price!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`Need ${diff} more coins!`);
        } else {
            window.audioEngine.playWrong();
            const over = `$${((totalCents - targetCents) / 100).toFixed(2)}`;
            feedback.innerHTML = `A bit too much! That is ${over} over the price! Tap coins in the tray to take them back!`;
            feedback.className = 'feedback-banner show-try-again';
            window.audioEngine.speak(`A bit too much! Tap coins in the tray to remove them!`);
        }
    }

    finishMarket() {
        window.audioEngine.playFanfare();
        window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 120);

        window.appState.addStars(6);

        const scene = document.querySelector('.market-scene');
        scene.innerHTML = `
            <div class="mission-complete-card">
                <div class="huge-badge">🏪</div>
                <h2>Super Market Manager!</h2>
                <p class="mission-subtitle">You served every animal customer and counted exact change like a financial star!</p>
                <div class="reward-box">
                    <div class="reward-item">⭐ +6 Market Stars!</div>
                    <div class="reward-item">🏆 Score: ${this.score} pts</div>
                </div>
                <div class="complete-actions">
                    <button class="primary-btn play-again-btn" id="market-replay-btn">🎮 Open Stand Again</button>
                    <button class="secondary-btn" id="market-hub-finish-btn">🏠 Hub</button>
                </div>
            </div>
        `;

        window.audioEngine.speak(`Super Market Manager! You counted coins and gave exact change!`);

        document.getElementById('market-replay-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            this.start();
        });

        document.getElementById('market-hub-finish-btn').addEventListener('click', () => {
            window.audioEngine.playClick();
            window.app.showHub();
        });
    }
}
