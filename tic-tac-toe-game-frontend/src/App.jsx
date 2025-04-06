
import './App.css'
import TicTacToe from './Components/TicTacToePage/TicTacToe.jsx'
import Welcome from './Components/WelcomePage/welcome.jsx'
import Replay from './Components/Replay/Replay.jsx';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<TicTacToe />} />
        <Route path="/replay" element={<Replay />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
