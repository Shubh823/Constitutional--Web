// This script updates game content in the database with enhanced game configurations
// Run with: node update-games.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  updateGames();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function updateGames() {
  try {
    console.log('🎮 Updating game content with enhanced configurations...');
    
    // Find all game content
    const gameContents = await Content.find({ type: 'game' });
    console.log(`Found ${gameContents.length} game content items to update`);
    
    let updatedCount = 0;
    
    for (const gameContent of gameContents) {
      // Get current game type
      const gameType = gameContent.gameConfig?.type;
      
      if (!gameType) {
        console.log(`⚠️ Game content ${gameContent._id} has no game type. Skipping.`);
        continue;
      }
      
      // Update game configuration based on type
      let updatedConfig;
      
      switch (gameType) {
        case 'quiz':
          updatedConfig = getEnhancedQuizConfig();
          break;
        case 'matching':
          updatedConfig = getEnhancedMatchingConfig();
          break;
        case 'scenario':
          updatedConfig = getEnhancedScenarioConfig();
          break;
        case 'timeline':
          updatedConfig = getEnhancedTimelineConfig();
          break;
        case 'spiral':
          updatedConfig = getEnhancedSpiralConfig(gameContent.gameConfig?.config?.centerTitle || "Indian Constitution");
          break;
        default:
          console.log(`⚠️ Unknown game type: ${gameType}. Skipping.`);
          continue;
      }
      
      // Update the game configuration
      gameContent.gameConfig = {
        type: gameType,
        config: updatedConfig
      };
      
      await gameContent.save();
      updatedCount++;
      console.log(`✅ Updated ${gameType} game with ID ${gameContent._id}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} of ${gameContents.length} game content items`);
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error updating games:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Enhanced game configurations

function getEnhancedQuizConfig() {
  return {
    timeLimit: 60,
    passingScore: 70,
    questions: [
      {
        question: "Which of the following is NOT a Fundamental Right guaranteed by the Indian Constitution?",
        options: [
          { text: "Right to Equality (Article 14-18)", isCorrect: false },
          { text: "Right to Freedom (Article 19-22)", isCorrect: false },
          { text: "Right to Property (formerly Article 31)", isCorrect: true },
          { text: "Right against Exploitation (Article 23-24)", isCorrect: false }
        ],
        explanation: "The Right to Property was originally a Fundamental Right under Article 31, but it was removed by the 44th Amendment in 1978. It is now a legal right under Article 300A."
      },
      {
        question: "The Indian Constitution is considered to be:",
        options: [
          { text: "Completely rigid", isCorrect: false },
          { text: "Completely flexible", isCorrect: false },
          { text: "A combination of rigidity and flexibility", isCorrect: true },
          { text: "Unwritten like the British Constitution", isCorrect: false }
        ],
        explanation: "The Indian Constitution contains both rigid provisions (requiring special majority) and flexible provisions (requiring simple majority), making it a balanced combination of rigidity and flexibility."
      },
      {
        question: "Which constitutional amendment introduced the Goods and Services Tax (GST) in India?",
        options: [
          { text: "99th Amendment", isCorrect: false },
          { text: "100th Amendment", isCorrect: false },
          { text: "101st Amendment", isCorrect: true },
          { text: "102nd Amendment", isCorrect: false }
        ],
        explanation: "The 101st Constitutional Amendment Act, 2016 introduced the Goods and Services Tax (GST) in India with effect from July 1, 2017."
      },
      {
        question: "The concept of 'Basic Structure' of the Constitution was propounded in which case?",
        options: [
          { text: "Golaknath v. State of Punjab", isCorrect: false },
          { text: "Kesavananda Bharati v. State of Kerala", isCorrect: true },
          { text: "Minerva Mills v. Union of India", isCorrect: false },
          { text: "Maneka Gandhi v. Union of India", isCorrect: false }
        ],
        explanation: "The Basic Structure doctrine was established in the landmark case of Kesavananda Bharati v. State of Kerala (1973), which held that Parliament cannot amend the basic structure of the Constitution."
      },
      {
        question: "Which Schedule of the Indian Constitution deals with the division of powers between the Union and States?",
        options: [
          { text: "Sixth Schedule", isCorrect: false },
          { text: "Seventh Schedule", isCorrect: true },
          { text: "Eighth Schedule", isCorrect: false },
          { text: "Ninth Schedule", isCorrect: false }
        ],
        explanation: "The Seventh Schedule contains three lists: Union List, State List, and Concurrent List, which distribute legislative powers between the Union and State governments."
      }
    ]
  };
}

function getEnhancedMatchingConfig() {
  return {
    pairs: [
      { term: 'Article 14', definition: 'Equality before law' },
      { term: 'Article 19', definition: 'Right to freedom' },
      { term: 'Article 21', definition: 'Right to life and personal liberty' },
      { term: 'Article 32', definition: 'Right to constitutional remedies' },
      { term: 'Article 44', definition: 'Uniform civil code' },
      { term: 'Article 368', definition: 'Procedure for amendment of the Constitution' },
      { term: 'Article 370', definition: 'Special status to Jammu and Kashmir (now abrogated)' },
      { term: 'Seventh Schedule', definition: 'Division of powers between Union and States' }
    ],
    timeLimit: 120
  };
}

function getEnhancedScenarioConfig() {
  return {
    scenarios: [
      {
        title: "State Speech Restriction",
        situation: "A state government passes a law restricting hate speech in certain contexts, including speech that promotes violence against minorities.",
        question: "Is this constitutional?",
        hint: "Consider Article 19 and its reasonable restrictions under 19(2)",
        options: [
          { 
            text: "Yes, states have complete authority over speech", 
            isCorrect: false,
            feedback: "Incorrect. States do not have unlimited authority over speech. The Constitution guarantees freedom of speech as a fundamental right under Article 19(1)(a)."
          },
          { 
            text: "Yes, if it falls under reasonable restrictions in Article 19(2)", 
            isCorrect: true,
            feedback: "Correct! Article 19(2) allows reasonable restrictions on free speech in the interests of sovereignty and integrity of India, security of the State, friendly relations with foreign States, public order, decency or morality, contempt of court, defamation, or incitement to an offence."
          },
          { 
            text: "No, free speech cannot be restricted under any circumstances", 
            isCorrect: false,
            feedback: "Incorrect. While free speech is protected under Article 19(1)(a), it is not absolute. Article 19(2) specifically provides for reasonable restrictions."
          },
          { 
            text: "No, only the central government can restrict speech", 
            isCorrect: false,
            feedback: "Incorrect. Both central and state governments can enact laws imposing reasonable restrictions on free speech as per Article 19(2), provided they meet the constitutional standards."
          }
        ]
      },
      {
        title: "Religious Discrimination in Private Employment",
        situation: "A private company denies employment to someone based solely on their religion.",
        question: "Does this violate Fundamental Rights under the Constitution?",
        hint: "Consider against whom Fundamental Rights are enforceable",
        options: [
          { 
            text: "Yes, it violates Article 15 on non-discrimination", 
            isCorrect: false,
            feedback: "Incorrect. Article 15 prohibits discrimination by the State, not private entities. It is not directly enforceable against private companies."
          },
          { 
            text: "Yes, it violates Article 16 on equal opportunity in public employment", 
            isCorrect: false,
            feedback: "Incorrect. Article 16 guarantees equal opportunity in public employment, but does not apply to private sector employment."
          },
          { 
            text: "No, Fundamental Rights are enforceable only against the State", 
            isCorrect: true,
            feedback: "Correct! Generally, Fundamental Rights under the Constitution are enforceable only against the State (as defined in Article 12) and not against private individuals or organizations, with limited exceptions like Articles 15(2), 17, 23, and 24."
          },
          { 
            text: "No, religious discrimination is permitted by the Constitution", 
            isCorrect: false,
            feedback: "Incorrect. The Constitution does not permit religious discrimination. While Fundamental Rights may not be directly enforceable against private entities, such discrimination may still be prohibited under other laws like the Equal Remuneration Act."
          }
        ]
      },
      {
        title: "Reservation Policy",
        situation: "The government introduces a 10% reservation for economically weaker sections (EWS) in education and government jobs, in addition to existing reservations for SC, ST, and OBC categories.",
        question: "What constitutional amendment made this possible?",
        hint: "Think about recent amendments to the Constitution",
        options: [
          { 
            text: "101st Amendment", 
            isCorrect: false,
            feedback: "Incorrect. The 101st Amendment introduced the Goods and Services Tax (GST) system."
          },
          { 
            text: "102nd Amendment", 
            isCorrect: false,
            feedback: "Incorrect. The 102nd Amendment gave constitutional status to the National Commission for Backward Classes."
          },
          { 
            text: "103rd Amendment", 
            isCorrect: true,
            feedback: "Correct! The 103rd Constitutional Amendment Act, 2019 provided for 10% reservation in education and government jobs for Economically Weaker Sections (EWS) among the general category."
          },
          { 
            text: "104th Amendment", 
            isCorrect: false,
            feedback: "Incorrect. There is no 104th Amendment yet."
          }
        ]
      },
      {
        title: "State Emergency",
        situation: "The President's Rule is imposed in a state where the elected government has lost majority and no alternative government can be formed.",
        question: "Under which Article is this emergency provision described?",
        hint: "Look at emergency provisions in the Constitution",
        options: [
          { 
            text: "Article 352", 
            isCorrect: false,
            feedback: "Incorrect. Article 352 deals with the proclamation of National Emergency due to war, external aggression, or armed rebellion."
          },
          { 
            text: "Article 356", 
            isCorrect: true,
            feedback: "Correct! Article 356 deals with State Emergency (President's Rule) where the constitutional machinery in a state has failed."
          },
          { 
            text: "Article 360", 
            isCorrect: false,
            feedback: "Incorrect. Article 360 deals with Financial Emergency."
          },
          { 
            text: "Article 370", 
            isCorrect: false,
            feedback: "Incorrect. Article 370 dealt with the special status of Jammu and Kashmir (now abrogated)."
          }
        ]
      },
      {
        title: "Constitutional Amendment",
        situation: "Parliament passes a bill to amend a part of the Constitution that affects the federal structure of India.",
        question: "Can the Supreme Court review this amendment?",
        hint: "Consider the Basic Structure doctrine",
        options: [
          { 
            text: "No, constitutional amendments are beyond judicial review", 
            isCorrect: false,
            feedback: "Incorrect. The Supreme Court established in Kesavananda Bharati case (1973) that constitutional amendments can be reviewed."
          },
          { 
            text: "No, only if it affects fundamental rights", 
            isCorrect: false,
            feedback: "Incorrect. The Supreme Court can review amendments that affect any aspect of the Basic Structure, not just fundamental rights."
          },
          { 
            text: "Yes, if it violates the Basic Structure doctrine", 
            isCorrect: true,
            feedback: "Correct! As per the Basic Structure doctrine established in Kesavananda Bharati case (1973), the Supreme Court can review and strike down constitutional amendments that damage or destroy the basic features of the Constitution, including federalism."
          },
          { 
            text: "Yes, but only with the President's permission", 
            isCorrect: false,
            feedback: "Incorrect. The Supreme Court does not need the President's permission to review the constitutionality of amendments."
          }
        ]
      }
    ],
    timeLimit: 300
  };
}

function getEnhancedTimelineConfig() {
  return {
    events: [
      { year: 1946, event: 'Formation of Constituent Assembly' },
      { year: 1949, event: 'Constitution was adopted' },
      { year: 1950, event: 'Constitution came into effect' },
      { year: 1951, event: 'First Amendment to Constitution' },
      { year: 1952, event: 'First General Elections in India' },
      { year: 1976, event: '42nd Amendment (Mini Constitution)' },
      { year: 1978, event: '44th Amendment (Right to Property removed)' },
      { year: 1992, event: '73rd and 74th Amendments (Panchayati Raj)' },
      { year: 2016, event: '101st Amendment (GST Implementation)' },
      { year: 2019, event: '103rd Amendment (EWS Reservation)' }
    ],
    timeLimit: 180
  };
}

function getEnhancedSpiralConfig(centerTitle) {
  return {
    centerTitle: centerTitle,
    levels: [
      {
        title: "Level 0: Introduction",
        items: ["Preamble", "History", "Features"],
        color: "#3498db"
      },
      {
        title: "Level 1: Structure",
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
    ],
    timeLimit: 420
  };
} 