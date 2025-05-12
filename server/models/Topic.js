const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['fundamental-rights', 'directive-principles', 'judiciary', 'legislature', 'executive', 'amendments', 'other'],
      required: true
    },
    icon: {
      type: String,
      default: 'default-icon.svg'
    },
    color: {
      type: String,
      default: '#3498db'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    parentTopic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    customId: {
      type: String,
      index: true,
      sparse: true,
      unique: true
    }
  },
  { timestamps: true }
);

// Create a compound index for efficient querying
topicSchema.index({ country: 1, category: 1, order: 1 });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic; 