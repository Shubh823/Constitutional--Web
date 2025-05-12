import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QuizGame = ({ quizData, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // seconds per question
  const [timerActive, setTimerActive] = useState(true);
  
  // Initialize answers array
  useEffect(() => {
    if (quizData && quizData.length > 0) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);
  
  // Timer effect
  useEffect(() => {
    let timerId;
    
    if (timerActive && timeLeft > 0 && !showResults) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      // Time's up for current question
      handleNextQuestion();
    }
    
    return () => {
      clearTimeout(timerId);
    };
  }, [timeLeft, timerActive, showResults]);
  
  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);
  
  // Handle selecting an answer
  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };
  
  // Handle moving to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      calculateScore();
    }
  };
  
  // Handle moving to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Calculate final score
  const calculateScore = () => {
    let correctCount = 0;
    
    quizData.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer !== null && question.options[userAnswer].isCorrect) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / quizData.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    setTimerActive(false);
    
    if (onComplete) {
      onComplete(finalScore);
    }
  };
  
  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quizData.length).fill(null));
    setScore(0);
    setShowResults(false);
    setTimeLeft(30);
    setTimerActive(true);
  };
  
  if (!quizData || quizData.length === 0) {
    return <div className="text-center text-gray-400">No quiz data available</div>;
  }

  return (
    <div className="card p-6">
      {showResults ? (
        // Results screen
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quiz Results</h2>
          
          <div className="inline-block h-40 w-40 rounded-full border-8 border-primary-500 p-3 mb-8">
            <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-400">{score}%</span>
            </div>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-xl font-medium text-white mb-4">Your Performance</h3>
            
            <div className="bg-dark-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Correct Answers:</span>
                <span className="text-green-400 font-medium">
                  {answers.filter((answer, index) => 
                    answer !== null && quizData[index].options[answer].isCorrect
                  ).length} 
                  out of {quizData.length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Score:</span>
                <span className={`font-medium ${
                  score >= 70 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {score}%
                </span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6">
              {score >= 70 
                ? 'Great job! You have a good understanding of this topic.' 
                : 'Keep studying! You might need to review this topic again.'}
            </p>
          </div>
          
          <button 
            onClick={restartQuiz}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        // Quiz questions
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Constitutional Quiz</h2>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                Question {currentQuestion + 1} of {quizData.length}
              </div>
              
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                timeLeft > 10 ? 'bg-green-900/30 text-green-400' :
                timeLeft > 5 ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-6 mb-6">
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-white mb-6">
                {quizData[currentQuestion].question}
              </h3>
              
              <div className="space-y-3">
                {quizData[currentQuestion].options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className={`p-4 rounded-lg border-2 cursor-pointer ${
                      answers[currentQuestion] === optionIndex
                        ? 'border-primary-500 bg-primary-900/20'
                        : 'border-dark-100 hover:border-dark-50'
                    }`}
                    onClick={() => handleSelectAnswer(optionIndex)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        answers[currentQuestion] === optionIndex
                          ? 'border-primary-500'
                          : 'border-gray-600'
                      }`}>
                        {answers[currentQuestion] === optionIndex && (
                          <div className="h-2 w-2 rounded-full bg-primary-500"></div>
                        )}
                      </div>
                      <span className="text-gray-200">{option.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              className="btn btn-outline"
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary"
              disabled={answers[currentQuestion] === null}
            >
              {currentQuestion < quizData.length - 1 ? 'Next' : 'Finish Quiz'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizGame; 