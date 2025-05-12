import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MatchingGame = ({ gameData, onComplete }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  // Initialize game
  useEffect(() => {
    // Create pairs of cards from game data
    const createGameCards = () => {
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
    
    setCards(createGameCards());
  }, [gameData]);

  // Check if game is complete
  useEffect(() => {
    if (matched.length > 0 && matched.length === cards.length) {
      setGameComplete(true);
      if (onComplete) {
        onComplete(moves);
      }
    }
  }, [matched, cards.length, moves, onComplete]);

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
    setCards(shuffleArray([...cards]));
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Constitutional Matching</h2>
        <div className="text-gray-300">
          Moves: {moves}
        </div>
      </div>
      
      {gameComplete ? (
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <h3 className="text-2xl font-bold text-white mb-2">Game Complete!</h3>
            <p className="text-gray-400 mb-6">You completed the game in {moves} moves</p>
            
            <button 
              onClick={resetGame}
              className="btn btn-primary"
            >
              Play Again
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {cards.map(card => (
            <motion.div
              key={card.id}
              className={`aspect-[4/3] cursor-pointer rounded-lg ${
                matched.includes(card.id) ? 'opacity-70' : ''
              }`}
              initial={{ rotateY: 0 }}
              animate={{ 
                rotateY: flipped.includes(card.id) || matched.includes(card.id) ? 180 : 0,
                opacity: matched.includes(card.id) ? 0.7 : 1
              }}
              transition={{ duration: 0.4 }}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="relative w-full h-full transform-style-preserve-3d">
                {/* Card back */}
                <div className={`absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center bg-dark-200 border-2 border-dark-100 ${
                  card.type === 'term' ? 'border-primary-500' : 'border-secondary-500'
                } ${
                  flipped.includes(card.id) || matched.includes(card.id) ? 'opacity-0' : 'opacity-100'
                }`}>
                  <div className="font-medium text-center">
                    {card.type === 'term' ? 'Term' : 'Definition'}
                  </div>
                </div>
                
                {/* Card front (content) */}
                <div className={`absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center p-3 bg-dark-100 border-2 rotateY-180 ${
                  card.type === 'term' ? 'border-primary-500' : 'border-secondary-500'
                } ${
                  flipped.includes(card.id) || matched.includes(card.id) ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="overflow-y-auto max-h-full">
                    <p className="text-sm text-center">
                      {card.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchingGame; 