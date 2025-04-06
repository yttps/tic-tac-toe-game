import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  date: { type: String, required: true },
  boardSize: { type: Number, required: true },
  winner: { type: String, required: true },
  moves: [
    {
      index: { type: Number, required: true },
      player: { type: String, required: true },
    },
  ],
  winningCells: [Number],
});

const Game = mongoose.model('games', gameSchema);
export default Game;
