import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Brain } from 'lucide-react';

export default function MemoryGames({ onNavigate }) {
  const [gameType, setGameType] = useState('menu');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍎', '🍊'];

  const initCardGame = () => {
    const selectedEmojis = emojis.slice(0, 6);
    const duplicatedEmojis = [...selectedEmojis, ...selectedEmojis];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
  };

  useEffect(() => {
    if (gameType === 'card-match') {
      initCardGame();
    }
  }, [gameType]);

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlipped;
      const firstCard = newCards.find(c => c.id === first);
      const secondCard = newCards.find(c => c.id === second);

      if (firstCard?.emoji === secondCard?.emoji) {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true }
              : c
          ));
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
        }, 600);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (gameType === 'menu') {
    return (
      <div className="min-h-screen px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Home</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-6 shadow-xl">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Memory Games
          </h1>
          <p className="text-2xl text-gray-600">
            Exercise your mind
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setGameType('card-match')}
            className="w-full bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-blue-100 mb-6"
          >
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Card Matching Game
            </h2>
            <p className="text-xl text-gray-600">
              Flip cards to find matching pairs
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (gameType === 'card-match') {
    const gameWon = matchedPairs === 6;

    return (
      <div className="min-h-screen px-6 py-8">
        <button
          onClick={() => setGameType('menu')}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Games</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Card Matching
          </h1>
          <div className="flex justify-center gap-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-blue-100">
              <p className="text-2xl font-bold text-gray-800">Moves: {moves}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-blue-100">
              <p className="text-2xl font-bold text-gray-800">Pairs: {matchedPairs}/6</p>
            </div>
          </div>
        </div>

        {gameWon ? (
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-12 shadow-xl text-center mb-8">
            <Trophy className="w-24 h-24 text-white mx-auto mb-4" />
            <p className="text-4xl font-bold text-white mb-4">Congratulations!</p>
            <p className="text-2xl text-white mb-8">You won in {moves} moves!</p>
            <button
              onClick={() => {
                initCardGame();
                setGameType('card-match');
              }}
              className="bg-white text-orange-500 px-8 py-4 rounded-2xl text-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-6 h-6" />
              Play Again
            </button>
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 mb-8">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-2xl text-6xl font-bold transition-all
                ${card.isMatched 
                  ? 'bg-green-300 cursor-default opacity-70'
                  : card.isFlipped
                  ? 'bg-blue-500'
                  : 'bg-purple-400 hover:bg-purple-500'
                }
              `}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>

        {!gameWon && (
          <div className="text-center">
            <button
              onClick={() => setGameType('menu')}
              className="bg-gray-300 text-gray-700 px-8 py-4 rounded-2xl text-2xl font-bold hover:bg-gray-400 transition-all"
            >
              Exit Game
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
