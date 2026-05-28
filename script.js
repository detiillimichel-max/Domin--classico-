class DominoGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.computerHand = [];
        this.table = [];
        this.playerScore = 0;
        this.computerScore = 0;
        this.currentTurn = 'player'; // 'player' or 'computer'
        this.gameOver = false;
        this.passCount = 0;
        
        this.init();
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
        // Find the highest double to start
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
        } else {
            // If no double, take first piece
            this.table.push(this.playerHand[0]);
            this.playerHand.shift();
            this.currentTurn = 'computer';
        }
    }
    
    canPlay(piece, position) {
        if (this.table.length === 0) return true;
        
        const leftEnd = this.table[0].left;
        const rightEnd = this.table[this.table.length - 1].right;
        
        if (position === 'left') {
            return piece.right === leftEnd || piece.left === leftEnd;
        } else if (position === 'right') {
            return piece.left === rightEnd || piece.right === rightEnd;
        }
        return false;
    }
    
    playPiece(piece, position, isPlayer) {
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
            this.passCount = 0;
        } else {
            this.computerHand = this.computerHand.filter(p => p !== piece);
            this.currentTurn = 'player';
            this.passCount = 0;
        }
        
        this.checkGameOver();
        this.render();
        
        if (!this.gameOver && this.currentTurn === 'computer') {
            setTimeout(() => this.computerPlay(), 500);
        }
    }
    
    computerPlay() {
        if (this.gameOver) return;
        
        const leftEnd = this.table[0].left;
        const rightEnd = this.table[this.table.length - 1].right;
        
        // Find playable piece
        for (let piece of this.computerHand) {
            if (piece.right === leftEnd || piece.left === leftEnd) {
                this.playPiece(piece, 'left', false);
                return;
            }
            if (piece.left === rightEnd || piece.right === rightEnd) {
                this.playPiece(piece, 'right', false);
                return;
            }
        }
        
        // No playable pieces, draw from deck
        if (this.deck.length > 0) {
            const drawnPiece = this.deck.pop();
            this.computerHand.push(drawnPiece);
            this.render();
            setTimeout(() => this.computerPlay(), 500);
        } else {
            // Pass turn
            this.passCount++;
            if (this.passCount >= 2) {
                this.endGame();
            } else {
                this.currentTurn = 'player';
                this.render();
            }
        }
    }
    
    playerPlay(pieceIndex, position) {
        if (this.gameOver || this.currentTurn !== 'player') return;
        
        const piece = this.playerHand[pieceIndex];
        if (this.canPlay(piece, position)) {
            this.playPiece(piece, position, true);
        }
    }
    
    checkGameOver() {
        if (this.playerHand.length === 0) {
            this.endGame('player');
        } else if (this.computerHand.length === 0) {
            this.endGame('computer');
        }
    }
    
    endGame(winner = null) {
        this.gameOver = true;
        
        if (!winner) {
            // Calculate scores
            const playerPoints = this.playerHand.reduce((sum, p) => sum + p.left + p.right, 0);
            const computerPoints = this.computerHand.reduce((sum, p) => sum + p.left + p.right, 0);
            
            if (playerPoints < computerPoints) {
                this.playerScore++;
                alert('Você venceu a rodada!');
            } else if (computerPoints < playerPoints) {
                this.computerScore++;
                alert('Computador venceu a rodada!');
            } else {
                alert('Rodada empatada!');
            }
        } else if (winner === 'player') {
            this.playerScore++;
            alert('Parabéns! Você venceu a rodada!');
        } else {
            this.computerScore++;
            alert('Computador venceu a rodada!');
        }
        
        this.updateScores();
        
        if (this.playerScore >= 5 || this.computerScore >= 5) {
            const finalWinner = this.playerScore >= 5 ? 'Jogador' : 'Computador';
            alert(`🏆 Fim de jogo! ${finalWinner} venceu o jogo! 🏆`);
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
            const drawnPiece = this.deck.pop();
            this.playerHand.push(drawnPiece);
            this.render();
            
            // Check if can play after drawing
            const leftEnd = this.table[0].left;
            const rightEnd = this.table[this.table.length - 1].right;
            const canPlayNow = this.playerHand.some(p => 
                p.right === leftEnd || p.left === leftEnd ||
                p.left === rightEnd || p.right === rightEnd
            );
            
            if (!canPlayNow) {
                this.currentTurn = 'computer';
                this.passCount++;
                if (this.passCount >= 2) {
                    this.endGame();
                } else {
                    setTimeout(() => this.computerPlay(), 500);
                }
            }
        } else {
            this.currentTurn = 'computer';
            this.passCount++;
            if (this.passCount >= 2) {
                this.endGame();
            } else {
                setTimeout(() => this.computerPlay(), 500);
            }
        }
        
        this.render();
    }
    
    updateScores() {
        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('computer-score').textContent = this.computerScore;
    }
    
    render() {
        const playerHandDiv = document.getElementById('player-hand');
        const computerHandDiv = document.getElementById('computer-hand');
        const tableDiv = document.getElementById('table');
        const turnIndicator = document.getElementById('turn-indicator');
        
        // Render player hand
        playerHandDiv.innerHTML = '';
        this.playerHand.forEach((piece, index) => {
            const domino = this.createDominoElement(piece, index, true);
            playerHandDiv.appendChild(domino);
        });
        
        // Render computer hand (face down)
        computerHandDiv.innerHTML = '';
        this.computerHand.forEach(() => {
            const backDomino = document.createElement('div');
            backDomino.className = 'domino';
            backDomino.style.background = '#2c3e50';
            backDomino.style.border = '2px solid #1a252f';
            backDomino.innerHTML = '<div style="color: white; text-align: center; padding-top: 40px;">?</div>';
            computerHandDiv.appendChild(backDomino);
        });
        
        // Render table
        tableDiv.innerHTML = '';
        this.table.forEach((piece) => {
            const domino = this.createDominoElement(piece, null, false);
            tableDiv.appendChild(domino);
        });
        
        // Update turn indicator
        if (!this.gameOver) {
            turnIndicator.textContent = this.currentTurn === 'player' ? '🎲 Sua vez! 🎲' : '🤖 Vez do Computador... 🤖';
            turnIndicator.style.background = this.currentTurn === 'player' ? '#d4edda' : '#f8d7da';
        } else {
            turnIndicator.textContent = '🔄 Aguardando próxima rodada... 🔄';
        }
    }
    
    createDominoElement(piece, index, isPlayable) {
        const domino = document.createElement('div');
        domino.className = 'domino';
        
        const topSide = document.createElement('div');
        topSide.className = 'domino-side';
        topSide.textContent = this.getDotsRepresentation(piece.left);
        
        const bottomSide = document.createElement('div');
        bottomSide.className = 'domino-side';
        bottomSide.textContent = this.getDotsRepresentation(piece.right);
        
        domino.appendChild(topSide);
        domino.appendChild(bottomSide);
        
        if (isPlayable && this.currentTurn === 'player' && !this.gameOver) {
            const leftEnd = this.table[0]?.left;
            const rightEnd = this.table[this.table.length - 1]?.right;
            
            if (this.table.length === 0 || 
                piece.right === leftEnd || piece.left === leftEnd) {
                domino.addEventListener('click', () => this.playerPlay(index, 'left'));
                domino.style.cursor = 'pointer';
            }
            if (this.table.length === 0 ||
                piece.left === rightEnd || piece.right === rightEnd) {
                domino.addEventListener('click', () => this.playerPlay(index, 'right'));
                domino.style.cursor = 'pointer';
            }
        }
        
        return domino;
    }
    
    getDotsRepresentation(number) {
        const dots = ['⚪', '●', '●●', '●●●', '●●●●', '●●●●●', '●●●●●●'];
        return dots[number] || number.toString();
    }
}

// Initialize game
const game = new DominoGame();

// Add event listeners
document.getElementById('reset-game').addEventListener('click', () => game.resetGame());
document.getElementById('pass-turn').addEventListener('click', () => game.passTurn());
