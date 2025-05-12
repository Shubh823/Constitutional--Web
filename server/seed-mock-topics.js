// This script seeds the mock topics from ConstitutionalTopics.js into the database
// Run with: node seed-mock-topics.js

require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Mock topics from ConstitutionalTopics.js
const mockTopics = [
  // Level 0: Introduction topics
  {
    customId: 'l0-1',
    title: 'Preamble',
    description: 'Introduction to the Constitution, its purpose, and ideals including sovereignty, socialism, secularism, democracy, justice, liberty, equality, and fraternity.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 1,
    isActive: true
  },
  {
    customId: 'l0-2',
    title: 'History of Constitution',
    description: 'Timeline of formation, Constituent Assembly, and the drafting process of the Indian Constitution.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 2,
    isActive: true
  },
  {
    customId: 'l0-3',
    title: 'Features of Constitution',
    description: 'Federalism, Parliamentary System, Secularism, and other unique features of the Indian Constitution.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 3,
    isActive: true
  },
  
  // Level 1: Basic Structure topics
  {
    customId: 'l1-1',
    title: 'Part I: Union and its Territory',
    description: 'Articles 1-4: Name and territory of the Union, admission of new states, formation of new states, and alteration of boundaries.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 4,
    isActive: true
  },
  {
    customId: 'l1-2',
    title: 'Part III: Fundamental Rights',
    description: 'Articles 12-35: Six fundamental rights including Right to Equality, Right to Freedom, Right against Exploitation, and more.',
    category: 'fundamental-rights',
    difficulty: 'beginner',
    country: 'India',
    order: 5,
    isActive: true
  },
  {
    customId: 'l1-3',
    title: 'Part IV: Directive Principles',
    description: 'Articles 36-51: Guidelines provided to the government to ensure social and economic democracy through welfare approach.',
    category: 'directive-principles',
    difficulty: 'intermediate',
    country: 'India',
    order: 6,
    isActive: true
  },
  {
    customId: 'l1-4',
    title: 'Part IV-A: Fundamental Duties',
    description: 'Article 51A: List of duties that citizens are expected to abide by.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 7,
    isActive: true
  },
  {
    customId: 'l1-5',
    title: 'Part V: Union Government',
    description: 'Articles 52-151: Structure and functioning of the President, Vice-President, Prime Minister, and Parliament.',
    category: 'other',
    difficulty: 'intermediate',
    country: 'India',
    order: 8,
    isActive: true
  },
  {
    customId: 'l1-6',
    title: 'Part XVIII: Emergency Provisions',
    description: 'Articles 352-360: Three types of emergencies - National, State, and Financial, and their implications.',
    category: 'other',
    difficulty: 'advanced',
    country: 'India',
    order: 9,
    isActive: true
  },
  
  // Level 2: Schedules topics
  {
    customId: 'l2-1',
    title: 'Schedule 1: States and UTs',
    description: 'List of states and union territories in India with their territories.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 10,
    isActive: true
  },
  {
    customId: 'l2-2',
    title: 'Schedule 7: Division of Powers',
    description: 'Union List, State List, and Concurrent List defining the division of powers between the Centre and States.',
    category: 'other',
    difficulty: 'intermediate',
    country: 'India',
    order: 11,
    isActive: true
  },
  {
    customId: 'l2-3',
    title: 'Schedule 8: Official Languages',
    description: 'The 22 official languages recognized by the Constitution of India.',
    category: 'other',
    difficulty: 'beginner',
    country: 'India',
    order: 12,
    isActive: true
  },
  {
    customId: 'l2-4',
    title: 'Schedule 9 & 10: Special Acts & Anti-Defection',
    description: 'Schedule 9 protects certain laws from judicial review, while Schedule 10 contains anti-defection provisions.',
    category: 'other',
    difficulty: 'advanced',
    country: 'India',
    order: 13,
    isActive: true
  },
  
  // Level 3: Amendments topics
  {
    customId: 'l3-1',
    title: '1st Amendment (1951)',
    description: 'Added Ninth Schedule to protect land reform laws from judicial review.',
    category: 'amendments',
    difficulty: 'intermediate',
    country: 'India',
    order: 14,
    isActive: true
  },
  {
    customId: 'l3-2',
    title: '42nd Amendment (1976)',
    description: 'The "Mini-Constitution" that made significant changes during the Emergency period.',
    category: 'amendments',
    difficulty: 'advanced',
    country: 'India',
    order: 15,
    isActive: true
  },
  {
    customId: 'l3-3',
    title: '73rd & 74th Amendments',
    description: 'Constitutional status to Panchayati Raj Institutions and Municipalities.',
    category: 'amendments',
    difficulty: 'intermediate',
    country: 'India',
    order: 16,
    isActive: true
  },
  {
    customId: 'l3-4',
    title: '101st Amendment (GST)',
    description: 'Introduction of Goods and Services Tax (GST) in India.',
    category: 'amendments',
    difficulty: 'intermediate',
    country: 'India',
    order: 17,
    isActive: true
  },
  
  // Level 4: Advanced topics
  {
    customId: 'l4-1',
    title: 'Doctrine of Basic Structure',
    description: 'Explore the judicial doctrine that sets limits on Parliament\'s power to amend the Constitution.',
    category: 'other',
    difficulty: 'advanced',
    country: 'India',
    order: 18,
    isActive: true
  },
  {
    customId: 'l4-2',
    title: 'Judicial Review',
    description: 'Study the power of the Supreme Court and High Courts to review the constitutionality of laws.',
    category: 'judiciary',
    difficulty: 'advanced',
    country: 'India',
    order: 19,
    isActive: true
  },
  {
    customId: 'l4-3',
    title: 'Landmark Judgments',
    description: 'Analyze landmark Supreme Court judgments that have shaped constitutional interpretation.',
    category: 'judiciary',
    difficulty: 'advanced',
    country: 'India',
    order: 20,
    isActive: true
  },
  {
    customId: 'l4-4',
    title: 'Constitution in Modern India',
    description: 'Evaluate the role and relevance of the Constitution in contemporary Indian society.',
    category: 'other',
    difficulty: 'advanced',
    country: 'India',
    order: 21,
    isActive: true
  }
];

// Function to seed the topics
async function seedTopics() {
  try {
    // Clear existing topics with customId starting with 'l'
    await Topic.deleteMany({ customId: /^l\d+-\d+/ });
    
    // Insert new topics
    const result = await Topic.insertMany(mockTopics);
    
    console.log(`Successfully seeded ${result.length} topics`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding topics:', error);
    mongoose.connection.close();
  }
}

// Run the seeding function
seedTopics(); 