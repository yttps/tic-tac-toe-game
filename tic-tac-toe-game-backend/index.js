import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 
import Game from './models/Game.js';

const app = express();
dotenv.config();

app.use(cors());   
app.use(express.json()); 

const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGODB_URI;

mongoose.connect(MONGOURL)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });


// Endpoint เพื่อดึงประวัติทั้งหมด (สำหรับทดสอบ)
app.get('/api/history', async (req, res) => {
    try {
        const games = await Game.find();
        console.log('Fetched history:', games);
        res.status(200).json(games);
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ message: 'Failed to fetch games', error });
    }
});

// Endpoint เพื่อบันทึกประวัติเกม
app.post('/api/history', async (req, res) => {
    try {
        const { date, boardSize, winner, moves, winningCells } = req.body;
        console.log('posttt' , req.body)

        const game = new Game({
            date,
            boardSize,
            winner,
            moves,
            winningCells,
        });

        const savedGame = await game.save();
        res.status(201).json({ message: 'Game saved successfully', game: savedGame });
    } catch (error) {
        console.error('Error saving game:', error);
        res.status(500).json({ message: 'Failed to save game', error });
    }
});