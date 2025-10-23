// gameEngine.js - Main game controller that connects all components
import GameBoard from '../modules/gameBoard.js';
import GameLogic from '../modules/gameLogic.js';
import UserInput from '../modules/userInput.js';

class GameEngine {

    // Sets up DOM refs, components, event handlers, and starts the first game.
    constructor(containerId, rows = 15, cols = 15, mines = 40) {
        this.containerId = containerId;
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;

        // Get HTML elements from the page
        this.boardEl = document.getElementById(containerId);
        this.statusEl = document.getElementById('status');
        this.resetBtn = document.getElementById('reset');

        // Prevent right click menu from showing on the board
        // This allows right click to place flags without popup menu
        this.boardEl.addEventListener('contextmenu', (e) => e.preventDefault());

        // Create all game components 
        this.gameBoard = new GameBoard(this.rows, this.cols, this.mines); // Model
        this.gameLogic = new GameLogic(this.gameBoard); // Controller
        this.userInput = new UserInput(
            this.gameLogic,
            this.gameBoard,
            () => this.updateStatus() // Pass update function
        );

        // Connect reset button to reset function
        this.resetBtn.addEventListener('click', () => this.init());

        // Start the first game
        this.init();
    }

    init() {
        // Reset game logic (timer, counts, flags)
        this.gameLogic.reset();

        //Reset board(clear old data; Mines will be placed on first click) 
        this.gameBoard.reset();

        // Render all tiles on screen with click handlers
        this.gameBoard.renderBoard(this.containerId, (event, row, col) => {
            this.userInput.handleClick(event, row, col);
        });

        // Show initial status (Time: 0s, Bombs Found: 0/40)
        this.updateStatus();
    }

    updateStatus() {
        // Only update if game isn't over
        if (!this.gameLogic.gameOver) {
            const flagged = this.gameLogic.getFlagsPlaced();
            this.statusEl.innerHTML = `Time: ${this.gameLogic.timeElapsed}s <br><br> Bombs Found: ${flagged} / ${this.mines}`;
        }
    }
}

export default GameEngine;