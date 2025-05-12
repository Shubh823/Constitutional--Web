import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ScenarioGame = ({ scenarioData, onComplete }) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userChoices, setUserChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
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
    
    // Check if the option has isCorrect property
    const isCorrect = selectedOption.isCorrect != null 
      ? selectedOption.isCorrect 
      : selectedOption.correct; // fallback for backward compatibility
    
    // Set feedback
    setFeedback({
      isCorrect,
      message: selectedOption.feedback || (isCorrect 
        ? "That's correct!" 
        : "That's not the right answer. Try again!")
    });
    
    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }
  };
  
  // Move to next scenario
  const handleNextScenario = () => {
    // Reset feedback and hint
    setFeedback(null);
    setShowHint(false);
    
    if (currentScenario < scenarioData.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      // Game completed
      setCompleted(true);
      
      // Calculate final percentage
      const finalScore = Math.round((score / scenarioData.length) * 100);
      
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
    setScore(0);
    setCompleted(false);
    setShowHint(false);
  };
  
  if (!scenarioData || scenarioData.length === 0) {
    return <div className="text-center text-gray-400">No scenario data available</div>;
  }

  // Get the current scenario
  const currentScenarioData = scenarioData[currentScenario];
  
  // Guard against missing data
  if (!currentScenarioData) {
    return <div className="text-center text-gray-400">Scenario data is invalid</div>;
  }

  return (
    <div className="card p-6">
      {completed ? (
        // Results screen
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Scenario Challenge Complete!</h2>
          
          <div className="inline-block h-40 w-40 rounded-full border-8 border-primary-500 p-3 mb-8">
            <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-400">{Math.round((score / scenarioData.length) * 100)}%</span>
            </div>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Your Results</h3>
            
            <div className="bg-dark-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Correct Decisions:</span>
                <span className="text-green-400 font-medium">
                  {score} out of {scenarioData.length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Constitutional Expertise:</span>
                <span className={`font-medium ${
                  score / scenarioData.length >= 0.7 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {score / scenarioData.length >= 0.9 ? 'Constitutional Expert' :
                   score / scenarioData.length >= 0.7 ? 'Constitutional Scholar' :
                   score / scenarioData.length >= 0.5 ? 'Constitutional Student' :
                   'Constitutional Novice'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              {score / scenarioData.length >= 0.7 
                ? 'You have a strong understanding of constitutional principles and how they apply to real-world scenarios.' 
                : 'Review the constitutional principles and their applications to improve your understanding.'}
            </p>
          </div>
          
          <button 
            onClick={restartGame}
            className="btn btn-primary"
          >
            Play Again
          </button>
        </motion.div>
      ) : (
        // Scenario gameplay
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Constitutional Scenarios</h2>
            
            <div className="flex items-center">
              <div className="text-sm font-medium mr-3 px-3 py-1 bg-dark-200 rounded-full">
                {currentScenario + 1} / {scenarioData.length}
              </div>
              
              <div className="w-24 bg-dark-200 h-2 rounded-full">
                <div 
                  className="bg-primary-500 h-2 rounded-full" 
                  style={{ width: `${((currentScenario + 1) / scenarioData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Scenario description */}
            <motion.div 
              className="bg-dark-200 rounded-lg p-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              key={`scenario-${currentScenario}`}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                {currentScenarioData.title || "Constitutional Scenario"}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {currentScenarioData.situation || currentScenarioData.description}
              </p>
              
              <div className="flex justify-end">
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
              
              {showHint && (
                <motion.div 
                  className="mt-4 p-3 bg-primary-900/20 border border-primary-800 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-primary-300">
                    <span className="font-medium">Hint:</span> {currentScenarioData.hint || "Think about how the constitutional principles apply to this situation."}
                  </p>
                </motion.div>
              )}
            </motion.div>
            
            {/* Options */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">{currentScenarioData.question || "What would you decide?"}</h4>
              
              {currentScenarioData.options.map((option, optionIndex) => (
                <motion.div 
                  key={optionIndex}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: optionIndex * 0.1 }}
                >
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      feedback !== null && userChoices[currentScenario] === optionIndex
                        ? (option.isCorrect || option.correct)
                            ? 'border-green-500 bg-green-900/20'
                            : 'border-red-500 bg-red-900/20'
                        : userChoices[currentScenario] === optionIndex
                          ? 'border-primary-500 bg-primary-900/20'
                          : 'border-gray-700 hover:border-gray-500'
                    }`}
                    onClick={() => handleSelectOption(optionIndex)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        userChoices[currentScenario] === optionIndex
                          ? (feedback !== null ? 
                              (option.isCorrect || option.correct) ? 'border-green-500' : 'border-red-500' 
                              : 'border-primary-500')
                          : 'border-gray-600'
                      }`}>
                        {userChoices[currentScenario] === optionIndex && (
                          <div className={`h-2 w-2 rounded-full ${
                            feedback !== null ? 
                              (option.isCorrect || option.correct) ? 'bg-green-500' : 'bg-red-500' 
                              : 'bg-primary-500'
                          }`}></div>
                        )}
                      </div>
                      <span className="text-gray-200">{option.text}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Feedback */}
            {feedback && (
              <motion.div 
                className={`p-4 rounded-lg ${
                  feedback.isCorrect ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {feedback.isCorrect ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                    </h3>
                    <div className="mt-1 text-sm text-gray-300">
                      {feedback.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Actions */}
            <div className="flex justify-between pt-4">
              <button
                onClick={feedback ? handleNextScenario : handleSubmitAnswer}
                className={`btn ${feedback ? 'btn-primary' : 'btn-secondary'}`}
                disabled={userChoices[currentScenario] === null}
              >
                {feedback 
                  ? (currentScenario < scenarioData.length - 1 ? 'Next Scenario' : 'Finish Game') 
                  : 'Submit Answer'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioGame; 