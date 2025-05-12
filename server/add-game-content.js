// This script adds game content (matching, spiral, timeline) to the database
// Run with: node add-game-content.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const Topic = require('./models/Topic');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  addGameContent();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function addGameContent() {
  try {
    console.log('🎮 Adding game content to database...');
    
    // Find constitutional topic (we'll need its ID)
    const constitutionTopic = await Topic.findOne({ 
      title: { $regex: /constitution/i },
      country: 'India'
    });
    
    if (!constitutionTopic) {
      console.error('❌ Constitution topic not found. Please make sure topics are seeded first.');
      process.exit(1);
    }
    
    // Define matching game content
    const matchingGameData = {
      topic: constitutionTopic._id,
      title: 'Constitutional Matching Game',
      type: 'game',
      content: 'Match each constitutional term with its correct definition. Test your knowledge of key constitutional concepts.',
      order: 1,
      estimatedTime: 10,
      points: 50,
      gameConfig: {
        type: 'matching',
        config: {
          pairs: [
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
          ]
        }
      },
      isActive: true
    };
    
    // Define spiral game content
    const spiralGameData = {
      topic: constitutionTopic._id,
      title: 'Constitution Structure Spiral',
      type: 'game',
      content: 'Explore the structure of the Constitution through this interactive spiral visualization.',
      order: 2,
      estimatedTime: 5,
      points: 30,
      gameConfig: {
        type: 'spiral',
        config: {
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
        }
      },
      isActive: true
    };
    
    // Define timeline game content
    const timelineGameData = {
      topic: constitutionTopic._id,
      title: 'Constitutional Timeline',
      type: 'game',
      content: 'Arrange key events in the history of the Indian Constitution in chronological order.',
      order: 3,
      estimatedTime: 8,
      points: 40,
      gameConfig: {
        type: 'timeline',
        config: {
          events: [
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
              details: "The Constitution of India came into effect on January 26, celebrated as Republic Day"
            },
            {
              year: 1976,
              event: "42nd Amendment",
              details: "Added the words 'secular' and 'socialist' to the Preamble"
            },
            {
              year: 1978,
              event: "44th Amendment",
              details: "Removed the right to property from the list of Fundamental Rights"
            },
            {
              year: 1992,
              event: "73rd & 74th Amendments",
              details: "Established Panchayati Raj and Municipalities as constitutional bodies"
            }
          ]
        }
      },
      isActive: true
    };
    
    // Additional matching game with different content
    const advancedMatchingGameData = {
      topic: constitutionTopic._id,
      title: 'Advanced Constitutional Concepts',
      type: 'game',
      content: 'Test your understanding of more advanced constitutional concepts and principles.',
      order: 4,
      estimatedTime: 12,
      points: 60,
      gameConfig: {
        type: 'matching',
        config: {
          pairs: [
            { 
              term: 'Directive Principles', 
              definition: 'Non-justiciable guidelines for the state aimed at promoting social and economic democracy'
            },
            { 
              term: 'Basic Structure Doctrine', 
              definition: 'Constitutional principle that certain features of the Constitution cannot be altered or destroyed through amendments'
            },
            { 
              term: 'Judicial Review', 
              definition: 'Power of courts to examine and determine the constitutional validity of laws and executive actions'
            },
            { 
              term: 'Residuary Powers', 
              definition: 'Powers not explicitly mentioned in Union or State Lists, which are allocated to the Parliament'
            },
            { 
              term: 'Preamble', 
              definition: 'Introductory statement that sets out the guiding principles and values of the Constitution'
            },
            { 
              term: 'Federalism', 
              definition: 'Constitutional system with division of powers between Central and State governments'
            },
            {
              term: 'Writ Jurisdiction',
              definition: 'Constitutional power of the Supreme Court and High Courts to issue writs for enforcement of rights'
            },
            {
              term: 'Cooperative Federalism',
              definition: 'Concept where Centre and States work together harmoniously towards achieving common objectives'
            }
          ]
        }
      },
      isActive: true
    };
    
    // Check for existing games and update or create
    const gameDataSets = [
      { title: 'Constitutional Matching Game', data: matchingGameData },
      { title: 'Constitution Structure Spiral', data: spiralGameData },
      { title: 'Constitutional Timeline', data: timelineGameData },
      { title: 'Advanced Constitutional Concepts', data: advancedMatchingGameData }
    ];
    
    for (const gameSet of gameDataSets) {
      const existingGame = await Content.findOne({ title: gameSet.title });
      
      if (existingGame) {
        console.log(`🔄 Game '${gameSet.title}' already exists, updating...`);
        await Content.findByIdAndUpdate(existingGame._id, gameSet.data);
      } else {
        console.log(`➕ Adding new game: ${gameSet.title}`);
        await Content.create(gameSet.data);
      }
    }
    
    console.log('✅ Game content added successfully');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error adding game content:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 