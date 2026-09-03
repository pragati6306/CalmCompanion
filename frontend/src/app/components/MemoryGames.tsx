import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, Brain } from 'lucide-react';

type Page = 'home' | 'games' | 'mood' | 'reminders' | 'memories' | 'calming' | 'about';
type GameType = 'menu' | 'card-match' | 'word-recall';

interface MemoryGamesProps {
  onNavigate: (page: Page) => void;
}

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGames({ onNavigate }: MemoryGamesProps) {
  const [gameType, setGameType] = useState<GameType>('menu');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  
  // Word recall game state
  const [wordList, setWordList] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const emojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍎', '🍊'];
  
  const wordPairs = [
    { word: 'Apple', hint: 'A red fruit' },
    { word: 'Sun', hint: 'Bright in the sky' },
    { word: 'Cat', hint: 'Pet that meows' },
    { word: 'Book', hint: 'You read this' },
    { word: 'Tree', hint: 'Has leaves and branches' },
    { word: 'Water', hint: 'You drink this' },
    { word: 'House', hint: 'Where you live' },
    { word: 'Flower', hint: 'Grows in gardens' }
  ];

  // Initialize card match game
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

  // Initialize word recall game
  const initWordGame = () => {
    const shuffled = [...wordPairs].sort(() => Math.random() - 0.5).slice(0, 5);
    setWordList(shuffled.map(w => w.word));
    setWordIndex(0);
    setCurrentWord('');
    setUserAnswer('');
    setShowAnswer(false);
  };

  useEffect(() => {
    if (gameType === 'card-match') {
      initCardGame();
    } else if (gameType === 'word-recall') {
      initWordGame();
    }
  }, [gameType]);

  // Card game logic
  const handleCardClick = (cardId: number) => {
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
        // Match!
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
        // No match
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

  // Word recall logic
  const showNextWord = () => {
    if (wordIndex < wordList.length) {
      setCurrentWord(wordList[wordIndex]);
      setShowAnswer(false);
      setUserAnswer('');
      setTimeout(() => {
        setCurrentWord('');
      }, 3000);
    }
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const nextWordRecall = () => {
    if (wordIndex < wordList.length - 1) {
      setWordIndex(wordIndex + 1);
      setShowAnswer(false);
      setUserAnswer('');
    } else {
      initWordGame();
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
            Choose a game to exercise your mind
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => setGameType('card-match')}
            className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-blue-100"
          >
            <div className="text-6xl mb-6">🃏</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Card Match
            </h2>
            <p className="text-xl text-gray-600">
              Find matching pairs of cards
            </p>
          </button>

          <button
            onClick={() => setGameType('word-recall')}
            className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-4 border-green-100"
          >
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Word Recall
            </h2>
            <p className="text-xl text-gray-600">
              Remember and recall words
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (gameType === 'card-match') {
    return (
      <div className="min-h-screen px-6 py-8">
        <button
          onClick={() => setGameType('menu')}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Games</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Card Match Game</h1>
          
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-4 border-blue-100">
              <p className="text-xl text-gray-600 mb-2">Moves</p>
              <p className="text-4xl font-bold text-blue-600">{moves}</p>
            </div>
            
            <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-4 border-green-100">
              <p className="text-xl text-gray-600 mb-2">Pairs Found</p>
              <p className="text-4xl font-bold text-green-600">{matchedPairs} / 6</p>
            </div>
          </div>

          <button
            onClick={initCardGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg flex items-center gap-3 mx-auto transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
            New Game
          </button>
        </div>

        {matchedPairs === 6 && (
          <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-3xl shadow-2xl text-center border-4 border-white">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-3">Congratulations! 🎉</h2>
            <p className="text-2xl">You found all pairs in {moves} moves!</p>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-6">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-2xl text-6xl flex items-center justify-center
                transition-all duration-300 shadow-lg border-4
                ${card.isFlipped || card.isMatched
                  ? 'bg-white border-white'
                  : 'bg-gradient-to-br from-purple-400 to-pink-500 border-purple-200 hover:scale-105'
                }
                ${card.isMatched ? 'opacity-50' : ''}
              `}
              disabled={card.isMatched}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameType === 'word-recall') {
    return (
      <div className="min-h-screen px-6 py-8">
        <button
          onClick={() => setGameType('menu')}
          className="mb-6 flex items-center gap-3 text-2xl text-gray-700 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="font-semibold">Back to Games</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Word Recall Game</h1>
          <p className="text-2xl text-gray-600 mb-8">
            Word {wordIndex + 1} of {wordList.length}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {currentWord ? (
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-16 rounded-3xl shadow-2xl text-center mb-8 border-4 border-white">
              <p className="text-xl mb-4">Remember this word:</p>
              <p className="text-7xl font-bold">{currentWord}</p>
            </div>
          ) : !showAnswer ? (
            <div className="bg-white p-16 rounded-3xl shadow-2xl text-center mb-8 border-4 border-blue-100">
              <p className="text-3xl text-gray-700 mb-8">
                {wordIndex === 0 
                  ? "Ready to start? Click the button below to see the first word!"
                  : "What was the word you just saw?"}
              </p>
              
              {wordIndex > 0 && (
                <>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type the word here..."
                    className="w-full px-6 py-4 text-2xl border-4 border-gray-300 rounded-2xl mb-6 focus:outline-none focus:border-blue-500"
                  />
                  
                  <button
                    onClick={checkAnswer}
                    className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-colors"
                  >
                    Check Answer
                  </button>
                </>
              )}
              
              {wordIndex === 0 && (
                <button
                  onClick={showNextWord}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-colors"
                >
                  Show Word
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-3xl shadow-2xl text-center mb-8 border-4 border-green-100">
              <p className="text-2xl text-gray-700 mb-4">The correct word was:</p>
              <p className="text-6xl font-bold text-green-600 mb-6">{wordList[wordIndex]}</p>
              
              {userAnswer.toLowerCase().trim() === wordList[wordIndex].toLowerCase() ? (
                <div className="mb-8">
                  <p className="text-5xl mb-4">🎉</p>
                  <p className="text-3xl text-green-600 font-bold">Correct!</p>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-5xl mb-4">💙</p>
                  <p className="text-3xl text-blue-600 font-bold">Keep trying!</p>
                  {userAnswer && <p className="text-2xl text-gray-600 mt-2">You wrote: {userAnswer}</p>}
                </div>
              )}
              
              <button
                onClick={wordIndex < wordList.length - 1 ? nextWordRecall : () => initWordGame()}
                className="bg-purple-500 hover:bg-purple-600 text-white px-12 py-6 rounded-2xl text-2xl font-bold shadow-lg transition-colors"
              >
                {wordIndex < wordList.length - 1 ? 'Next Word' : 'Play Again'}
              </button>
            </div>
          )}

          {!currentWord && !showAnswer && wordIndex > 0 && (
            <div className="bg-blue-50 p-8 rounded-3xl border-4 border-blue-100">
              <p className="text-xl text-gray-700">
                <strong>Hint:</strong> {wordPairs.find(w => w.word === wordList[wordIndex])?.hint}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
