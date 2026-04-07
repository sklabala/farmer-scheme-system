const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  documents: [{
    name: String,
    url: String,
    status: {
      type: String,
      enum: ['uploaded', 'verified', 'rejected'],
      default: 'uploaded'
    },
    rejectionReason: String
  }],
  applicationNumber: String,
  appliedAt: Date,
  lastUpdated: Date,
  notes: [{
    type: mongoose.Schema.Types.Mixed,
    stamp: Date
  }],
  timeline: [{
    event: String,
    date: Date,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

applicationSchema.pre('save', function(next) {
  this.timeline?.push({
    event: 'Created',
    description: 'Application created',
    userId: this.userId,
    timestamp: new Date()
  });
  this.lastUpdated = new Date();
  next();
});

applicationSchema.pre('save', function(next) {
  if (!this.applicationNumber) {
    const year = new Date().getFullYear();
    this.applicationNumber = \`APP${year}${Math.floor(Math.random() * 10000)}`;
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);