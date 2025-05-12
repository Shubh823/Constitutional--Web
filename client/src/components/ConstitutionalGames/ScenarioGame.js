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
    
    const isCorrect = selectedOption.isCorrect;
    
    // Set feedback
    setFeedback({
      isCorrect,
      message: selectedOption.feedback
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
            
            <div className="text-sm text-gray-300">
              Scenario {currentScenario + 1} of {scenarioData.length}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Scenario description */}
            <div className="bg-dark-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {scenarioData[currentScenario].title}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {scenarioData[currentScenario].description}
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
                    <span className="font-medium">Hint:</span> {scenarioData[currentScenario].hint}
                  </p>
                </motion.div>
              )}
            </div>
            
            {/* Options */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">What would you decide?</h4>
              
              {scenarioData[currentScenario].options.map((option, optionIndex) => (
                <div 
                  key={optionIndex}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    userChoices[currentScenario] === optionIndex
                      ? feedback === null
                        ? 'border-primary-500 bg-primary-900/20'
                        : feedback.isCorrect && userChoices[currentScenario] === optionIndex
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-red-500 bg-red-900/20'
                      : 'border-dark-100 hover:border-dark-50'
                  }`}
                  onClick={() => handleSelectOption(optionIndex)}
                >
                  <span className="text-gray-200">{option.text}</span>
                </div>
              ))}
            </div>
            
            {/* Feedback area */}
            {feedback && (
              <motion.div 
                className={`p-4 rounded-lg ${
                  feedback.isCorrect 
                    ? 'bg-green-900/20 border border-green-800' 
                    : 'bg-red-900/20 border border-red-800'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {feedback.isCorrect ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-medium text-lg ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className="text-gray-300">
                      {feedback.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-end pt-4">
              {feedback === null ? (
                <button
                  onClick={handleSubmitAnswer}
                  className="btn btn-primary"
                  disabled={userChoices[currentScenario] === null}
                >
                  Submit Decision
                </button>
              ) : (
                <button
                  onClick={handleNextScenario}
                  className="btn btn-primary"
                >
                  {currentScenario < scenarioData.length - 1 ? 'Next Scenario' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ScenarioGame; 