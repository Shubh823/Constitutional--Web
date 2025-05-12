// This script checks if topics with custom IDs exist in the database
// Run with: node check-topics.js

require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  checkTopics();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Function to check topics
async function checkTopics() {
  try {
    // Get all topics
    const topics = await Topic.find({});
    console.log(`Found ${topics.length} topics in the database`);
    
    if (topics.length > 0) {
      console.log('\nSample topics:');
      topics.slice(0, 3).forEach(topic => {
        console.log(`- ID: ${topic._id}`);
        console.log(`  CustomID: ${topic.customId}`);
        console.log(`  Title: ${topic.title}`);
        console.log('');
      });
      
      // Check specific IDs that are failing
      console.log('Checking specific topic IDs that are failing:');
      const l01 = await Topic.findOne({ customId: 'l0-1' });
      console.log(`Topic with customId 'l0-1': ${l01 ? 'Found' : 'Not found'}`);
      
      const l02 = await Topic.findOne({ customId: 'l0-2' });
      console.log(`Topic with customId 'l0-2': ${l02 ? 'Found' : 'Not found'}`);
    } else {
      console.log('No topics found in the database. You need to seed the database first.');
    }
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking topics:', error);
    mongoose.connection.close();
  }
} 