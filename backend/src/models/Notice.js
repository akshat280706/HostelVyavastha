const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'emergency', 'event', 'maintenance', 'academic'],
    default: 'general'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: String,
  targetAudience: {
    type: String,
    enum: ['all', 'boys', 'girls', 'specific-hostel'],
    default: 'all'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  attachments: [String],
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);