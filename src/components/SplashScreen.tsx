import React, { useEffect, useState } from 'react';
import '../styles/Common.css';
import '../styles/SplashScreen.css';

interface SplashScreenProps {
  onStartGame: () => void; // Prop function to start the game
}

type GameData = {
  score: number;
  moves: number;
  gameTime: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
  // State Variables
  const [gameData, setGameData] = useState<GameData[]>([]);

  // Effects
  useEffect(() => {
    fetch('http://localhost:5000/api/getGame')
      .then(response => response.json())
      .then(data => setGameData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  // Render
  return (
    <div className="screen">
      <h1>Welcome to My Game App!!</h1>
      <p>Previous score(s) of the game.</p>
      {gameData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Score</th>
              <th>Moves</th>
              <th>Game Time</th>
            </tr>
          </thead>
          <tbody>
            {gameData.map((game, index) => (
              <tr key={index}>
                <td>{game.score}</td>
                <td>{game.moves}</td>
                <td>{game.gameTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading game data...</p>
      )}
      <button onClick={onStartGame}>Start Game</button>
    </div>
  );
};

export default SplashScreen;
