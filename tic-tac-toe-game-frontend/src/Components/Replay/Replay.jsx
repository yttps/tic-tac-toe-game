import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGameHistories } from '../../services/GameService';
import { Game } from '../../models/gameModel';


function Replay() {

    const navigate = useNavigate();
    const [histories, setHistories] = useState([]); // รายการประวัติ
    const [selectedHistory, setSelectedHistory] = useState(null); // ประวัติที่เลือก
    const [board, setBoard] = useState([]); // บอร์ดสำหรับแสดง
    const [currentStep, setCurrentStep] = useState(0);


    const handleSelectHistory = (history) => {
        setSelectedHistory(history);
        setCurrentStep(0);
        const initialBoard = Array(history.boardSize * history.boardSize).fill(null);
        if (history.moves.length > 0) {
            initialBoard[history.moves[0].index] = history.moves[0].player; // แสดง move แรก
        }
        setBoard(initialBoard);
    };

    // เลื่อนไป step ถัดไป
  const handleNext = () => {
    if (!selectedHistory || currentStep >= selectedHistory.moves.length - 1) return;
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    const updatedBoard = Array(selectedHistory.boardSize * selectedHistory.boardSize).fill(null);
    selectedHistory.moves.slice(0, nextStep + 1).forEach((move) => {
      updatedBoard[move.index] = move.player;
    });
    setBoard(updatedBoard);
  };

  // ย้อนกลับไป step ก่อนหน้า
  const handlePrev = () => {
    if (!selectedHistory || currentStep <= 0) return;
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    const updatedBoard = Array(selectedHistory.boardSize * selectedHistory.boardSize).fill(null);
    selectedHistory.moves.slice(0, prevStep + 1).forEach((move) => {
      updatedBoard[move.index] = move.player;
    });
    setBoard(updatedBoard);
  };
    
    // กลับไปหน้าแรก
    const handleBack = () => {
    navigate('/');
    };

    useEffect(() => {
        const loadHistories = async () => {
          try {
            const data = await fetchGameHistories();
            const gameHistories = data.map((item) => new Game(item));
            setHistories(gameHistories);
            console.log(gameHistories)
          } catch (error) {
            console.error('Failed to load histories:', error);
          }
        };
        loadHistories();
      }, []);
    
    
    return (
    <div className="bg-white flex h-screen w-full">

      <div 
        className="bg-gray-200 w-[30%] flex flex-col items-center justify-between h-full p-3 gap-8 rounded-lg shadow-lg border border-gray-400">
        <span className="text-xl font-bold">ประวัติการเล่น</span>
        <hr className='w-full' />
        <div className="w-full h-full flex flex-col gap-3 overflow-y-auto">
          {histories.map((history, index) => (
            <div
              key={index}
              className="flex gap-2 p-2 hover:bg-gray-300 hover:cursor-pointer"
              onClick={() => handleSelectHistory(history)}
            >
              <span>วันที่: {history.date}</span>
              <span
                className={`font-bold ${
                  history.winner === 'Player'
                    ? 'text-green-500'
                    : history.winner === 'Bot'
                    ? 'text-red-500'
                    : 'text-blue-500'
                }`}
              >
                ผลลัพธ์: {history.winner}
              </span>
            </div>
          ))}
        </div>
        <div
          className="flex w-full h-auto bg-blue-600 items-center justify-center p-2 cursor-pointer rounded-lg"
          onClick={handleBack}
        >
          <span className="text-white">กลับไปหน้าแรก</span>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-3 shadow-lg">
        {selectedHistory ? (
          <>
            <span className="text-2xl font-bold mb-4">
              Replay: {selectedHistory.winner} ({selectedHistory.boardSize}x{selectedHistory.boardSize})
            </span>
            <div
              className="gap-2"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${selectedHistory.boardSize}, 5rem)`,
              }}
            >
              {board.map((cell, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex items-center justify-center rounded-lg text-2xl font-bold ${
                    currentStep === selectedHistory.moves.length - 1 && // ตรวจสอบ step สุดท้าย
                    selectedHistory.winningCells.includes(index)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                disabled={currentStep <= 0}
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
                disabled={currentStep >= selectedHistory.moves.length - 1}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <span className="text-xl">เลือกประวัติเพื่อดูการเล่นซ้ำ</span>
        )}
      </div>
    </div>
  );
}

export default Replay