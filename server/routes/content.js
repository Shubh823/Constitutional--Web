const express = require('express');
const { authenticateToken } = require('./auth');
const Topic = require('../models/Topic');
const Content = require('../models/Content');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');
const router = express.Router();

// ==================== COUNTRIES ROUTES ====================
// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Topic.distinct('country');
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
});

// ==================== TOPIC DETAIL ROUTES ====================
// This route must be defined BEFORE any routes with similar patterns like /topics/:param
router.get('/topics/detail/:topicId', async (req, res) => {
  try {
    const { topicId } = req.params;
    console.log(`Fetching topic with ID: ${topicId}`);
    
    let topic;
    
    // Check if topicId is a valid MongoDB ObjectId
    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      topic = await Topic.findById(topicId);
    } else {
      // If not a valid ObjectId, try to find by custom ID format
      topic = await Topic.findOne({ customId: topicId });
      
      // Debug info
      if (!topic) {
        // Additional debug - check if any topics exist with similar IDs
        const allTopics = await Topic.find({ customId: { $exists: true } });
        console.log('Available customIds:', allTopics.map(t => t.customId));
      }
    }
    
    if (!topic) {
      console.log(`Topic not found: ${topicId}`);
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    console.log(`Found topic: ${topic.title}`);
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
});

// ==================== CONTENT ROUTES ====================
// Get a specific content item
router.get('/content/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content item:', error);
    res.status(500).json({ message: 'Error fetching content item', error: error.message });
  }
});

// New endpoint - Get all game types at once
router.get('/games/all', async (req, res) => {
  try {
    console.log('🔍 Fetching all games...');
    
    // Valid game types
    const gameTypes = ['quiz', 'scenario', 'matching', 'spiral', 'timeline'];
    const result = {};
    
    // Process each game type
    for (const gameType of gameTypes) {
      console.log(`Looking for ${gameType} games...`);
      let games;
      
      // Handle different game types
      if (gameType === 'quiz') {
        // Find content with type "quiz"
        games = await Content.find({ 
          type: 'quiz',
          isActive: true
        });
      } else {
        // Find game content with specific gameConfig.type
        games = await Content.find({ 
          type: 'game',
          'gameConfig.type': gameType,
          isActive: true
        });
      }
      
      console.log(`Found ${games.length} ${gameType} games`);
      
      if (games && games.length > 0) {
        // Format the game data based on type
        if (gameType === 'quiz') {
          const questions = games[0].quiz && games[0].quiz.questions ? games[0].quiz.questions : [];
          result[gameType] = {
            id: games[0]._id,
            title: games[0].title,
            data: questions
          };
          console.log(`Quiz data length: ${result[gameType].data.length}`);
        } else if (gameType === 'scenario') {
          const scenarios = games[0].gameConfig && 
                           games[0].gameConfig.config && 
                           games[0].gameConfig.config.scenarios ? 
                           games[0].gameConfig.config.scenarios : [];
          result[gameType] = {
            id: games[0]._id,
            title: games[0].title,
            data: scenarios
          };
          console.log(`Scenario data length: ${result[gameType].data.length}`);
        } else if (gameType === 'matching') {
          const pairs = games[0].gameConfig && 
                       games[0].gameConfig.config && 
                       games[0].gameConfig.config.pairs ? 
                       games[0].gameConfig.config.pairs : [];
          result[gameType] = {
            id: games[0]._id,
            title: games[0].title,
            data: pairs
          };
          console.log(`Matching data length: ${result[gameType].data.length}`);
        } else if (gameType === 'spiral') {
          const config = games[0].gameConfig && games[0].gameConfig.config ? 
                        games[0].gameConfig.config : {};
          result[gameType] = {
            id: games[0]._id,
            title: games[0].title,
            data: config
          };
          console.log(`Spiral data: ${JSON.stringify(result[gameType].data, null, 2).substring(0, 100)}...`);
        } else if (gameType === 'timeline') {
          const events = games[0].gameConfig && 
                        games[0].gameConfig.config && 
                        games[0].gameConfig.config.events ? 
                        games[0].gameConfig.config.events : [];
          result[gameType] = {
            id: games[0]._id,
            title: games[0].title,
            data: events
          };
          console.log(`Timeline data length: ${result[gameType].data.length}`);
        }
      } else {
        // No games found for this type
        result[gameType] = { id: null, title: null, data: [] };
        console.log(`No ${gameType} games found`);
      }
    }
    
    console.log('✅ Successfully retrieved all games');
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching all games:', error);
    res.status(500).json({ 
      message: 'Error fetching all games', 
      error: error.message 
    });
  }
});

// New endpoint - Get all games (for debugging)
router.get('/games/list', async (req, res) => {
  try {
    console.log('Listing all games in database...');
    
    // Find all content with type "quiz" or "game"
    const allGames = await Content.find({
      $or: [
        { type: 'quiz' },
        { type: 'game' }
      ],
      isActive: true
    });
    
    console.log(`Found ${allGames.length} games in database`);
    
    // Return minimal game info to avoid overwhelming the response
    const gameList = allGames.map(game => ({
      id: game._id,
      title: game.title,
      type: game.type,
      gameType: game.type === 'game' && game.gameConfig ? game.gameConfig.type : 'quiz',
      hasConfig: game.type === 'game' && !!game.gameConfig,
      hasQuestions: game.type === 'quiz' && !!game.quiz && Array.isArray(game.quiz.questions),
      questionsCount: game.type === 'quiz' && game.quiz && Array.isArray(game.quiz.questions) ? game.quiz.questions.length : 0
    }));
    
    res.json(gameList);
  } catch (error) {
    console.error('Error listing games:', error);
    res.status(500).json({ 
      message: 'Error listing games', 
      error: error.message 
    });
  }
});

// New endpoint - Get games by type
router.get('/games/:gameType', async (req, res) => {
  try {
    const { gameType } = req.params;
    
    // Validate game type
    const validGameTypes = ['quiz', 'scenario', 'matching', 'spiral', 'timeline'];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ 
        message: 'Invalid game type',
        validTypes: validGameTypes
      });
    }
    
    let games;
    
    // Handle different game types
    if (gameType === 'quiz') {
      // Find content with type "quiz"
      games = await Content.find({ 
        type: 'quiz',
        isActive: true
      });
    } else {
      // Find game content with specific gameConfig.type
      games = await Content.find({ 
        type: 'game',
        'gameConfig.type': gameType,
        isActive: true
      });
    }
    
    if (!games || games.length === 0) {
      return res.status(404).json({ message: `No ${gameType} games found` });
    }
    
    // Return formatted game data based on type
    const formattedGames = games.map(game => {
      if (gameType === 'quiz') {
        return {
          id: game._id,
          title: game.title,
          description: game.content,
          questions: game.quiz.questions
        };
      } else if (gameType === 'scenario') {
        return {
          id: game._id,
          title: game.title,
          description: game.content,
          scenarios: game.gameConfig.config.scenarios
        };
      } else {
        return {
          id: game._id,
          title: game.title,
          description: game.content,
          config: game.gameConfig.config
        };
      }
    });
    
    res.json(formattedGames);
  } catch (error) {
    console.error(`Error fetching ${req.params.gameType} games:`, error);
    res.status(500).json({ 
      message: `Error fetching ${req.params.gameType} games`, 
      error: error.message 
    });
  }
});

// New endpoint - Get specific game by ID
router.get('/game/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Find the game by ID
    const game = await Content.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    // Return formatted game data based on type
    let gameData;
    
    if (game.type === 'quiz') {
      gameData = {
        id: game._id,
        title: game.title,
        type: 'quiz',
        description: game.content,
        questions: game.quiz.questions
      };
    } else if (game.type === 'game' && game.gameConfig && game.gameConfig.type === 'scenario') {
      gameData = {
        id: game._id,
        title: game.title,
        type: 'scenario',
        description: game.content,
        scenarios: game.gameConfig.config.scenarios
      };
    } else if (game.type === 'game') {
      gameData = {
        id: game._id,
        title: game.title,
        type: game.gameConfig.type,
        description: game.content,
        config: game.gameConfig.config
      };
    } else {
      gameData = {
        id: game._id,
        title: game.title,
        type: game.type,
        description: game.content
      };
    }
    
    res.json(gameData);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
});

// ==================== TOPIC CONTENT ROUTES ====================
// Get all content for a topic
router.get('/topics/:topicId/content', async (req, res) => {
  try {
    const { topicId } = req.params;
    let content = [];
    
    // Check if topicId is a valid MongoDB ObjectId
    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      content = await Content.find({ 
        topic: topicId,
        isActive: true 
      }).sort({ order: 1 });
    } else {
      // For custom IDs, try to find the topic first
      const topic = await Topic.findOne({ customId: topicId });
      
      if (topic) {
        content = await Content.find({ 
          topic: topic._id,
          isActive: true 
        }).sort({ order: 1 });
      } else {
        // If no topic found, return empty array
        return res.json([]);
      }
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
});

// ==================== TOPIC SUBTOPICS ROUTES ====================
// Get subtopics for a parent topic
router.get('/topics/:topicId/subtopics', async (req, res) => {
  try {
    const { topicId } = req.params;
    let subtopics = [];
    
    // Check if topicId is a valid MongoDB ObjectId
    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      subtopics = await Topic.find({ 
        parentTopic: topicId,
        isActive: true 
      }).sort({ order: 1 });
    } else {
      // For custom IDs, try to find the topic first
      const topic = await Topic.findOne({ customId: topicId });
      
      if (topic) {
        subtopics = await Topic.find({ 
          parentTopic: topic._id,
          isActive: true 
        }).sort({ order: 1 });
      }
    }
    
    res.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).json({ message: 'Error fetching subtopics', error: error.message });
  }
});

// ==================== TOPICS BY COUNTRY ROUTES ====================
// Get all topics for a country
router.get('/topics/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const topics = await Topic.find({ 
      country, 
      isActive: true,
      parentTopic: null // Get only top-level topics
    }).sort({ order: 1 });
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
});

// ==================== SEARCH ROUTES ====================
// Search topics and content
router.get('/search', async (req, res) => {
  try {
    const { query, country } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchRegex = new RegExp(query, 'i');
    const filter = country ? { country } : {};
    
    // Search in topics
    const topics = await Topic.find({
      ...filter,
      isActive: true,
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10);
    
    // Search in content
    const contentItems = await Content.find({
      isActive: true,
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    }).populate('topic').limit(10);
    
    // Filter content by country if specified
    const filteredContent = country 
      ? contentItems.filter(item => item.topic.country === country)
      : contentItems;
    
    res.json({
      topics,
      content: filteredContent.map(item => ({
        _id: item._id,
        title: item.title,
        type: item.type,
        topic: {
          _id: item.topic._id,
          title: item.topic.title,
          country: item.topic.country
        }
      }))
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching', error: error.message });
  }
});

// ==================== PROGRESS TRACKING ROUTES ====================
// Track content completion (requires auth)
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { topicId, contentId, type, score, completed } = req.body;
    
    // Get topic to get country
    const topic = await Topic.findById(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.id,
      topic: topicId,
      country: topic.country
    });
    
    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        topic: topicId,
        country: topic.country,
        completionPercentage: 0,
        quizScores: [],
        activities: []
      });
    }
    
    // Get the content to determine if it's a game
    const content = await Content.findById(contentId);
    let isGame = false;
    
    if (content) {
      isGame = type === 'quiz' || 
              (content.type === 'game' || 
               (content.gameConfig && 
                ['quiz', 'scenario', 'matching', 'spiral', 'timeline'].includes(content.gameConfig.type)));
    }
    
    if (type === 'quiz') {
      // Add quiz score
      const existingQuizIndex = progress.quizScores.findIndex(
        q => q.quizId.toString() === contentId
      );
      
      if (existingQuizIndex >= 0) {
        progress.quizScores[existingQuizIndex].score = score;
        progress.quizScores[existingQuizIndex].date = Date.now();
      } else {
        progress.quizScores.push({
          quizId: contentId,
          score: score,
          date: Date.now()
        });
      }
    } else {
      // Add activity
      const existingActivityIndex = progress.activities.findIndex(
        a => a.activityId.toString() === contentId
      );
      
      if (existingActivityIndex >= 0) {
        progress.activities[existingActivityIndex].completed = completed;
        progress.activities[existingActivityIndex].score = score || 0;
        progress.activities[existingActivityIndex].date = Date.now();
      } else {
        progress.activities.push({
          activityId: contentId,
          completed: completed,
          score: score || 0,
          date: Date.now()
        });
      }
    }
    
    // Calculate completion percentage based on all content for this topic
    const allContent = await Content.find({ topic: topicId, isActive: true });
    const totalContentCount = allContent.length;
    
    if (totalContentCount > 0) {
      // Calculate how many content items are completed
      const allContentIds = allContent.map(c => c._id.toString());
      const completedQuizzes = progress.quizScores
        .filter(q => allContentIds.includes(q.quizId.toString()))
        .length;
      
      const completedActivities = progress.activities
        .filter(a => a.completed && allContentIds.includes(a.activityId.toString()))
        .length;
      
      const completedContent = completedQuizzes + completedActivities;
      progress.completionPercentage = Math.round((completedContent / totalContentCount) * 100);
    }
    
    progress.lastUpdated = Date.now();
    await progress.save();
    
    // Check for achievements if it's a game and it's completed or has a high score
    let achievementsChecked = false;
    let newBadges = 0;
    
    if (isGame && (completed || (type === 'quiz' && score >= 80))) {
      // Import the checkAndAwardAchievements function
      const { checkAndAwardAchievements } = require('./users');
      
      // Check for new achievements
      newBadges = await checkAndAwardAchievements(req.user.id);
      achievementsChecked = true;
    }
    
    res.json({
      progress,
      achievementsChecked,
      newBadges
    });
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ message: 'Error tracking progress', error: error.message });
  }
});

module.exports = router; 