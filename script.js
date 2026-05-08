const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let xWins = 0;
let oWins = 0;
let draws = 0;
let gameMode = null; // 'human' or 'computer'

const modeSelection = document.getElementById('mode-selection');
const game = document.getElementById('game');
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

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex);
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
    gameMode = mode;
    modeSelection.style.display = 'none';
    game.style.display = '';
    initGame();
}

function resetGame() {
    initGame();
}

function resetScores() {
    xWins = 0;
    oWins = 0;
    draws = 0;
    updateScores();
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

// initGame(); // убрано, игра начинается после выбора режима