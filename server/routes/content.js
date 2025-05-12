const express = require('express');
const { authenticateToken } = require('./auth');
const Topic = require('../models/Topic');
const Content = require('../models/Content');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');
const router = express.Router();

// ==================== COUNTRIES ROUTES ====================
// Get all countries
router.get('/countries', async (req, res) => {
  try {
    const countries = await Topic.distinct('country');
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
});

// ==================== TOPIC DETAIL ROUTES ====================
// This route must be defined BEFORE any routes with similar patterns like /topics/:param
router.get('/topics/detail/:topicId', async (req, res) => {
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
      
      // Debug info
      if (!topic) {
        // Additional debug - check if any topics exist with similar IDs
        const allTopics = await Topic.find({ customId: { $exists: true } });
        console.log('Available customIds:', allTopics.map(t => t.customId));
      }
    }
    
    if (!topic) {
      console.log(`Topic not found: ${topicId}`);
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    console.log(`Found topic: ${topic.title}`);
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
});

// ==================== CONTENT ROUTES ====================
// Get a specific content item
router.get('/content/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findById(contentId);
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content item:', error);
    res.status(500).json({ message: 'Error fetching content item', error: error.message });
  }
});

// ==================== TOPIC CONTENT ROUTES ====================
// Get all content for a topic
router.get('/topics/:topicId/content', async (req, res) => {
  try {
    const { topicId } = req.params;
    let content = [];
    
    // Check if topicId is a valid MongoDB ObjectId
    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      content = await Content.find({ 
        topic: topicId,
        isActive: true 
      }).sort({ order: 1 });
    } else {
      // For custom IDs, try to find the topic first
      const topic = await Topic.findOne({ customId: topicId });
      
      if (topic) {
        content = await Content.find({ 
          topic: topic._id,
          isActive: true 
        }).sort({ order: 1 });
      } else {
        // If no topic found, return empty array
        return res.json([]);
      }
    }
    
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
});

// ==================== TOPIC SUBTOPICS ROUTES ====================
// Get subtopics for a parent topic
router.get('/topics/:topicId/subtopics', async (req, res) => {
  try {
    const { topicId } = req.params;
    let subtopics = [];
    
    // Check if topicId is a valid MongoDB ObjectId
    if (topicId.match(/^[0-9a-fA-F]{24}$/)) {
      subtopics = await Topic.find({ 
        parentTopic: topicId,
        isActive: true 
      }).sort({ order: 1 });
    } else {
      // For custom IDs, try to find the topic first
      const topic = await Topic.findOne({ customId: topicId });
      
      if (topic) {
        subtopics = await Topic.find({ 
          parentTopic: topic._id,
          isActive: true 
        }).sort({ order: 1 });
      }
    }
    
    res.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).json({ message: 'Error fetching subtopics', error: error.message });
  }
});

// ==================== TOPICS BY COUNTRY ROUTES ====================
// Get all topics for a country
router.get('/topics/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const topics = await Topic.find({ 
      country, 
      isActive: true,
      parentTopic: null // Get only top-level topics
    }).sort({ order: 1 });
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
});

// ==================== SEARCH ROUTES ====================
// Search topics and content
router.get('/search', async (req, res) => {
  try {
    const { query, country } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchRegex = new RegExp(query, 'i');
    const filter = country ? { country } : {};
    
    // Search in topics
    const topics = await Topic.find({
      ...filter,
      isActive: true,
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10);
    
    // Search in content
    const contentItems = await Content.find({
      isActive: true,
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    }).populate('topic').limit(10);
    
    // Filter content by country if specified
    const filteredContent = country 
      ? contentItems.filter(item => item.topic.country === country)
      : contentItems;
    
    res.json({
      topics,
      content: filteredContent.map(item => ({
        _id: item._id,
        title: item.title,
        type: item.type,
        topic: {
          _id: item.topic._id,
          title: item.topic.title,
          country: item.topic.country
        }
      }))
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ message: 'Error searching', error: error.message });
  }
});

// ==================== PROGRESS TRACKING ROUTES ====================
// Track content completion (requires auth)
router.post('/track', authenticateToken, async (req, res) => {
  try {
    const { topicId, contentId, type, score, completed } = req.body;
    
    // Get topic to get country
    const topic = await Topic.findById(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    
    // Find or create progress record
    let progress = await Progress.findOne({
      user: req.user.id,
      topic: topicId,
      country: topic.country
    });
    
    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        topic: topicId,
        country: topic.country,
        completionPercentage: 0,
        quizScores: [],
        activities: []
      });
    }
    
    if (type === 'quiz') {
      // Add quiz score
      const existingQuizIndex = progress.quizScores.findIndex(
        q => q.quizId.toString() === contentId
      );
      
      if (existingQuizIndex >= 0) {
        progress.quizScores[existingQuizIndex].score = score;
        progress.quizScores[existingQuizIndex].date = Date.now();
      } else {
        progress.quizScores.push({
          quizId: contentId,
          score: score,
          date: Date.now()
        });
      }
    } else {
      // Add activity
      const existingActivityIndex = progress.activities.findIndex(
        a => a.activityId.toString() === contentId
      );
      
      if (existingActivityIndex >= 0) {
        progress.activities[existingActivityIndex].completed = completed;
        progress.activities[existingActivityIndex].score = score || 0;
        progress.activities[existingActivityIndex].date = Date.now();
      } else {
        progress.activities.push({
          activityId: contentId,
          completed: completed,
          score: score || 0,
          date: Date.now()
        });
      }
    }
    
    // Calculate completion percentage based on all content for this topic
    const allContent = await Content.find({ topic: topicId, isActive: true });
    const totalContentCount = allContent.length;
    
    if (totalContentCount > 0) {
      // Calculate how many content items are completed
      const allContentIds = allContent.map(c => c._id.toString());
      const completedQuizzes = progress.quizScores
        .filter(q => allContentIds.includes(q.quizId.toString()))
        .length;
      
      const completedActivities = progress.activities
        .filter(a => a.completed && allContentIds.includes(a.activityId.toString()))
        .length;
      
      const completedContent = completedQuizzes + completedActivities;
      progress.completionPercentage = Math.round((completedContent / totalContentCount) * 100);
    }
    
    progress.lastUpdated = Date.now();
    await progress.save();
    
    res.json(progress);
  } catch (error) {
    console.error('Error tracking progress:', error);
    res.status(500).json({ message: 'Error tracking progress', error: error.message });
  }
});

module.exports = router; 