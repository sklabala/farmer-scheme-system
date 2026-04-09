// models/Scheme.js
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  // Basic Information
  title: { 
    type: String, 
    required: true,
    index: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Insurance', 'Subsidy', 'Loan', 'Training', 'Equipment', 'Relief', 'Other'],
    default: 'Other',
    index: true
  },
  state: String,

  // Eligibility & Benefits
  eligibilityCriteria: String,
  eligibility: [String],
  benefits: String,
  benefitsList: [String],

  // Application Details
  applicationLink: String,
  sourceUrl: {
    type: String,
    index: true
  },

  // Timeline
  deadlines: {
    start: Date,
    end: Date
  },
  deadline: Date,
  publishedDate: {
    type: Date,
    default: Date.now
  },

  // Source Information (for web scraping)
  source: {
    type: String,
    index: true
  },
  sourceType: {
    type: String,
    enum: ['government', 'newspaper', 'manual', 'other'],
    default: 'manual'
  },

  // Scraping Metadata
  scrapedAt: Date,
  verified: {
    type: Boolean,
    default: false
  },

  // Status & Engagement
  active: { 
    type: Boolean, 
    default: true,
    index: true
  },
  region: [String],
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },

  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create text index for search
schemeSchema.index({ title: 'text', description: 'text' });

// Method to mark scheme as verified
schemeSchema.methods.verify = function() {
  this.verified = true;
  this.updatedAt = new Date();
  return this.save();
};

// Method to deactivate scheme
schemeSchema.methods.deactivate = function() {
  this.active = false;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to find active schemes
schemeSchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find schemes by category
schemeSchema.statics.findByCategory = function(category) {
  return this.find({ category, active: true });
};

// Static method to find upcoming deadline schemes
schemeSchema.statics.findUpcomingDeadlines = function(daysFrom = 30) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysFrom);

  return this.find({
    $or: [
      { 'deadlines.end': { $gte: startDate, $lte: endDate } },
      { deadline: { $gte: startDate, $lte: endDate } }
    ],
    active: true
  }).sort({ deadline: 1, 'deadlines.end': 1 });
};

module.exports = mongoose.model('Scheme', schemeSchema);
