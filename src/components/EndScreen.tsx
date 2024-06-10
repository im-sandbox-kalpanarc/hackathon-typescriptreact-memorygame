import React from 'react';
import '../styles/EndScreen.css';

interface EndScreenProps {
    onRestartGame: () => void; // Prop function to restart the game
    score: number; // Prop for the player's score
    timeTaken: number; // Prop for the time taken to finish the game
}

const EndScreen: React.FC<EndScreenProps> = ({ onRestartGame, score, timeTaken }) => {
    // Render
    return (
        <div className="end-screen">
            <h1>Game Over</h1>
            <p>Thanks for playing!</p>
            <p>Your score: {score}</p>
            <p>Time taken: {timeTaken} seconds</p>
            <button onClick={onRestartGame}>Play Again</button>
        </div>
    );
};

export default EndScreen;
