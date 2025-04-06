import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { saveHistory } from '../../services/GameService';


function TicTacToe() {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState('X'); // 'X' is player, 'O' is bot
  const [gameOver, setGameOver] = useState(false);
  const [winningCells, setWinningCells] = useState([]); // เก็บ index ที่ winning 
  
  //for replay
  const [moves, setMoves] = useState([]); // ลำดับการเคลื่อนไหว

  const totalCells = boardSize * boardSize;

  const handleCancle = () => {
    navigate('/'); // เปลี่ยนเส้นทางไปยัง /game
  };

  // Handle player move
  const handleClick = (index) => {
    if (board[index] || gameOver || turn === 'O') return; //เมื่อไม่ใช้คุณไม่ให้กด
    const updated = [...board];
    updated[index] = 'X';
    setBoard(updated);
    setMoves([...moves, { index, player: 'X' }]); // บันทึกการเคลื่อนไหวของผู้เล่น
    setTurn('O');
  };

  // Bot move
  const botMove = () => {
    const emptyCells = board
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((idx) => idx !== null);
    if (emptyCells.length > 0 && !gameOver) {
      const randomIndex = 
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const updated = [...board];
      updated[randomIndex] = 'O';
      setTimeout(() => {
        setBoard(updated);
        setMoves([...moves, { index: randomIndex, player: 'O' }]); // บันทึกการเคลื่อนไหวของบอท
        setTurn('X');
      }, 500);
    }
  };

  // Reset game
  const handleReset = () => {
    setBoard(Array(totalCells).fill(null));
    setTurn('X');
    setGameOver(false);
    setWinningCells([]);
    setMoves([]);
  };

  // Prompt for board size
  const checkStart = async () => {
    const result = await Swal.fire({
      title: 'กรอกขนาดช่องตาราง',
      text: 'กรุณาใส่ขนาดช่องตารางขั้นต่ำ 3 ขนาด',
      input: 'number',
      inputValue: 3,
      inputAttributes: {
        min: 3,
        step: 1,
      },
      inputValidator: (value) => {
        if (!value || isNaN(value) || value < 3) {
          return 'กรุณาใส่ขนาดช่องตารางขั้นต่ำ 3 ขนาด';
        }
      },
      confirmButtonText: 'เริ่มเกม',
      cancelButtonText: 'กลับไปหน้าแรก', 
      showCancelButton: true,
      cancelButtonColor: '#a6a6a6',
    });

    if (result.isConfirmed) {
      const size = parseInt(result.value);
      setBoardSize(size);
      setBoard(Array(size * size).fill(null));
      setGameOver(false);
      setWinningCells([]);
      setMoves([]);
    } else if (
      result.isDismissed && 
      result.dismiss === Swal.DismissReason.cancel) {
      navigate('/');
    }
  };

  // Check for a winner
  const checkWinner = (currentBoard) => {
    const size = boardSize;
    if (!currentBoard || currentBoard.length !== size * size) {
      console.log('Invalid board size or data');
      return { winner: null, winningCells: [] };
    }

    // Check rows
    for (let i = 0; i < size; i++) {
      const rowStart = i * size;
      if (
        currentBoard[rowStart] &&
        currentBoard.slice(rowStart, rowStart + size).every((cell) => cell === currentBoard[rowStart])
      ) {
        const winning = Array.from({ length: size }, (_, j) => rowStart + j);
        console.log(`Winner in row ${i}: ${currentBoard[rowStart]}`, winning);
        return { winner: currentBoard[rowStart], winningCells: winning };
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      const col = Array.from({ length: size }, (_, j) => currentBoard[j * size + i]);
      if (col[0] && col.every((cell) => cell === col[0])) {
        const winning = Array.from({ length: size }, (_, j) => j * size + i);
        console.log(`Winner in column ${i}: ${col[0]}`, winning);
        return { winner: col[0], winningCells: winning };
      }
    }

    // Check main diagonal
    const mainDiag = Array.from({ length: size }, (_, i) => currentBoard[i * size + i]);
    if (mainDiag[0] && mainDiag.every((cell) => cell === mainDiag[0])) {
      const winning = Array.from({ length: size }, (_, i) => i * size + i);
      console.log(`Winner in main diagonal: ${mainDiag[0]}`, winning);
      return { winner: mainDiag[0], winningCells: winning };
    }

    // Check anti-diagonal
    const antiDiag = Array.from({ length: size }, (_, i) => currentBoard[i * size + (size - 1 - i)]);
    if (antiDiag[0] && antiDiag.every((cell) => cell === antiDiag[0])) {
      const winning = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i));
      console.log(`Winner in anti-diagonal: ${antiDiag[0]}`, winning);
      return { winner: antiDiag[0], winningCells: winning };
    }

    // Check for draw
    if (currentBoard.every((cell) => cell !== null)) {
      console.log('Game is a draw');
      return { winner: 'Draw', winningCells: [] };
    }

    return { winner: null, winningCells: [] };
  }

  // Save game history
  const saveGameHistory = async(winner, winningCells) => {
    const history = {
      date: new Date().toLocaleString(),
      boardSize: boardSize,
      winner: winner === 'X' ? 'Player' : winner === 'O' ? 'Bot' : 'Draw',
      moves: moves,
      winningCells: winningCells, 
    };
    console.log('Game History Saved:', history);
    //send to api

    try {
      const result = await saveHistory(history); // เรียกฟังก์ชันจาก GameService
      console.log('Game History Saved to API:', result);
    } catch (error) {
      console.error('Failed to save game history:', error);
    }
  };

  // Handle game state updates
  useEffect(() => {
    if (board.length === 0) return;

    
    const { winner, winningCells } = checkWinner(board);
    if (winner) {
      setGameOver(true);
      setWinningCells(winningCells);
      setTimeout(() => {
        Swal.fire({
          title: winner === 'Draw' ? 'เสมอ!' : `${winner === 'X' ? 'คุณ' : 'บอท'} ชนะ!`,
          icon: 'success',
          confirmButtonText: 'ตกลง',
        }).then((result) => {
          if (result.isConfirmed) {
            saveGameHistory(winner, winningCells);
            Swal.fire({
              title: 'เล่นอีกครั้ง?',
              showCancelButton: true,
              confirmButtonText: 'เล่น',
              cancelButtonText: 'ไม่เล่น',
            }).then((saveResult) => {
              if (saveResult.isConfirmed) {
                handleReset();
                checkStart();
              } else {
                handleCancle();
              }
            });
          }
        });
      }, 2000); // หน่วงเวลา 2 วินาที
    } else if (turn === 'O') {
      botMove();
    }
  }, [board, turn]);


  useEffect(() => {
    checkStart();
  }, []);

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen">
      <span className="text-3xl font-bold text-red-800 mb-4">Tic Tac Toe Game</span>

      <div
        className="gap-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 5rem)`,
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex items-center justify-center rounded-lg cursor-pointer text-2xl font-bold ${
              winningCells.includes(index)
                ? 'bg-green-300 text-white' // สีพื้นหลังเมื่อชนะ
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Reset
      </button>
    </div>
  );
}

export default TicTacToe