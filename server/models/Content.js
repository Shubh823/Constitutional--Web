const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['lesson', 'quiz', 'game', 'article', 'video'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      default: 0
    },
    estimatedTime: {
      type: Number, // in minutes
      default: 5
    },
    points: {
      type: Number,
      default: 10
    },
    quiz: {
      questions: [{
        question: {
          type: String
        },
        options: [{
          text: String,
          isCorrect: Boolean
        }],
        explanation: {
          type: String
        }
      }]
    },
    gameConfig: {
      type: mongoose.Schema.Types.Mixed
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Create a compound index for efficient querying
contentSchema.index({ topic: 1, type: 1, order: 1 });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content; 