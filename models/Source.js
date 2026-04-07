// models/Source.js
const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['gov', 'news', 'portal', 'site'],
    default: 'site'
  },
  category: {
    type: String,
    enum: ['agriculture', 'irrigation', 'seeds', 'solar', 'insurance', 'subsidy', 'loan', 'training', 'market', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastFetchedAt: Date,
  lastFetchStatus: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'pending'
  },
  fetchInterval: {
    type: Number, // hours
    default: 24
  },
  selectors: {
    title: String,
    description: String,
    content: String,
    links: String,
    schemeList: String
  },
  metadata: {
    country: { type: String, default: 'India' },
    language: { type: String, default: 'en' },
    region: String
  }
}, {
  timestamps: true
});

// Index for querying active sources
sourceSchema.index({ isActive: 1, type: 1 };

module.exports = mongoose.model('Source', sourceSchema);