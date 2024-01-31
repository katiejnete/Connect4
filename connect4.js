const start = document.querySelector('#start');
const restart = document.querySelector('#restart');

// Part One: Make game into a class
class Game {
  constructor(HEIGHT,WIDTH,color1,color2) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.players = [new Player(color1,1), new Player(color2,2)];
    this.currPlayer = this.players[0];
    this.board = [];
    this.ongoing = true;

  }
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
    this.makeHtmlBoard();
  }
  
  /** makeHtmlBoard: make HTML table and row of column tops. */
  
  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', evt => {
        /** handleClick: handle click of column top to play piece */
    // get x from ID of clicked cell
    const x = +evt.target.id;
      
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.num;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.num} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    });
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  
  /** placeInTable: update DOM to place piece into HTML table of board */
  
  placeInTable(y, x) {
    if (!this.checkForWin()) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.top = -50 * (y + 2);
      piece.style.backgroundColor = this.currPlayer.color;
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
    else if (this.checkForWin () && this.ongoing) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.top = -50 * (y + 2);
      piece.style.backgroundColor = this.currPlayer.color;
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
    else if (!this.ongoing) {
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer.num} won!`);
      }
      
      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      } 
    }
  }
  
  /** endGame: announce game end */
  
  endGame(msg) {
    this.ongoing = false;
    alert(msg);
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer.num
    );
  }

  checkForWin() {
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }
  
}

// Part Two: Small Improvements
start.addEventListener('click', function() {
  const startBtn = document.querySelector('#start');
  const restartBtn = document.querySelector('#restart');
  const inputs = document.querySelectorAll('input');
  const [input1, input2] = inputs;
  const color1 = input1.value;
  const color2 = input2.value;
  for (let input of inputs) {
    input.remove();
  }
  startBtn.remove();
  restartBtn.setAttribute('data-color1',color1);
  restartBtn.setAttribute('data-color2',color2);
  restartBtn.style.display = 'block';
  const newGame = new Game(6,7,color1,color2);
  newGame.makeBoard();
});

restart.addEventListener('click', function() {
  const trs = document.querySelectorAll('tr');
  for (let tr of trs) {
    tr.remove();
  }
  const restartBtn = document.querySelector('#restart');
  const color1 = restartBtn.dataset.color1;
  const color2 = restartBtn.dataset.color2;
  const newGame = new Game(6,7,color1,color2);
  newGame.makeBoard();
});

// Part Three: Make Player a Class
class Player {
  constructor (str, playerNum) {
    this.color = str;
    this.num = playerNum;
  }
}



