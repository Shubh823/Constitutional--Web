// Simple test to bypass API and check route handler directly
require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');

async function main() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Connected to MongoDB');

  // Simulate the route handler logic
  const topicId = 'l0-1';
  console.log(`Finding topic with customId: ${topicId}`);

  try {
    // Direct query to find the topic
    const topic = await Topic.findOne({ customId: topicId });
    
    if (topic) {
      console.log('FOUND TOPIC:');
      console.log({
        _id: topic._id.toString(),
        customId: topic.customId,
        title: topic.title,
        description: topic.description.substring(0, 50) + '...'
      });
    } else {
      console.log('NO TOPIC FOUND');
      
      // Check if any topics exist with the customId field
      const topicsWithCustomId = await Topic.find({ customId: { $exists: true } });
      console.log(`Found ${topicsWithCustomId.length} topics with customId field`);
      
      if (topicsWithCustomId.length > 0) {
        // Show the first few
        topicsWithCustomId.slice(0, 5).forEach(t => {
          console.log(`- customId: "${t.customId}", title: "${t.title}"`);
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

main(); 