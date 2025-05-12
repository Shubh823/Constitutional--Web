// Script to test finding topics by customId
require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');

async function testFindTopic() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB:', mongoose.connection.name);
    
    // Find a specific topic by customId
    const testId = 'l0-1';
    console.log(`Searching for topic with customId: ${testId}`);
    
    const topic = await Topic.findOne({ customId: testId });
    
    if (topic) {
      console.log('Topic found!');
      console.log('Topic details:', {
        id: topic._id,
        customId: topic.customId,
        title: topic.title,
        category: topic.category
      });
    } else {
      console.log('Topic not found');
      
      // List all topics
      const allTopics = await Topic.find({});
      console.log(`Found ${allTopics.length} topics in database:`);
      allTopics.forEach(t => {
        console.log(`- ${t._id}: ${t.customId} - ${t.title}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

testFindTopic(); 