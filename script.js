const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');

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
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== null || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    if (checkWinner()) {
        statusDisplay.textContent = `Игрок ${currentPlayer} победил!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusDisplay.textContent = 'Ничья!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function checkDraw() {
    return board.every(cell => cell !== null);
}

function updateStatus() {
    statusDisplay.textContent = `Ход игрока ${currentPlayer}`;
}

function resetGame() {
    initGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

initGame();