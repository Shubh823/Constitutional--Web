import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MatchingGame = ({ gameData, onComplete, isCompleted, score, onPlayAgain }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize game
  useEffect(() => {
    // If game is already completed from props
    if (isCompleted && score !== undefined) {
      setGameComplete(true);
      setGameScore(score);
      return;
    }
    
    // Create pairs of cards from game data
    const createGameCards = () => {
      if (!gameData || !Array.isArray(gameData) || gameData.length === 0) {
        // Handle empty or invalid data
        return [];
      }
      
      // Each card needs an id, type (term/definition), and content
      const termCards = gameData.map((item, index) => ({
        id: `term-${index}`,
        type: 'term',
        content: item.term,
        matchId: index
      }));
      
      const definitionCards = gameData.map((item, index) => ({
        id: `def-${index}`,
        type: 'definition',
        content: item.definition,
        matchId: index
      }));
      
      // Combine and shuffle
      return shuffleArray([...termCards, ...definitionCards]);
    };
    
    const cardData = createGameCards();
    setCards(cardData);
    setStartTime(Date.now());
    
    // Reset game state
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameComplete(false);
    setDisabled(false);
  }, [gameData, isCompleted, score]);

  // Timer for the game
  useEffect(() => {
    if (!gameComplete && startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameComplete, startTime]);

  // Check if game is complete
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length && cards.length > 0) {
      setGameComplete(true);
      
      // Calculate score based on moves and time
      // Lower moves and time = higher score, max 100%
      const baseScore = Math.max(0, 100 - (moves - (cards.length / 2)) * 5);
      const timeScore = Math.max(0, 100 - (elapsedTime / 5));
      const finalScore = Math.round((baseScore + timeScore) / 2);
      
      const normalizedScore = Math.min(100, Math.max(0, finalScore));
      setGameScore(normalizedScore);
      
      if (onComplete) {
        onComplete(normalizedScore);
      }
    }
  }, [matched, cards.length, moves, onComplete, elapsedTime]);

  // Shuffle array helper function
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Handle card click
  const handleCardClick = (id) => {
    // Prevent clicking if disabled
    if (disabled) return;
    
    // Prevent clicking on already matched or flipped cards
    if (matched.includes(id) || flipped.includes(id)) return;
    
    // Add card to flipped array
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    // If two cards are flipped, check for a match
    if (newFlipped.length === 2) {
      setDisabled(true);
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);
      
      // Check if the cards match (same matchId but different types)
      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        // Match found
        setMatched([...matched, firstId, secondId]);
        resetFlipped();
      } else {
        // No match
        setTimeout(resetFlipped, 1000);
      }
    }
  };

  // Reset flipped cards
  const resetFlipped = () => {
    setFlipped([]);
    setDisabled(false);
  };

  // Reset game
  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    setDisabled(false);
    setMoves(0);
    setGameComplete(false);
    setGameScore(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCards(shuffleArray([...cards]));
    
    if (onPlayAgain) {
      onPlayAgain();
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle empty data
  if (!cards || cards.length === 0) {
    return (
      <div className="bg-dark-200 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <h3 className="text-lg font-medium text-white mb-2">No matching pairs available</h3>
        <p className="text-gray-400">The game data is empty or invalid. Please check the configuration.</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Constitutional Matching</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-dark-300 px-3 py-1 rounded-full text-gray-300">
            Moves: <span className="font-semibold text-primary-400">{moves}</span>
          </div>
          <div className="bg-dark-300 px-3 py-1 rounded-full text-gray-300">
            Time: <span className="font-semibold text-primary-400">{formatTime(elapsedTime)}</span>
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {gameComplete ? (
          <motion.div
            key="complete"
            className="text-center py-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Game Complete!</h3>
            
            <motion.div 
              className="inline-block h-32 w-32 rounded-full border-8 border-primary-500 p-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-400">{isCompleted && score !== undefined ? score : gameScore}%</span>
              </div>
            </motion.div>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-dark-300 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Total Moves:</span>
                  <span className="text-primary-400 font-medium">{moves}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Completion Time:</span>
                  <span className="text-primary-400 font-medium">{formatTime(elapsedTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Memory Rating:</span>
                  <span className="text-green-400 font-medium">
                    {gameScore >= 90 ? 'Constitutional Master' :
                    gameScore >= 75 ? 'Constitutional Expert' :
                    gameScore >= 60 ? 'Constitutional Scholar' : 'Constitutional Student'}
                  </span>
                </div>
              </div>
            </div>
            
            <motion.button 
              onClick={resetGame}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-4">
              <p className="text-gray-300 text-sm">Match each constitutional term with its correct definition.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {cards.map(card => (
                <motion.div
                  key={card.id}
                  className={`aspect-[3/4] cursor-pointer relative rounded-lg ${
                    matched.includes(card.id) ? 'opacity-80' : ''
                  }`}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={!matched.includes(card.id) && !flipped.includes(card.id) ? { scale: 1.03 } : {}}
                  whileTap={!matched.includes(card.id) && !flipped.includes(card.id) ? { scale: 0.97 } : {}}
                >
                  {/* Card Container with 3D perspective */}
                  <div className="w-full h-full perspective-500">
                    {/* Card Inner Container that flips */}
                    <div 
                      className={`w-full h-full relative transform-style-preserve-3d transition-transform duration-500 ${
                        flipped.includes(card.id) || matched.includes(card.id) ? 'rotate-y-180' : ''
                      }`}
                    >
                      {/* Card Back */}
                      <div className="absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center p-3 bg-dark-300 border-2 border-gray-700 shadow-md">
                        <div className={`text-sm font-medium text-center ${
                          card.type === 'term' ? 'text-primary-400' : 'text-secondary-400'
                        }`}>
                          {card.type === 'term' ? 'Constitutional Term' : 'Definition'}
                        </div>
                      </div>
                      
                      {/* Card Front */}
                      <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg flex items-center justify-center p-3 bg-dark-100 border-2 border-gray-600 shadow-md">
                        <div className={`overflow-y-auto max-h-full text-center ${
                          card.type === 'term' ? 'text-primary-300 font-medium' : 'text-gray-300 text-sm'
                        }`}>
                          {card.content}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Matched indicator */}
                  <AnimatePresence>
                    {matched.includes(card.id) && (
                      <motion.div 
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add CSS to handle the 3D card flipping
const cardStyles = `
  .perspective-500 {
    perspective: 1000px;
  }
  
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Inject CSS for 3D card flipping
if (typeof document !== 'undefined') {
  if (!document.getElementById('matching-game-styles')) {
    const style = document.createElement('style');
    style.id = 'matching-game-styles';
    style.innerHTML = cardStyles;
    document.head.appendChild(style);
  }
}

export default MatchingGame; 