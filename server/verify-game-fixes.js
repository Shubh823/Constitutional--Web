// This script verifies that all games (quizzes and scenarios) are properly configured
// Run with: node verify-game-fixes.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  verifyGameFixes();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function verifyGameFixes() {
  try {
    console.log('🔍 Verifying game fixes...');
    
    // 1. Check quiz games
    console.log('\n--- Quiz Games ---');
    const quizzes = await Content.find({
      type: 'quiz'
    });
    
    console.log(`Found ${quizzes.length} quiz games`);
    
    const quizIssues = [];
    
    for (const quiz of quizzes) {
      let hasIssues = false;
      
      // Check if quiz has questions in the right structure
      if (!quiz.quiz || !quiz.quiz.questions || quiz.quiz.questions.length === 0) {
        console.log(`❌ Quiz '${quiz.title}' has no questions in the quiz.questions field`);
        hasIssues = true;
      }
      
      // Check if questions have all required fields
      if (quiz.quiz && quiz.quiz.questions) {
        const questionIssues = [];
        
        quiz.quiz.questions.forEach((question, i) => {
          if (!question.question) {
            questionIssues.push(`Question ${i+1} is missing the question text`);
          }
          
          if (!question.options || question.options.length === 0) {
            questionIssues.push(`Question ${i+1} has no options`);
          } else {
            // Check if at least one option is marked correct
            const hasCorrectOption = question.options.some(option => option.isCorrect);
            if (!hasCorrectOption) {
              questionIssues.push(`Question ${i+1} has no correct option marked`);
            }
          }
        });
        
        if (questionIssues.length > 0) {
          console.log(`❌ Quiz '${quiz.title}' has question issues:`);
          questionIssues.forEach(issue => console.log(`  - ${issue}`));
          hasIssues = true;
        }
      }
      
      if (!hasIssues) {
        console.log(`✅ Quiz '${quiz.title}' is properly configured with ${quiz.quiz?.questions?.length || 0} questions`);
      } else {
        quizIssues.push(quiz.title);
      }
    }
    
    // 2. Check scenario games
    console.log('\n--- Scenario Games ---');
    const scenarioGames = await Content.find({
      type: 'game',
      'gameConfig.type': 'scenario'
    });
    
    console.log(`Found ${scenarioGames.length} scenario games`);
    
    const scenarioIssues = [];
    
    for (const game of scenarioGames) {
      let hasIssues = false;
      
      // Check if game has scenarios
      if (!game.gameConfig || !game.gameConfig.config || !game.gameConfig.config.scenarios || game.gameConfig.config.scenarios.length === 0) {
        console.log(`❌ Scenario game '${game.title}' has no scenarios`);
        hasIssues = true;
      } else {
        const scenarioCount = game.gameConfig.config.scenarios.length;
        
        // Check if scenarios have all required fields
        const scenarioFieldIssues = [];
        
        game.gameConfig.config.scenarios.forEach((scenario, i) => {
          if (!scenario.title && !scenario.situation) {
            scenarioFieldIssues.push(`Scenario ${i+1} is missing both title and situation fields`);
          }
          
          if (!scenario.options || scenario.options.length === 0) {
            scenarioFieldIssues.push(`Scenario ${i+1} has no options`);
          } else {
            // Check if at least one option is marked correct
            const hasCorrectOption = scenario.options.some(option => option.isCorrect || option.correct);
            if (!hasCorrectOption) {
              scenarioFieldIssues.push(`Scenario ${i+1} has no correct option marked`);
            }
          }
        });
        
        if (scenarioFieldIssues.length > 0) {
          console.log(`❌ Scenario game '${game.title}' has issues:`);
          scenarioFieldIssues.forEach(issue => console.log(`  - ${issue}`));
          hasIssues = true;
        } else {
          console.log(`✅ Scenario game '${game.title}' is properly configured with ${scenarioCount} scenarios`);
        }
      }
      
      if (hasIssues) {
        scenarioIssues.push(game.title);
      }
    }
    
    // Summary
    console.log('\n--- Summary ---');
    if (quizIssues.length === 0 && scenarioIssues.length === 0) {
      console.log('🎉 All games are properly configured!');
    } else {
      console.log('⚠️ Some games have issues:');
      
      if (quizIssues.length > 0) {
        console.log(`  - Quiz games with issues: ${quizIssues.length}`);
        quizIssues.forEach(title => console.log(`    - ${title}`));
      }
      
      if (scenarioIssues.length > 0) {
        console.log(`  - Scenario games with issues: ${scenarioIssues.length}`);
        scenarioIssues.forEach(title => console.log(`    - ${title}`));
      }
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error verifying game fixes:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 