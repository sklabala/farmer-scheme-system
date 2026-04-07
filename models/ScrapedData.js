// models/ScrapedData.js
const { Schema, model } = require('mongoose');

const scrapedDataSchema = new Schema({
  sourceId: {
    type: Schema.Types.ObjectId,
    ref: 'Source',
    required: true,
    index: true
  },
  rawUrl: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  schemes: [{
    title: String,
    link: String,
    text: String,
    extractedAt: Date
  }],
  deadlines: [String],
  dates: [String],
  rawData: {
    type: Schema.Types.Mixed
  },
  screenshot: {
    data: Buffer,
    contentType: String
  },
  metadata: {
    fetchDuration: Number, // ms
    language: String,
    encoding: String
  }
}, {
  timestamps: true,
  indexes: [
    { fields: { 'metadata.fetchDuration': 1 } },
    { fields: { createdAt: -1 } }
  ]
});

// Prevent duplicate URLs
scrapedDataSchema.index({ sourceId: 1, rawUrl: 1 }, { unique: true });

module.exports = model('ScrapedData', scrapedDataSchema);