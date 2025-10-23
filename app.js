// app.js - Application entry point
import GameEngine from './Libraries/gameEngine.js';

// Create the game (module scripts wait for DOM automatically)
const game = new GameEngine('board', 15, 15, 40);