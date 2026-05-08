const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let xWins = 0;
let oWins = 0;
let draws = 0;
let gameMode = null; // 'human' or 'computer'
let difficulty = 'easy'; // default to easy

const modeSelection = document.getElementById('mode-selection');
const game = document.getElementById('game');
const computerSettings = document.getElementById('computer-settings');
const difficultySelect = document.getElementById('difficulty-select');
const vsHumanButton = document.getElementById('vs-human');
const vsComputerButton = document.getElementById('vs-computer');
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const resetScoresButton = document.getElementById('reset-scores');
const backToModeButton = document.getElementById('back-to-mode');
const xWinsDisplay = document.getElementById('x-wins');
const oWinsDisplay = document.getElementById('o-wins');
const drawsDisplay = document.getElementById('draws');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initGame() {
    board.fill(null);
    currentPlayer = 'X';
    gameActive = true;
    updateStatus();
    updateScores();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning');
    });
}

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== null || !gameActive || (gameMode === 'computer' && currentPlayer === 'O')) {
        return;
    }

    makeMove(index);

    if (gameMode === 'computer' && gameActive && currentPlayer === 'O') {
        setTimeout(() => {
            computerMove();
        }, 500); // задержка для реализма
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add('taken');

    const winningCondition = checkWinner();
    if (winningCondition) {
        statusDisplay.textContent = `Игрок ${currentPlayer} победил!`;
        gameActive = false;
        highlightWinningCells(winningCondition);
        if (currentPlayer === 'X') {
            xWins++;
        } else {
            oWins++;
        }
        updateScores();
        return;
    }

    if (checkDraw()) {
        statusDisplay.textContent = 'Ничья!';
        gameActive = false;
        draws++;
        updateScores();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function computerMove() {
    const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    if (availableCells.length === 0) return;

    let moveIndex;
    if (difficulty === 'easy') {
        moveIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    } else if (difficulty === 'medium') {
        moveIndex = findBestMove('O') || findBestMove('X') || availableCells[Math.floor(Math.random() * availableCells.length)];
    } else if (difficulty === 'hard') {
        moveIndex = minimax(board, 'O').index;
    }
    makeMove(moveIndex);
}

function findBestMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === null) return c;
        if (board[a] === player && board[c] === player && board[b] === null) return b;
        if (board[b] === player && board[c] === player && board[a] === null) return a;
    }
    return null;
}

function minimax(board, player) {
    const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    if (checkWinnerForMinimax(board, 'X')) return { score: -10 };
    if (checkWinnerForMinimax(board, 'O')) return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availableCells.length; i++) {
        const move = {};
        move.index = availableCells[i];
        board[availableCells[i]] = player;
        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }
        board[availableCells[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function checkWinnerForMinimax(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function checkWinner() {
    return winningConditions.find(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function checkDraw() {
    return board.every(cell => cell !== null);
}

function highlightWinningCells(condition) {
    condition.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function updateScores() {
    xWinsDisplay.textContent = `Побед X: ${xWins}`;
    oWinsDisplay.textContent = `Побед O: ${oWins}`;
    drawsDisplay.textContent = `Ничьих: ${draws}`;
}

function updateStatus() {
    statusDisplay.textContent = `Ход игрока ${currentPlayer}`;
}

function selectMode(mode) {
    if (mode === 'computer') {
        gameMode = 'computer';
        difficulty = 'easy';
        difficultySelect.value = 'easy';
        computerSettings.style.display = 'flex';
        modeSelection.style.display = 'none';
        game.style.display = 'block';
        initGame();
    } else {
        gameMode = 'human';
        computerSettings.style.display = 'none';
        modeSelection.style.display = 'none';
        game.style.display = 'block';
        initGame();
    }
}

function changeDifficulty(event) {
    const newDifficulty = event.target.value;
    if (newDifficulty !== difficulty) {
        difficulty = newDifficulty;
        initGame();
    }
}

function resetScores() {
    xWins = 0;
    oWins = 0;
    draws = 0;
    updateScores();
}

function resetGame() {
    initGame();
}

function backToModeSelection() {
    gameMode = null;
    initGame();
    modeSelection.style.display = 'block';
    game.style.display = 'none';
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
resetScoresButton.addEventListener('click', resetScores);
backToModeButton.addEventListener('click', backToModeSelection);
vsHumanButton.addEventListener('click', () => selectMode('human'));
vsComputerButton.addEventListener('click', () => selectMode('computer'));
difficultySelect.addEventListener('change', changeDifficulty);

// initGame(); // убрано, игра начинается после выбора режима