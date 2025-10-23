// gameLogic.js - Handles game rules and state
class GameLogic {
    // Initializes game logic, tracking timer, flags, and progress.
    constructor(gameBoard) {
        this.gameBoard = gameBoard; // Connects logic to the game board
        this.remaining = gameBoard.mines; // Mines left to find
        this.revealed = 0; // Number of safe cells revealed
        this.gameOver = false; // Is the game finished?
        this.gameStarted = false; // Whether the timer has begun
        this.timeElapsed = 0; // Seconds since game started
        this.timerInterval = null; // Holds timer reference for stopping
    }

    // Starts the timer and updates elapsed time every second.
    startTimer(updateCallback) {
        // Only start if game hasn't started and isn't over
        if (!this.gameStarted && !this.gameOver) {
            this.gameStarted = true;
            this.timerInterval = setInterval(() => {
                this.timeElapsed++;
                if (updateCallback) updateCallback();
            }, 1000);
        }
    }

    // Stops the running timer.
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Toggles a flag on or off for the selected cell.
    flag(row, col) {
        const cell = this.gameBoard.picture[row][col];

        // Toggle flag on/off
        if (cell === 'hidden') {
            this.gameBoard.picture[row][col] = 'flag';
            this.remaining--;
        } else if (cell === 'flag') {
            this.gameBoard.picture[row][col] = 'hidden';
            this.remaining++;
        }

        this.gameBoard.updateTile(row, col);
    }

    // Reveals a cell and checks for win or recursive reveals.
    reveal(row, col) {

        //Create board on first reveal (makes first click safe)
        if (!this.gameBoard.boardCreated) {
            this.gameBoard.createBoard(row, col);
        }

        // Don't reveal if already revealed
        if (this.gameBoard.picture[row][col] !== 'hidden') return;

        const value = this.gameBoard.boardData[row][col];
        this.gameBoard.picture[row][col] = value;

        // Count safe cells
        if (value !== 'mine') this.revealed++;

        this.gameBoard.updateTile(row, col);

        // If empty cell, reveal all 8 neighbors recursively
        if (value === 0) {
            const { rows, cols, picture } = this.gameBoard;
            const neighbors = [
                [row, col - 1], [row, col + 1], [row + 1, col], [row - 1, col],
                [row - 1, col - 1], [row - 1, col + 1], [row + 1, col - 1], [row + 1, col + 1]
            ];

            for (const [r, c] of neighbors) {
                if (r >= 0 && r < rows && c >= 0 && c < cols && picture[r][c] === 'hidden') {
                    this.reveal(r, c);
                }
            }
        }

        // Check if player won (all safe cells revealed)
        const totalCells = this.gameBoard.rows * this.gameBoard.cols;
        const safeCells = totalCells - this.gameBoard.mines;
        return this.revealed === safeCells;
    }

    // Reveals all mines and marks incorrect flags when the game ends.
    revealAllMines() {
        this.gameOver = true;
        this.stopTimer();

        // Show all mines and mark wrong flags
        for (let row = 0; row < this.gameBoard.rows; row++) {
            for (let col = 0; col < this.gameBoard.cols; col++) {
                const data = this.gameBoard.boardData[row][col];
                const pic = this.gameBoard.picture[row][col];

                if (data === 'mine') {
                    this.gameBoard.picture[row][col] = 'mine';
                }
                if (data !== 'mine' && pic === 'flag') {
                    this.gameBoard.picture[row][col] = 'misplaced';
                }
            }
        }

        this.gameBoard.updateAllTiles();
    }

    // Resets all game state and stops timer for a new round.
    reset() {
        this.stopTimer();
        this.remaining = this.gameBoard.mines;
        this.revealed = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.timeElapsed = 0;
    }

    // Returns the number of flags currently placed.
    getFlagsPlaced() {
        return this.gameBoard.mines - this.remaining;
    }
}

export default GameLogic;