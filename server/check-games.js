// Script to check if games are present in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  checkGames();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function checkGames() {
  try {
    console.log('Checking for games in the database...');
    
    // Find all content with type "quiz" or "game"
    const allGames = await Content.find({
      $or: [
        { type: 'quiz' },
        { type: 'game' }
      ],
      isActive: true
    });
    
    console.log(`Found ${allGames.length} games in database`);
    
    if (allGames.length === 0) {
      console.log('No games found. You should run the add-game-content.js script to add games to the database.');
      process.exit(0);
    }
    
    // Log detailed information about each game
    allGames.forEach((game, index) => {
      console.log(`\n--- Game ${index + 1} ---`);
      console.log(`ID: ${game._id}`);
      console.log(`Title: ${game.title}`);
      console.log(`Type: ${game.type}`);
      
      if (game.type === 'quiz') {
        const questionsCount = game.quiz && Array.isArray(game.quiz.questions) ? game.quiz.questions.length : 0;
        console.log(`Number of questions: ${questionsCount}`);
        if (questionsCount === 0) {
          console.log('WARNING: This quiz has no questions!');
        }
      } else if (game.type === 'game') {
        console.log(`Game Type: ${game.gameConfig ? game.gameConfig.type : 'undefined'}`);
        
        if (!game.gameConfig) {
          console.log('WARNING: This game has no gameConfig!');
        } else if (!game.gameConfig.config) {
          console.log('WARNING: This game has no gameConfig.config!');
        } else {
          const configType = game.gameConfig.type;
          
          if (configType === 'matching') {
            const pairsCount = game.gameConfig.config.pairs ? game.gameConfig.config.pairs.length : 0;
            console.log(`Number of matching pairs: ${pairsCount}`);
            if (pairsCount === 0) {
              console.log('WARNING: This matching game has no pairs!');
            }
          } else if (configType === 'scenario') {
            const scenariosCount = game.gameConfig.config.scenarios ? game.gameConfig.config.scenarios.length : 0;
            console.log(`Number of scenarios: ${scenariosCount}`);
            if (scenariosCount === 0) {
              console.log('WARNING: This scenario game has no scenarios!');
            }
          } else if (configType === 'timeline') {
            const eventsCount = game.gameConfig.config.events ? game.gameConfig.config.events.length : 0;
            console.log(`Number of timeline events: ${eventsCount}`);
            if (eventsCount === 0) {
              console.log('WARNING: This timeline game has no events!');
            }
          } else if (configType === 'spiral') {
            const hasLevels = game.gameConfig.config.levels && Array.isArray(game.gameConfig.config.levels);
            console.log(`Has spiral levels: ${hasLevels}`);
            if (!hasLevels) {
              console.log('WARNING: This spiral game has no levels!');
            }
          }
        }
      }
    });
    
    console.log('\nDatabase check complete!');
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error checking games:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}