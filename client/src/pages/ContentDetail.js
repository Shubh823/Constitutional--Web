import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';

// Import game components
import QuizGame from '../components/ConstitutionalGames/QuizGame';
import MatchingGame from '../components/ConstitutionalGames/MatchingGame';
import ScenarioGame from '../components/ConstitutionalGames/ScenarioGame';
import TimelineGame from '../components/ConstitutionalGames/TimelineGame';
import SpiralGame from '../components/ConstitutionalGames/SpiralGame';

const ContentDetail = () => {
  const { contentId } = useParams();
  const { authAxios } = useContext(AuthContext);
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [topic, setTopic] = useState(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch content details
        const contentResponse = await authAxios.get(`/content/content/${contentId}`);
        setContent(contentResponse.data);
        
        // Fetch topic details for this content
        const topicResponse = await authAxios.get(`/content/topics/detail/${contentResponse.data.topic}`);
        setTopic(topicResponse.data);
        
        // If it's a quiz, initialize answer array
        if (contentResponse.data.type === 'quiz' && contentResponse.data.quiz?.questions) {
          setQuizAnswers(new Array(contentResponse.data.quiz.questions.length).fill(null));
        }
      } catch (err) {
        console.error('Error fetching content data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    
    if (contentId) {
      fetchData();
    }
  }, [contentId, authAxios]);

  // Handle quiz answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  // Go to next quiz question
  const handleNextQuestion = () => {
    if (currentQuizQuestion < content.quiz.questions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      // Calculate score
      calculateQuizScore();
    }
  };

  // Go to previous quiz question
  const handlePrevQuestion = () => {
    if (currentQuizQuestion > 0) {
      setCurrentQuizQuestion(currentQuizQuestion - 1);
    }
  };

  // Calculate quiz score and submit it
  const calculateQuizScore = async () => {
    const correctAnswers = content.quiz.questions.map((question, index) => {
      const selectedAnswerIndex = quizAnswers[index];
      
      if (selectedAnswerIndex === null) return false;
      
      return question.options[selectedAnswerIndex].isCorrect;
    });
    
    const correctCount = correctAnswers.filter(Boolean).length;
    const totalCount = content.quiz.questions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    
    setQuizScore(score);
    setQuizCompleted(true);
    
    // Submit quiz score to API
    try {
      await authAxios.post('/content/track', {
        topicId: topic._id,
        contentId: content._id,
        type: 'quiz',
        score: score
      });
    } catch (err) {
      console.error('Error tracking quiz completion:', err);
    }
  };

  // Handle game completion
  const handleGameComplete = async (score) => {
    setGameScore(score);
    setGameCompleted(true);
    
    // Submit game score to API
    try {
      await authAxios.post('/content/track', {
        topicId: topic._id,
        contentId: content._id,
        type: 'game',
        score: score,
        completed: true
      });
    } catch (err) {
      console.error('Error tracking game completion:', err);
    }
  };

  // Mark lesson/article/video as completed
  const handleContentCompleted = async () => {
    try {
      await authAxios.post('/content/track', {
        topicId: topic._id,
        contentId: content._id,
        type: content.type,
        completed: true
      });
      
      // Navigate back to topic detail
      navigate(`/topics/${topic._id}`);
    } catch (err) {
      console.error('Error tracking content completion:', err);
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setQuizAnswers(new Array(content.quiz.questions.length).fill(null));
    setCurrentQuizQuestion(0);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  // Reset game
  const resetGame = () => {
    setGameCompleted(false);
    setGameScore(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error || "Could not load the content"}</span>
      </div>
    );
  }

  // Function to render the appropriate game component
  const renderGameComponent = () => {
    if (!content.gameConfig || !content.gameConfig.type) {
      return (
        <div className="text-center text-gray-400 py-8">
          <p>Game configuration not found</p>
        </div>
      );
    }

    const gameType = content.gameConfig.type;
    const gameConfig = content.gameConfig.config;

    switch (gameType) {
      case 'quiz':
        return (
          <QuizGame 
            quizData={gameConfig.questions || []} 
            onComplete={handleGameComplete} 
          />
        );
      case 'matching':
        return (
          <MatchingGame 
            gameData={gameConfig.pairs || []} 
            onComplete={handleGameComplete} 
          />
        );
      case 'scenario':
        return (
          <ScenarioGame 
            scenarioData={gameConfig.scenarios || []} 
            onComplete={handleGameComplete} 
          />
        );
      case 'timeline':
        return (
          <TimelineGame 
            gameData={gameConfig.events || []} 
            onComplete={handleGameComplete} 
          />
        );
      case 'spiral':
        return (
          <SpiralGame 
            gameData={gameConfig} 
            onComplete={handleGameComplete} 
          />
        );
      default:
        return (
          <div className="text-center text-gray-400 py-8">
            <p>Unsupported game type: {gameType}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      {topic && (
        <div className="flex items-center text-sm text-gray-400">
          <Link to="/topics" className="hover:text-primary-500">
            Topics
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/topics/${topic._id}`} className="hover:text-primary-500">
            {topic.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{content.title}</span>
        </div>
      )}
      
      {/* Content title */}
      <div className="card">
        <h1 className="text-2xl font-bold text-white mb-2">{content.title}</h1>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {content.estimatedTime} min
          </span>
          
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
          </span>
          
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.585l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {content.points} points
          </span>
        </div>
      </div>
      
      {/* Content body */}
      <div className="card">
        {content.type === 'quiz' ? (
          <div className="space-y-6">
            {quizCompleted ? (
              // Quiz results
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center py-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Quiz Results</h2>
                  
                  <div className="inline-block h-40 w-40 rounded-full border-8 border-primary-500 p-3 mb-4">
                    <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-400">{quizScore}%</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    {quizScore >= 70 
                      ? 'Great job! You\'ve passed the quiz.' 
                      : 'You need to score at least 70% to pass. Try again!'}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetQuiz}
                      className="btn btn-outline"
                    >
                      Retake Quiz
                    </button>
                    
                    <Link to={`/topics/${topic._id}`} className="btn btn-primary">
                      Back to Topic
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Quiz questions
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Question {currentQuizQuestion + 1} of {content.quiz.questions.length}</h2>
                  
                  <div className="bg-dark-200 h-2 rounded-full w-48">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${((currentQuizQuestion + 1) / content.quiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-6">
                  <motion.div
                    key={`question-${currentQuizQuestion}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-medium text-white mb-4">
                      {content.quiz.questions[currentQuizQuestion].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {content.quiz.questions[currentQuizQuestion].options.map((option, optionIndex) => (
                        <div 
                          key={optionIndex}
                          className={`p-4 rounded-lg border-2 cursor-pointer ${
                            quizAnswers[currentQuizQuestion] === optionIndex
                              ? 'border-primary-500 bg-primary-900/20'
                              : 'border-gray-700 hover:border-gray-500'
                          }`}
                          onClick={() => handleAnswerSelect(currentQuizQuestion, optionIndex)}
                        >
                          <div className="flex items-center">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                              quizAnswers[currentQuizQuestion] === optionIndex
                                ? 'border-primary-500'
                                : 'border-gray-600'
                            }`}>
                              {quizAnswers[currentQuizQuestion] === optionIndex && (
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
                    disabled={currentQuizQuestion === 0}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="btn btn-primary"
                    disabled={quizAnswers[currentQuizQuestion] === null}
                  >
                    {currentQuizQuestion < content.quiz.questions.length - 1 ? 'Next' : 'Finish Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : content.type === 'game' ? (
          // Game content
          <div className="space-y-6">
            {gameCompleted ? (
              // Game completion screen
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center py-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Game Complete!</h2>
                  
                  <div className="inline-block h-40 w-40 rounded-full border-8 border-primary-500 p-3 mb-4">
                    <div className="h-full w-full rounded-full bg-primary-900/30 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-400">{gameScore}%</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    {gameScore >= 70 
                      ? 'Great job! You\'ve mastered this game.' 
                      : 'Keep practicing to improve your score!'}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetGame}
                      className="btn btn-outline"
                    >
                      Play Again
                    </button>
                    
                    <Link to={`/topics/${topic._id}`} className="btn btn-primary">
                      Back to Topic
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Render the game component
              renderGameComponent()
            )}
          </div>
        ) : (
          // Other content types (lesson, article, video)
          <div className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
            
            <div className="flex justify-between pt-4 border-t border-dark-200">
              <Link to={`/topics/${topic._id}`} className="btn btn-outline">
                Back to Topic
              </Link>
              
              <button
                onClick={handleContentCompleted}
                className="btn btn-primary"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetail; 