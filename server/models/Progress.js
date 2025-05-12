const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    country: {
      type: String,
      required: true
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    quizScores: [{
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    activities: [{
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      },
      completed: {
        type: Boolean,
        default: false
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      date: {
        type: Date,
        default: Date.now
      }
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create a unique compound index for user-topic-country combination
progressSchema.index({ user: 1, topic: 1, country: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 