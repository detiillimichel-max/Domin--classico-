class DominoGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.computerHand = [];
        this.table = [];
        this.playerScore = 0;
        this.computerScore = 0;
        this.currentTurn = 'player';
        this.gameOver = false;
        this.passCount = 0;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.createDeck();
        this.shuffleDeck();
        this.dealPieces();
        this.findFirstPiece();
        this.render();
        this.updateScores();
    }
    
    createDeck() {
        this.deck = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                this.deck.push({ left: i, right: j });
            }
        }
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    dealPieces() {
        this.playerHand = this.deck.splice(0, 7);
        this.computerHand = this.deck.splice(0, 7);
    }
    
    findFirstPiece() {
        let highestDouble = null;
        let highestValue = -1;
        
        for (let piece of this.playerHand) {
            if (piece.left === piece.right && piece.left > highestValue) {
                highestDouble = piece;
                highestValue = piece.left;
            }
        }
        
        for (let piece of this.computerHand) {
            if (piece.left === piece.right && piece.left > highestValue) {
                highestDouble = piece;
                highestValue = piece.left;
            }
        }
        
        if (highestDouble) {
            this.table.push(highestDouble);
            if (this.playerHand.includes(highestDouble)) {
                this.playerHand = this.playerHand.filter(p => p !== highestDouble);
                this.currentTurn = 'computer';
            } else {
                this.computerHand = this.computerHand.filter(p => p !== highestDouble);
                this.currentTurn = 'player';
            }
        } else if (this.playerHand.length > 0) {
            this.table.push(this.playerHand[0]);
            this.playerHand.shift();
            this.currentTurn = 'computer';
        }
    }
    
    canPlay(piece) {
        if (this.table.length === 0) return true;
        const leftEnd = this.table[0].left;
        const rightEnd = this.table[this.table.length - 1].right;
        return (piece.left === leftEnd || piece.right === leftEnd ||
                piece.left === rightEnd || piece.right === rightEnd);
    }
    
    getPlayPosition(piece) {
        if (this.table.length === 0) return 'right';
        const leftEnd = this.table[0].left;
        const rightEnd = this.table[this.table.length - 1].right;
        if (piece.right === leftEnd || piece.left === leftEnd) return 'left';
        if (piece.left === rightEnd || piece.right === rightEnd) return 'right';
        return null;
    }
    
    playPiece(piece, isPlayer) {
        const position = this.getPlayPosition(piece);
        if (!position) return false;
        
        if (position === 'left') {
            if (piece.right === this.table[0].left) {
                this.table.unshift(piece);
            } else if (piece.left === this.table[0].left) {
                this.table.unshift({ left: piece.right, right: piece.left });
            }
        } else if (position === 'right') {
            if (piece.left === this.table[this.table.length - 1].right) {
                this.table.push(piece);
            } else if (piece.right === this.table[this.table.length - 1].right) {
                this.table.push({ left: piece.right, right: piece.left });
            }
        }
        
        if (isPlayer) {
            this.playerHand = this.playerHand.filter(p => p !== piece);
            this.currentTurn = 'computer';
        } else {
            this.computerHand = this.computerHand.filter(p => p !== piece);
            this.currentTurn = 'player';
        }
        
        this.passCount = 0;
        this.checkGameOver();
        this.render();
        
        if (!this.gameOver && this.currentTurn === 'computer') {
            setTimeout(() => this.computerPlay(), 600);
        }
        return true;
    }
    
    computerPlay() {
        if (this.gameOver || this.currentTurn !== 'computer') return;
        
        for (let i = 0; i < this.computerHand.length; i++) {
            if (this.canPlay(this.computerHand[i])) {
                this.playPiece(this.computerHand[i], false);
                return;
            }
        }
        
        if (this.deck.length > 0) {
            this.computerHand.push(this.deck.pop());
            this.render();
            setTimeout(() => this.computerPlay(), 500);
        } else {
            this.passCount++;
            if (this.passCount >= 2) {
                this.endGame();
            } else {
                this.currentTurn = 'player';
                this.render();
            }
        }
    }
    
    playerPlay(pieceIndex) {
        if (this.gameOver || this.currentTurn !== 'player') return false;
        const piece = this.playerHand[pieceIndex];
        if (this.canPlay(piece)) {
            return this.playPiece(piece, true);
        }
        return false;
    }
    
    checkGameOver() {
        if (this.playerHand.length === 0) this.endGame('player');
        else if (this.computerHand.length === 0) this.endGame('computer');
    }
    
    endGame(winner = null) {
        this.gameOver = true;
        
        if (!winner) {
            const playerPoints = this.playerHand.reduce((sum, p) => sum + p.left + p.right, 0);
            const computerPoints = this.computerHand.reduce((sum, p) => sum + p.left + p.right, 0);
            if (playerPoints < computerPoints) this.playerScore++;
            else if (computerPoints < playerPoints) this.computerScore++;
        } else if (winner === 'player') {
            this.playerScore++;
        } else {
            this.computerScore++;
        }
        
        this.updateScores();
        
        if (this.playerScore >= 5 || this.computerScore >= 5) {
            const finalWinner = this.playerScore >= 5 ? 'Jogador' : 'Computador';
            alert(`🏆 ${finalWinner} venceu o jogo! 🏆`);
            this.resetGame();
        } else {
            setTimeout(() => this.resetRound(), 2000);
        }
    }
    
    resetRound() {
        this.createDeck();
        this.shuffleDeck();
        this.playerHand = [];
        this.computerHand = [];
        this.table = [];
        this.currentTurn = 'player';
        this.gameOver = false;
        this.passCount = 0;
        this.dealPieces();
        this.findFirstPiece();
        this.render();
    }
    
    resetGame() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.resetRound();
        this.updateScores();
    }
    
    passTurn() {
        if (this.gameOver || this.currentTurn !== 'player') return;
        
        if (this.deck.length > 0) {
            this.playerHand.push(this.deck.pop());
            this.render();
            if (!this.canPlay(this.playerHand[this.playerHand.length - 1])) {
                this.currentTurn = 'computer';
                this.passCount++;
                if (this.passCount >= 2) this.endGame();
                else setTimeout(() => this.computerPlay(), 500);
            }
        } else {
            this.currentTurn = 'computer';
            this.passCount++;
            if (this.passCount >= 2) this.endGame();
            else setTimeout(() => this.computerPlay(), 500);
        }
        this.render();
    }
    
    updateScores() {
        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('computer-score').textContent = this.computerScore;
    }
    
    getDotsHTML(number) {
        if (number === 0) return '<div style="text-align: center;">⚪</div>';
        let dots = '';
        for (let i = 0; i < number; i++) dots += '<div class="dot"></div>';
        return `<div class="dots-container">${dots}</div>`;
    }
    
    createDominoElement(piece, isPlayable = false, pieceIndex = null) {
        const domino = document.createElement('div');
        domino.className = 'domino';
        
        const topSide = document.createElement('div');
        topSide.className = 'domino-side';
        topSide.innerHTML = this.getDotsHTML(piece.left);
        
        const bottomSide = document.createElement('div');
        bottomSide.className = 'domino-side';
        bottomSide.innerHTML = this.getDotsHTML(piece.right);
        
        domino.appendChild(topSide);
        domino.appendChild(bottomSide);
        
        if (isPlayable && this.currentTurn === 'player' && !this.gameOver && this.canPlay(piece)) {
            domino.style.cursor = 'pointer';
            domino.style.border = '3px solid #27ae60';
            domino.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.playerPlay(pieceIndex)) this.render();
                else alert('❌ Esta peça não pode ser jogada agora!');
            });
        } else if (isPlayable && this.currentTurn === 'player' && !this.gameOver) {
            domino.style.opacity = '0.5';
        }
        return domino;
    }
    
    render() {
        const playerHandDiv = document.getElementById('player-hand');
        const computerHandDiv = document.getElementById('computer-hand');
        const tableDiv = document.getElementById('table');
        const turnIndicator = document.getElementById('turn-indicator');
        
        playerHandDiv.innerHTML = '';
        this.playerHand.forEach((piece, index) => {
            playerHandDiv.appendChild(this.createDominoElement(piece, true, index));
        });
        
        computerHandDiv.innerHTML = '';
        for (let i = 0; i < this.computerHand.length; i++) {
            const backDomino = document.createElement('div');
            backDomino.className = 'domino computer-domino-back';
            backDomino.innerHTML = '?';
            computerHandDiv.appendChild(backDomino);
        }
        
        tableDiv.innerHTML = '';
        this.table.forEach((piece) => {
            tableDiv.appendChild(this.createDominoElement(piece, false));
        });
        
        if (!this.gameOver) {
            if (this.currentTurn === 'player') {
                turnIndicator.innerHTML = '🎲 SUA VEZ! Clique nas peças verdes 🎲';
                turnIndicator.style.background = '#d4edda';
            } else {
                turnIndicator.innerHTML = '🤖 VEZ DO COMPUTADOR... Aguarde 🤖';
                turnIndicator.style.background = '#f8d7da';
            }
        } else {
            turnIndicator.innerHTML = '🔄 Aguardando próxima rodada... 🔄';
            turnIndicator.style.background = '#fff3cd';
        }
    }
    
    setupEventListeners() {
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('pass-turn').addEventListener('click', () => this.passTurn());
    }
}

const game = new DominoGame();
