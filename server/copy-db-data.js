// This script copies data from the 'constitutional' database to the 'constitutional-app' database
// Run with: node copy-db-data.js

require('dotenv').config();
const mongoose = require('mongoose');

// Function to connect to a specific database
async function connectToDb(dbName) {
  const connection = await mongoose.createConnection(`mongodb://localhost:27017/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log(`Connected to ${dbName} database`);
  return connection;
}

// Function to copy data from one database to another
async function copyData() {
  try {
    // Connect to both databases
    const sourceDb = await connectToDb('constitutional');
    const targetDb = await connectToDb('constitutional-app');
    
    // Define models for both connections
    const SourceTopic = sourceDb.model('Topic', new mongoose.Schema({}, { strict: false }), 'topics');
    const TargetTopic = targetDb.model('Topic', new mongoose.Schema({}, { strict: false }), 'topics');
    
    const SourceContent = sourceDb.model('Content', new mongoose.Schema({}, { strict: false }), 'contents');
    const TargetContent = targetDb.model('Content', new mongoose.Schema({}, { strict: false }), 'contents');
    
    // Clear target collections first
    console.log('Clearing target collections...');
    await TargetTopic.deleteMany({});
    await TargetContent.deleteMany({});
    
    // Get all topics from source database
    const topics = await SourceTopic.find({});
    console.log(`Found ${topics.length} topics in source database`);
    
    // If no topics found, exit
    if (topics.length === 0) {
      console.log('No topics found in source database. Make sure to run the seeding scripts first.');
      await sourceDb.close();
      await targetDb.close();
      return;
    }
    
    // Create a map to store old to new topic ID mappings
    const topicIdMap = new Map();
    
    // Insert topics into target database
    console.log('Copying topics...');
    for (const topic of topics) {
      const topicData = topic.toObject();
      const oldId = topicData._id;
      
      // Remove the _id field to let MongoDB generate a new one
      delete topicData._id;
      
      // Insert topic into target database
      const newTopic = await TargetTopic.create(topicData);
      
      // Store the mapping of old to new ID
      topicIdMap.set(oldId.toString(), newTopic._id);
    }
    
    // Get all content from source database
    const contentItems = await SourceContent.find({});
    console.log(`Found ${contentItems.length} content items in source database`);
    
    // Insert content into target database with updated topic references
    console.log('Copying content...');
    for (const contentItem of contentItems) {
      const contentData = contentItem.toObject();
      const oldTopicId = contentData.topic.toString();
      
      // Replace the old topic ID with the new one
      if (topicIdMap.has(oldTopicId)) {
        contentData.topic = topicIdMap.get(oldTopicId);
      } else {
        console.warn(`Warning: Topic ID ${oldTopicId} not found in mapping`);
      }
      
      // Remove the _id field to let MongoDB generate a new one
      delete contentData._id;
      
      // Insert content into target database
      await TargetContent.create(contentData);
    }
    
    console.log('Data copying completed successfully');
    
    // Close connections
    await sourceDb.close();
    await targetDb.close();
    
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error copying data:', error);
    process.exit(1);
  }
}

// Run the copy function
copyData(); 