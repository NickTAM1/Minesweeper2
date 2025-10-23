// gameBoard.js for Handles board data and rendering
class GameBoard {

    // initializes board arrays and basic properties.
    constructor(rows, cols, mines) {
        this.rows = rows;
        this.cols = cols;
        this.mines = mines;
        this.boardCreated = false;
        // boardData stores what's in each cell (mine or number)
        this.boardData = new Array(this.rows);
        // picture stores what the player sees (hidden, flag, revealed)
        this.picture = new Array(this.rows);
        // tile stores the actual HTML img elements
        this.tile = new Array(this.rows);

        // Create 2D arrays for each row
        for (let i = 0; i < this.rows; i++) {
            this.boardData[i] = new Array(this.cols);
            this.picture[i] = new Array(this.cols);
            this.tile[i] = new Array(this.cols);
        }
    }

    createBoard(safeRow, safeCol) {
        let placed = 0;

        //Place mines randomly on the board
        while (placed < this.mines) {
            // Get random column and row positions
            let col = Math.floor(Math.random() * this.cols);
            let row = Math.floor(Math.random() * this.rows);

            //The first click must be safe
            let isFirstClick = (row == safeRow && col == safeCol);

            // Only place mine if this cell doesn't already have one
            if (this.boardData[row][col] != 'mine' && !isFirstClick) {
                this.boardData[row][col] = 'mine';
                placed++;
            }
            
        }

        // Calculate numbers for each non mine cell
        // The number shows how many mines are touching that cell
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                // Only calculate for cells that aren't mines
                if (this.boardData[row][col] != 'mine') {
                    let count = 0;

                    // Check all 8 surrounding cells (neighbors)
                    for (let r = row - 1; r <= row + 1; r++) {
                        for (let c = col - 1; c <= col + 1; c++) {
                            // Make sure we're inside the board boundaries
                            if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                                // Count this neighbor if it's a mine
                                if (this.boardData[r][c] == 'mine') count++;
                            }
                        }
                    }

                    // Store the count in this cell
                    this.boardData[row][col] = count;
                }
            }
        }
        this.boardCreated = true;
    }

    renderBoard(containerId, clickHandler) {
        const boardEl = document.getElementById(containerId);
        boardEl.innerHTML = ''; // Clear any existing tiles

        // Create a tile for each cell in the board
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // Calculate unique ID for this tile
                let index = row * this.cols + col;

                // Create an image element for this tile
                this.tile[row][col] = document.createElement('img');
                this.tile[row][col].src = 'images/hidden.png'; // Start hidden
                this.tile[row][col].id = index;
                this.tile[row][col].className = 'tile';
                
                // Position the tile using absolute positioning
                this.tile[row][col].style.position = 'absolute';
                this.tile[row][col].style.top = (row * 32) + 'px';
                this.tile[row][col].style.left = (col * 32) + 'px';

                // Add click listener (handles both left and right clicks)
                this.tile[row][col].addEventListener('mousedown', (event) => {
                    clickHandler(event, row, col);
                });

                // Add tile to the page
                boardEl.appendChild(this.tile[row][col]);
                
                // Set initial picture state to hidden
                this.picture[row][col] = 'hidden';
            }
        }
    }

    // Updates all tiles based on their picture states.
    updateAllTiles() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.updateTile(row, col);
            }
        }
    }

    // Updates a single tile image according to its state.
    updateTile(row, col) {
        const tileEl = this.tile[row][col];
        const picState = this.picture[row][col]; // What should be shown

        // Choose the correct image based on the tile's state
        // For all cases (hidden, flag, mine, misplaced, 0-8)
        tileEl.src = `images/${picState}.png`;
    }

    // Resets all board data for a new game.
    reset(){
        this.boardCreated = false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {

                //remove mines and numbers
                this.boardData[i][j] = ''; 
                // Hide all tiles
                this.picture[i][j] = 'hidden'; 
            }
        }
    }
}

export default GameBoard;