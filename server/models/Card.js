const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  team: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear() + 1
  },
  sport: {
    type: String,
    required: true,
    enum: ['Baseball', 'Basketball', 'Football', 'Hockey', 'Soccer']
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  set: {
    type: String,
    required: true,
    trim: true
  },
  cardNumber: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['Mint', 'Near Mint', 'Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
    default: 'Near Mint'
  },
  conditionScore: {
    type: Number,
    min: 0,
    max: 100
  },
  centeringScore: {
    type: Number,
    min: 0,
    max: 100
  },
  cornersScore: {
    type: Number,
    min: 0,
    max: 100
  },
  edgesScore: {
    type: Number,
    min: 0,
    max: 100
  },
  surfaceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  estimatedValue: {
    type: Number,
    min: 0
  },
  priceChange: {
    type: Number,
    default: 0
  },
  isRookie: {
    type: Boolean,
    default: false
  },
  isGraded: {
    type: Boolean,
    default: false
  },
  isParallel: {
    type: Boolean,
    default: false
  },
  frontImage: {
    type: String
  },
  backImage: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  conditionNotes: [{
    issue: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['minor', 'moderate', 'major'],
      default: 'minor'
    }
  }],
  recentSales: [{
    price: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['Auction', 'Buy It Now', 'Best Offer'],
      required: true
    }
  }],
  tcgPlayerPrice: {
    type: Number
  },
  ebayAverage: {
    type: Number
  },
  lastPriceUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
cardSchema.index({ playerName: 'text', team: 'text', set: 'text' });
cardSchema.index({ sport: 1, year: 1 });
cardSchema.index({ manufacturer: 1 });
cardSchema.index({ condition: 1 });
cardSchema.index({ estimatedValue: 1 });
cardSchema.index({ isRookie: 1 });
cardSchema.index({ isGraded: 1 });

module.exports = mongoose.model('Card', cardSchema);