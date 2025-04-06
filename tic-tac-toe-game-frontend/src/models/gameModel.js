export class Game {
    constructor({ date, boardSize, winner, moves, winningCells }) {
      this.date = date;
      this.boardSize = boardSize;
      this.winner = winner;
      this.moves = moves || [];
      this.winningCells = winningCells || [];
    }
  }