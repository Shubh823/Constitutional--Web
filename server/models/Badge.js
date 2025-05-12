const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['achievement', 'progress', 'mastery', 'participation', 'special'],
      default: 'achievement'
    },
    requirements: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    points: {
      type: Number,
      default: 50
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge; 