import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TimelineGame = ({ gameData, onComplete, isCompleted, score, onPlayAgain }) => {
  const [shuffledEvents, setShuffledEvents] = useState([]);
  const [userArrangement, setUserArrangement] = useState([]);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [feedback, setFeedback] = useState({ show: false, correct: 0, total: 0 });
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  
  // Initialize the game
  useEffect(() => {
    if (isCompleted) {
      setGameEnded(true);
      return;
    }
    
    resetGame();
  }, [gameData, isCompleted]);
  
  // Timer effect
  useEffect(() => {
    let timer;
    
    if (gameStarted && !gameEnded && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && !gameEnded) {
      checkAnswer();
    }
    
    return () => clearTimeout(timer);
  }, [gameStarted, gameEnded, remainingTime]);
  
  // Reset the game
  const resetGame = () => {
    // Create a shuffled copy of the events
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    setShuffledEvents(shuffled);
    setUserArrangement([]);
    setGameStarted(false);
    setGameEnded(false);
    setFeedback({ show: false, correct: 0, total: 0 });
    setRemainingTime(120);
  };
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
  };
  
  // Handle drag start
  const handleDragStart = (event) => {
    setDraggedEvent(event);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggedEvent(null);
  };
  
  // Handle dropping an event into the timeline
  const handleDrop = () => {
    if (draggedEvent && !userArrangement.some(e => e.year === draggedEvent.year)) {
      setUserArrangement([...userArrangement, draggedEvent]);
      setShuffledEvents(shuffledEvents.filter(e => e.year !== draggedEvent.year));
    }
  };
  
  // Handle removing an event from the timeline
  const handleRemoveFromTimeline = (event) => {
    setUserArrangement(userArrangement.filter(e => e.year !== event.year));
    setShuffledEvents([...shuffledEvents, event]);
  };
  
  // Check if the arrangement is correct
  const checkAnswer = () => {
    if (userArrangement.length !== gameData.length) {
      alert("Please arrange all events in the timeline first!");
      return;
    }
    
    // Sort the original data by year
    const sortedOriginal = [...gameData].sort((a, b) => a.year - b.year);
    
    // Count correct positions
    let correctCount = 0;
    for (let i = 0; i < sortedOriginal.length; i++) {
      if (userArrangement[i].year === sortedOriginal[i].year) {
        correctCount++;
      }
    }
    
    const correctPercentage = (correctCount / sortedOriginal.length) * 100;
    
    setFeedback({
      show: true,
      correct: correctCount,
      total: sortedOriginal.length,
    });
    
    setGameEnded(true);
    onComplete(correctPercentage);
  };
  
  // Format time (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">Constitutional Timeline Challenge</h2>
        {gameStarted && !gameEnded && (
          <div className={`font-mono text-lg ${remainingTime < 30 ? 'text-red-400' : 'text-gray-300'}`}>
            {formatTime(remainingTime)}
          </div>
        )}
      </div>
      
      {!gameStarted ? (
        <div className="card p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-3">Arrange the Constitutional Events</h3>
          <p className="text-gray-400 mb-6">
            Drag and drop the events in chronological order (earliest to latest). You have 2 minutes to complete the challenge.
          </p>
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
          >
            Start Challenge
          </button>
        </div>
      ) : (
        <>
          {/* The timeline area (drop zone) */}
          <div 
            className={`bg-dark-200 rounded-lg p-4 min-h-[200px] transition ${draggedEvent ? 'ring-2 ring-primary-500' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <h3 className="text-white font-medium mb-3">Your Timeline (Drop Events Here)</h3>
            
            {userArrangement.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic">
                Drag events here to build your timeline
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                
                {/* Timeline events */}
                <div className="space-y-3">
                  {userArrangement.map((event, index) => (
                    <motion.div
                      key={event.year}
                      className="flex items-start ml-4 pl-6 relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-2 h-2 rounded-full bg-primary-500 transform -translate-x-1 mt-2.5"></div>
                      
                      <div className="flex-grow bg-dark-300 rounded-lg p-3 flex justify-between items-start">
                        <div>
                          <div className="text-white font-medium">{event.year}: {event.event}</div>
                          <p className="text-gray-400 text-sm mt-1">{event.details}</p>
                        </div>
                        
                        {!gameEnded && (
                          <button
                            onClick={() => handleRemoveFromTimeline(event)}
                            className="text-gray-400 hover:text-red-400 transition"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Available events (drag source) */}
          {!gameEnded && (
            <div className="bg-dark-200 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Available Events</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {shuffledEvents.map((event) => (
                  <div
                    key={event.year}
                    className="bg-dark-300 rounded-lg p-3 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(event)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="font-medium text-white">{event.event}</div>
                    <div className="text-primary-400 text-sm">{event.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Game controls */}
          <div className="flex justify-center gap-4">
            {!gameEnded ? (
              <>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-dark-300 hover:bg-dark-200 text-white rounded-lg transition"
                >
                  Reset
                </button>
                <button
                  onClick={checkAnswer}
                  disabled={userArrangement.length !== gameData.length}
                  className={`px-6 py-2 rounded-lg transition ${
                    userArrangement.length === gameData.length
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-dark-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <button
                onClick={onPlayAgain}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition"
              >
                Play Again
              </button>
            )}
          </div>
          
          {/* Results */}
          {feedback.show && (
            <motion.div
              className={`p-5 rounded-lg text-center ${
                feedback.correct === feedback.total 
                  ? 'bg-green-900/30 border border-green-800' 
                  : feedback.correct >= feedback.total / 2
                    ? 'bg-yellow-900/30 border border-yellow-800'
                    : 'bg-red-900/30 border border-red-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {feedback.correct === feedback.total 
                  ? 'Perfect Timeline!'
                  : feedback.correct >= feedback.total / 2
                    ? 'Good Attempt!'
                    : 'Try Again!'}
              </h3>
              <p className="text-gray-300">
                You correctly positioned {feedback.correct} out of {feedback.total} events.
              </p>
              
              {/* Correct order information */}
              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Correct Order:</h4>
                <div className="text-left inline-block">
                  {[...gameData].sort((a, b) => a.year - b.year).map((event, index) => (
                    <div key={event.year} className="text-gray-300">
                      <span className="font-semibold">{index + 1}.</span> {event.year}: {event.event}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default TimelineGame; 