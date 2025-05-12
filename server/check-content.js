require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('./models/Topic');
const Content = require('./models/Content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  checkContent();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function checkContent() {
  try {
    // Get a topic by customId
    const topic = await Topic.findOne({ customId: 'l0-1' });
    
    if (!topic) {
      console.log('Topic with customId l0-1 not found');
      mongoose.connection.close();
      return;
    }
    
    console.log(`Found topic: ${topic.title} (${topic._id})`);
    
    // Find content for this topic
    const content = await Content.find({ topic: topic._id });
    
    console.log(`Found ${content.length} content items for this topic:`);
    content.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Order: ${item.order}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking content:', error);
    mongoose.connection.close();
  }
} 