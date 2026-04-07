// models/Scheme.js
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  state: { type: String, required: true }, // e.g., "Maharashtra"
  eligibilityCriteria: { type: String, required: true },
  benefits: { type: String, required: true },
  applicationLink: { type: String, required: true },
  deadlines: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  region: [String], // e.g., ['North', 'South']
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scheme', schemeSchema);
