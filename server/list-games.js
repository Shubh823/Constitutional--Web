// This script lists all game content in the database
// Run with: node list-games.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const Topic = require('./models/Topic'); // Ensure Topic model is loaded

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  listGames();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function listGames() {
  try {
    // Find all game content
    const games = await Content.find({ type: 'game' })
      .select('title gameConfig.type points createdAt topic')
      .lean(); // Use lean for better performance
    
    console.log(`\n🎮 Found ${games.length} games in the database:\n`);
    
    // Get topic information separately to avoid populate issues
    const topics = await Topic.find({
      _id: { $in: games.map(game => game.topic) }
    }).lean();
    
    const topicMap = topics.reduce((map, topic) => {
      map[topic._id.toString()] = topic.title;
      return map;
    }, {});
    
    games.forEach((game, index) => {
      const topicId = game.topic ? game.topic.toString() : null;
      const topicTitle = topicId ? topicMap[topicId] || 'Unknown' : 'Unknown';
      
      console.log(`${index + 1}. ${game.title}`);
      console.log(`   Topic: ${topicTitle}`);
      console.log(`   Game Type: ${game.gameConfig?.type || 'Unknown'}`);
      
      // Get question count information
      let questionCount = 'N/A';
      if (game.gameConfig?.type === 'quiz' && game.gameConfig.config?.questions) {
        questionCount = game.gameConfig.config.questions.length;
      } else if (game.gameConfig?.type === 'scenario' && game.gameConfig.config?.scenarios) {
        questionCount = game.gameConfig.config.scenarios.length;
      }
      
      console.log(`   Questions: ${questionCount}`);
      console.log(`   Created: ${game.createdAt ? new Date(game.createdAt).toISOString().split('T')[0] : 'Unknown'}`);
      console.log(`   Points: ${game.points || 0}`);
      console.log('   ------------------------------');
    });
    
    // Get statistics by game type
    const gameTypes = games.reduce((acc, game) => {
      const type = game.gameConfig?.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Game Statistics by Type:');
    Object.entries(gameTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} games`);
    });
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    
  } catch (error) {
    console.error('Error listing games:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 