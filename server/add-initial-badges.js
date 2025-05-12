// This script adds initial achievement badges to the database
// Run with: node add-initial-badges.js

require('dotenv').config();
const mongoose = require('mongoose');
const Badge = require('./models/Badge');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  addInitialBadges();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function addInitialBadges() {
  try {
    console.log('🏆 Adding initial achievement badges...');
    
    // Define initial badges
    const badges = [
      {
        name: 'Quiz Master',
        description: 'Successfully complete 5 quizzes with a score of 80% or higher.',
        icon: 'quiz-master',
        category: 'mastery',
        requirements: {
          minQuizzes: 5,
          minScore: 80
        },
        points: 100,
        rarity: 'uncommon'
      },
      {
        name: 'Constitution Defender',
        description: 'Complete 3 or more constitutional scenario challenges.',
        icon: 'constitution-defender',
        category: 'achievement',
        requirements: {
          minScenarios: 3
        },
        points: 150,
        rarity: 'uncommon'
      },
      {
        name: 'Preamble Scholar',
        description: 'Score 80% or higher on a Preamble-related quiz.',
        icon: 'preamble-scholar',
        category: 'mastery',
        requirements: {
          specificQuiz: 'preamble',
          minScore: 80
        },
        points: 75,
        rarity: 'common'
      },
      {
        name: 'Rights Expert',
        description: 'Score 80% or higher on a Fundamental Rights quiz.',
        icon: 'rights-expert',
        category: 'mastery',
        requirements: {
          specificQuiz: 'rights',
          minScore: 80
        },
        points: 75,
        rarity: 'common'
      },
      {
        name: 'Amendment Tracker',
        description: 'Score 80% or higher on a Constitutional Amendments quiz.',
        icon: 'amendment-tracker',
        category: 'mastery',
        requirements: {
          specificQuiz: 'amendments',
          minScore: 80
        },
        points: 75,
        rarity: 'common'
      },
      {
        name: 'Perfect Score',
        description: 'Achieve a perfect 100% score on any quiz.',
        icon: 'perfect-score',
        category: 'achievement',
        requirements: {
          perfectScore: true
        },
        points: 200,
        rarity: 'rare'
      },
      {
        name: 'Fast Learner',
        description: 'Complete 10 different learning activities.',
        icon: 'fast-learner',
        category: 'progress',
        requirements: {
          minActivities: 10
        },
        points: 100,
        rarity: 'common'
      },
      {
        name: 'Constitutional Expert',
        description: 'Complete a topic with 100% mastery.',
        icon: 'constitutional-expert',
        category: 'mastery',
        requirements: {
          topicCompletion: 100
        },
        points: 250,
        rarity: 'epic'
      }
    ];
    
    // Check for existing badges
    for (const badge of badges) {
      const existingBadge = await Badge.findOne({ name: badge.name });
      
      if (existingBadge) {
        console.log(`🔄 Badge '${badge.name}' already exists, updating...`);
        await Badge.findByIdAndUpdate(existingBadge._id, badge);
      } else {
        console.log(`➕ Adding new badge: ${badge.name}`);
        await Badge.create(badge);
      }
    }
    
    console.log('✅ Initial badges added successfully');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error adding initial badges:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 