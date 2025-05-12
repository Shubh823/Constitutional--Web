// This script fixes the game configuration structure to ensure proper display on the frontend
// Run with: node fix-game-config.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  fixGameConfig();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function fixGameConfig() {
  try {
    console.log('🔧 Fixing game configurations...');
    
    // 1. Find all game content of type 'game' with gameConfig.type 'quiz'
    const quizGames = await Content.find({
      type: 'game',
      'gameConfig.type': 'quiz'
    });
    
    console.log(`Found ${quizGames.length} quiz games to fix`);
    
    // 2. Fix each game
    let updatedCount = 0;
    
    for (const game of quizGames) {
      // Make sure the content.type is 'quiz' (not 'game')
      game.type = 'quiz';
      
      // Move questions from gameConfig to quiz structure
      if (game.gameConfig?.config?.questions) {
        // Create quiz structure if it doesn't exist
        if (!game.quiz) {
          game.quiz = { questions: [] };
        }
        
        // Copy questions
        game.quiz.questions = game.gameConfig.config.questions;
        
        // Save the updated game
        await game.save();
        console.log(`✅ Fixed game: ${game.title}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Game ${game.title} has no questions to fix`);
      }
    }
    
    // 3. Find all scenario games
    const scenarioGames = await Content.find({
      type: 'game',
      'gameConfig.type': 'scenario'
    });
    
    console.log(`Found ${scenarioGames.length} scenario games to check`);
    
    // 4. Fix scenario games if needed
    for (const game of scenarioGames) {
      if (game.gameConfig?.config?.scenarios) {
        // Check if scenarios have proper structure
        const scenarios = game.gameConfig.config.scenarios;
        let updated = false;
        
        for (const scenario of scenarios) {
          if (scenario.options) {
            // Ensure options have proper isCorrect/correct property
            for (const option of scenario.options) {
              if (option.correct !== undefined && option.isCorrect === undefined) {
                option.isCorrect = option.correct;
                updated = true;
              }
            }
          }
        }
        
        if (updated) {
          await game.save();
          console.log(`✅ Fixed scenario game: ${game.title}`);
          updatedCount++;
        }
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} games`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error fixing game configurations:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 