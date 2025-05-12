const express = require('express');
const Topic = require('../models/Topic');
const router = express.Router();

// GET topic by ID (works with both MongoDB ObjectIds and custom IDs)
router.get('/:topicId', async (req, res) => {
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
    }
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Return the found topic
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
});

module.exports = router; 