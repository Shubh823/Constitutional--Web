// This script helps track and analyze user progress across constitutional learning games
// Run with: node track-constitutional-learning.js

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const User = require('./models/User');
const Progress = require('./models/Progress');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/constitutional', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  trackConstitutionalLearning();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

async function trackConstitutionalLearning() {
  try {
    console.log('📊 Analyzing constitutional learning progress...');
    
    // 1. Get all constitutional content (quizzes and games)
    const constitutionalContent = await Content.find({
      $or: [
        { type: 'quiz' },
        { type: 'game', 'gameConfig.type': { $in: ['scenario', 'quiz'] } }
      ]
    }).populate('topic', 'title');
    
    console.log(`\nFound ${constitutionalContent.length} learning activities`);
    
    // 2. Get all users
    const users = await User.find({}, 'name email');
    console.log(`Found ${users.length} users`);
    
    // 3. Analyze progress for each user
    console.log('\n--- User Progress Analysis ---');
    
    for (const user of users) {
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      
      // Get user's progress records
      const userProgress = await Progress.find({ user: user._id }).populate('content');
      
      if (!userProgress || userProgress.length === 0) {
        console.log('  No learning activities completed yet');
        continue;
      }
      
      // Count completed quizzes and games
      const completedQuizzes = userProgress.filter(p => 
        p.content && p.content.type === 'quiz' && p.completed
      );
      
      const completedScenarios = userProgress.filter(p => 
        p.content && p.content.type === 'game' && 
        p.content.gameConfig && p.content.gameConfig.type === 'scenario' && 
        p.completed
      );
      
      // Calculate average scores
      const quizAvgScore = completedQuizzes.length > 0 
        ? completedQuizzes.reduce((sum, p) => sum + p.score, 0) / completedQuizzes.length 
        : 0;
      
      const scenarioAvgScore = completedScenarios.length > 0 
        ? completedScenarios.reduce((sum, p) => sum + p.score, 0) / completedScenarios.length 
        : 0;
      
      // Output progress summary
      console.log(`  Quizzes completed: ${completedQuizzes.length}/${constitutionalContent.filter(c => c.type === 'quiz').length}`);
      console.log(`  Scenario games completed: ${completedScenarios.length}/${constitutionalContent.filter(c => c.type === 'game' && c.gameConfig && c.gameConfig.type === 'scenario').length}`);
      console.log(`  Average quiz score: ${quizAvgScore.toFixed(2)}%`);
      console.log(`  Average scenario score: ${scenarioAvgScore.toFixed(2)}%`);
      
      // Identify areas of strength and improvement
      const topicScores = {};
      
      // Group scores by topic
      userProgress.forEach(p => {
        if (p.content && p.content.topic && p.completed) {
          const topicId = p.content.topic.toString();
          if (!topicScores[topicId]) {
            topicScores[topicId] = {
              title: p.content.topic.title || 'Unknown Topic',
              scores: [],
              total: 0,
              count: 0
            };
          }
          
          topicScores[topicId].scores.push(p.score);
          topicScores[topicId].total += p.score;
          topicScores[topicId].count++;
        }
      });
      
      // Calculate average scores by topic
      console.log('\n  Topic Performance:');
      
      Object.values(topicScores).forEach(topic => {
        const avgScore = topic.count > 0 ? topic.total / topic.count : 0;
        let performanceLevel = '';
        
        if (avgScore >= 90) performanceLevel = 'Excellent';
        else if (avgScore >= 75) performanceLevel = 'Good';
        else if (avgScore >= 60) performanceLevel = 'Satisfactory';
        else performanceLevel = 'Needs improvement';
        
        console.log(`  - ${topic.title}: ${avgScore.toFixed(2)}% (${performanceLevel})`);
      });
      
      // Recommend next steps
      console.log('\n  Recommendations:');
      
      // For incomplete content
      const incompleteContent = constitutionalContent.filter(content => 
        !userProgress.some(p => p.content && p.content._id.toString() === content._id.toString() && p.completed)
      );
      
      if (incompleteContent.length > 0) {
        console.log('  - Incomplete learning activities:');
        incompleteContent.slice(0, 3).forEach(content => {
          console.log(`    * ${content.title} (${content.type})`);
        });
        
        if (incompleteContent.length > 3) {
          console.log(`    * ...and ${incompleteContent.length - 3} more`);
        }
      }
      
      // For low-scoring content
      const lowScores = userProgress.filter(p => p.score < 70 && p.completed);
      
      if (lowScores.length > 0) {
        console.log('  - Topics to review (scores below 70%):');
        lowScores.slice(0, 3).forEach(progress => {
          if (progress.content) {
            console.log(`    * ${progress.content.title} (${progress.score}%)`);
          }
        });
        
        if (lowScores.length > 3) {
          console.log(`    * ...and ${lowScores.length - 3} more`);
        }
      }
      
      // If user has completed everything with good scores
      if (incompleteContent.length === 0 && lowScores.length === 0) {
        console.log('  - Excellent progress! All content completed with good scores.');
        console.log('  - Consider exploring advanced constitutional topics or revisiting activities to maintain knowledge.');
      }
    }
    
    // 4. Overall platform statistics
    console.log('\n--- Platform Learning Statistics ---');
    
    // Get all progress records
    const allProgress = await Progress.find({ completed: true });
    
    // Calculate completion rates
    const quizCompletionRate = constitutionalContent.filter(c => c.type === 'quiz').length > 0
      ? (allProgress.filter(p => p.content && p.content.type === 'quiz').length / 
        (users.length * constitutionalContent.filter(c => c.type === 'quiz').length)) * 100
      : 0;
    
    const scenarioCompletionRate = constitutionalContent.filter(c => c.type === 'game' && c.gameConfig && c.gameConfig.type === 'scenario').length > 0
      ? (allProgress.filter(p => p.content && p.content.type === 'game' && p.content.gameConfig && p.content.gameConfig.type === 'scenario').length / 
        (users.length * constitutionalContent.filter(c => c.type === 'game' && c.gameConfig && c.gameConfig.type === 'scenario').length)) * 100
      : 0;
    
    // Calculate average scores
    const allQuizScores = allProgress.filter(p => p.content && p.content.type === 'quiz').map(p => p.score);
    const allScenarioScores = allProgress.filter(p => p.content && p.content.type === 'game' && p.content.gameConfig && p.content.gameConfig.type === 'scenario').map(p => p.score);
    
    const avgQuizScore = allQuizScores.length > 0
      ? allQuizScores.reduce((sum, score) => sum + score, 0) / allQuizScores.length
      : 0;
    
    const avgScenarioScore = allScenarioScores.length > 0
      ? allScenarioScores.reduce((sum, score) => sum + score, 0) / allScenarioScores.length
      : 0;
    
    console.log(`Quiz completion rate: ${quizCompletionRate.toFixed(2)}%`);
    console.log(`Scenario game completion rate: ${scenarioCompletionRate.toFixed(2)}%`);
    console.log(`Average quiz score: ${avgQuizScore.toFixed(2)}%`);
    console.log(`Average scenario score: ${avgScenarioScore.toFixed(2)}%`);
    
    // Most and least popular content
    const contentCompletionCounts = {};
    
    allProgress.forEach(p => {
      if (p.content) {
        const contentId = p.content.toString();
        if (!contentCompletionCounts[contentId]) {
          contentCompletionCounts[contentId] = 0;
        }
        contentCompletionCounts[contentId]++;
      }
    });
    
    const contentCountsArray = Object.entries(contentCompletionCounts).map(([id, count]) => ({ id, count }));
    contentCountsArray.sort((a, b) => b.count - a.count);
    
    console.log('\nMost Popular Content:');
    for (let i = 0; i < Math.min(3, contentCountsArray.length); i++) {
      const content = constitutionalContent.find(c => c._id.toString() === contentCountsArray[i].id);
      if (content) {
        console.log(`${i+1}. ${content.title} - ${contentCountsArray[i].count} completions`);
      }
    }
    
    console.log('\nLeast Popular Content:');
    for (let i = Math.max(0, contentCountsArray.length - 3); i < contentCountsArray.length; i++) {
      const content = constitutionalContent.find(c => c._id.toString() === contentCountsArray[i].id);
      if (content) {
        console.log(`${contentCountsArray.length - i}. ${content.title} - ${contentCountsArray[i].count} completions`);
      }
    }
    
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error analyzing learning progress:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
} 