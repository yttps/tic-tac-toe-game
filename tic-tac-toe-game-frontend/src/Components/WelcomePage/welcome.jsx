import React from 'react'
import './welcome.css'
import bgWelcome from '../assets/bg-welcome.mp4'
import imageTic from '../assets/image.jpg'
import { useNavigate } from 'react-router-dom';

function Welcome() {

    const navigate = useNavigate();

    const handlePlay = () => {
        navigate('/game'); 
    };

    const handleRePlay = () => {
        navigate('/replay');
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <video
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={bgWelcome} type="video/mp4" />
            </video>
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-auto gap-4">
                <div className='flex flex-col items-center justify-center gap-5 bg-white p-4 rounded-lg shadow-lg'>
                    <span className="text-3xl font-bold text-red-800">Tic Tac Toe Game</span>
                    <img src={imageTic} alt="" width="300" height="200"/>
                    <div className='gap-4 flex items-center justify-center'>
                        <button
                        onClick={handleRePlay}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            ประวัติการเล่น
                        </button>
                        <button
                            onClick={handlePlay}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            เริ่มเกม
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome