const express = require('express');
const { authenticateToken } = require('./auth');
const User = require('../models/User');
const Progress = require('../models/Progress');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('badges');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, name, preferredCountry, profilePicture } = req.body;
    
    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: username,
          name: name,
          preferredCountry: preferredCountry,
          profilePicture: profilePicture
        }
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get user with badges
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('badges');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user progress across all topics
    const progress = await Progress.find({ user: req.user.id })
      .populate('topic')
      .sort({ lastUpdated: -1 });
    
    // Calculate overall statistics
    const totalTopics = progress.length;
    const completedTopics = progress.filter(p => p.completionPercentage === 100).length;
    const overallProgress = totalTopics > 0 
      ? Math.round((progress.reduce((sum, p) => sum + p.completionPercentage, 0) / totalTopics)) 
      : 0;
    
    // Get recent activities
    const recentActivities = progress
      .filter(p => p.activities.length > 0)
      .flatMap(p => p.activities.map(a => ({
        topicId: p.topic._id,
        topicTitle: p.topic.title,
        activityId: a.activityId,
        completed: a.completed,
        score: a.score,
        date: a.date
      })))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    // Get quiz scores
    const quizScores = progress
      .filter(p => p.quizScores.length > 0)
      .flatMap(p => p.quizScores.map(q => ({
        topicId: p.topic._id,
        topicTitle: p.topic.title,
        quizId: q.quizId,
        score: q.score,
        date: q.date
      })))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate average quiz score
    const averageQuizScore = quizScores.length > 0
      ? Math.round(quizScores.reduce((sum, q) => sum + q.score, 0) / quizScores.length)
      : 0;
    
    res.json({
      user,
      stats: {
        totalTopics,
        completedTopics,
        overallProgress,
        averageQuizScore,
        totalBadges: user.badges.length
      },
      recentActivities,
      quizScores: quizScores.slice(0, 5),
      progress: progress.map(p => ({
        topicId: p.topic._id,
        topicTitle: p.topic.title,
        completionPercentage: p.completionPercentage,
        country: p.country,
        lastUpdated: p.lastUpdated
      })).slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

module.exports = router; 