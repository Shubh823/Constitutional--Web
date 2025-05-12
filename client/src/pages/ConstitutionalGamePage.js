import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MatchingGame from '../components/ConstitutionalGames/MatchingGame';
import QuizGame from '../components/ConstitutionalGames/QuizGame';
import ScenarioGame from '../components/ConstitutionalGames/ScenarioGame';
import ConstitutionSpiralGame from '../components/ConstitutionalGames/SpiralGame';
import TimelineGame from '../components/ConstitutionalGames/TimelineGame';

const ConstitutionalGamePage = () => {
  const [selectedGame, setSelectedGame] = useState('spiral');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  
  // Sample data for matching game (Indian Constitution)
  const matchingGameData = [
    { 
      term: 'Article 14', 
      definition: 'Right to Equality - Equality before law and equal protection of laws'
    },
    { 
      term: 'Article 19', 
      definition: 'Right to Freedom - Speech, expression, assembly, association, movement, residence, and profession'
    },
    { 
      term: 'Article 21', 
      definition: 'Right to Life and Personal Liberty - No person shall be deprived of his life or personal liberty except according to procedure established by law'
    },
    { 
      term: 'Article 32', 
      definition: 'Right to Constitutional Remedies - Empowers citizens to approach the Supreme Court directly for enforcement of fundamental rights'
    },
    { 
      term: 'Article 51A', 
      definition: 'Fundamental Duties - List of duties that citizens are expected to abide by'
    },
    { 
      term: 'Article 368', 
      definition: 'Power of Parliament to amend the Constitution and procedure thereof'
    }
  ];
  
  // Sample data for quiz game (Indian Constitution)
  const quizGameData = [
    {
      question: 'Which article of the Indian Constitution abolishes untouchability?',
      options: [
        { text: 'Article 14', isCorrect: false },
        { text: 'Article 15', isCorrect: false },
        { text: 'Article 17', isCorrect: true },
        { text: 'Article 21', isCorrect: false }
      ]
    },
    {
      question: 'The concept of "Rule of Law" in the Indian Constitution was adopted from:',
      options: [
        { text: 'United States', isCorrect: false },
        { text: 'Britain', isCorrect: true },
        { text: 'Canada', isCorrect: false },
        { text: 'France', isCorrect: false }
      ]
    },
    {
      question: 'Which of the following is NOT a Fundamental Right guaranteed by the Indian Constitution?',
      options: [
        { text: 'Right to Freedom of Religion', isCorrect: false },
        { text: 'Right to Property', isCorrect: true },
        { text: 'Right against Exploitation', isCorrect: false },
        { text: 'Right to Constitutional Remedies', isCorrect: false }
      ]
    },
    {
      question: 'Who is known as the "Father of the Indian Constitution"?',
      options: [
        { text: 'Mahatma Gandhi', isCorrect: false },
        { text: 'Jawaharlal Nehru', isCorrect: false },
        { text: 'Dr. B.R. Ambedkar', isCorrect: true },
        { text: 'Sardar Vallabhbhai Patel', isCorrect: false }
      ]
    },
    {
      question: 'Which part of the Indian Constitution deals with Fundamental Rights?',
      options: [
        { text: 'Part II', isCorrect: false },
        { text: 'Part III', isCorrect: true },
        { text: 'Part IV', isCorrect: false },
        { text: 'Part V', isCorrect: false }
      ]
    }
  ];
  
  // Sample data for scenario game (Indian Constitution)
  const scenarioGameData = [
    {
      title: 'Freedom of Speech and Expression',
      description: 'A student organization at a government-funded university wants to organize a peaceful protest criticizing certain government policies. The university administration denies permission, citing concerns about disturbing academic activities.',
      hint: 'Consider Article 19 and reasonable restrictions.',
      options: [
        {
          text: 'The university has a right to restrict any activities on its campus.',
          isCorrect: false,
          feedback: 'While educational institutions can regulate activities, a blanket ban on peaceful protests violates the fundamental right to freedom of speech and expression under Article 19(1)(a).'
        },
        {
          text: 'The students have an absolute right to protest anywhere and anytime they want.',
          isCorrect: false,
          feedback: 'The right to protest is subject to reasonable restrictions under Article 19(2), including public order and interests of the sovereignty and integrity of India.'
        },
        {
          text: 'The students have a right to peaceful protest, but it can be reasonably regulated in terms of time, place, and manner.',
          isCorrect: true,
          feedback: 'Correct! Article 19(1)(a) guarantees freedom of speech and expression, including the right to peaceful protest. However, reasonable restrictions can be imposed regarding the time, place, and manner to ensure it doesn\'t disrupt essential activities.'
        }
      ]
    },
    {
      title: 'Equality Before Law',
      description: 'A state government introduces a reservation policy providing 30% seats in government jobs for women. A male candidate challenges this policy as a violation of his right to equality.',
      hint: 'Think about Article 14 and Article 15(3) of the Constitution.',
      options: [
        {
          text: 'The policy is unconstitutional as it discriminates on the basis of gender.',
          isCorrect: false,
          feedback: 'While Article 14 guarantees equality before law, Article 15(3) specifically empowers the State to make special provisions for women and children, allowing for positive discrimination.'
        },
        {
          text: 'The policy is constitutional as Article 15(3) allows the State to make special provisions for women.',
          isCorrect: true,
          feedback: 'Correct! Article 15(3) explicitly empowers the State to make special provisions for women and children. This is an exception to the general rule of non-discrimination under Article 15(1).'
        },
        {
          text: 'The policy is constitutional but should be limited to 10% reservation.',
          isCorrect: false,
          feedback: 'There is no such specific limit in the Constitution for reservations under Article 15(3). The Supreme Court has generally discouraged reservations exceeding 50% in total, but this applies to the aggregate of all reservations.'
        }
      ]
    },
    {
      title: 'Right to Education',
      description: 'A private unaided school refuses admission to a child from an economically weaker section, despite the Right to Education Act mandating that such schools reserve 25% seats for disadvantaged groups.',
      hint: 'Consider Article 21A and the RTE Act.',
      options: [
        {
          text: 'The school has complete autonomy as a private institution and cannot be forced to provide reservations.',
          isCorrect: false,
          feedback: 'The Supreme Court has upheld the constitutional validity of the 25% reservation in private unaided schools under the RTE Act, considering education as a fundamental right under Article 21A.'
        },
        {
          text: 'The school must comply with the RTE Act provisions for 25% reservation as education is a fundamental right.',
          isCorrect: true,
          feedback: 'Correct! In Society for Unaided Private Schools of Rajasthan v. Union of India (2012), the Supreme Court upheld the constitutional validity of the 25% reservation in private unaided non-minority schools under the RTE Act.'
        },
        {
          text: 'Only government schools have an obligation to provide free education to disadvantaged groups.',
          isCorrect: false,
          feedback: 'The RTE Act specifically includes private schools in its ambit for the 25% reservation, recognizing education as a social good and ensuring inclusive education across all types of schools.'
        }
      ]
    },
    {
      title: 'Emergency Provisions',
      description: 'Following widespread riots and civil unrest in multiple states, the President is considering declaring a national emergency under Article 352.',
      hint: 'Consider the grounds for declaring an emergency under Article 352.',
      options: [
        {
          text: 'The President can independently declare a national emergency.',
          isCorrect: false,
          feedback: 'Post the 44th Amendment, the President can declare an emergency only upon written recommendation of the Cabinet, not independently.'
        },
        {
          text: 'Internal disturbance is sufficient ground for declaring a national emergency.',
          isCorrect: false,
          feedback: 'After the 44th Amendment, "internal disturbance" was replaced with "armed rebellion" as a ground for emergency under Article 352. Civil unrest alone is not sufficient.'
        },
        {
          text: 'A national emergency can be declared only if there is a threat of war, external aggression, or armed rebellion.',
          isCorrect: true,
          feedback: 'Correct! Article 352 allows the President to declare a national emergency only on grounds of war, external aggression, or armed rebellion. Civil unrest or riots, unless amounting to armed rebellion, do not qualify.'
        }
      ]
    },
    {
      title: 'Freedom of Religion',
      description: 'A religious community wants to establish a new educational institution that would give preference in admission to students of their own religion.',
      hint: 'Consider Articles 25-30, particularly Article 30.',
      options: [
        {
          text: 'This is unconstitutional as it discriminates based on religion.',
          isCorrect: false,
          feedback: 'Article 30 specifically gives religious and linguistic minorities the right to establish and administer educational institutions of their choice.'
        },
        {
          text: 'This is constitutional only if the institution doesn\'t receive any government aid.',
          isCorrect: false,
          feedback: 'While receiving government aid may impose certain regulatory conditions, the fundamental right under Article 30 isn\'t negated by receiving aid.'
        },
        {
          text: 'This is constitutional as minorities have the right to establish and administer educational institutions under Article 30.',
          isCorrect: true,
          feedback: 'Correct! Article 30 guarantees religious and linguistic minorities the right to establish and administer educational institutions of their choice, which includes reasonable preference in admissions to students of their community.'
        }
      ]
    }
  ];
  
  // Sample data for spiral game (new game type)
  const spiralGameData = {
    centerTitle: "Indian Constitution",
    levels: [
      {
        title: "Level 0: Introduction",
        items: ["Preamble", "History", "Features"],
        color: "#3498db"
      },
      {
        title: "Level 1: Basic Structure",
        items: ["Parts I-VIII", "Parts IX-XV", "Parts XVI-XXII"],
        color: "#2ecc71"
      },
      {
        title: "Level 2: Schedules",
        items: ["Schedules 1-4", "Schedules 5-8", "Schedules 9-12"],
        color: "#9b59b6"
      },
      {
        title: "Level 3: Amendments",
        items: ["1st-42nd", "43rd-86th", "87th-105th"],
        color: "#f39c12"
      },
      {
        title: "Level 4: Advanced",
        items: ["Basic Structure", "Judicial Review", "Landmark Cases"],
        color: "#e74c3c"
      }
    ]
  };
  
  // Sample data for timeline game (new game type)
  const timelineGameData = [
    {
      year: 1946,
      event: "Formation of Constituent Assembly",
      details: "The Constituent Assembly was formed to draft a constitution for India"
    },
    {
      year: 1947,
      event: "Independence of India",
      details: "India gained independence from British rule on August 15"
    },
    {
      year: 1949,
      event: "Constitution Adoption",
      details: "The Constitution of India was adopted by the Constituent Assembly on November 26"
    },
    {
      year: 1950,
      event: "Constitution Implementation",
      details: "The Constitution of India came into effect on January 26"
    },
    {
      year: 1951,
      event: "First Amendment",
      details: "Added the Ninth Schedule to protect land reform laws from judicial review"
    },
    {
      year: 1971,
      event: "24th Amendment",
      details: "Parliament given power to amend any part of the Constitution"
    },
    {
      year: 1976,
      event: "42nd Amendment",
      details: "Known as 'Mini-Constitution' making major changes during Emergency"
    },
    {
      year: 1978,
      event: "44th Amendment",
      details: "Removed the Right to Property as a Fundamental Right"
    },
    {
      year: 1992,
      event: "73rd & 74th Amendments",
      details: "Constitutional status to Panchayati Raj and Urban Local Bodies"
    },
    {
      year: 2002,
      event: "86th Amendment",
      details: "Made Education a Fundamental Right for children aged 6-14"
    },
    {
      year: 2016,
      event: "101st Amendment",
      details: "Introduction of Goods and Services Tax (GST)"
    }
  ];
  
  // Handle game completion
  const handleGameComplete = (score) => {
    setGameCompleted(true);
    setGameScore(score);
  };
  
  // Reset game state
  const handlePlayAgain = () => {
    setGameCompleted(false);
    setGameScore(0);
  };
  
  // Game definitions with descriptions and UI for selection
  const gameTypes = [
    {
      id: 'spiral',
      title: 'Constitution Spiral',
      description: 'Explore the Indian Constitution through an interactive spiral visualization',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      id: 'scenario',
      title: 'Scenario Challenge',
      description: 'Apply constitutional principles to real-world scenarios',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'quiz',
      title: 'Constitutional Quiz',
      description: 'Test your knowledge about the Indian Constitution',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'matching',
      title: 'Article Matching',
      description: 'Match constitutional articles with their descriptions',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    {
      id: 'timeline',
      title: 'Constitutional Timeline',
      description: 'Arrange key events in Indian constitutional history in chronological order',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Constitutional Learning Games</h1>
          <p className="text-gray-400 mt-1">Interactive games to test and improve your constitutional knowledge</p>
        </div>
      </div>
      
      {/* Game selection section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {gameTypes.map(game => (
          <button
            key={game.id}
            onClick={() => setSelectedGame(game.id)}
            className={`p-4 rounded-lg flex flex-col items-center transition ${
              selectedGame === game.id
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
            }`}
          >
            <div className={`p-3 rounded-full mb-2 ${
              selectedGame === game.id ? 'bg-primary-700' : 'bg-dark-300'
            }`}>
              {game.icon}
            </div>
            <h3 className="font-medium text-center">{game.title}</h3>
            <p className="text-xs mt-2 text-center opacity-80">{game.description}</p>
          </button>
        ))}
      </div>
      
      {/* Game display area */}
      <motion.div
        className="card p-5"
        key={selectedGame}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedGame === 'matching' && (
          <MatchingGame 
            gameData={matchingGameData} 
            onComplete={handleGameComplete}
            isCompleted={gameCompleted}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
        
        {selectedGame === 'quiz' && (
          <QuizGame 
            gameData={quizGameData} 
            onComplete={handleGameComplete}
            isCompleted={gameCompleted}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
        
        {selectedGame === 'scenario' && (
          <ScenarioGame 
            gameData={scenarioGameData} 
            onComplete={handleGameComplete}
            isCompleted={gameCompleted}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
        
        {selectedGame === 'spiral' && (
          <ConstitutionSpiralGame 
            gameData={spiralGameData}
            onComplete={handleGameComplete}
            isCompleted={gameCompleted}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
        
        {selectedGame === 'timeline' && (
          <TimelineGame 
            gameData={timelineGameData}
            onComplete={handleGameComplete}
            isCompleted={gameCompleted}
            score={gameScore}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </motion.div>
      
      {/* Game completion card */}
      {gameCompleted && (
        <motion.div 
          className="card p-5 bg-gradient-to-r from-primary-600 to-primary-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-yellow-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">Game Completed!</h3>
            <p className="text-white/80 mb-6">Your score: {gameScore.toFixed(2)}%</p>
            <button 
              onClick={handlePlayAgain}
              className="px-5 py-2.5 bg-white text-primary-600 font-medium rounded-lg hover:bg-white/90 transition"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Game badges and achievements */}
      <div className="card p-5">
        <h2 className="text-xl font-bold text-white mb-4">Your Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">Quiz Master</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">Constitution Defender</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-sm text-blue-400">Preamble Scholar</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">Rights Expert</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-dark-200 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="text-sm text-gray-400">Amendment Tracker</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionalGamePage; 