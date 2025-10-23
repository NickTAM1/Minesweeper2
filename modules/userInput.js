// userInput.js - Handles user interactions
class UserInput {

    constructor(gameLogic, gameBoard, updateStatusCallback) {
        this.gameLogic = gameLogic;
        this.gameBoard = gameBoard;
        this.updateStatusCallback = updateStatusCallback;
    }

    handleClick(event, row, col) {
        // Start the timer on first click
        this.gameLogic.startTimer(this.updateStatusCallback);

        // Don't do anything if game is already over
        if (this.gameLogic.gameOver) return;

        // Right click (button 3) = Place/remove flag
        if (event.which === 3) {
            this.gameLogic.flag(row, col);
            event.preventDefault(); // Stop browser context menu
        }
        // Left click (button 1) = Reveal tile
        else if (event.which === 1 && this.gameBoard.picture[row][col] !== 'flag') {
            // Check if it's a mine
            if (this.gameBoard.boardData[row][col] === 'mine') {
                this.gameOver(); // Game over!
            }
            // Only reveal if tile is still hidden
            else if (this.gameBoard.picture[row][col] === 'hidden') {
                const won = this.gameLogic.reveal(row, col);
                if (won) {
                    this.gameWin(); // Player won!
                }
            }
        }

        // Update the status display after each click
        this.updateStatusCallback();
    }

    gameOver() {
        // Show all mines on the board
        this.gameLogic.revealAllMines();

        // Display game over message with final time
        const statusEl = document.getElementById('status');
        statusEl.innerHTML = `GAME OVER<br><br>Time: ${this.gameLogic.timeElapsed}s<br><br>Click New Game to restart`;
    }

    gameWin() {
        // Mark game as finished and stop counting time
        this.gameLogic.gameOver = true;
        this.gameLogic.stopTimer();

        // Display win message with final time
        const statusEl = document.getElementById('status');
        statusEl.innerHTML = `YOU WIN!<br><br>Time: ${this.gameLogic.timeElapsed}s<br><br>Click New Game to restart`;
    }
}

export default UserInput;