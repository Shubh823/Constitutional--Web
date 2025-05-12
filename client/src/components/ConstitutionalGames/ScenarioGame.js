import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScenarioGame = ({ scenarioData, onComplete, isCompleted, score, onPlayAgain }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userChoices, setUserChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [animations, setAnimations] = useState({
    feedback: false,
    correct: false,
    wrong: false
  });
  
  // Check for completed status from props
  useEffect(() => {
    if (isCompleted && score) {
      setCompleted(true);
      setGameScore(score);
    }
  }, [isCompleted, score]);
  
  // Initialize user choices array
  useEffect(() => {
    if (scenarioData && scenarioData.length > 0) {
      setUserChoices(new Array(scenarioData.length).fill(null));
    }
  }, [scenarioData]);
  
  // Handle selecting an option
  const handleSelectOption = (optionIndex) => {
    // Don't allow changing answer after receiving feedback
    if (feedback !== null) return;
    
    const newChoices = [...userChoices];
    newChoices[currentScenario] = optionIndex;
    setUserChoices(newChoices);
  };
  
  // Submit answer and get feedback
  const handleSubmitAnswer = () => {
    if (userChoices[currentScenario] === null) return;
    
    const scenario = scenarioData[currentScenario];
    const selectedOption = scenario.options[userChoices[currentScenario]];
    
    // Check if the option has isCorrect or correct property (for backward compatibility)
    const isCorrect = selectedOption.isCorrect != null 
      ? selectedOption.isCorrect 
      : selectedOption.correct != null
        ? selectedOption.correct
        : false;
    
    // Set feedback
    setFeedback({
      isCorrect,
      message: selectedOption.feedback || (isCorrect 
        ? "That's correct!" 
        : "That's not the right answer.")
    });
    
    // Play animations
    setAnimations({
      feedback: true,
      correct: isCorrect,
      wrong: !isCorrect
    });
    
    // Update score
    if (isCorrect) {
      setGameScore(prevScore => prevScore + 1);
    }
  };
  
  // Move to next scenario
  const handleNextScenario = () => {
    // Reset feedback and hint
    setFeedback(null);
    setShowHint(false);
    setAnimations({ feedback: false, correct: false, wrong: false });
    
    if (currentScenario < scenarioData.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      // Game completed
      setCompleted(true);
      
      // Calculate final percentage
      const finalScore = Math.round((gameScore / scenarioData.length) * 100);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(finalScore);
      }
    }
  };
  
  // Toggle hint visibility
  const toggleHint = () => {
    setShowHint(!showHint);
  };
  
  // Restart game
  const restartGame = () => {
    setCurrentScenario(0);
    setUserChoices(new Array(scenarioData.length).fill(null));
    setFeedback(null);
    setGameScore(0);
    setCompleted(false);
    setShowHint(false);
    setAnimations({ feedback: false, correct: false, wrong: false });
    
    // Call play again handler if provided
    if (onPlayAgain) {
      onPlayAgain();
    }
  };
  
  if (!scenarioData || scenarioData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-dark-200 rounded-lg p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-center text-gray-400">No scenario data available</div>
        <p className="text-center text-gray-500 text-sm mt-2">Please check the configuration for this game</p>
      </div>
    );
  }

  // Get the current scenario
  const currentScenarioData = scenarioData[currentScenario];
  
  // Guard against missing data
  if (!currentScenarioData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-dark-200 rounded-lg p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="text-center text-gray-400">Scenario data is invalid</div>
        <p className="text-center text-gray-500 text-sm mt-2">Please check the format of your scenario configuration</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-200 rounded-lg p-6">
      <AnimatePresence mode="wait">
        {completed ? (
          // Results screen
          <motion.div 
            key="results"
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Scenario Challenge Complete!</h2>
            
            <motion.div 
              className="inline-block h-40 w-40 rounded-full border-8 border-primary-500 p-3 mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 50, damping: 10 }}
            >
              <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary-400">{typeof score === 'number' ? score : Math.round((gameScore / scenarioData.length) * 100)}%</span>
              </div>
            </motion.div>
            
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-xl font-medium text-white mb-4">Your Results</h3>
              
              <div className="bg-dark-300 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Correct Decisions:</span>
                  <span className="text-green-400 font-medium">
                    {gameScore} out of {scenarioData.length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-300">Constitutional Expertise:</span>
                  <span className={`font-medium ${
                    gameScore / scenarioData.length >= 0.7 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {gameScore / scenarioData.length >= 0.9 ? 'Constitutional Expert' :
                     gameScore / scenarioData.length >= 0.7 ? 'Constitutional Scholar' :
                     gameScore / scenarioData.length >= 0.5 ? 'Constitutional Student' :
                     'Constitutional Novice'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                {gameScore / scenarioData.length >= 0.7 
                  ? 'Excellent! You have a strong understanding of constitutional principles and how they apply to real-world scenarios.' 
                  : 'Review the constitutional principles and their applications to improve your understanding of how they work in practice.'}
              </p>
            </div>
            
            <motion.button 
              onClick={restartGame}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        ) : (
          // Scenario gameplay
          <motion.div
            key="gameplay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Constitutional Scenarios</h2>
              
              <div className="flex items-center">
                <div className="text-sm font-medium mr-3 px-3 py-1 bg-dark-300 rounded-full">
                  {currentScenario + 1} / {scenarioData.length}
                </div>
                
                <div className="w-24 bg-dark-300 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="bg-primary-500 h-2"
                    initial={{ width: `${((currentScenario) / scenarioData.length) * 100}%` }}
                    animate={{ width: `${((currentScenario + 1) / scenarioData.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Scenario description */}
              <motion.div 
                className="bg-dark-300 rounded-lg p-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={`scenario-${currentScenario}`}
                layout
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {currentScenarioData.title || "Constitutional Scenario"}
                </h3>
                
                <p className="text-gray-300 mb-4">
                  {currentScenarioData.situation || currentScenarioData.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="text-primary-400 font-medium">
                    {currentScenarioData.question || "What would you decide?"}
                  </div>
                  
                  <button 
                    onClick={toggleHint}
                    className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                </div>
                
                <AnimatePresence>
                  {showHint && (
                    <motion.div 
                      className="mt-4 p-3 bg-primary-900/20 border border-primary-800 rounded-lg"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-primary-300">
                        <span className="font-medium">Hint:</span> {currentScenarioData.hint || "Think about how the constitutional principles apply to this situation."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Options */}
              <div className="space-y-3">
                {currentScenarioData.options.map((option, optionIndex) => {
                  // Determine if this option is correct
                  const isOptionCorrect = option.isCorrect != null 
                    ? option.isCorrect 
                    : option.correct != null 
                      ? option.correct 
                      : false;
                  
                  return (
                    <motion.div 
                      key={optionIndex}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: optionIndex * 0.1 }}
                    >
                      <motion.div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          feedback !== null && userChoices[currentScenario] === optionIndex
                            ? isOptionCorrect
                                ? 'border-green-500 bg-green-900/20'
                                : 'border-red-500 bg-red-900/20'
                            : userChoices[currentScenario] === optionIndex
                              ? 'border-primary-500 bg-primary-900/20'
                              : 'border-gray-700 hover:border-gray-500'
                        }`}
                        onClick={() => handleSelectOption(optionIndex)}
                        whileHover={feedback === null ? { scale: 1.01, borderColor: '#6c5ce7' } : {}}
                        animate={
                          feedback !== null && userChoices[currentScenario] === optionIndex
                            ? isOptionCorrect
                              ? { borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)' }
                              : { borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)' }
                            : {}
                        }
                      >
                        <div className="flex items-center">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                            userChoices[currentScenario] === optionIndex
                              ? (feedback !== null ? 
                                  isOptionCorrect ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500' 
                                  : 'border-primary-500 bg-primary-500')
                              : 'border-gray-600'
                          }`}>
                            {userChoices[currentScenario] === optionIndex && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={userChoices[currentScenario] === optionIndex ? 'text-white font-medium' : 'text-gray-300'}>
                            {option.text}
                          </span>
                        </div>
                        
                        {/* Show feedback if this option was selected */}
                        <AnimatePresence>
                          {feedback !== null && userChoices[currentScenario] === optionIndex && (
                            <motion.div 
                              className={`mt-3 pt-3 border-t ${isOptionCorrect ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}
                              initial={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 12, paddingTop: 12 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              {option.feedback || (isOptionCorrect ? "That's correct!" : "That's not correct.")}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Actions */}
              <div className="flex justify-end pt-4">
                {feedback === null ? (
                  <motion.button
                    className={`px-6 py-2.5 rounded-lg transition-colors ${
                      userChoices[currentScenario] !== null 
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={handleSubmitAnswer}
                    disabled={userChoices[currentScenario] === null}
                    whileHover={userChoices[currentScenario] !== null ? { scale: 1.05 } : {}}
                    whileTap={userChoices[currentScenario] !== null ? { scale: 0.95 } : {}}
                  >
                    Submit Answer
                  </motion.button>
                ) : (
                  <motion.button
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                    onClick={handleNextScenario}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {currentScenario < scenarioData.length - 1 ? 'Next Scenario' : 'Complete Challenge'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioGame; 