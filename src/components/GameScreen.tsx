import React, { useState, useEffect, useCallback } from 'react';
import '../styles/GameScreen.css';
import Card from './Card';

interface Props {
  x: number;
  y: number;
  onEndGame: (score: number, timeTaken: number) => void;
}

const GameScreen: React.FC<Props> = ({ x, y, onEndGame }) => {

  // State Variables
  const totalCards = x * y;
  const [cards, setCards] = useState<number[]>([]);
  const [clickedCards, setClickedCards] = useState<{ index: number, value: number }[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [scoredCards, setScoredCards] = useState<number[]>([]);

  // Derived Variables
  const maxScore = totalCards / 2;
  const gameTime = startTime ? Math.floor(((endTime || new Date()).getTime() - startTime.getTime()) / 1000) : 0;
  const minutes = Math.floor(gameTime / 60);
  const seconds = Math.floor(gameTime % 60);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  let finalScore = 0;

  // Helper Functions
  const generateCards = () => {
    let arr = Array.from({ length: totalCards / 2 }, (_, i) => i + 1);
    arr = [...arr, ...arr];
    arr.sort(() => Math.random() - 0.5);
    setCards(arr);
  };

  const resetGame = () => {
    setCards([]);
    setClickedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
    setStartTime(null);
    setEndTime(null);
    generateCards();
  };

  const handleCardClick = (index: number) => {
    if (clickedCards.length === 2) {
      return;
    }

    setClickedCards((prev) => {
      const newClickedCards = [...prev, { index, value: cards[index] }];

      if (newClickedCards.length === 2) {
        const firstCard = newClickedCards[0].value;
        const secondCard = newClickedCards[1].value;

        if (firstCard === secondCard) {
          setMatchedCards((prevMatched) => {
            const newMatchedCards = [...prevMatched, firstCard];

            // Only add the card to scoredCards if both it and its pair have been matched
            if (newMatchedCards.filter(card => card === firstCard).length === 2) {
              setScoredCards((prevScored) => [...prevScored, firstCard]);
            }
            return newMatchedCards;
          });
        }
        // If the cards don't match, flip them back after 1 second
        setTimeout(() => {
          setClickedCards([]);
        }, 1000);
      }
      return newClickedCards;
    });
    setMoves(moves + 1);
  };

  const handleEndGame = useCallback(() => {
    setEndTime(new Date());
    finalScore = maxScore - (moves / 2) - (gameTime / 120);
    finalScore = Math.max(finalScore, maxScore / 2);
    console.log('Game Over! Score:', finalScore, 'Time Taken:', gameTime);
    onEndGame(finalScore, gameTime);
  }, [moves, gameTime, onEndGame]);

  const saveGameToJson = () => {
    const gameData = {
      score: finalScore,
      moves,
      gameTime,
    };

    fetch('http://localhost:5000/api/savePlayerGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log(data.message))
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Effects
  useEffect(() => { generateCards(); }, []);
  useEffect(() => { setStartTime(new Date()); }, []);
  useEffect(() => { if (score === maxScore) setEndTime(new Date()); }, [score]);
  useEffect(() => { if (scoredCards.length > score) setScore(scoredCards.length); }, [scoredCards]);


  // Render
  return (
    <div className="gamescreen">
      <div className="game-info">
        <p>Score: {score}</p>
        <p>Moves: {moves}</p>
        <p>Time taken: {formattedTime}</p>
      </div>
      <div className="cards">
        {cards.map((cardNumber, index) => (
          <Card key={index} cardNumber={cardNumber} onClick={() => handleCardClick(index)}
            isFlipped={!!(clickedCards.find(card => card.index === index) || matchedCards.includes(cardNumber))} />
        ))}
      </div>
      <div className="game-controls">
        <button onClick={handleEndGame}>End Game</button>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={saveGameToJson}>Save Game</button>
      </div>
    </div>
  );
}

export default GameScreen;
