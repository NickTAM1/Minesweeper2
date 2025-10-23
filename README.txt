HOW TO OPEN THE GAME
1. Open Command Prompt (Windows) or Terminal (Mac/Linux).
2. Go to the game folder:
   Example:
     cd C:\Users\YourName\Downloads\Minesweeper2
3. Run a local server:
     npx http-server
4. Open your browser and go to:
     http://localhost:8080(Example: http://127.0.0.1:8080)
   The game will load.

Alternative:
If you have Python:
     python -m http.server 8000
Then open: http://localhost:8000

=======================================================================
HOW TO PLAY
LEFT CLICK = Reveal tile
RIGHT CLICK = Flag or unflag tile
GOAL = Find all safe tiles without clicking a mine
First click is always safe
New Game button = restart

Tip: Do not open index.html directly. The game needs a server.

Github: https://github.com/NickTAM1/Minesweeper2.git
